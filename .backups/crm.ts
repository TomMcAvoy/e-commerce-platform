import express from 'express'
import {
  getCRMDashboard,
  getCustomers,
  getCustomerProfile,
  addCustomerNote,
  getCustomerSegments
} from '../controllers/crmController'
import { protect, authorize } from '../middleware/auth'
import { handleValidationErrors } from '../middleware/validation'

const { body, param } = require('express-validator')

const router = express.Router()

// Customer note validation
const customerNoteValidation = [
  body('note').notEmpty().withMessage('Note content is required'),
  body('type').optional().isIn(['general', 'support', 'sales', 'billing']).withMessage('Invalid note type'),
  param('id').isMongoId().withMessage('Invalid customer ID')
]

// All routes require authentication and admin/vendor authorization
router.use(protect as any)
router.use(authorize('admin', 'vendor') as any)

// GET /api/crm/dashboard - Get CRM dashboard
router.get('/dashboard', getCRMDashboard as any)

// GET /api/crm/customers - Get all customers with filtering
router.get('/customers', getCustomers as any)

// GET /api/crm/customers/:id - Get customer profile
router.get('/customers/:id', getCustomerProfile as any)

// POST /api/crm/customers/:id/notes - Add note to customer
router.post('/customers/:id/notes', customerNoteValidation, handleValidationErrors, addCustomerNote as any)

// GET /api/crm/segments - Get customer segments
router.get('/segments', authorize('admin') as any, getCustomerSegments as any)

export default router
