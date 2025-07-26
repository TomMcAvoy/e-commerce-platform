import express from 'express'
import {
  getInventoryDashboard,
  getInventoryLevels,
  adjustInventory,
  generateInventoryReport,
  getLowStockAlerts
} from '../controllers/inventoryController'
import { protect, authorize } from '../middleware/auth'
import { handleValidationErrors } from '../middleware/validation'

const { body, query } = require('express-validator')

const router = express.Router()

// Inventory adjustment validation
const inventoryAdjustmentValidation = [
  body('adjustments').isArray({ min: 1 }).withMessage('Adjustments array is required'),
  body('adjustments.*.productId').notEmpty().withMessage('Product ID is required'),
  body('adjustments.*.quantity').isNumeric().withMessage('Quantity must be a number'),
  body('adjustments.*.type').isIn(['increase', 'decrease', 'set']).withMessage('Invalid adjustment type'),
  body('reason').optional().isString().withMessage('Reason must be a string')
]

// Report generation validation
const reportValidation = [
  query('type').optional().isIn(['movement', 'valuation', 'aging', 'reorder']).withMessage('Invalid report type'),
  query('dateFrom').optional().isISO8601().withMessage('Invalid start date format'),
  query('dateTo').optional().isISO8601().withMessage('Invalid end date format')
]

// All routes require authentication and admin/vendor authorization
router.use(protect as any)
router.use(authorize('admin', 'vendor') as any)

// GET /api/inventory/dashboard - Get inventory dashboard
router.get('/dashboard', getInventoryDashboard as any)

// GET /api/inventory/levels - Get inventory levels with filtering
router.get('/levels', getInventoryLevels as any)

// POST /api/inventory/adjust - Bulk inventory adjustments
router.post('/adjust', inventoryAdjustmentValidation, handleValidationErrors, adjustInventory as any)

// GET /api/inventory/reports - Generate inventory reports
router.get('/reports', reportValidation, handleValidationErrors, generateInventoryReport as any)

// GET /api/inventory/alerts/low-stock - Get low stock alerts
router.get('/alerts/low-stock', getLowStockAlerts as any)

export default router
