import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../types'
import Product from '../models/Product'
import Vendor from '../models/Vendor'
import Order from '../models/Order'
import { AppError } from '../middleware/errorHandler'

// @desc    Get comprehensive inventory dashboard
// @route   GET /api/inventory/dashboard
// @access  Private (Vendor/Admin)
export const getInventoryDashboard = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    let filter: any = {}
    
    // If vendor, filter by their products only
    if (req.user.role === 'vendor') {
      filter.vendorId = req.user._id
    }

    // Get inventory summary
    const totalProducts = await Product.countDocuments(filter)
    const lowStockProducts = await Product.countDocuments({
      ...filter,
      'inventory.trackQuantity': true,
      $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] }
    })
    const outOfStockProducts = await Product.countDocuments({
      ...filter,
      'inventory.trackQuantity': true,
      'inventory.quantity': 0
    })

    // Get total inventory value
    const inventoryValue = await Product.aggregate([
      { $match: filter },
      { 
        $group: {
          _id: null,
          totalCost: { $sum: { $multiply: ['$cost', '$inventory.quantity'] } },
          totalRetail: { $sum: { $multiply: ['$price', '$inventory.quantity'] } }
        }
      }
    ])

    // Get top moving products (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const topMovingProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $unwind: '$vendorOrders' },
      { $unwind: '$vendorOrders.items' },
      ...(req.user.role === 'vendor' ? [{ $match: { 'vendorOrders.vendorId': req.user._id } }] : []),
      {
        $group: {
          _id: '$vendorOrders.items.productId',
          totalSold: { $sum: '$vendorOrders.items.quantity' },
          revenue: { $sum: '$vendorOrders.items.total' },
          productName: { $first: '$vendorOrders.items.name' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ])

    const dashboard = {
      summary: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalValue: inventoryValue[0] || { totalCost: 0, totalRetail: 0 }
      },
      topMovingProducts,
      alerts: {
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts,
        reorderNeeded: lowStockProducts // Could be more sophisticated
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

// @desc    Get inventory levels with filters
// @route   GET /api/inventory/levels
// @access  Private (Vendor/Admin)
export const getInventoryLevels = async (
  req: Request,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    let filter: any = {}
    
    // Apply filters
    if (req.query.category) filter.category = req.query.category
    if (req.query.lowStock === 'true') {
      filter['inventory.trackQuantity'] = true
      filter.$expr = { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] }
    }
    if (req.query.outOfStock === 'true') {
      filter['inventory.trackQuantity'] = true
      filter['inventory.quantity'] = 0
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } }
      ]
    }

    const products = await Product.find(filter)
      .select('name sku price cost inventory category images')
      .populate('category', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ 'inventory.quantity': 1 })

    const total = await Product.countDocuments(filter)

    // Add calculated fields
    const enrichedProducts = products.map(product => ({
      ...product.toObject(),
      stockValue: product.inventory.quantity * product.cost,
      stockStatus: product.inventory.quantity === 0 ? 'out_of_stock' :
                   product.inventory.quantity <= product.inventory.lowStockThreshold ? 'low_stock' : 'in_stock'
    }))

    res.status(200).json({
      success: true,
      data: enrichedProducts,
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

// @desc    Update inventory levels
// @route   PUT /api/inventory/adjust
// @access  Private (Vendor/Admin)
export const adjustInventory = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { adjustments } = req.body // Array of { productId, adjustment, reason, type }

    if (!Array.isArray(adjustments) || adjustments.length === 0) {
      return next(new AppError('Adjustments array is required', 400))
    }

    const results = []

    for (const adj of adjustments) {
      const { productId, adjustment, reason, type = 'manual' } = adj

      if (!productId || adjustment === undefined) {
        results.push({
          productId,
          success: false,
          error: 'Product ID and adjustment amount required'
        })
        continue
      }

      try {
        const product = await Product.findById(productId)
        if (!product) {
          results.push({
            productId,
            success: false,
            error: 'Product not found'
          })
          continue
        }

        // Check vendor ownership
        if (req.user.role === 'vendor' && product.vendorId !== req.user._id) {
          results.push({
            productId,
            success: false,
            error: 'Not authorized to adjust this product inventory'
          })
          continue
        }

        const oldQuantity = product.inventory.quantity
        const newQuantity = Math.max(0, oldQuantity + adjustment)
        
        product.inventory.quantity = newQuantity
        await product.save()

        // TODO: Create inventory adjustment log entry
        // await InventoryLog.create({
        //   productId,
        //   type,
        //   oldQuantity,
        //   newQuantity,
        //   adjustment,
        //   reason,
        //   userId: req.user._id,
        //   timestamp: new Date()
        // })

        results.push({
          productId,
          success: true,
          oldQuantity,
          newQuantity,
          adjustment
        })
      } catch (error) {
        results.push({
          productId,
          success: false,
          error: 'Failed to update inventory'
        })
      }
    }

    res.status(200).json({
      success: true,
      data: { results },
      message: `Processed ${results.length} inventory adjustments`
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Generate inventory report
// @route   GET /api/inventory/reports
// @access  Private (Vendor/Admin)
export const generateInventoryReport = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { type = 'summary', startDate, endDate } = req.query

    let filter: any = {}
    if (req.user.role === 'vendor') {
      filter.vendorId = req.user._id
    }

    let report: any = {}

    switch (type) {
      case 'summary':
        // Overall inventory summary
        const summary = await Product.aggregate([
          { $match: filter },
          {
            $group: {
              _id: null,
              totalProducts: { $sum: 1 },
              totalUnits: { $sum: '$inventory.quantity' },
              totalCostValue: { $sum: { $multiply: ['$cost', '$inventory.quantity'] } },
              totalRetailValue: { $sum: { $multiply: ['$price', '$inventory.quantity'] } },
              lowStockCount: {
                $sum: {
                  $cond: [
                    { $and: [
                      '$inventory.trackQuantity',
                      { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] }
                    ]},
                    1,
                    0
                  ]
                }
              }
            }
          }
        ])
        report = summary[0] || {}
        break

      case 'by-category':
        // Inventory breakdown by category
        report = await Product.aggregate([
          { $match: filter },
          {
            $group: {
              _id: '$category',
              productCount: { $sum: 1 },
              totalUnits: { $sum: '$inventory.quantity' },
              totalValue: { $sum: { $multiply: ['$cost', '$inventory.quantity'] } }
            }
          },
          { $sort: { totalValue: -1 } }
        ])
        break

      case 'movement':
        // Inventory movement report (requires date range)
        const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const end = endDate ? new Date(endDate as string) : new Date()

        report = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end },
              status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] }
            }
          },
          { $unwind: '$vendorOrders' },
          { $unwind: '$vendorOrders.items' },
          ...(req.user.role === 'vendor' ? [{ $match: { 'vendorOrders.vendorId': req.user._id } }] : []),
          {
            $group: {
              _id: '$vendorOrders.items.productId',
              productName: { $first: '$vendorOrders.items.name' },
              totalSold: { $sum: '$vendorOrders.items.quantity' },
              totalRevenue: { $sum: '$vendorOrders.items.total' }
            }
          },
          { $sort: { totalSold: -1 } }
        ])
        break

      default:
        return next(new AppError('Invalid report type', 400))
    }

    res.status(200).json({
      success: true,
      data: {
        reportType: type,
        generatedAt: new Date(),
        report
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get low stock alerts
// @route   GET /api/inventory/alerts
// @access  Private (Vendor/Admin)
export const getLowStockAlerts = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    let filter: any = {
      'inventory.trackQuantity': true,
      $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] }
    }

    if (req.user.role === 'vendor') {
      filter.vendorId = req.user._id
    }

    const lowStockProducts = await Product.find(filter)
      .select('name sku inventory price cost category')
      .populate('category', 'name')
      .sort({ 'inventory.quantity': 1 })

    const alerts = lowStockProducts.map(product => ({
      productId: product._id,
      name: product.name,
      sku: product.sku,
      currentStock: product.inventory.quantity,
      threshold: product.inventory.lowStockThreshold,
      suggestedReorder: Math.max(product.inventory.lowStockThreshold * 2, 10),
      priority: product.inventory.quantity === 0 ? 'critical' : 'warning'
    }))

    res.status(200).json({
      success: true,
      data: {
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter(a => a.priority === 'critical').length,
        alerts
      }
    })
  } catch (error) {
    next(error)
  }
}
