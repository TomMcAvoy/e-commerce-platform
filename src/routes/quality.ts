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
router.get('/dashboard', protect, authorize('admin', 'quality_manager'), getQualityDashboard)

// Quality Inspections
router.route('/inspections')
  .get(protect, authorize('admin', 'quality_manager', 'inspector'), getQualityInspections)
  .post(protect, authorize('admin', 'quality_manager', 'inspector'), createQualityInspection)

router.put('/inspections/:id', protect, authorize('admin', 'quality_manager', 'inspector'), updateInspectionResults)

// Quality Metrics
router.get('/metrics', protect, authorize('admin', 'quality_manager'), getQualityMetrics)

// Supplier Quality
router.get('/suppliers', protect, authorize('admin', 'quality_manager'), getSupplierQualityRatings)

// Quality Reports
router.get('/reports', protect, authorize('admin', 'quality_manager'), getQualityReports)

export default router
