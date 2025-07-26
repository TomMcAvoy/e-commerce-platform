import express from 'express';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes for viewing categories
router.route('/')
    .get(getCategories);

router.route('/:id')
    .get(getCategory);

// Protected admin routes for managing categories
router.route('/')
    .post(protect, authorize('admin'), createCategory);

router.route('/:id')
    .put(protect, authorize('admin'), updateCategory)
    .delete(protect, authorize('admin'), deleteCategory);

export default router;