import { Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import AppError from '../utils/AppError';
import { TenantRequest } from '../middleware/tenantResolver';
import eventService from '../services/eventService';

// @desc    Get all orders for the logged-in user or all tenant orders for admin
// @route   GET /api/orders
export const getOrders = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            // Admin sees all orders for the tenant
            query = Order.find({ tenantId: req.tenantId });
        } else {
            // Regular user sees only their own orders
            query = Order.find({ user: req.user.id, tenantId: req.tenantId });
        }
        const orders = await query.populate('user', 'name email').populate('items.product');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
export const getOrder = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, tenantId: req.tenantId })
            .populate('user', 'name email')
            .populate('items.product');

        if (!order) {
            return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
        }

        // Ensure user owns the order or is an admin
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new AppError('Not authorized to view this order', 401));
        }

        res.status(200).json({ success: true, data: order });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Create a new order
// @route   POST /api/orders
export const createOrder = async (req: TenantRequest, res: Response, next: NextFunction) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
        return next(new AppError('No order items provided', 400));
    }

    try {
        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findOne({ _id: item.product, tenantId: req.tenantId });
            if (!product) {
                return next(new AppError(`Product not found: ${item.product}`, 404));
            }
            if (product.stock < item.quantity) {
                return next(new AppError(`Not enough stock for ${product.name}`, 400));
            }
            orderItems.push({
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                product: item.product,
            });
            totalPrice += product.price * item.quantity;
            // In a real app, you'd decrement stock here within a transaction
        }

        const order = await Order.create({
            tenantId: req.tenantId,
            user: req.user.id,
            items: orderItems,
            totalPrice,
            shippingAddress,
            paymentMethod,
        });
        
        // Emit an event for other services (e.g., notifications, dropshipping)
        eventService.emitEvent('order:created', { orderId: order._id, userId: req.user.id });

        res.status(201).json({ success: true, data: order });
    } catch (error: any) {
        next(new AppError(error.message, 400));
    }
};

// @desc    Update order status (for admins/vendors)
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, tenantId: req.tenantId },
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
        }
        
        eventService.emitEvent('order:status_updated', { orderId: order._id, newStatus: status });

        res.status(200).json({ success: true, data: order });
    } catch (error: any) {
        next(new AppError(error.message, 400));
    }
};
