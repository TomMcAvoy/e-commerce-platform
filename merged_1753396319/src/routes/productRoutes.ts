// filepath: /Users/thomasmcavoy/GitHub/shoppingcart/src/routes/productRoutes.ts
import express from 'express';
import {
  getProductsByCategory,
  getFeaturedProducts,
  getCategories,
  searchProducts
} from '../controllers/productController';

const router = express.Router();

// Public routes - no authentication required following API Endpoints Structure
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);

export default router;
