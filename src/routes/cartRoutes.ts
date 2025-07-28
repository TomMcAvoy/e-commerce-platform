import express from 'express';
import { getCart, updateCart } from '../controllers/cartController';
import { protect } from '../middleware/protect';

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.route('/')
  .get(getCart)
  .put(updateCart);

export default router;