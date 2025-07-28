import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryBySlug
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';
import * as categoryController from '../controllers/categoryController';

const router = express.Router();

router.route('/slug/:slug').get(categoryController.getCategoryBySlug);

router
  .route('/')
  .get(getCategories)
  .post(protect, authorize('admin'), createCategory);

router.route('/:id')
  .get(getCategory)
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

export default router;
