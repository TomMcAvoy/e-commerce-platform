import { Router } from 'express';
import { getUsers, getUser, updateUser } from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(protect, authorize('admin'), getUsers);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser);

export default router;
