import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, searchProducts } from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';
import { validateCreateProduct, validateUpdateProduct, validateMongoId, validatePagination } from '../middleware/validation';

const router = express.Router();

router.route('/')
  .get(validatePagination, getProducts)
  .post(protect as any, authorize('vendor', 'admin') as any, validateCreateProduct, createProduct as any);

router.get('/search', searchProducts);

router.route('/:id')
  .get(validateMongoId(), getProduct)
  .put(protect as any, authorize('vendor', 'admin') as any, validateUpdateProduct, updateProduct as any)
  .delete(protect as any, authorize('vendor', 'admin') as any, validateMongoId(), deleteProduct as any);

export default router;
