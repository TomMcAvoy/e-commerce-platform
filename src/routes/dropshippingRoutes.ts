import express from 'express';
import { getProviders, getDropshippingHealth, fulfillOrder, getDropshippingOrderStatus, getProviderProducts } from '../controllers/dropshippingController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/providers', protect, authorize('admin'), getProviders);
router.get('/health', protect, authorize('admin'), getDropshippingHealth);
router.post('/fulfill', protect, authorize('admin'), fulfillOrder);
router.get('/status/:provider/:externalOrderId', protect, authorize('admin'), getDropshippingOrderStatus);
router.get('/products/:provider', protect, authorize('admin'), getProviderProducts);

export default router;