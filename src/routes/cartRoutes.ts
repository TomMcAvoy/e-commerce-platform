import express from 'express';
import {
    getCart,
    addItemToCart,
    removeItemFromCart,
    clearCart
} from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All cart routes are protected and require a logged-in user
router.use(protect);

router.route('/')
    .get(getCart)
    .post(addItemToCart)
    .delete(clearCart);

router.route('/:productId')
    .delete(removeItemFromCart);

export default router;