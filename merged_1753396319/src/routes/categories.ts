import { Router } from 'express';
import { 
  getCategories, 
  getCategory, 
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public routes following API Endpoints Structure
router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategory);

// Admin-only routes following Security Considerations
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
