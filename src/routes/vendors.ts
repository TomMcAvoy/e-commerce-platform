import express from 'express';
import { getVendors, getVendorProfile, getFeaturedVendors } from '../controllers/vendorController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.route('/featured').get(getFeaturedVendors);

// Protected routes
router.route('/').get(protect, authorize('admin'), getVendors);
router.route('/:id').get(protect, getVendorProfile);

export default router;
