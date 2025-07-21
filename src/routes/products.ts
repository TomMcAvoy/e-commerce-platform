import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, searchProducts } from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('vendor', 'admin'), createProduct);

router.get('/search', searchProducts);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('vendor', 'admin'), updateProduct)
  .delete(protect, authorize('vendor', 'admin'), deleteProduct);

export default router;
