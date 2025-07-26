import express from 'express';
import {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus
} from '../controllers/orderController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes below this are protected
router.use(protect);

router.route('/')
    .get(getOrders)
    .post(createOrder);

router.route('/:id')
    .get(getOrder);

router.route('/:id/status')
    .put(authorize('admin', 'vendor'), updateOrderStatus);

export default router;