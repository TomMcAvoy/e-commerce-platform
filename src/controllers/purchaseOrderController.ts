import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../types'
import Order from '../models/Order'
import Product from '../models/Product'
import User from '../models/User'
import Vendor from '../models/Vendor'
import { AppError } from '../middleware/errorHandler'

interface PurchaseOrder {
  _id?: string
  vendorId: string
  vendorName?: string
  items: Array<{
    productId: string
    productName?: string
    quantity: number
    unitCost: number
    total: number
  }>
  totalAmount: number
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled'
  orderDate: Date
  expectedDate?: Date
  receivedDate?: Date
  notes?: string
  createdBy: string
}

interface SupplierPerformance {
  vendorId: string
  vendorName: string
  totalOrders: number
  onTimeDeliveries: number
  averageDeliveryDays: number
  totalSpent: number
  onTimePercentage: number
  qualityRating: number
}

// @desc    Get purchase order dashboard
// @route   GET /api/purchase-orders/dashboard
// @access  Private (Admin/Vendor)
export const getPurchaseOrderDashboard = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Create PurchaseOrder model for actual implementation
    // For now, we'll use existing Order data to simulate purchase orders

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    // Summary statistics
    const totalPOs = await Order.countDocuments()
    const pendingPOs = await Order.countDocuments({ 
      status: { $in: ['pending', 'processing'] } 
    })
    const recentPOs = await Order.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    })

    // Top suppliers by order volume
    const topSuppliers = await Order.aggregate([
      {
        $unwind: '$vendorOrders'
      },
      {
        $group: {
          _id: '$vendorOrders.vendorId',
          totalOrders: { $sum: 1 },
          totalValue: { $sum: '$vendorOrders.total' },
          averageOrderValue: { $avg: '$vendorOrders.total' }
        }
      },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: '_id',
          as: 'vendor'
        }
      },
      { $unwind: '$vendor' },
      {
        $project: {
          vendorId: '$_id',
          vendorName: '$vendor.businessName',
          totalOrders: 1,
          totalValue: 1,
          averageOrderValue: 1
        }
      },
      { $sort: { totalValue: -1 } },
      { $limit: 10 }
    ])

    // Purchase order trends
    const poTrends = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) } // Last 6 months
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          orderCount: { $sum: 1 },
          totalValue: { $sum: '$total' },
          averageValue: { $avg: '$total' }
        }
      },
      {
        $project: {
          period: { $concat: [{ $toString: '$_id.year' }, '-', { $toString: '$_id.month' }] },
          orderCount: 1,
          totalValue: 1,
          averageValue: 1
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const dashboard = {
      summary: {
        totalPurchaseOrders: totalPOs,
        pendingPurchaseOrders: pendingPOs,
        recentPurchaseOrders: recentPOs,
        completionRate: totalPOs > 0 ? ((totalPOs - pendingPOs) / totalPOs * 100).toFixed(2) : 0
      },
      topSuppliers,
      trends: poTrends
    }

    res.status(200).json({
      success: true,
      data: dashboard
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private (Admin/Vendor)
export const getPurchaseOrders = async (
  req: Request,
  res: Response<PaginatedResponse<PurchaseOrder>>,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    let filter: any = {}

    if (req.query.vendorId) {
      filter['vendorOrders.vendorId'] = req.query.vendorId
    }

    if (req.query.status) {
      filter.status = req.query.status
    }

    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {}
      if (req.query.dateFrom) {
        filter.createdAt.$gte = new Date(req.query.dateFrom as string)
      }
      if (req.query.dateTo) {
        filter.createdAt.$lte = new Date(req.query.dateTo as string)
      }
    }

    // Transform orders to purchase order format
    const purchaseOrders = await Order.aggregate([
      { $match: filter },
      { $unwind: '$vendorOrders' },
      {
        $lookup: {
          from: 'vendors',
          localField: 'vendorOrders.vendorId',
          foreignField: '_id',
          as: 'vendor'
        }
      },
      { $unwind: '$vendor' },
      {
        $project: {
          _id: 1,
          vendorId: '$vendorOrders.vendorId',
          vendorName: '$vendor.businessName',
          items: '$vendorOrders.items',
          totalAmount: '$vendorOrders.total',
          status: '$status',
          orderDate: '$createdAt',
          expectedDate: '$expectedDeliveryDate',
          receivedDate: '$deliveredAt',
          notes: '$specialInstructions',
          createdBy: '$userId'
        }
      },
      { $sort: { orderDate: -1 } },
      { $skip: skip },
      { $limit: limit }
    ])

    const total = await Order.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: purchaseOrders,
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

// @desc    Create purchase order
// @route   POST /api/purchase-orders
// @access  Private (Admin/Vendor)
export const createPurchaseOrder = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { vendorId, items, expectedDate, notes } = req.body

    // Validate vendor exists
    const vendor = await Vendor.findById(vendorId)
    if (!vendor) {
      return next(new AppError('Vendor not found', 404))
    }

    // Validate products and calculate total
    let totalAmount = 0
    const processedItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return next(new AppError(`Product ${item.productId} not found`, 404))
      }

      const itemTotal = item.quantity * item.unitCost
      totalAmount += itemTotal

      processedItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitCost: item.unitCost,
        total: itemTotal
      })
    }

    // TODO: Create actual PurchaseOrder model
    // For now, create a simulated purchase order response
    const purchaseOrder = {
      _id: new Date().getTime().toString(),
      vendorId,
      vendorName: vendor.businessName,
      items: processedItems,
      totalAmount,
      status: 'draft' as const,
      orderDate: new Date(),
      expectedDate: expectedDate ? new Date(expectedDate) : undefined,
      notes,
      createdBy: req.user._id
    }

    res.status(201).json({
      success: true,
      data: purchaseOrder,
      message: 'Purchase order created successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update purchase order status
// @route   PUT /api/purchase-orders/:id/status
// @access  Private (Admin/Vendor)
export const updatePurchaseOrderStatus = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { status, receivedDate, notes } = req.body

    const validStatuses = ['draft', 'sent', 'confirmed', 'received', 'cancelled']
    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid status', 400))
    }

    // TODO: Update actual PurchaseOrder model
    // For now, simulate the update
    const updatedPO = {
      _id: id,
      status,
      receivedDate: receivedDate ? new Date(receivedDate) : undefined,
      notes,
      updatedAt: new Date()
    }

    res.status(200).json({
      success: true,
      data: updatedPO,
      message: `Purchase order status updated to ${status}`
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get supplier performance analytics
// @route   GET /api/purchase-orders/supplier-performance
// @access  Private (Admin)
export const getSupplierPerformance = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)

    const supplierPerformance = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $in: ['delivered', 'completed'] }
        }
      },
      { $unwind: '$vendorOrders' },
      {
        $group: {
          _id: '$vendorOrders.vendorId',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$vendorOrders.total' },
          averageOrderValue: { $avg: '$vendorOrders.total' },
          onTimeDeliveries: {
            $sum: {
              $cond: [
                { $lte: ['$deliveredAt', '$expectedDeliveryDate'] },
                1,
                0
              ]
            }
          },
          totalDeliveryDays: {
            $sum: {
              $divide: [
                { $subtract: ['$deliveredAt', '$createdAt'] },
                24 * 60 * 60 * 1000 // Convert to days
              ]
            }
          }
        }
      },
      {
        $addFields: {
          onTimePercentage: {
            $multiply: [
              { $divide: ['$onTimeDeliveries', '$totalOrders'] },
              100
            ]
          },
          averageDeliveryDays: {
            $divide: ['$totalDeliveryDays', '$totalOrders']
          }
        }
      },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: '_id',
          as: 'vendor'
        }
      },
      { $unwind: '$vendor' },
      {
        $project: {
          vendorId: '$_id',
          vendorName: '$vendor.businessName',
          totalOrders: 1,
          onTimeDeliveries: 1,
          averageDeliveryDays: { $round: ['$averageDeliveryDays', 1] },
          totalSpent: 1,
          onTimePercentage: { $round: ['$onTimePercentage', 1] },
          qualityRating: { 
            $round: [
              {
                $add: [
                  { $multiply: ['$onTimePercentage', 0.006] }, // 60% weight for on-time delivery
                  4 // Base score of 4
                ]
              },
              1
            ]
          }
        }
      },
      { $sort: { qualityRating: -1, totalSpent: -1 } }
    ])

    res.status(200).json({
      success: true,
      data: {
        suppliers: supplierPerformance,
        period: `${sixMonthsAgo.toISOString().split('T')[0]} to ${new Date().toISOString().split('T')[0]}`,
        generatedAt: new Date()
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get purchase order analytics
// @route   GET /api/purchase-orders/analytics
// @access  Private (Admin)
export const getPurchaseOrderAnalytics = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const timeRange = req.query.range || '6m' // 1m, 3m, 6m, 1y
    let startDate: Date

    switch (timeRange) {
      case '1m':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        break
      case '3m':
        startDate = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
    }

    // Order volume and spend trends
    const trends = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            week: { $week: '$createdAt' }
          },
          orderCount: { $sum: 1 },
          totalSpend: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } }
    ])

    // Category breakdown
    const categoryBreakdown = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: '$vendorOrders' },
      { $unwind: '$vendorOrders.items' },
      {
        $lookup: {
          from: 'products',
          localField: 'vendorOrders.items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalSpend: { $sum: '$vendorOrders.items.total' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$vendorOrders.items.total' }
        }
      },
      { $sort: { totalSpend: -1 } }
    ])

    const analytics = {
      period: {
        start: startDate,
        end: new Date(),
        range: timeRange
      },
      trends,
      categoryBreakdown,
      summary: {
        totalOrders: trends.reduce((sum, t) => sum + t.orderCount, 0),
        totalSpend: trends.reduce((sum, t) => sum + t.totalSpend, 0),
        averageOrderValue: trends.length > 0 
          ? trends.reduce((sum, t) => sum + t.averageOrderValue, 0) / trends.length 
          : 0
      }
    }

    res.status(200).json({
      success: true,
      data: analytics
    })
  } catch (error) {
    next(error)
  }
}
