import express from 'express';
import { getCart, addItem, updateItemQuantity, removeItem, clearCart } from '../controllers/cartController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addItem)
  .delete(clearCart);

router.route('/:productId')
  .put(updateItemQuantity)
  .delete(removeItem);

export default router;