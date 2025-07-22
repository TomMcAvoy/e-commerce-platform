import express from 'express'
import {
  getFinancialDashboard,
  getTransactions,
  createTransaction,
  getPayouts,
  processPayout,
  getFinancialReports,
  getTaxReports
} from '../controllers/financialController'
import { protect, authorize } from '../middleware/auth'
import { handleValidationErrors } from '../middleware/validation'

const { body, param, query } = require('express-validator')

const router = express.Router()

// Transaction creation validation
const transactionValidation = [
  body('type').isIn(['fee', 'commission', 'adjustment', 'refund']).withMessage('Invalid transaction type'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').notEmpty().withMessage('Transaction description is required'),
  body('vendorId').optional().isMongoId().withMessage('Invalid vendor ID'),
  body('customerId').optional().isMongoId().withMessage('Invalid customer ID')
]

// Payout processing validation
const payoutValidation = [
  param('id').isMongoId().withMessage('Invalid payout ID'),
  body('action').isIn(['approve', 'reject', 'process']).withMessage('Invalid action'),
  body('notes').optional().isString().withMessage('Notes must be a string')
]

// Report validation
const reportValidation = [
  query('type').optional().isIn(['revenue', 'payouts']).withMessage('Invalid report type'),
  query('range').optional().isIn(['1w', '1m', '3m', '1y']).withMessage('Invalid time range')
]

// Tax report validation
const taxReportValidation = [
  query('year').optional().isInt({ min: 2020, max: 2030 }).withMessage('Invalid year'),
  query('quarter').optional().isInt({ min: 1, max: 4 }).withMessage('Invalid quarter')
]

// All routes require authentication and admin authorization
router.use(protect as any)
router.use(authorize('admin') as any)

// GET /api/financial/dashboard - Get financial dashboard
router.get('/dashboard', getFinancialDashboard as any)

// GET /api/financial/transactions - Get all transactions
router.get('/transactions', getTransactions as any)

// POST /api/financial/transactions - Create manual transaction
router.post('/transactions', transactionValidation, handleValidationErrors, createTransaction as any)

// GET /api/financial/payouts - Get vendor payouts
router.get('/payouts', getPayouts as any)

// POST /api/financial/payouts/:id/process - Process vendor payout
router.post('/payouts/:id/process', payoutValidation, handleValidationErrors, processPayout as any)

// GET /api/financial/reports - Generate financial reports
router.get('/reports', reportValidation, handleValidationErrors, getFinancialReports as any)

// GET /api/financial/tax-reports - Get tax reports
router.get('/tax-reports', taxReportValidation, handleValidationErrors, getTaxReports as any)

export default router
