import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest, ApiResponse } from '../types'
import Order from '../models/Order'
import Product from '../models/Product'
import User from '../models/User'
import Vendor from '../models/Vendor'
import AppError from '../utils/AppError'

interface DashboardMetrics {
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    growth: number
  }
  orders: {
    total: number
    thisMonth: number
    lastMonth: number
    averageValue: number
  }
  customers: {
    total: number
    active: number
    new: number
    retention: number
  }
  products: {
    total: number
    lowStock: number
    outOfStock: number
    topSelling: Array<{
      productId: string
      name: string
      sold: number
      revenue: number
    }>
  }
}

interface SalesAnalytics {
  dailySales: Array<{
    date: Date
    revenue: number
    orders: number
    customers: number
  }>
  topProducts: Array<{
    productId: string
    name: string
    category: string
    unitsSold: number
    revenue: number
    profit?: number
  }>
  topCustomers: Array<{
    customerId: string
    name: string
    orders: number
    totalSpent: number
    averageOrderValue: number
  }>
  salesByCategory: Array<{
    category: string
    revenue: number
    units: number
    growth: number
  }>
}

// @desc    Get comprehensive business dashboard
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
export const getDashboard = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    // Revenue metrics
    const revenueData = await Order.aggregate([
      {
        $facet: {
          total: [
            { $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ],
          thisMonth: [
            {
              $match: {
                createdAt: { $gte: startOfMonth },
                status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
              }
            },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ],
          lastMonth: [
            {
              $match: {
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
              }
            },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ]
        }
      }
    ])

    // Order metrics
    const orderData = await Order.aggregate([
      {
        $facet: {
          total: [
            { $count: 'count' }
          ],
          thisMonth: [
            { $match: { createdAt: { $gte: startOfMonth } } },
            { $count: 'count' }
          ],
          lastMonth: [
            { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $count: 'count' }
          ],
          averageValue: [
            { $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
            { $group: { _id: null, avg: { $avg: '$total' } } }
          ]
        }
      }
    ])

    // Customer metrics
    const customerData = await User.aggregate([
      {
        $facet: {
          total: [
            { $match: { role: 'customer' } },
            { $count: 'count' }
          ],
          new: [
            { $match: { role: 'customer', createdAt: { $gte: startOfMonth } } },
            { $count: 'count' }
          ]
        }
      }
    ])

    // Active customers (ordered in last 30 days)
    const activeCustomerIds = await Order.distinct('userId', {
      createdAt: { $gte: thirtyDaysAgo }
    })

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
      { $unwind: '$vendorOrders' },
      { $unwind: '$vendorOrders.items' },
      {
        $group: {
          _id: '$vendorOrders.items.productId',
          name: { $first: '$vendorOrders.items.name' },
          sold: { $sum: '$vendorOrders.items.quantity' },
          revenue: { $sum: '$vendorOrders.items.total' }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 10 },
      {
        $project: {
          productId: '$_id',
          name: 1,
          sold: 1,
          revenue: 1
        }
      }
    ])

    // Product inventory status
    const productStats = await Product.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          lowStock: [
            { $match: { $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] } } },
            { $count: 'count' }
          ],
          outOfStock: [
            { $match: { 'inventory.quantity': { $lte: 0 } } },
            { $count: 'count' }
          ]
        }
      }
    ])

    // Calculate growth rates
    const thisMonthRevenue = revenueData[0].thisMonth[0]?.total || 0
    const lastMonthRevenue = revenueData[0].lastMonth[0]?.total || 0
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0

    const totalCustomers = customerData[0].total[0]?.count || 0
    const customerRetention = totalCustomers > 0 
      ? (activeCustomerIds.length / totalCustomers) * 100 
      : 0

    const dashboard: DashboardMetrics = {
      revenue: {
        total: revenueData[0].total[0]?.total || 0,
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        growth: Number(revenueGrowth.toFixed(2))
      },
      orders: {
        total: orderData[0].total[0]?.count || 0,
        thisMonth: orderData[0].thisMonth[0]?.count || 0,
        lastMonth: orderData[0].lastMonth[0]?.count || 0,
        averageValue: orderData[0].averageValue[0]?.avg || 0
      },
      customers: {
        total: totalCustomers,
        active: activeCustomerIds.length,
        new: customerData[0].new[0]?.count || 0,
        retention: Number(customerRetention.toFixed(2))
      },
      products: {
        total: productStats[0].total[0]?.count || 0,
        lowStock: productStats[0].lowStock[0]?.count || 0,
        outOfStock: productStats[0].outOfStock[0]?.count || 0,
        topSelling: topProducts
      }
    }

    res.status(200).json({
      success: true,
      data: dashboard
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private (Admin/Vendor)
export const getSalesAnalytics = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const timeRange = req.query.range || '30d'
    let startDate: Date

    switch (timeRange) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }

    // Daily sales trends
    const dailySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
          customers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          revenue: 1,
          orders: 1,
          customers: { $size: '$customers' }
        }
      },
      { $sort: { date: 1 } }
    ])

    // Top products by revenue and units
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
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
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$vendorOrders.items.productId',
          name: { $first: '$vendorOrders.items.name' },
          category: { $first: '$product.category' },
          unitsSold: { $sum: '$vendorOrders.items.quantity' },
          revenue: { $sum: '$vendorOrders.items.total' }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 20 },
      {
        $project: {
          productId: '$_id',
          name: 1,
          category: 1,
          unitsSold: 1,
          revenue: 1
        }
      }
    ])

    // Top customers
    const topCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: '$userId',
          orders: { $sum: 1 },
          totalSpent: { $sum: '$total' }
        }
      },
      {
        $addFields: {
          averageOrderValue: { $divide: ['$totalSpent', '$orders'] }
        }
      },
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
          name: { $concat: ['$customer.firstName', ' ', '$customer.lastName'] },
          orders: 1,
          totalSpent: 1,
          averageOrderValue: 1
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 20 }
    ])

    // Sales by category
    const salesByCategory = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
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
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: '$vendorOrders.items.total' },
          units: { $sum: '$vendorOrders.items.quantity' }
        }
      },
      {
        $project: {
          category: '$_id',
          revenue: 1,
          units: 1,
          growth: 0 // TODO: Calculate growth compared to previous period
        }
      },
      { $sort: { revenue: -1 } }
    ])

    const analytics: SalesAnalytics = {
      dailySales,
      topProducts,
      topCustomers,
      salesByCategory
    }

    res.status(200).json({
      success: true,
      data: {
        ...analytics,
        period: {
          start: startDate,
          end: new Date(),
          range: timeRange
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get financial reports
// @route   GET /api/analytics/financial
// @access  Private (Admin)
export const getFinancialReports = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const reportType = req.query.type || 'revenue'
    const timeRange = req.query.range || '1y'
    
    let startDate: Date
    let groupBy: any

    switch (timeRange) {
      case '1m':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        }
        break
      case '3m':
        startDate = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          week: { $week: '$createdAt' }
        }
        break
      case '1y':
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        }
        break
      default:
        startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        }
    }

    if (reportType === 'revenue') {
      const revenueReport = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
          }
        },
        {
          $group: {
            _id: groupBy,
            totalRevenue: { $sum: '$total' },
            totalOrders: { $sum: 1 },
            averageOrderValue: { $avg: '$total' },
            totalTax: { $sum: '$tax' },
            totalShipping: { $sum: '$shipping' },
            totalDiscount: { $sum: '$discount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])

      res.status(200).json({
        success: true,
        data: {
          reportType: 'revenue',
          period: { start: startDate, end: new Date(), range: timeRange },
          data: revenueReport
        }
      })
    } else if (reportType === 'profit') {
      // TODO: Implement profit analysis with cost tracking
      const profitReport = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
          }
        },
        {
          $group: {
            _id: groupBy,
            totalRevenue: { $sum: '$total' },
            totalOrders: { $sum: 1 },
            // TODO: Add cost calculations when cost data is available
            estimatedCosts: { $sum: { $multiply: ['$total', 0.6] } }, // Estimated 60% cost
            estimatedProfit: { $sum: { $multiply: ['$total', 0.4] } } // Estimated 40% profit
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])

      res.status(200).json({
        success: true,
        data: {
          reportType: 'profit',
          period: { start: startDate, end: new Date(), range: timeRange },
          data: profitReport,
          note: 'Profit calculations are estimated. Implement cost tracking for accurate profit analysis.'
        }
      })
    } else {
      return next(new AppError('Invalid report type', 400))
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Get vendor performance analytics
// @route   GET /api/analytics/vendors
// @access  Private (Admin)
export const getVendorAnalytics = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const timeRange = req.query.range || '3m'
    let startDate: Date

    switch (timeRange) {
      case '1m':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        break
      case '3m':
        startDate = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
        break
      case '6m':
        startDate = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
    }

    const vendorPerformance = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      { $unwind: '$vendorOrders' },
      {
        $group: {
          _id: '$vendorOrders.vendorId',
          totalRevenue: { $sum: '$vendorOrders.total' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$vendorOrders.total' },
          totalProducts: { $sum: { $size: '$vendorOrders.items' } }
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
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'vendor',
          as: 'products'
        }
      },
      {
        $project: {
          vendorId: '$_id',
          vendorName: '$vendor.businessName',
          totalRevenue: 1,
          totalOrders: 1,
          averageOrderValue: 1,
          totalProducts: 1,
          activeProducts: { $size: '$products' },
          performanceScore: {
            $add: [
              { $multiply: [{ $divide: ['$totalRevenue', 10000] }, 40] }, // Revenue weight
              { $multiply: [{ $divide: ['$totalOrders', 100] }, 30] }, // Orders weight
              { $multiply: [{ $divide: ['$averageOrderValue', 100] }, 20] }, // AOV weight
              { $multiply: [{ $divide: [{ $size: '$products' }, 50] }, 10] } // Product count weight
            ]
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ])

    res.status(200).json({
      success: true,
      data: {
        vendors: vendorPerformance,
        period: {
          start: startDate,
          end: new Date(),
          range: timeRange
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Export analytics data
// @route   POST /api/analytics/export
// @access  Private (Admin)
export const exportAnalytics = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, format = 'json', dateRange } = req.body

    if (!type) {
      return next(new AppError('Export type is required', 400))
    }

    const startDate = dateRange?.start ? new Date(dateRange.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = dateRange?.end ? new Date(dateRange.end) : new Date()

    let exportData: any

    switch (type) {
      case 'orders':
        exportData = await Order.find({
          createdAt: { $gte: startDate, $lte: endDate }
        }).populate('userId', 'firstName lastName email')
        break

      case 'customers':
        exportData = await User.find({
          role: 'customer',
          createdAt: { $gte: startDate, $lte: endDate }
        }).select('-password')
        break

      case 'products':
        exportData = await Product.find({
          createdAt: { $gte: startDate, $lte: endDate }
        }).populate('vendor', 'businessName')
        break

      default:
        return next(new AppError('Invalid export type', 400))
    }

    // TODO: Implement CSV export format
    if (format === 'csv') {
      return next(new AppError('CSV export not yet implemented', 501))
    }

    res.status(200).json({
      success: true,
      data: {
        type,
        format,
        dateRange: { start: startDate, end: endDate },
        recordCount: exportData.length,
        exportData
      },
      message: `Successfully exported ${exportData.length} ${type} records`
    })
  } catch (error) {
    next(error)
  }
}
