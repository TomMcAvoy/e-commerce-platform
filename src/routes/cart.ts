import express from 'express';
import { optionalAuth, protect } from '../middleware/auth';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart
} from '../controllers/cartController';
import { validateAddToCart, validateUpdateCartItem, validateMongoId } from '../middleware/validation';

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private/Public (with session)
router.get('/', optionalAuth as any, getCart as any);

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private/Public (with session)
router.post('/items', optionalAuth as any, validateAddToCart, addToCart as any);

// @route   PUT /api/cart/items/:itemId
// @desc    Update cart item quantity
// @access  Private/Public (with session)
router.put('/items/:itemId', optionalAuth as any, validateUpdateCartItem, updateCartItem as any);

// @route   DELETE /api/cart/items/:itemId
// @desc    Remove item from cart
// @access  Private/Public (with session)
router.delete('/items/:itemId', optionalAuth as any, validateMongoId('itemId'), removeFromCart as any);

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private/Public (with session)
router.delete('/', optionalAuth as any, clearCart as any);

// @route   POST /api/cart/merge
// @desc    Merge guest cart with user cart
// @access  Private
router.post('/merge', protect as any, mergeCart as any);

export default router;
