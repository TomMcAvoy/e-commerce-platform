import express from 'express'
import {
  getPurchaseOrderDashboard,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  getSupplierPerformance,
  getPurchaseOrderAnalytics
} from '../controllers/purchaseOrderController'
import { protect, authorize } from '../middleware/auth'
import { handleValidationErrors } from '../middleware/validation'

const { body, param } = require('express-validator')

const router = express.Router()

// Purchase order creation validation
const createPOValidation = [
  body('vendorId').isMongoId().withMessage('Valid vendor ID is required'),
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('items.*.productId').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('items.*.unitCost').isFloat({ min: 0 }).withMessage('Unit cost must be a positive number'),
  body('expectedDate').optional().isISO8601().withMessage('Invalid expected date format'),
  body('notes').optional().isString().withMessage('Notes must be a string')
]

// Status update validation
const statusUpdateValidation = [
  param('id').isMongoId().withMessage('Invalid purchase order ID'),
  body('status').isIn(['draft', 'sent', 'confirmed', 'received', 'cancelled']).withMessage('Invalid status'),
  body('receivedDate').optional().isISO8601().withMessage('Invalid received date format'),
  body('notes').optional().isString().withMessage('Notes must be a string')
]

// All routes require authentication and admin/vendor authorization
router.use(protect as any)
router.use(authorize('admin', 'vendor') as any)

// GET /api/purchase-orders/dashboard - Get purchase order dashboard
router.get('/dashboard', getPurchaseOrderDashboard as any)

// GET /api/purchase-orders - Get all purchase orders
router.get('/', getPurchaseOrders as any)

// POST /api/purchase-orders - Create purchase order
router.post('/', createPOValidation, handleValidationErrors, createPurchaseOrder as any)

// PUT /api/purchase-orders/:id/status - Update purchase order status
router.put('/:id/status', statusUpdateValidation, handleValidationErrors, updatePurchaseOrderStatus as any)

// GET /api/purchase-orders/supplier-performance - Get supplier performance
router.get('/supplier-performance', authorize('admin') as any, getSupplierPerformance as any)

// GET /api/purchase-orders/analytics - Get purchase order analytics
router.get('/analytics', authorize('admin') as any, getPurchaseOrderAnalytics as any)

export default router
