import express from 'express';
import { getVendors, getVendorProfile } from '../controllers/vendorController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/').get(protect, authorize('admin'), getVendors);
router.route('/:id').get(protect, getVendorProfile);

export default router;
