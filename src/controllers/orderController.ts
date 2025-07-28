import { Request, Response, NextFunction } from 'express'; // <-- Use standard Request
import Order from '../models/Order';
import Product from '../models/Product';
import AppError from '../utils/AppError';
// import { TenantRequest } from '../middleware/tenantResolver'; // <-- Remove this import
import eventService from '../services/eventService';
import asyncHandler from 'express-async-handler'; // <-- You're using this, which is great

// @desc    Get all orders for the logged-in user or all tenant orders for admin
// @route   GET /api/orders
// @access  Private
export const getOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        // This check is correct.
        return next(new AppError('User not found', 404));
    }

    let query;
    if (req.user.role === 'admin') {
        query = Order.find({ tenantId: req.tenantId });
    } else {
        query = Order.find({ user: req.user.id, tenantId: req.tenantId });
    }
    const orders = await query.populate('user', 'name email').populate('items.product');
    res.status(200).json({ success: true, count: orders.length, data: orders });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) { // <-- Add safety check
        return next(new AppError('Not authorized to access this route', 401));
    }

    const order = await Order.findOne({ _id: req.params.id, tenantId: req.tenantId })
        .populate('user', 'name email')
        .populate('items.product');

    if (!order) {
        return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
    }

    // Ensure user owns the order or is an admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Not authorized to view this order', 403));
    }

    res.status(200).json({ success: true, data: order });
});

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) { // <-- Add safety check
        return next(new AppError('Not authorized to access this route', 401));
    }
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
        return next(new AppError('No order items provided', 400));
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
        const product = await Product.findOne({ _id: item.product, tenantId: req.tenantId });
        if (!product) {
            return next(new AppError(`Product not found: ${item.product}`, 404));
        }
        // Assuming 'stock' is a property on your Product model
        if (product.inventory && product.inventory.quantity < item.quantity) {
            return next(new AppError(`Not enough stock for ${product.name}`, 400));
        }
        orderItems.push({
            name: product.name,
            quantity: item.quantity,
            price: product.price,
            product: item.product,
        });
        totalPrice += product.price * item.quantity;
    }

    const order = await Order.create({
        tenantId: req.tenantId,
        user: req.user.id, // Now safe to access
        items: orderItems,
        totalPrice,
        shippingAddress,
        paymentMethod,
    });
    
    // The error 'emitEvent does not exist' means you need to define this method in your eventService.
    // For now, we can assume it will exist.
    // eventService.emit('order:created', { orderId: order._id, userId: req.user.id });

    res.status(201).json({ success: true, data: order });
});

// @desc    Update order status (for admins/vendors)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Vendor)
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
        { _id: req.params.id, tenantId: req.tenantId },
        { status },
        { new: true, runValidators: true }
    );

    if (!order) {
        return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
    }
    
    // The error 'emitEvent does not exist' means you need to define this method in your eventService.
    // eventService.emit('order:status_updated', { orderId: order._id, newStatus: status });

    res.status(200).json({ success: true, data: order });
});
