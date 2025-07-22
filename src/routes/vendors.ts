import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  registerVendor,
  getVendors,
  getVendor,
  updateVendor,
  deleteVendor,
  verifyVendor,
  getVendorStats
} from '../controllers/vendorController';
import { validateMongoId, validateVendorRegister } from '../middleware/validation';

const router = express.Router();

// @route   POST /api/vendors/register
// @desc    Register new vendor
// @access  Public
router.post('/register', validateVendorRegister, registerVendor);

// @route   GET /api/vendors
// @desc    Get all vendors
// @access  Public
router.get('/', getVendors);

// @route   GET /api/vendors/:id
// @desc    Get single vendor
// @access  Public
router.get('/:id', validateMongoId(), getVendor);

// @route   PUT /api/vendors/:id
// @desc    Update vendor profile
// @access  Private (Vendor/Admin)
router.put('/:id', protect as any, validateMongoId(), updateVendor as any);

// @route   DELETE /api/vendors/:id
// @desc    Delete vendor
// @access  Private (Admin only)
router.delete('/:id', protect as any, authorize('admin') as any, validateMongoId(), deleteVendor as any);

// @route   PUT /api/vendors/:id/verify
// @desc    Verify vendor (Admin only)
// @access  Private (Admin only)
router.put('/:id/verify', protect as any, authorize('admin') as any, validateMongoId(), verifyVendor as any);

// @route   GET /api/vendors/:id/stats
// @desc    Get vendor dashboard stats
// @access  Private (Vendor/Admin)
router.get('/:id/stats', protect as any, validateMongoId(), getVendorStats as any);

export default router;
