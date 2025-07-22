import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../types'
import User from '../models/User'
import Order from '../models/Order'
import Product from '../models/Product'
import { AppError } from '../middleware/errorHandler'

interface CustomerData {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: Date
  registrationDate: Date
  status: 'active' | 'inactive' | 'vip'
  lifetimeValue: number
}

// @desc    Get CRM dashboard
// @route   GET /api/crm/dashboard
// @access  Private (Vendor/Admin)
export const getCRMDashboard = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Customer summary stats
    const totalCustomers = await User.countDocuments({ role: 'customer' })
    const newCustomersThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    })

    // Order-based customer insights
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const activeCustomers = await Order.distinct('userId', {
      createdAt: { $gte: thirtyDaysAgo }
    })

    // Top customers by value
    const topCustomers = await Order.aggregate([
      { $group: {
          _id: '$userId',
          totalSpent: { $sum: '$total' },
          orderCount: { $sum: 1 },
          lastOrder: { $max: '$createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $project: {
          customerId: '$_id',
          customerName: { $concat: ['$customer.firstName', ' ', '$customer.lastName'] },
          email: '$customer.email',
          totalSpent: 1,
          orderCount: 1,
          lastOrder: 1,
          averageOrderValue: { $divide: ['$totalSpent', '$orderCount'] }
        }
      }
    ])

    // Sales trends
    const salesTrend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }, // Last 12 months
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
          customerCount: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          period: { $concat: [{ $toString: '$_id.year' }, '-', { $toString: '$_id.month' }] },
          revenue: 1,
          orderCount: 1,
          uniqueCustomers: { $size: '$customerCount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const dashboard = {
      summary: {
        totalCustomers,
        activeCustomers: activeCustomers.length,
        newCustomersThisMonth,
        customerRetentionRate: totalCustomers > 0 ? (activeCustomers.length / totalCustomers * 100).toFixed(2) : 0
      },
      topCustomers,
      salesTrend: salesTrend.slice(-6) // Last 6 months
    }

    res.status(200).json({
      success: true,
      data: dashboard
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all customers with advanced filtering
// @route   GET /api/crm/customers
// @access  Private (Vendor/Admin)
export const getCustomers = async (
  req: Request,
  res: Response<PaginatedResponse<CustomerData>>,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    // Build filter
    let filter: any = { role: 'customer' }
    
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ]
    }

    if (req.query.status === 'active') {
      // Customers who ordered in last 90 days
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      const activeCustomerIds = await Order.distinct('userId', {
        createdAt: { $gte: ninetyDaysAgo }
      })
      filter._id = { $in: activeCustomerIds }
    }

    // Get customers with order aggregation
    const customers = await User.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'userId',
          as: 'orders'
        }
      },
      {
        $addFields: {
          totalOrders: { $size: '$orders' },
          totalSpent: { $sum: '$orders.total' },
          lastOrderDate: { $max: '$orders.createdAt' },
          averageOrderValue: {
            $cond: [
              { $gt: [{ $size: '$orders' }, 0] },
              { $divide: [{ $sum: '$orders.total' }, { $size: '$orders' }] },
              0
            ]
          }
        }
      },
      {
        $addFields: {
          status: {
            $cond: [
              { $gte: ['$lastOrderDate', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)] },
              'active',
              'inactive'
            ]
          },
          lifetimeValue: '$totalSpent'
        }
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          totalOrders: 1,
          totalSpent: 1,
          averageOrderValue: 1,
          lastOrderDate: 1,
          registrationDate: '$createdAt',
          status: 1,
          lifetimeValue: 1
        }
      },
      { $sort: { totalSpent: -1 } },
      { $skip: skip },
      { $limit: limit }
    ])

    const total = await User.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: customers,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get customer profile with detailed analytics
// @route   GET /api/crm/customers/:id
// @access  Private (Vendor/Admin)
export const getCustomerProfile = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params

    const customer = await User.findById(id).select('-password')
    if (!customer || customer.role !== 'customer') {
      return next(new AppError('Customer not found', 404))
    }

    // Get customer orders
    const orders = await Order.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('vendorOrders.items.productId', 'name price')

    // Calculate customer metrics
    const orderStats = await Order.aggregate([
      { $match: { userId: id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' }
        }
      }
    ])

    // Get favorite products/categories
    const favoriteProducts = await Order.aggregate([
      { $match: { userId: id } },
      { $unwind: '$vendorOrders' },
      { $unwind: '$vendorOrders.items' },
      {
        $group: {
          _id: '$vendorOrders.items.productId',
          productName: { $first: '$vendorOrders.items.name' },
          totalQuantity: { $sum: '$vendorOrders.items.quantity' },
          totalSpent: { $sum: '$vendorOrders.items.total' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ])

    // Order frequency analysis
    const orderFrequency = await Order.aggregate([
      { $match: { userId: id } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          orderCount: { $sum: 1 },
          monthlySpend: { $sum: '$total' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ])

    const profile = {
      customer: customer.toObject(),
      metrics: orderStats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        firstOrder: null,
        lastOrder: null
      },
      recentOrders: orders,
      favoriteProducts,
      orderFrequency,
      customerSegment: orderStats[0]?.totalSpent > 1000 ? 'VIP' : 
                     orderStats[0]?.totalSpent > 500 ? 'Regular' : 'New'
    }

    res.status(200).json({
      success: true,
      data: profile
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Add note to customer
// @route   POST /api/crm/customers/:id/notes
// @access  Private (Vendor/Admin)
export const addCustomerNote = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { note, type = 'general' } = req.body

    if (!note || note.trim().length === 0) {
      return next(new AppError('Note content is required', 400))
    }

    const customer = await User.findById(id)
    if (!customer || customer.role !== 'customer') {
      return next(new AppError('Customer not found', 404))
    }

    // TODO: Create CustomerNote model for storing notes
    // const customerNote = await CustomerNote.create({
    //   customerId: id,
    //   note: note.trim(),
    //   type,
    //   createdBy: req.user._id,
    //   createdAt: new Date()
    // })

    // For now, we'll just acknowledge the note
    res.status(201).json({
      success: true,
      message: 'Customer note added successfully',
      data: {
        customerId: id,
        note: note.trim(),
        type,
        createdBy: req.user._id,
        createdAt: new Date()
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get customer segments
// @route   GET /api/crm/segments
// @access  Private (Admin)
export const getCustomerSegments = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const segments = await Order.aggregate([
      {
        $group: {
          _id: '$userId',
          totalSpent: { $sum: '$total' },
          orderCount: { $sum: 1 },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      {
        $addFields: {
          segment: {
            $switch: {
              branches: [
                { case: { $gte: ['$totalSpent', 2000] }, then: 'VIP' },
                { case: { $gte: ['$totalSpent', 500] }, then: 'Regular' },
                { case: { $gte: ['$orderCount', 3] }, then: 'Frequent' },
                { case: { $gte: ['$lastOrder', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] }, then: 'Recent' }
              ],
              default: 'New'
            }
          }
        }
      },
      {
        $group: {
          _id: '$segment',
          customerCount: { $sum: 1 },
          totalRevenue: { $sum: '$totalSpent' },
          averageOrderValue: { $avg: { $divide: ['$totalSpent', '$orderCount'] } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ])

    res.status(200).json({
      success: true,
      data: {
        segments,
        generatedAt: new Date()
      }
    })
  } catch (error) {
    next(error)
  }
}
