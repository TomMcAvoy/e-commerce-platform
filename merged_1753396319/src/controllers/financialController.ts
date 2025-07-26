import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../types'
import Order from '../models/Order'
import User from '../models/User'
import Vendor from '../models/Vendor'
import { Transaction, PayoutRequest } from '../models/FinancialModels'
import AppError from '../utils/AppError'

interface Transaction {
  _id?: string
  type: 'sale' | 'refund' | 'fee' | 'commission' | 'payout' | 'adjustment'
  orderId?: string
  vendorId?: string
  customerId?: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  description: string
  transactionDate: Date
  metadata?: Record<string, any>
}

interface PayoutRequest {
  _id?: string
  vendorId: string
  vendorName?: string
  amount: number
  requestDate: Date
  approvedDate?: Date
  processedDate?: Date
  status: 'pending' | 'approved' | 'processed' | 'rejected'
  bankDetails?: {
    accountNumber: string
    routingNumber: string
    accountName: string
  }
  notes?: string
}

interface FinancialSummary {
  revenue: {
    total: number
    thisMonth: number
    commissions: number
    fees: number
  }
  payouts: {
    pending: number
    processed: number
    thisMonth: number
  }
  cashFlow: {
    inflow: number
    outflow: number
    netCashFlow: number
  }
  pendingTransactions: number
  accountsReceivable: number
}

// @desc    Get financial dashboard
// @route   GET /api/financial/dashboard
// @access  Private (Admin)
export const getFinancialDashboard = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    // Revenue calculations from orders
    const revenueData = await Order.aggregate([
      {
        $facet: {
          totalRevenue: [
            { $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ],
          monthlyRevenue: [
            {
              $match: {
                createdAt: { $gte: startOfMonth },
                status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
              }
            },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ],
          commissions: [
            { $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
            { $unwind: '$vendorOrders' },
            {
              $group: {
                _id: null,
                total: {
                  $sum: { $multiply: ['$vendorOrders.total', 0.1] } // 10% commission
                }
              }
            }
          ],
          fees: [
            { $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
            {
              $group: {
                _id: null,
                total: {
                  $sum: { $multiply: ['$total', 0.029] } // 2.9% payment processing fee
                }
              }
            }
          ]
        }
      }
    ])

    // TODO: Implement actual transaction tracking
    // For now, simulate payout calculations
    const vendorEarnings = await Order.aggregate([
      { $match: { status: { $in: ['delivered'] } } },
      { $unwind: '$vendorOrders' },
      {
        $group: {
          _id: '$vendorOrders.vendorId',
          totalEarnings: {
            $sum: { $multiply: ['$vendorOrders.total', 0.9] } // Vendor gets 90%
          },
          orderCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          totalPendingPayouts: { $sum: '$totalEarnings' },
          vendorCount: { $sum: 1 }
        }
      }
    ])

    // Cash flow simulation
    const cashFlowData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: null,
          inflow: { $sum: '$total' },
          vendorPayouts: {
            $sum: { $multiply: ['$total', 0.9] }
          },
          fees: {
            $sum: { $multiply: ['$total', 0.029] }
          }
        }
      },
      {
        $project: {
          inflow: 1,
          outflow: { $add: ['$vendorPayouts', '$fees'] },
          netCashFlow: {
            $subtract: ['$inflow', { $add: ['$vendorPayouts', '$fees'] }]
          }
        }
      }
    ])

    const revenue = revenueData[0]
    const payouts = vendorEarnings[0] || { totalPendingPayouts: 0, vendorCount: 0 }
    const cashFlow = cashFlowData[0] || { inflow: 0, outflow: 0, netCashFlow: 0 }

    const summary: FinancialSummary = {
      revenue: {
        total: revenue.totalRevenue[0]?.total || 0,
        thisMonth: revenue.monthlyRevenue[0]?.total || 0,
        commissions: revenue.commissions[0]?.total || 0,
        fees: revenue.fees[0]?.total || 0
      },
      payouts: {
        pending: payouts.totalPendingPayouts,
        processed: 0, // TODO: Calculate from actual payout records
        thisMonth: 0 // TODO: Calculate monthly processed payouts
      },
      cashFlow: {
        inflow: cashFlow.inflow,
        outflow: cashFlow.outflow,
        netCashFlow: cashFlow.netCashFlow
      },
      pendingTransactions: 0, // TODO: Count pending transactions
      accountsReceivable: 0 // TODO: Calculate outstanding receivables
    }

    res.status(200).json({
      success: true,
      data: summary
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all transactions
// @route   GET /api/financial/transactions
// @access  Private (Admin)
export const getTransactions = async (
  req: Request,
  res: Response<PaginatedResponse<Transaction>>,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    let filter: any = {}

    if (req.query.type) {
      filter.type = req.query.type
    }

    if (req.query.status) {
      filter.status = req.query.status
    }

    if (req.query.vendorId) {
      filter.vendorId = req.query.vendorId
    }

    if (req.query.dateFrom || req.query.dateTo) {
      filter.transactionDate = {}
      if (req.query.dateFrom) {
        filter.transactionDate.$gte = new Date(req.query.dateFrom as string)
      }
      if (req.query.dateTo) {
        filter.transactionDate.$lte = new Date(req.query.dateTo as string)
      }
    }

    // TODO: Replace with actual Transaction model
    // For now, simulate transactions from orders
    const transactions = await Order.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $project: {
          _id: 1,
          type: { $literal: 'sale' },
          orderId: '$_id',
          customerId: '$userId',
          amount: '$total',
          currency: '$currency',
          status: {
            $switch: {
              branches: [
                { case: { $eq: ['$status', 'delivered'] }, then: 'completed' },
                { case: { $eq: ['$status', 'cancelled'] }, then: 'cancelled' }
              ],
              default: 'pending'
            }
          },
          description: { $concat: ['Order #', '$orderNumber'] },
          transactionDate: '$createdAt'
        }
      },
      { $sort: { transactionDate: -1 } },
      { $skip: skip },
      { $limit: limit }
    ])

    const total = await Order.countDocuments({
      status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
    })

    res.status(200).json({
      success: true,
      data: transactions,
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

// @desc    Create manual transaction
// @route   POST /api/financial/transactions
// @access  Private (Admin)
export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, amount, vendorId, customerId, description, metadata } = req.body

    const validTypes = ['fee', 'commission', 'adjustment', 'refund']
    if (!validTypes.includes(type)) {
      return next(new AppError('Invalid transaction type', 400))
    }

    if (!amount || amount <= 0) {
      return next(new AppError('Valid amount is required', 400))
    }

    if (!description) {
      return next(new AppError('Transaction description is required', 400))
    }

    // TODO: Create actual Transaction model and save
    const transaction: Transaction = {
      _id: new Date().getTime().toString(),
      type,
      vendorId,
      customerId,
      amount,
      currency: 'USD',
      status: 'completed',
      description,
      transactionDate: new Date(),
      metadata: {
        ...metadata,
        createdBy: req.user._id
      }
    }

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get vendor payouts
// @route   GET /api/financial/payouts
// @access  Private (Admin)
export const getPayouts = async (
  req: Request,
  res: Response<PaginatedResponse<PayoutRequest>>,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    let filter: any = {}

    if (req.query.status) {
      filter.status = req.query.status
    }

    if (req.query.vendorId) {
      filter.vendorId = req.query.vendorId
    }

    // TODO: Replace with actual PayoutRequest model
    // For now, simulate payout requests from vendor earnings
    const payoutRequests = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$vendorOrders' },
      {
        $group: {
          _id: '$vendorOrders.vendorId',
          totalEarnings: {
            $sum: { $multiply: ['$vendorOrders.total', 0.9] }
          },
          orderCount: { $sum: 1 },
          lastOrderDate: { $max: '$createdAt' }
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
          _id: { $toString: '$_id' },
          vendorId: '$_id',
          vendorName: '$vendor.businessName',
          amount: '$totalEarnings',
          requestDate: '$lastOrderDate',
          status: 'pending',
          bankDetails: {
            accountNumber: '****1234',
            routingNumber: '****5678',
            accountName: '$vendor.businessName'
          }
        }
      },
      { $match: { amount: { $gte: 100 } } }, // Minimum payout amount
      { $sort: { requestDate: -1 } },
      { $skip: skip },
      { $limit: limit }
    ])

    const total = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$vendorOrders' },
      {
        $group: {
          _id: '$vendorOrders.vendorId',
          totalEarnings: {
            $sum: { $multiply: ['$vendorOrders.total', 0.9] }
          }
        }
      },
      { $match: { totalEarnings: { $gte: 100 } } },
      { $count: 'total' }
    ])

    res.status(200).json({
      success: true,
      data: payoutRequests,
      pagination: {
        page,
        pages: Math.ceil((total[0]?.total || 0) / limit),
        total: total[0]?.total || 0,
        limit
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Process vendor payout
// @route   POST /api/financial/payouts/:id/process
// @access  Private (Admin)
export const processPayout = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { action, notes } = req.body

    if (!['approve', 'reject', 'process'].includes(action)) {
      return next(new AppError('Invalid action. Must be approve, reject, or process', 400))
    }

    // TODO: Update actual PayoutRequest model
    // For now, simulate the payout processing
    let status: string
    let processedDate: Date | undefined

    switch (action) {
      case 'approve':
        status = 'approved'
        break
      case 'reject':
        status = 'rejected'
        break
      case 'process':
        status = 'processed'
        processedDate = new Date()
        break
      default:
        status = 'pending'
    }

    const updatedPayout = {
      _id: id,
      status,
      processedDate,
      notes,
      updatedAt: new Date()
    }

    // TODO: Integrate with payment processor for actual payout
    if (action === 'process') {
      // Simulate payment processing
      console.log(`Processing payout ${id} to vendor`)
    }

    res.status(200).json({
      success: true,
      data: updatedPayout,
      message: `Payout ${action}ed successfully`
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Generate financial reports
// @route   GET /api/financial/reports
// @access  Private (Admin)
export const getFinancialReports = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const reportType = req.query.type || 'revenue'
    const timeRange = req.query.range || '1m'
    
    let startDate: Date
    switch (timeRange) {
      case '1w':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        break
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
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
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
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            totalRevenue: { $sum: '$total' },
            totalOrders: { $sum: 1 },
            averageOrderValue: { $avg: '$total' },
            totalTax: { $sum: '$tax' },
            totalShipping: { $sum: '$shipping' },
            commission: { $sum: { $multiply: ['$total', 0.1] } },
            netRevenue: { $sum: { $multiply: ['$total', 0.1] } }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])

      res.status(200).json({
        success: true,
        data: {
          reportType: 'revenue',
          period: { start: startDate, end: new Date(), range: timeRange },
          summary: {
            totalRevenue: revenueReport.reduce((sum, r) => sum + r.totalRevenue, 0),
            totalCommission: revenueReport.reduce((sum, r) => sum + r.commission, 0),
            totalOrders: revenueReport.reduce((sum, r) => sum + r.totalOrders, 0)
          },
          data: revenueReport
        }
      })
    } else if (reportType === 'payouts') {
      const payoutReport = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: 'delivered'
          }
        },
        { $unwind: '$vendorOrders' },
        {
          $group: {
            _id: {
              vendorId: '$vendorOrders.vendorId',
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            vendorEarnings: {
              $sum: { $multiply: ['$vendorOrders.total', 0.9] }
            },
            platformCommission: {
              $sum: { $multiply: ['$vendorOrders.total', 0.1] }
            },
            orderCount: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'vendors',
            localField: '_id.vendorId',
            foreignField: '_id',
            as: 'vendor'
          }
        },
        { $unwind: '$vendor' },
        {
          $project: {
            vendorId: '$_id.vendorId',
            vendorName: '$vendor.businessName',
            period: { $concat: [{ $toString: '$_id.year' }, '-', { $toString: '$_id.month' }] },
            vendorEarnings: 1,
            platformCommission: 1,
            orderCount: 1
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1, vendorEarnings: -1 } }
      ])

      res.status(200).json({
        success: true,
        data: {
          reportType: 'payouts',
          period: { start: startDate, end: new Date(), range: timeRange },
          summary: {
            totalVendorEarnings: payoutReport.reduce((sum, r) => sum + r.vendorEarnings, 0),
            totalPlatformCommission: payoutReport.reduce((sum, r) => sum + r.platformCommission, 0),
            uniqueVendors: new Set(payoutReport.map(r => r.vendorId)).size
          },
          data: payoutReport
        }
      })
    } else {
      return next(new AppError('Invalid report type', 400))
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Get tax reports
// @route   GET /api/financial/tax-reports
// @access  Private (Admin)
export const getTaxReports = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear()
    const quarter = req.query.quarter ? parseInt(req.query.quarter as string) : null

    let startDate: Date
    let endDate: Date

    if (quarter) {
      // Quarterly report
      startDate = new Date(year, (quarter - 1) * 3, 1)
      endDate = new Date(year, quarter * 3, 0, 23, 59, 59)
    } else {
      // Annual report
      startDate = new Date(year, 0, 1)
      endDate = new Date(year, 11, 31, 23, 59, 59)
    }

    const taxReport = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' }
          },
          totalSales: { $sum: '$total' },
          totalTax: { $sum: '$tax' },
          totalShipping: { $sum: '$shipping' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $project: {
          month: '$_id.month',
          totalSales: 1,
          totalTax: 1,
          totalShipping: 1,
          orderCount: 1,
          taxableAmount: { $subtract: ['$totalSales', '$totalTax'] }
        }
      },
      { $sort: { month: 1 } }
    ])

    const summary = {
      period: quarter ? `Q${quarter} ${year}` : `${year}`,
      startDate,
      endDate,
      totalSales: taxReport.reduce((sum, r) => sum + r.totalSales, 0),
      totalTaxCollected: taxReport.reduce((sum, r) => sum + r.totalTax, 0),
      totalTaxableAmount: taxReport.reduce((sum, r) => sum + r.taxableAmount, 0),
      totalOrders: taxReport.reduce((sum, r) => sum + r.orderCount, 0)
    }

    res.status(200).json({
      success: true,
      data: {
        summary,
        monthlyBreakdown: taxReport,
        generatedAt: new Date()
      }
    })
  } catch (error) {
    next(error)
  }
}
