import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getProviders,
  searchProducts,
  getProduct,
  importProduct,
  syncInventory,
  createOrder,
  getOrderStatus,
  healthCheck
} from '../controllers/dropshippingController';

const router = express.Router();

// Public routes
router.get('/providers', getProviders);
router.get('/health', healthCheck);

// Protected routes (require authentication)
router.get('/search', protect, searchProducts);
router.get('/products/:provider/:productId', protect, getProduct);

// Vendor/Admin only routes
router.post('/import', protect, authorize('vendor', 'admin'), importProduct);
router.post('/sync-inventory', protect, authorize('vendor', 'admin'), syncInventory);
router.post('/orders', protect, authorize('vendor', 'admin'), createOrder);
router.get('/orders/:provider/:orderId', protect, authorize('vendor', 'admin'), getOrderStatus);

export default router;
