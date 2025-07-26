import { Router } from 'express';
import { 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser,
  getCurrentUser 
} from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// All user routes require authentication following Authentication Flow
router.use(protect);

// Current user route
router.get('/me', getCurrentUser);

// Admin routes
router.get('/', authorize('admin'), getUsers);

// User-specific routes
router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

export default router;
