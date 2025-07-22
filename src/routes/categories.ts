import express from 'express';
import { protect } from '../middleware/auth';
import {
  getCategories,
  getCategory,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree
} from '../controllers/categoryController';
import { validateCreateCategory, validateUpdateCategory, validateMongoId, validatePagination } from '../middleware/validation';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories with pagination and filtering
// @access  Public
router.get('/', validatePagination, getCategories);

// @route   GET /api/categories/tree
// @desc    Get categories in hierarchical tree structure
// @access  Public
router.get('/tree', getCategoryTree);

// @route   GET /api/categories/slug/:slug
// @desc    Get category by slug
// @access  Public
router.get('/slug/:slug', getCategoryBySlug);

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
router.get('/:id', validateMongoId(), getCategory);

// @route   POST /api/categories
// @desc    Create new category
// @access  Private (Admin only)
router.post('/', protect as any, validateCreateCategory, createCategory as any);

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin only)
router.put('/:id', protect as any, validateUpdateCategory, updateCategory as any);

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private (Admin only)
router.delete('/:id', protect as any, validateMongoId(), deleteCategory as any);

export default router;
