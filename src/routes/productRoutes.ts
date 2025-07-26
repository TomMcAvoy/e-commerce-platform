// filepath: /Users/thomasmcavoy/GitHub/shoppingcart/src/routes/productRoutes.ts
import express from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getCategories,
    searchProducts,
    getProductsByCategory
} from '../controllers/productController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes - no authentication required following API Endpoints Structure
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);

// Public routes for viewing products
router.route('/')
    .get(getProducts);

router.route('/:id')
    .get(getProduct);

// Protected admin/vendor routes for managing products
router.route('/')
    .post(protect, authorize('admin', 'vendor'), createProduct);

router.route('/:id')
    .put(protect, authorize('admin', 'vendor'), updateProduct)
    .delete(protect, authorize('admin', 'vendor'), deleteProduct);

export default router;
