import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../types'
import Product from '../models/Product'
import Vendor from '../models/Vendor'
import QualityInspection from '../models/QualityInspection'
import AppError from '../utils/AppError'

interface QualityInspection {
  _id?: string
  inspectionNumber: string
  productId: string
  productName?: string
  batchNumber?: string
  inspectionType: 'incoming' | 'in-process' | 'final' | 'supplier-audit'
  inspectionDate: Date
  inspector: string
  status: 'pending' | 'in-progress' | 'passed' | 'failed' | 'conditional'
  testResults: Array<{
    testName: string
    specification: string
    actualValue: string
    result: 'pass' | 'fail' | 'marginal'
    notes?: string
  }>
  nonConformances?: Array<{
    description: string
    severity: 'minor' | 'major' | 'critical'
    correctiveAction: string
    responsibleParty: string
    dueDate: Date
    status: 'open' | 'in-progress' | 'closed'
  }>
  attachments?: Array<{
    fileName: string
    fileType: string
    uploadDate: Date
  }>
  overallResult: 'pass' | 'fail' | 'conditional'
  certificateNumber?: string
}

interface QualityMetric {
  _id?: string
  metricName: string
  category: 'defect-rate' | 'customer-complaints' | 'supplier-quality' | 'process-capability'
  value: number
  unit: string
  target: number
  threshold: {
    warning: number
    critical: number
  }
  trend: 'improving' | 'stable' | 'declining'
  lastUpdated: Date
}

interface SupplierQualityRating {
  _id?: string
  supplierId: string
  supplierName: string
  qualityScore: number
  deliveryPerformance: number
  responseTime: number
  overallRating: 'A' | 'B' | 'C' | 'D' | 'F'
  auditDate?: Date
  nextAuditDue?: Date
  certifications: Array<{
    type: string
    number: string
    validUntil: Date
    status: 'valid' | 'expired' | 'suspended'
  }>
  qualityIssues: {
    total: number
    open: number
    resolved: number
    critical: number
  }
}

// @desc    Get quality dashboard
// @route   GET /api/quality/dashboard
// @access  Private (Admin/Quality Manager)
export const getQualityDashboard = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Quality metrics summary
    const qualityMetrics = {
      overallQualityScore: 96.8,
      defectRate: 0.32, // percentage
      customerComplaintRate: 0.15,
      firstPassYield: 94.2,
      costOfQuality: {
        prevention: 25000,
        appraisal: 18000,
        internalFailure: 12000,
        externalFailure: 8000,
        total: 63000
      }
    }

    // Recent inspections summary
    const inspectionSummary = {
      total: 245,
      pending: 12,
      inProgress: 8,
      passed: 210,
      failed: 15,
      passRate: 93.3
    }

    // Top quality issues
    const topQualityIssues = [
      {
        issue: 'Surface finish defects',
        occurrences: 18,
        impact: 'medium',
        status: 'under-investigation'
      },
      {
        issue: 'Dimensional variance',
        occurrences: 12,
        impact: 'high',
        status: 'corrective-action-pending'
      },
      {
        issue: 'Color inconsistency',
        occurrences: 8,
        impact: 'low',
        status: 'resolved'
      }
    ]

    // Supplier quality performance
    const supplierQuality = [
      { supplier: 'Steel Corp Ltd', qualityScore: 98.5, rating: 'A', trend: 'stable' },
      { supplier: 'Electronics Inc', qualityScore: 94.2, rating: 'A', trend: 'improving' },
      { supplier: 'Components Co', qualityScore: 87.1, rating: 'B', trend: 'declining' }
    ]

    // Quality trends (last 12 weeks)
    const qualityTrends = []
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000)
      qualityTrends.push({
        week: `Week ${12 - i}`,
        date: weekStart,
        qualityScore: 95 + Math.random() * 5,
        defectRate: 0.2 + Math.random() * 0.3,
        passRate: 92 + Math.random() * 6
      })
    }

    const dashboard = {
      qualityMetrics,
      inspectionSummary,
      topQualityIssues,
      supplierQuality,
      qualityTrends
    }

    res.status(200).json({
      success: true,
      data: dashboard
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get quality inspections
// @route   GET /api/quality/inspections
// @access  Private (Admin/Quality Manager)
export const getQualityInspections = async (
  req: Request,
  res: Response<PaginatedResponse<QualityInspection>>,
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

    if (req.query.type) {
      filter.inspectionType = req.query.type
    }

    if (req.query.dateFrom || req.query.dateTo) {
      filter.inspectionDate = {}
      if (req.query.dateFrom) {
        filter.inspectionDate.$gte = new Date(req.query.dateFrom as string)
      }
      if (req.query.dateTo) {
        filter.inspectionDate.$lte = new Date(req.query.dateTo as string)
      }
    }

    // TODO: Replace with actual QualityInspection model
    const qualityInspections: QualityInspection[] = [
      {
        _id: 'qi-001',
        inspectionNumber: 'QI-2025-001',
        productId: 'prod-001',
        productName: 'Premium Widget',
        batchNumber: 'B2025-001',
        inspectionType: 'final',
        inspectionDate: new Date(),
        inspector: 'John Quality',
        status: 'passed',
        testResults: [
          {
            testName: 'Dimensional Check',
            specification: '10.0 ± 0.1 mm',
            actualValue: '10.05 mm',
            result: 'pass'
          },
          {
            testName: 'Surface Finish',
            specification: 'Ra ≤ 1.6 μm',
            actualValue: '1.2 μm',
            result: 'pass'
          },
          {
            testName: 'Hardness Test',
            specification: '45-50 HRC',
            actualValue: '47 HRC',
            result: 'pass'
          }
        ],
        overallResult: 'pass',
        certificateNumber: 'QC-2025-001'
      },
      {
        _id: 'qi-002',
        inspectionNumber: 'QI-2025-002',
        productId: 'prod-002',
        productName: 'Standard Component',
        batchNumber: 'B2025-002',
        inspectionType: 'in-process',
        inspectionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        inspector: 'Jane Inspector',
        status: 'failed',
        testResults: [
          {
            testName: 'Weight Check',
            specification: '500 ± 5 g',
            actualValue: '512 g',
            result: 'fail',
            notes: 'Exceeds upper tolerance limit'
          },
          {
            testName: 'Color Match',
            specification: 'RAL 5015',
            actualValue: 'Visual pass',
            result: 'pass'
          }
        ],
        nonConformances: [
          {
            description: 'Weight exceeds specification',
            severity: 'major',
            correctiveAction: 'Review material density and process parameters',
            responsibleParty: 'Production Team',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            status: 'open'
          }
        ],
        overallResult: 'fail'
      }
    ]

    // Apply filters (simplified for demo)
    let filteredInspections = qualityInspections
    if (req.query.status) {
      filteredInspections = filteredInspections.filter(insp => insp.status === req.query.status)
    }

    const paginatedInspections = filteredInspections.slice(skip, skip + limit)
    const total = filteredInspections.length

    res.status(200).json({
      success: true,
      data: paginatedInspections,
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

// @desc    Create quality inspection
// @route   POST /api/quality/inspections
// @access  Private (Admin/Quality Manager)
export const createQualityInspection = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, batchNumber, inspectionType, testResults } = req.body

    if (!productId || !inspectionType) {
      return next(new AppError('Product ID and inspection type are required', 400))
    }

    const product = await Product.findById(productId)
    if (!product) {
      return next(new AppError('Product not found', 404))
    }

    // TODO: Create actual QualityInspection model
    const qualityInspection: QualityInspection = {
      _id: new Date().getTime().toString(),
      inspectionNumber: `QI-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      productId,
      productName: product.name,
      batchNumber,
      inspectionType,
      inspectionDate: new Date(),
      inspector: req.user?.email || 'Unknown',
      status: 'pending',
      testResults: testResults || [],
      overallResult: 'pass' // Will be calculated based on test results
    }

    res.status(201).json({
      success: true,
      data: qualityInspection,
      message: 'Quality inspection created successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get quality metrics
// @route   GET /api/quality/metrics
// @access  Private (Admin/Quality Manager)
export const getQualityMetrics = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Calculate actual metrics from inspection data
    const qualityMetrics: QualityMetric[] = [
      {
        _id: 'qm-001',
        metricName: 'Overall Defect Rate',
        category: 'defect-rate',
        value: 0.32,
        unit: '%',
        target: 0.5,
        threshold: { warning: 0.4, critical: 0.6 },
        trend: 'improving',
        lastUpdated: new Date()
      },
      {
        _id: 'qm-002',
        metricName: 'Customer Complaint Rate',
        category: 'customer-complaints',
        value: 0.15,
        unit: '%',
        target: 0.2,
        threshold: { warning: 0.18, critical: 0.25 },
        trend: 'stable',
        lastUpdated: new Date()
      },
      {
        _id: 'qm-003',
        metricName: 'Supplier Quality Score',
        category: 'supplier-quality',
        value: 94.2,
        unit: 'score',
        target: 95,
        threshold: { warning: 90, critical: 85 },
        trend: 'improving',
        lastUpdated: new Date()
      },
      {
        _id: 'qm-004',
        metricName: 'Process Capability (Cpk)',
        category: 'process-capability',
        value: 1.33,
        unit: 'index',
        target: 1.33,
        threshold: { warning: 1.0, critical: 0.8 },
        trend: 'stable',
        lastUpdated: new Date()
      }
    ]

    // Calculate trends for each metric (last 12 periods)
    const metricTrends = qualityMetrics.map(metric => ({
      metricName: metric.metricName,
      category: metric.category,
      currentValue: metric.value,
      target: metric.target,
      trend: metric.trend,
      historicalData: Array.from({ length: 12 }, (_, i) => ({
        period: `Period ${i + 1}`,
        value: metric.value + (Math.random() - 0.5) * 0.1 * metric.value
      }))
    }))

    res.status(200).json({
      success: true,
      data: {
        metrics: qualityMetrics,
        trends: metricTrends,
        summary: {
          totalMetrics: qualityMetrics.length,
          metricsAboveTarget: qualityMetrics.filter(m => m.value >= m.target).length,
          metricsBelowWarning: qualityMetrics.filter(m => m.value < m.threshold.warning).length
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get supplier quality ratings
// @route   GET /api/quality/suppliers
// @access  Private (Admin/Quality Manager)
export const getSupplierQualityRatings = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Calculate actual supplier quality data
    const supplierRatings: SupplierQualityRating[] = [
      {
        _id: 'sqr-001',
        supplierId: 'sup-001',
        supplierName: 'Steel Corp Ltd',
        qualityScore: 98.5,
        deliveryPerformance: 96.2,
        responseTime: 4.5,
        overallRating: 'A',
        auditDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        nextAuditDue: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
        certifications: [
          {
            type: 'ISO 9001:2015',
            number: 'ISO9001-2023-001',
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            status: 'valid'
          },
          {
            type: 'ISO 14001:2015',
            number: 'ISO14001-2023-001',
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            status: 'valid'
          }
        ],
        qualityIssues: {
          total: 23,
          open: 2,
          resolved: 21,
          critical: 0
        }
      },
      {
        _id: 'sqr-002',
        supplierId: 'sup-002',
        supplierName: 'Electronics Inc',
        qualityScore: 94.2,
        deliveryPerformance: 92.8,
        responseTime: 6.2,
        overallRating: 'A',
        auditDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        nextAuditDue: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000),
        certifications: [
          {
            type: 'ISO 9001:2015',
            number: 'ISO9001-2023-002',
            validUntil: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
            status: 'valid'
          }
        ],
        qualityIssues: {
          total: 31,
          open: 5,
          resolved: 26,
          critical: 1
        }
      }
    ]

    // Performance trends for suppliers
    const performanceTrends = supplierRatings.map(supplier => ({
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      currentRating: supplier.overallRating,
      qualityTrend: Array.from({ length: 12 }, (_, i) => ({
        month: `Month ${i + 1}`,
        qualityScore: supplier.qualityScore + (Math.random() - 0.5) * 5,
        deliveryScore: supplier.deliveryPerformance + (Math.random() - 0.5) * 8
      }))
    }))

    res.status(200).json({
      success: true,
      data: {
        suppliers: supplierRatings,
        performanceTrends,
        summary: {
          totalSuppliers: supplierRatings.length,
          aRatedSuppliers: supplierRatings.filter(s => s.overallRating === 'A').length,
          averageQualityScore: supplierRatings.reduce((sum, s) => sum + s.qualityScore, 0) / supplierRatings.length,
          openQualityIssues: supplierRatings.reduce((sum, s) => sum + s.qualityIssues.open, 0)
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update inspection results
// @route   PUT /api/quality/inspections/:id
// @access  Private (Admin/Quality Manager)
export const updateInspectionResults = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { testResults, nonConformances, status, overallResult } = req.body

    if (!testResults || !Array.isArray(testResults)) {
      return next(new AppError('Test results are required', 400))
    }

    // TODO: Update actual QualityInspection model
    const updatedInspection: any = {
      _id: id,
      testResults,
      nonConformances: nonConformances || [],
      status: status || 'completed',
      overallResult: overallResult || 'pass',
      updatedAt: new Date()
    }

    // Generate certificate if inspection passed
    if (overallResult === 'pass') {
      updatedInspection.certificateNumber = `QC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    }

    res.status(200).json({
      success: true,
      data: updatedInspection,
      message: 'Inspection results updated successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Generate quality reports
// @route   GET /api/quality/reports
// @access  Private (Admin/Quality Manager)
export const getQualityReports = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const reportType = req.query.type || 'summary'
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
      case 'summary':
        reportData = {
          qualityOverview: {
            totalInspections: 245,
            passRate: 93.3,
            failRate: 6.7,
            averageQualityScore: 96.8
          },
          topDefects: [
            { defect: 'Surface finish', occurrences: 18, percentage: 32.1 },
            { defect: 'Dimensional variance', occurrences: 12, percentage: 21.4 },
            { defect: 'Color issues', occurrences: 8, percentage: 14.3 }
          ],
          productQuality: [
            { product: 'Premium Widget', qualityScore: 98.5, inspections: 95 },
            { product: 'Standard Component', qualityScore: 94.2, inspections: 150 }
          ]
        }
        break

      case 'cost-of-quality':
        reportData = {
          totalCostOfQuality: 63000,
          costBreakdown: {
            prevention: { amount: 25000, percentage: 39.7 },
            appraisal: { amount: 18000, percentage: 28.6 },
            internalFailure: { amount: 12000, percentage: 19.0 },
            externalFailure: { amount: 8000, percentage: 12.7 }
          },
          costTrends: [
            { period: 'Month 1', prevention: 23000, appraisal: 19000, failure: 15000 },
            { period: 'Month 2', prevention: 24000, appraisal: 18500, failure: 12000 },
            { period: 'Month 3', prevention: 25000, appraisal: 18000, failure: 10000 }
          ]
        }
        break

      case 'supplier-quality':
        reportData = {
          supplierOverview: {
            totalSuppliers: 15,
            averageQualityScore: 92.3,
            aRatedSuppliers: 8,
            suppliersWithIssues: 3
          },
          topPerformers: [
            { supplier: 'Steel Corp Ltd', score: 98.5, rating: 'A' },
            { supplier: 'Electronics Inc', score: 94.2, rating: 'A' },
            { supplier: 'Components Co', score: 87.1, rating: 'B' }
          ],
          qualityIssuesBySupplier: [
            { supplier: 'Electronics Inc', issues: 5, critical: 1 },
            { supplier: 'Components Co', issues: 8, critical: 2 }
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
