import express from 'express'
import {
  getFulfillmentDashboard,
  getShipments,
  updateShipmentStatus,
  generateShippingLabel,
  getFulfillmentAnalytics,
  bulkUpdateShipments
} from '../controllers/fulfillmentController'
import { protect, authorize } from '../middleware/auth'
import { handleValidationErrors } from '../middleware/validation'

const { body, param } = require('express-validator')

const router = express.Router()

// Shipment status update validation
const statusUpdateValidation = [
  param('id').isMongoId().withMessage('Invalid shipment ID'),
  body('status').isIn(['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed']).withMessage('Invalid status'),
  body('trackingNumber').optional().isString().withMessage('Tracking number must be a string'),
  body('carrier').optional().isString().withMessage('Carrier must be a string'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  body('estimatedDelivery').optional().isISO8601().withMessage('Invalid estimated delivery date format')
]

// Shipping label validation
const shippingLabelValidation = [
  param('id').isMongoId().withMessage('Invalid shipment ID'),
  body('carrier').notEmpty().withMessage('Carrier is required'),
  body('serviceType').notEmpty().withMessage('Service type is required'),
  body('insurance').optional().isBoolean().withMessage('Insurance must be a boolean')
]

// Bulk update validation
const bulkUpdateValidation = [
  body('shipmentIds').isArray({ min: 1 }).withMessage('Shipment IDs array is required'),
  body('shipmentIds.*').isMongoId().withMessage('Invalid shipment ID'),
  body('updates').notEmpty().withMessage('Updates object is required'),
  body('updates.status').optional().isIn(['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed']).withMessage('Invalid status'),
  body('updates.carrier').optional().isString().withMessage('Carrier must be a string'),
  body('updates.estimatedDelivery').optional().isISO8601().withMessage('Invalid estimated delivery date format')
]

// All routes require authentication and admin/vendor authorization
router.use(protect as any)
router.use(authorize('admin', 'vendor') as any)

// GET /api/fulfillment/dashboard - Get fulfillment dashboard
router.get('/dashboard', getFulfillmentDashboard as any)

// GET /api/fulfillment/shipments - Get all shipments
router.get('/shipments', getShipments as any)

// PUT /api/fulfillment/shipments/:id/status - Update shipment status
router.put('/shipments/:id/status', statusUpdateValidation, handleValidationErrors, updateShipmentStatus as any)

// POST /api/fulfillment/shipments/:id/label - Generate shipping label
router.post('/shipments/:id/label', shippingLabelValidation, handleValidationErrors, generateShippingLabel as any)

// POST /api/fulfillment/shipments/bulk-update - Bulk update shipments
router.post('/shipments/bulk-update', bulkUpdateValidation, handleValidationErrors, bulkUpdateShipments as any)

// GET /api/fulfillment/analytics - Get fulfillment analytics
router.get('/analytics', authorize('admin') as any, getFulfillmentAnalytics as any)

export default router
