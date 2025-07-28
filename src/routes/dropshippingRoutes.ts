import express from 'express';
import { importProducts } from '../controllers/dropshippingController';
import { protect, authorize } from '../middleware/protect';

const router = express.Router();

// This route is protected and only accessible by admins, as it performs a major operation.
router.post('/import', protect, authorize('admin'), importProducts);

export default router;