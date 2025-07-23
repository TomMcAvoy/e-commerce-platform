import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../types'
import Product from '../models/Product'
import Order from '../models/Order'
import ProductionOrder, { IProductionOrder } from '../models/ProductionOrder'
import AppError from '../utils/AppError'

interface WorkCenter {
  _id?: string
  code: string
  name: string
  department: string
  capacity: {
    hoursPerDay: number
    daysPerWeek: number
    efficiency: number // percentage
  }
  currentLoad: {
    scheduled: number
    available: number
    utilization: number // percentage
  }
  resources: Array<{
    type: 'machine' | 'tool' | 'operator'
    name: string
    quantity: number
    hourlyRate?: number
  }>
  maintenanceSchedule?: Array<{
    date: Date
    type: 'preventive' | 'corrective'
    description: string
    estimatedDuration: number
  }>
}

interface MaterialRequirement {
  _id?: string
  materialId: string
  materialName: string
  requiredQuantity: number
  availableQuantity: number
  shortfall: number
  unit: string
  requirementDate: Date
  supplier?: string
  leadTime: number
  status: 'available' | 'shortage' | 'ordered' | 'delayed'
}

// @desc    Get production dashboard
// @route   GET /api/production/dashboard
// @access  Private (Admin/Production Manager)
export const getProductionDashboard = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Production orders summary
    const productionOrderStats = {
      total: 150, // TODO: Calculate from actual ProductionOrder model
      planned: 25,
      inProgress: 85,
      completed: 30,
      delayed: 10
    }

    // Work center utilization
    const workCenterUtilization = [
      { workCenter: 'Assembly Line 1', utilization: 92.5, status: 'high' },
      { workCenter: 'Assembly Line 2', utilization: 78.3, status: 'normal' },
      { workCenter: 'Quality Control', utilization: 65.2, status: 'low' },
      { workCenter: 'Packaging', utilization: 88.7, status: 'high' },
      { workCenter: 'Warehouse', utilization: 71.4, status: 'normal' }
    ]

    // Material requirements (critical shortages)
    const criticalMaterials = [
      {
        materialName: 'Steel Component A',
        currentStock: 120,
        requiredQuantity: 500,
        shortfall: 380,
        requirementDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        status: 'critical'
      },
      {
        materialName: 'Electronic Module B',
        currentStock: 45,
        requiredQuantity: 200,
        shortfall: 155,
        requirementDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'warning'
      }
    ]

    // Production efficiency metrics
    const efficiencyMetrics = {
      overallEquipmentEffectiveness: 78.5, // OEE
      onTimeDelivery: 94.2,
      qualityRate: 98.7,
      productionVolume: {
        planned: 2500,
        actual: 2342,
        variance: -158
      }
    }

    // Upcoming production schedule
    const upcomingProduction = [
      {
        orderNumber: 'PO-2025-001',
        productName: 'Widget A',
        quantity: 500,
        startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        priority: 'high'
      },
      {
        orderNumber: 'PO-2025-002',
        productName: 'Component B',
        quantity: 1000,
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        priority: 'normal'
      }
    ]

    const dashboard = {
      productionOrderStats,
      workCenterUtilization,
      criticalMaterials,
      efficiencyMetrics,
      upcomingProduction
    }

    res.status(200).json({
      success: true,
      data: dashboard
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all production orders
// @route   GET /api/production/orders
// @access  Private (Admin/Production Manager)
export const getProductionOrders = async (
  req: Request,
  res: Response<PaginatedResponse<IProductionOrder>>,
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

    if (req.query.priority) {
      filter.priority = req.query.priority
    }

    if (req.query.dateFrom || req.query.dateTo) {
      filter.targetDate = {}
      if (req.query.dateFrom) {
        filter.targetDate.$gte = new Date(req.query.dateFrom as string)
      }
      if (req.query.dateTo) {
        filter.targetDate.$lte = new Date(req.query.dateTo as string)
      }
    }

    // Use actual ProductionOrder model
    const total = await ProductionOrder.countDocuments(filter)
    const productionOrders = await ProductionOrder.find(filter)
      .populate('product', 'name description')
      .populate('order', 'orderNumber status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      success: true,
      data: productionOrders,
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

// @desc    Create production order
// @route   POST /api/production/orders
// @access  Private (Admin/Production Manager)
export const createProductionOrder = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, quantity, targetDate, priority, billOfMaterials, routing } = req.body

    if (!productId || !quantity || !targetDate) {
      return next(new AppError('Product ID, quantity, and target date are required', 400))
    }

    const product = await Product.findById(productId)
    if (!product) {
      return next(new AppError('Product not found', 404))
    }

    // Create actual ProductionOrder using the model
    const productionOrder = new ProductionOrder({
      orderNumber: `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      product: productId,
      quantity,
      targetDate: new Date(targetDate),
      priority: priority || 'normal',
      status: 'planned',
      billOfMaterials: billOfMaterials || [],
      routing: routing || [],
      actualCosts: {
        materialCost: 0,
        laborCost: 0,
        overheadCost: 0,
        totalCost: 0
      },
      progress: {
        percentComplete: 0,
        completedOperations: 0,
        totalOperations: routing?.length || 0
      }
    })

    await productionOrder.save()

    res.status(201).json({
      success: true,
      data: productionOrder,
      message: 'Production order created successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get material requirements planning (MRP)
// @route   GET /api/production/mrp
// @access  Private (Admin/Production Manager)
export const getMaterialRequirements = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { dateFrom, dateTo } = req.query

    const startDate = dateFrom ? new Date(dateFrom as string) : new Date()
    const endDate = dateTo ? new Date(dateTo as string) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // TODO: Calculate actual material requirements from production orders and BOMs
    const materialRequirements: MaterialRequirement[] = [
      {
        _id: 'req-001',
        materialId: 'mat-001',
        materialName: 'Steel Component A',
        requiredQuantity: 1500,
        availableQuantity: 200,
        shortfall: 1300,
        unit: 'kg',
        requirementDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        supplier: 'Steel Corp Ltd',
        leadTime: 7,
        status: 'shortage'
      },
      {
        _id: 'req-002',
        materialId: 'mat-002',
        materialName: 'Electronic Module B',
        requiredQuantity: 800,
        availableQuantity: 150,
        shortfall: 650,
        unit: 'pcs',
        requirementDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        supplier: 'Electronics Inc',
        leadTime: 10,
        status: 'shortage'
      },
      {
        _id: 'req-003',
        materialId: 'mat-003',
        materialName: 'Packaging Material',
        requiredQuantity: 2000,
        availableQuantity: 2500,
        shortfall: 0,
        unit: 'pcs',
        requirementDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        supplier: 'Pack Solutions',
        leadTime: 3,
        status: 'available'
      }
    ]

    const summary = {
      totalMaterials: materialRequirements.length,
      criticalShortages: materialRequirements.filter(req => req.status === 'shortage').length,
      availableMaterials: materialRequirements.filter(req => req.status === 'available').length,
      totalShortfallValue: materialRequirements.reduce((sum, req) => sum + (req.shortfall * 10), 0) // Estimated value
    }

    res.status(200).json({
      success: true,
      data: {
        materialRequirements,
        summary,
        period: { start: startDate, end: endDate }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get work center capacity planning
// @route   GET /api/production/capacity
// @access  Private (Admin/Production Manager)
export const getCapacityPlanning = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement actual WorkCenter model and capacity calculations
    const workCenters: WorkCenter[] = [
      {
        _id: 'wc-001',
        code: 'ASM01',
        name: 'Assembly Line 1',
        department: 'Production',
        capacity: {
          hoursPerDay: 16,
          daysPerWeek: 5,
          efficiency: 85
        },
        currentLoad: {
          scheduled: 68,
          available: 12,
          utilization: 85
        },
        resources: [
          { type: 'machine', name: 'Assembly Robot', quantity: 2, hourlyRate: 50 },
          { type: 'operator', name: 'Assembly Technician', quantity: 4, hourlyRate: 25 }
        ],
        maintenanceSchedule: [
          {
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            type: 'preventive',
            description: 'Monthly maintenance check',
            estimatedDuration: 4
          }
        ]
      },
      {
        _id: 'wc-002',
        code: 'QC01',
        name: 'Quality Control Station',
        department: 'Quality',
        capacity: {
          hoursPerDay: 8,
          daysPerWeek: 5,
          efficiency: 90
        },
        currentLoad: {
          scheduled: 26,
          available: 10,
          utilization: 72
        },
        resources: [
          { type: 'tool', name: 'Testing Equipment', quantity: 3, hourlyRate: 15 },
          { type: 'operator', name: 'Quality Inspector', quantity: 2, hourlyRate: 30 }
        ]
      }
    ]

    // Capacity utilization trends (last 30 days)
    const utilizationTrends = []
    for (let i = 30; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      utilizationTrends.push({
        date,
        'Assembly Line 1': 75 + Math.random() * 20,
        'Quality Control': 60 + Math.random() * 25,
        'Packaging': 70 + Math.random() * 20
      })
    }

    // Capacity alerts
    const capacityAlerts = [
      {
        workCenter: 'Assembly Line 1',
        message: 'High utilization detected - consider additional shifts',
        severity: 'warning',
        utilization: 92.5
      }
    ]

    res.status(200).json({
      success: true,
      data: {
        workCenters,
        utilizationTrends: utilizationTrends.slice(-7), // Last 7 days
        capacityAlerts,
        summary: {
          totalWorkCenters: workCenters.length,
          averageUtilization: workCenters.reduce((sum, wc) => sum + wc.currentLoad.utilization, 0) / workCenters.length,
          overutilizedCenters: workCenters.filter(wc => wc.currentLoad.utilization > 90).length
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update production order status
// @route   PUT /api/production/orders/:id/status
// @access  Private (Admin/Production Manager)
export const updateProductionOrderStatus = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { status, completedOperations, actualCosts, notes } = req.body

    const validStatuses = ['planned', 'released', 'in-progress', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid production order status', 400))
    }

    // TODO: Update actual ProductionOrder model
    const updatedOrder = {
      _id: id,
      status,
      progress: {
        completedOperations: completedOperations || 0,
        percentComplete: completedOperations ? (completedOperations / 2) * 100 : 0 // Assuming 2 total operations
      },
      actualCosts: actualCosts || {},
      notes,
      updatedAt: new Date()
    }

    if (status === 'completed') {
      updatedOrder.progress = {
        ...updatedOrder.progress,
        percentComplete: 100
      }
    }

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: `Production order status updated to ${status}`
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Generate production reports
// @route   GET /api/production/reports
// @access  Private (Admin/Production Manager)
export const getProductionReports = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const reportType = req.query.type || 'efficiency'
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

    let reportData: any

    switch (reportType) {
      case 'efficiency':
        reportData = {
          overallEfficiency: 84.2,
          workCenterEfficiency: [
            { workCenter: 'Assembly Line 1', efficiency: 87.5, target: 85 },
            { workCenter: 'Quality Control', efficiency: 92.1, target: 90 },
            { workCenter: 'Packaging', efficiency: 78.3, target: 80 }
          ],
          trends: [
            { period: 'Week 1', efficiency: 82.1 },
            { period: 'Week 2', efficiency: 84.5 },
            { period: 'Week 3', efficiency: 86.2 },
            { period: 'Week 4', efficiency: 84.2 }
          ]
        }
        break

      case 'quality':
        reportData = {
          overallQualityRate: 98.7,
          defectRate: 1.3,
          reworkRate: 2.1,
          qualityByProduct: [
            { product: 'Premium Widget', qualityRate: 99.2, defects: 4 },
            { product: 'Standard Component', qualityRate: 98.1, defects: 12 }
          ],
          qualityTrends: [
            { period: 'Week 1', qualityRate: 98.1 },
            { period: 'Week 2', qualityRate: 99.0 },
            { period: 'Week 3', qualityRate: 98.5 },
            { period: 'Week 4', qualityRate: 98.7 }
          ]
        }
        break

      case 'cost':
        reportData = {
          totalProductionCost: 125000,
          costBreakdown: {
            materials: 75000,
            labor: 35000,
            overhead: 15000
          },
          costPerUnit: 50.0,
          costVariance: -2.5, // Under budget
          costTrends: [
            { period: 'Week 1', cost: 128000 },
            { period: 'Week 2', cost: 126500 },
            { period: 'Week 3', cost: 124200 },
            { period: 'Week 4', cost: 125000 }
          ]
        }
        break

      default:
        return next(new AppError('Invalid report type', 400))
    }

    res.status(200).json({
      success: true,
      data: {
        reportType,
        period: { start: startDate, end: new Date(), range: timeRange },
        ...reportData,
        generatedAt: new Date()
      }
    })
  } catch (error) {
    next(error)
  }
}
