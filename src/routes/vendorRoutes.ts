import express from 'express';
import { 
  getVendors, 
  getVendorProfile, 
  getVendorBySlug, 
  createVendorProfile, 
  updateVendorProfile,
  getVendorProducts,
  registerVendor,
  importProducts
} from '../controllers/vendorController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getVendors);
router.get('/slug/:slug', getVendorBySlug);
router.get('/:id', getVendorProfile);
router.get('/:id/products', getVendorProducts);

// Protected routes
router.post('/register', registerVendor);
router.post('/', protect, createVendorProfile);
router.put('/:id', protect, updateVendorProfile);
router.post('/import-products', protect, authorize('vendor', 'admin'), importProducts);

export default router;