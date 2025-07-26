import express from 'express';
import {
    fulfillOrder,
    getProvidersStatus
} from '../controllers/dropshippingController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected and require admin or vendor roles
router.use(protect);

// GET /api/dropshipping/status - Check provider status (admin only)
router.get('/status', authorize('admin'), getProvidersStatus);

// POST /api/dropshipping/fulfill/:orderId - Trigger order fulfillment (admin/vendor)
router.post('/fulfill/:orderId', authorize('admin', 'vendor'), fulfillOrder);

export default router;