import express from 'express';
import asyncHandler from 'express-async-handler';
import { getCategories, createCategory, getCategory, updateCategory, deleteCategory, getCategoryBySlug } from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(asyncHandler(getCategories))
  .post(protect, authorize('admin'), asyncHandler(createCategory));

// FIX: Use the correctly imported 'getCategoryBySlug' function and wrap it in asyncHandler for consistency.
router.route('/slug/:slug').get(asyncHandler(getCategoryBySlug));

router.route('/:id')
  .get(asyncHandler(getCategory))
  .put(protect, authorize('admin'), asyncHandler(updateCategory))
  .delete(protect, authorize('admin'), asyncHandler(deleteCategory));

export default router;