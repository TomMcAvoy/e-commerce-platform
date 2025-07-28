import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getMe // Correct function name
} from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect); // Protect all routes below

router.get('/me', getMe); // Use the correct function

// Admin routes
router.get('/', authorize('admin'), getUsers);

// User-specific routes
router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

export default router;
