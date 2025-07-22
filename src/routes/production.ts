import express from 'express'
import {
  getProductionDashboard,
  getProductionOrders,
  createProductionOrder,
  getMaterialRequirements,
  getCapacityPlanning,
  updateProductionOrderStatus,
  getProductionReports
} from '../controllers/productionController'
import { protect, authorize } from '../middleware/auth'

const router = express.Router()

// Production Dashboard
router.get('/dashboard', protect, authorize('admin', 'production_manager'), getProductionDashboard)

// Production Orders
router.route('/orders')
  .get(protect, authorize('admin', 'production_manager', 'manager'), getProductionOrders)
  .post(protect, authorize('admin', 'production_manager'), createProductionOrder)

router.put('/orders/:id/status', protect, authorize('admin', 'production_manager'), updateProductionOrderStatus)

// Material Requirements Planning
router.get('/mrp', protect, authorize('admin', 'production_manager'), getMaterialRequirements)

// Capacity Planning
router.get('/capacity', protect, authorize('admin', 'production_manager'), getCapacityPlanning)

// Production Reports
router.get('/reports', protect, authorize('admin', 'production_manager'), getProductionReports)

export default router
