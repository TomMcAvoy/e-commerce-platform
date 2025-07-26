import express from 'express';
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes below this are protected and require an admin role
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

export default router;