import express from 'express';
import {
    getVendors,
    getVendor,
    createVendor,
    updateVendor,
    deleteVendor
} from '../controllers/vendorController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes for viewing vendors
router.route('/')
    .get(getVendors);

router.route('/:id')
    .get(getVendor);

// Protected routes
router.route('/:id')
    .put(protect, authorize('admin', 'vendor'), updateVendor);

// Admin-only routes
router.route('/')
    .post(protect, authorize('admin'), createVendor);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteVendor);

export default router;