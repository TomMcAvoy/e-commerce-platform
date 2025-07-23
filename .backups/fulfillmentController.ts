import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../types'
import Order from '../models/Order'
import Product from '../models/Product'
import User from '../models/User'
import AppError from '../utils/AppError'

interface ShipmentData {
  _id: string
  orderId: string
  orderNumber?: string
  trackingNumber?: string
  carrier: string
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed'
  shippedDate?: Date
  estimatedDelivery?: Date
  actualDelivery?: Date
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  customerName: string
  customerEmail: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    weight?: number
  }>
  weight: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  shippingCost: number
  notes?: string
}

interface FulfillmentMetrics {
  totalShipments: number
  pendingShipments: number
  inTransitShipments: number
  deliveredShipments: number
  failedShipments: number
  averageProcessingTime: number
  onTimeDeliveryRate: number
  shippingCostTotal: number
}

// @desc    Get fulfillment dashboard
// @route   GET /api/fulfillment/dashboard
// @access  Private (Admin/Vendor)
export const getFulfillmentDashboard = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    // Get shipment statistics from orders
    const shipmentStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalShipments: { $sum: 1 },
          pendingShipments: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          processingShipments: {
            $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
          },
          shippedShipments: {
            $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
          },
          deliveredShipments: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          cancelledShipments: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          totalShippingCost: { $sum: '$shipping' },
          averageProcessingTime: {
            $avg: {
              $cond: [
                { $and: ['$shippedAt', '$createdAt'] },
                {
                  $divide: [
                    { $subtract: ['$shippedAt', '$createdAt'] },
                    24 * 60 * 60 * 1000 // Convert to days
                  ]
                },
                null
              ]
            }
          }
        }
      }
    ])

    // Get delivery performance
    const deliveryPerformance = await Order.aggregate([
      {
        $match: {
          status: 'delivered',
          deliveredAt: { $exists: true },
          expectedDeliveryDate: { $exists: true },
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $addFields: {
          onTime: { $lte: ['$deliveredAt', '$expectedDeliveryDate'] }
        }
      },
      {
        $group: {
          _id: null,
          totalDelivered: { $sum: 1 },
          onTimeDeliveries: { $sum: { $cond: ['$onTime', 1, 0] } }
        }
      },
      {
        $project: {
          onTimeDeliveryRate: {
            $multiply: [
              { $divide: ['$onTimeDeliveries', '$totalDelivered'] },
              100
            ]
          }
        }
      }
    ])

    // Recent shipments requiring attention
    const urgentShipments = await Order.find({
      status: { $in: ['pending', 'processing'] },
      createdAt: { $lte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } // Older than 2 days
    })
    .limit(10)
    .select('_id orderNumber createdAt status customerEmail total')
    .sort({ createdAt: 1 })

    // Shipping trends by carrier
    const carrierStats = await Order.aggregate([
      {
        $match: {
          status: { $in: ['shipped', 'delivered'] },
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$shippingMethod',
          shipmentCount: { $sum: 1 },
          totalCost: { $sum: '$shipping' },
          averageCost: { $avg: '$shipping' }
        }
      },
      { $sort: { shipmentCount: -1 } }
    ])

    const metrics = shipmentStats[0] || {
      totalShipments: 0,
      pendingShipments: 0,
      processingShipments: 0,
      shippedShipments: 0,
      deliveredShipments: 0,
      cancelledShipments: 0,
      totalShippingCost: 0,
      averageProcessingTime: 0
    }

    const dashboard = {
      metrics: {
        ...metrics,
        onTimeDeliveryRate: deliveryPerformance[0]?.onTimeDeliveryRate || 0,
        inTransitShipments: metrics.shippedShipments
      },
      urgentShipments,
      carrierPerformance: carrierStats,
      periodDays: 30
    }

    res.status(200).json({
      success: true,
      data: dashboard
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all shipments
// @route   GET /api/fulfillment/shipments
// @access  Private (Admin/Vendor)
export const getShipments = async (
  req: Request,
  res: Response<PaginatedResponse<ShipmentData>>,
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

    if (req.query.carrier) {
      filter.shippingMethod = req.query.carrier
    }

    if (req.query.tracking) {
      filter['trackingNumbers'] = { $in: [new RegExp(req.query.tracking as string, 'i')] }
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

    // Transform orders to shipment format
    const shipments = await Order.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $addFields: {
          // Map order status to shipment status
          shipmentStatus: {
            $switch: {
              branches: [
                { case: { $eq: ['$status', 'pending'] }, then: 'pending' },
                { case: { $eq: ['$status', 'processing'] }, then: 'picked_up' },
                { case: { $eq: ['$status', 'shipped'] }, then: 'in_transit' },
                { case: { $eq: ['$status', 'delivered'] }, then: 'delivered' },
                { case: { $eq: ['$status', 'cancelled'] }, then: 'failed' }
              ],
              default: 'pending'
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          orderId: '$_id',
          orderNumber: 1,
          trackingNumber: { $arrayElemAt: ['$trackingNumbers', 0] },
          carrier: '$shippingMethod',
          status: '$shipmentStatus',
          shippedDate: '$shippedAt',
          estimatedDelivery: '$expectedDeliveryDate',
          actualDelivery: '$deliveredAt',
          shippingAddress: '$shippingAddress',
          customerName: { $concat: ['$customer.firstName', ' ', '$customer.lastName'] },
          customerEmail: '$customer.email',
          items: {
            $reduce: {
              input: '$vendorOrders',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this.items'] }
            }
          },
          weight: '$packageWeight',
          dimensions: '$packageDimensions',
          shippingCost: '$shipping',
          notes: '$specialInstructions'
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ])

    const total = await Order.countDocuments(filter)

    res.status(200).json({
      success: true,
      data: shipments,
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

// @desc    Update shipment status
// @route   PUT /api/fulfillment/shipments/:id/status
// @access  Private (Admin/Vendor)
export const updateShipmentStatus = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { status, trackingNumber, carrier, notes, estimatedDelivery } = req.body

    const validStatuses = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed']
    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid shipment status', 400))
    }

    const order = await Order.findById(id)
    if (!order) {
      return next(new AppError('Order not found', 404))
    }

    // Map shipment status to order status
    let orderStatus: string
    switch (status) {
      case 'pending':
        orderStatus = 'pending'
        break
      case 'picked_up':
        orderStatus = 'processing'
        break
      case 'in_transit':
      case 'out_for_delivery':
        orderStatus = 'shipped'
        break
      case 'delivered':
        orderStatus = 'delivered'
        break
      case 'failed':
        orderStatus = 'cancelled'
        break
      default:
        orderStatus = order.status
    }

    const updateData: any = {
      status: orderStatus
    }

    if (trackingNumber) {
      // Add to trackingNumbers array if not already present
      if (!order.trackingNumbers.includes(trackingNumber)) {
        updateData.$addToSet = { trackingNumbers: trackingNumber }
      }
    }
    if (notes) updateData.notes = notes

    // Note: Order model doesn't have shippingMethod, carrier, shippedAt, deliveredAt fields
    // These would need to be added to the model for full implementation

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      data: {
        orderId: id,
        shipmentStatus: status,
        orderStatus: orderStatus,
        trackingNumber: updatedOrder?.trackingNumbers?.[0] || trackingNumber,
        updatedAt: new Date()
      },
      message: `Shipment status updated to ${status}`
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Generate shipping labels
// @route   POST /api/fulfillment/shipments/:id/label
// @access  Private (Admin/Vendor)
export const generateShippingLabel = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { carrier, serviceType, insurance } = req.body

    const order = await Order.findById(id)
      .populate('userId', 'firstName lastName email')

    if (!order) {
      return next(new AppError('Order not found', 404))
    }

    if (order.status !== 'pending' && order.status !== 'processing') {
      return next(new AppError('Order is not ready for shipping', 400))
    }

    // TODO: Integrate with actual shipping provider APIs (UPS, FedEx, USPS)
    // For now, generate a mock shipping label
    const trackingNumber = `${carrier.toUpperCase()}${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    
    const shippingLabel = {
      trackingNumber,
      carrier,
      serviceType,
      labelUrl: `https://api.shippingprovider.com/labels/${trackingNumber}.pdf`,
      cost: order.shipping || 0,
      insurance: insurance || false,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      generatedAt: new Date()
    }

    // Update order with tracking info
    await Order.findByIdAndUpdate(id, {
      $addToSet: { trackingNumbers: trackingNumber },
      status: 'processing'
    })

    res.status(200).json({
      success: true,
      data: shippingLabel,
      message: 'Shipping label generated successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get fulfillment analytics
// @route   GET /api/fulfillment/analytics
// @access  Private (Admin)
export const getFulfillmentAnalytics = async (
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
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }

    // Processing time analytics
    const processingTimes = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          shippedAt: { $exists: true }
        }
      },
      {
        $project: {
          processingTime: {
            $divide: [
              { $subtract: ['$shippedAt', '$createdAt'] },
              60 * 60 * 1000 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          averageProcessingTime: { $avg: '$processingTime' },
          minProcessingTime: { $min: '$processingTime' },
          maxProcessingTime: { $max: '$processingTime' },
          totalOrders: { $sum: 1 }
        }
      }
    ])

    // Delivery performance by carrier
    const carrierPerformance = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'delivered',
          deliveredAt: { $exists: true },
          expectedDeliveryDate: { $exists: true }
        }
      },
      {
        $addFields: {
          onTime: { $lte: ['$deliveredAt', '$expectedDeliveryDate'] },
          deliveryTime: {
            $divide: [
              { $subtract: ['$deliveredAt', '$shippedAt'] },
              24 * 60 * 60 * 1000 // Convert to days
            ]
          }
        }
      },
      {
        $group: {
          _id: '$shippingMethod',
          totalDeliveries: { $sum: 1 },
          onTimeDeliveries: { $sum: { $cond: ['$onTime', 1, 0] } },
          averageDeliveryTime: { $avg: '$deliveryTime' },
          totalCost: { $sum: '$shippingCost' }
        }
      },
      {
        $project: {
          carrier: '$_id',
          totalDeliveries: 1,
          onTimeRate: {
            $multiply: [
              { $divide: ['$onTimeDeliveries', '$totalDeliveries'] },
              100
            ]
          },
          averageDeliveryTime: { $round: ['$averageDeliveryTime', 1] },
          averageCost: { $divide: ['$totalCost', '$totalDeliveries'] }
        }
      },
      { $sort: { onTimeRate: -1 } }
    ])

    // Daily fulfillment trends
    const dailyTrends = await Order.aggregate([
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
            day: { $dayOfMonth: '$createdAt' }
          },
          ordersCreated: { $sum: 1 },
          ordersShipped: {
            $sum: { $cond: [{ $ne: ['$shippedAt', null] }, 1, 0] }
          },
          ordersDelivered: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          shippingRevenue: { $sum: '$shipping' }
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
          ordersCreated: 1,
          ordersShipped: 1,
          ordersDelivered: 1,
          shippingRevenue: 1,
          fulfillmentRate: {
            $cond: [
              { $gt: ['$ordersCreated', 0] },
              { $multiply: [{ $divide: ['$ordersShipped', '$ordersCreated'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { date: 1 } }
    ])

    const analytics = {
      period: {
        start: startDate,
        end: new Date(),
        range: timeRange
      },
      processingMetrics: processingTimes[0] || {
        averageProcessingTime: 0,
        minProcessingTime: 0,
        maxProcessingTime: 0,
        totalOrders: 0
      },
      carrierPerformance,
      dailyTrends
    }

    res.status(200).json({
      success: true,
      data: analytics
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Bulk update shipments
// @route   POST /api/fulfillment/shipments/bulk-update
// @access  Private (Admin/Vendor)
export const bulkUpdateShipments = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { shipmentIds, updates } = req.body

    if (!Array.isArray(shipmentIds) || shipmentIds.length === 0) {
      return next(new AppError('Shipment IDs array is required', 400))
    }

    const validUpdates: any = {}
    if (updates.status) validUpdates.status = updates.status
    if (updates.carrier) validUpdates.shippingMethod = updates.carrier
    if (updates.estimatedDelivery) validUpdates.expectedDeliveryDate = new Date(updates.estimatedDelivery)

    const result = await Order.updateMany(
      { _id: { $in: shipmentIds } },
      validUpdates
    )

    res.status(200).json({
      success: true,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        updatedFields: Object.keys(validUpdates)
      },
      message: `Successfully updated ${result.modifiedCount} shipments`
    })
  } catch (error) {
    next(error)
  }
}
