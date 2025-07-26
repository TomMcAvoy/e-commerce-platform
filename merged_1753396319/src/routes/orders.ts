import { Router } from 'express';
import { createOrder, getOrders, getOrder } from '../controllers/orderController';
import { protect } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.get('/:id', protect, getOrder);

export default router;
