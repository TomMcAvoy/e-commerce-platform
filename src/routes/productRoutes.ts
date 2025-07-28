// filepath: /Users/thomasmcavoy/GitHub/shoppingcart/src/routes/productRoutes.ts
import express from 'express';
import asyncHandler from 'express-async-handler';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(asyncHandler(getProducts))
  .post(protect, authorize('admin', 'vendor'), asyncHandler(createProduct));

router.route('/:id')
  .get(asyncHandler(getProduct))
  .put(protect, authorize('admin', 'vendor'), asyncHandler(updateProduct))
  .delete(protect, authorize('admin', 'vendor'), asyncHandler(deleteProduct));

export default router;
