import express from 'express'
import {
  getHRDashboard,
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  processPayroll,
  getTimeTracking,
  submitTimeEntry,
  getPerformanceReviews,
  createPerformanceReview,
  getHRReports
} from '../controllers/hrController'
import { protect, authorize } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'

const router = express.Router()

// All routes require authentication
router.use(protect)

// HR Dashboard
router.get('/dashboard', authorize('admin', 'hr_manager'), getHRDashboard)

// Employee Management
router.route('/employees')
  .get(authorize('admin', 'hr_manager', 'manager'), getEmployees)
  .post(authorize('admin', 'hr_manager'), createEmployee)

router.route('/employees/:id')
  .get(authorize('admin', 'hr_manager', 'manager'), getEmployee)
  .put(authorize('admin', 'hr_manager'), updateEmployee)

// Payroll Management
router.post('/payroll/process', authorize('admin', 'hr_manager'), processPayroll)

// Time Tracking
router.route('/timetracking')
  .get(authorize('admin', 'hr_manager', 'manager', 'employee'), getTimeTracking)
  .post(authorize('admin', 'hr_manager', 'manager', 'employee'), submitTimeEntry)

// Performance Management
router.route('/performance')
  .get(authorize('admin', 'hr_manager', 'manager'), getPerformanceReviews)
  .post(authorize('admin', 'hr_manager', 'manager'), createPerformanceReview)

// HR Reports
router.get('/reports', authorize('admin', 'hr_manager'), getHRReports)

export default router
