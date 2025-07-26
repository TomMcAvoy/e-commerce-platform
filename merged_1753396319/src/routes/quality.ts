import express from 'express'
import {
  getQualityDashboard,
  getQualityInspections,
  createQualityInspection,
  getQualityMetrics,
  getSupplierQualityRatings,
  updateInspectionResults,
  getQualityReports
} from '../controllers/qualityController'
import { protect, authorize } from '../middleware/auth'

const router = express.Router()

// Quality Dashboard
router.get('/dashboard', protect as any, authorize('admin', 'quality_manager') as any, getQualityDashboard as any)

// Quality Inspections
router.get('/inspections', protect as any, authorize('admin', 'quality_manager', 'inspector') as any, getQualityInspections as any)
router.post('/inspections', protect as any, authorize('admin', 'quality_manager', 'inspector') as any, createQualityInspection as any)

router.put('/inspections/:id', protect as any, authorize('admin', 'quality_manager', 'inspector') as any, updateInspectionResults as any)

// Quality Metrics
router.get('/metrics', protect as any, authorize('admin', 'quality_manager') as any, getQualityMetrics as any)

// Supplier Quality
router.get('/suppliers', protect as any, authorize('admin', 'quality_manager') as any, getSupplierQualityRatings as any)

// Quality Reports
router.get('/reports', protect as any, authorize('admin', 'quality_manager') as any, getQualityReports as any)

export default router
