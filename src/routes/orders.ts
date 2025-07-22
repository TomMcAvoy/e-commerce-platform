import express from 'express';
import { protect } from '../middleware/auth';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController';
import { validateCreateOrder, validateMongoId, validatePagination } from '../middleware/validation';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user's orders with pagination and filtering
// @access  Private
router.get('/', protect as any, validatePagination, getOrders as any);

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', protect as any, validateMongoId(), getOrder as any);

// @route   POST /api/orders
// @desc    Create new order from cart
// @access  Private
router.post('/', protect as any, validateCreateOrder, createOrder as any);

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin/Vendor only)
// @access  Private (Admin/Vendor)
router.put('/:id/status', protect as any, validateMongoId(), updateOrderStatus as any);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect as any, validateMongoId(), cancelOrder as any);

export default router;
