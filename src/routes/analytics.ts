import express from 'express'
import {
  getDashboard,
  getSalesAnalytics,
  getFinancialReports,
  getVendorAnalytics,
  exportAnalytics
} from '../controllers/analyticsController'
import { protect, authorize } from '../middleware/auth'
import { handleValidationErrors } from '../middleware/validation'

const { body, query } = require('express-validator')

const router = express.Router()

// Export validation
const exportValidation = [
  body('type').isIn(['orders', 'customers', 'products']).withMessage('Invalid export type'),
  body('format').optional().isIn(['json', 'csv']).withMessage('Invalid export format'),
  body('dateRange.start').optional().isISO8601().withMessage('Invalid start date format'),
  body('dateRange.end').optional().isISO8601().withMessage('Invalid end date format')
]

// Time range validation
const timeRangeValidation = [
  query('range').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid time range')
]

// Report type validation
const reportTypeValidation = [
  query('type').optional().isIn(['revenue', 'profit']).withMessage('Invalid report type'),
  query('range').optional().isIn(['1m', '3m', '1y']).withMessage('Invalid time range')
]

// All routes require authentication and admin authorization
router.use(protect as any)
router.use(authorize('admin') as any)

// GET /api/analytics/dashboard - Get comprehensive business dashboard
router.get('/dashboard', getDashboard as any)

// GET /api/analytics/sales - Get sales analytics
router.get('/sales', timeRangeValidation, handleValidationErrors, getSalesAnalytics as any)

// GET /api/analytics/financial - Get financial reports
router.get('/financial', reportTypeValidation, handleValidationErrors, getFinancialReports as any)

// GET /api/analytics/vendors - Get vendor performance analytics
router.get('/vendors', timeRangeValidation, handleValidationErrors, getVendorAnalytics as any)

// POST /api/analytics/export - Export analytics data
router.post('/export', exportValidation, handleValidationErrors, exportAnalytics as any)

export default router
