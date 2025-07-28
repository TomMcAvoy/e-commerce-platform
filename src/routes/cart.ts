import express from 'express';
import { getCart, addItem, removeItem, clearCart } from '../controllers/cartController';
import { protect } from '../middleware/auth';

const router = express.Router();

/**
 * Shopping cart routes following Shopping Cart Operations from Copilot Instructions
 * All routes require authentication via protect middleware
 */

router.route('/').get(protect, getCart).post(protect, addItem);
router.route('/:itemId').delete(protect, removeItem);
router.route('/clear').delete(protect, clearCart);

export default router;
