import express from 'express'
import {
  getHRDashboard,
  getEmployees,
  getEmployeeProfile,
  createEmployee,
  processPayroll,
  getTimeTracking,
  submitTimeEntry
} from '../controllers/hrController'
import { protect, authorize } from '../middleware/auth'

const router = express.Router()

// HR Dashboard
router.get('/dashboard', protect as any, authorize('admin', 'hr_manager') as any, getHRDashboard as any)

// Employee Management
router.get('/employees', protect as any, authorize('admin', 'hr_manager', 'manager') as any, getEmployees as any)
router.post('/employees', protect as any, authorize('admin', 'hr_manager') as any, createEmployee as any)
router.get('/employees/:id', protect as any, authorize('admin', 'hr_manager', 'manager') as any, getEmployeeProfile as any)

// Payroll Management
router.post('/payroll/process', protect as any, authorize('admin', 'hr_manager') as any, processPayroll as any)

// Time Tracking
router.get('/timetracking', protect as any, authorize('admin', 'hr_manager', 'manager', 'employee') as any, getTimeTracking as any)
router.post('/timetracking', protect as any, authorize('admin', 'hr_manager', 'manager', 'employee') as any, submitTimeEntry as any)

export default router
