import express from 'express';
import { 
  getVendors, 
  getVendorById, 
  getVendorBySlug, 
  createVendorProfile, 
  updateVendorProfile,
  getVendorProducts,
  registerVendor,
  importProducts
} from '../controllers/vendorController';
import { protect, authorize } from '../../../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/vendors
 * @desc    Get all vendors
 * @access  Public
 */
router.get('/', getVendors);

/**
 * @route   GET /api/vendors/slug/:slug
 * @desc    Get vendor by slug
 * @access  Public
 */
router.get('/slug/:slug', getVendorBySlug);

/**
 * @route   GET /api/vendors/:id
 * @desc    Get vendor by ID
 * @access  Public
 */
router.get('/:id', getVendorById);

/**
 * @route   GET /api/vendors/:id/products
 * @desc    Get vendor products
 * @access  Public
 */
router.get('/:id/products', getVendorProducts);

/**
 * @route   POST /api/vendors/register
 * @desc    Register as a vendor
 * @access  Public
 */
router.post('/register', registerVendor);

/**
 * @route   POST /api/vendors
 * @desc    Create vendor profile
 * @access  Private
 */
router.post('/', protect, createVendorProfile);

/**
 * @route   PUT /api/vendors/:id
 * @desc    Update vendor profile
 * @access  Private
 */
router.put('/:id', protect, updateVendorProfile);

/**
 * @route   POST /api/vendors/import-products
 * @desc    Import products for vendor
 * @access  Private/Vendor
 */
router.post('/import-products', protect, authorize('vendor', 'admin'), importProducts);

export default router;