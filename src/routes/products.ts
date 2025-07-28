import express from 'express';
import {
  getProducts,
  getProduct,
  getProductBySlug,       // This will now be found
  getFeaturedProducts,    // This will now be found
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

// CRITICAL: More specific routes must be defined *before* general ones.
router.route('/featured')
  .get(getFeaturedProducts);

router.route('/slug/:slug')
  .get(getProductBySlug);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

export default router;
