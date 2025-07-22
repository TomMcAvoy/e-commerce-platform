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
router.get('/dashboard', protect as any, authorize('admin', 'production_manager') as any, getProductionDashboard as any)

// Production Orders
router.get('/orders', protect as any, authorize('admin', 'production_manager', 'manager') as any, getProductionOrders as any)
router.post('/orders', protect as any, authorize('admin', 'production_manager') as any, createProductionOrder as any)

router.put('/orders/:id/status', protect as any, authorize('admin', 'production_manager') as any, updateProductionOrderStatus as any)

// Material Requirements Planning
router.get('/mrp', protect as any, authorize('admin', 'production_manager') as any, getMaterialRequirements as any)

// Capacity Planning
router.get('/capacity', protect as any, authorize('admin', 'production_manager') as any, getCapacityPlanning as any)

// Production Reports
router.get('/reports', protect as any, authorize('admin', 'production_manager') as any, getProductionReports as any)

export default router
