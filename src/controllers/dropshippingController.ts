import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { DropshippingService } from '../services/dropshipping/DropshippingService';
import { Order } from '../models/Order';
import AppError from '../utils/AppError';
import { AuthenticatedRequest } from '../middleware/auth';

// Get the singleton instance of the service as per the architecture pattern
const dropshippingService = DropshippingService.getInstance();

/**
 * Dropshipping Controller following Service Architecture pattern from Copilot Instructions
 * Uses lazy loading and proper error handling with AppError class
 */

// @desc    Get all available dropshipping providers
// @route   GET /api/dropshipping/providers
// @access  Private/Admin
export const getProviders = asyncHandler(async (req: Request, res: Response) => {
    const providers = dropshippingService.getEnabledProviders();
    const providerData = providers.map(p => ({
        name: p.getProviderName(),
    }));
    res.status(200).json({ success: true, data: providerData });
});

// @desc    Get health status of all dropshipping providers
// @route   GET /api/dropshipping/health
// @access  Private/Admin
export const getDropshippingHealth = asyncHandler(async (req: Request, res: Response) => {
    const healthStatus = await dropshippingService.getHealth();
    res.status(200).json({ success: true, data: healthStatus });
});

// @desc    Manually fulfill an order with a dropshipping provider
// @route   POST /api/dropshipping/fulfill
// @access  Private/Admin
export const fulfillOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { orderId, provider } = req.body;

    if (!orderId || !provider) {
        return next(new AppError('Order ID and provider name are required', 400));
    }

    const order = await Order.findById(orderId);

    if (!order) {
        return next(new AppError('Order not found', 404));
    }

    const fulfillmentResult = await dropshippingService.createOrder(provider, order.toObject());

    if (fulfillmentResult.success) {
        order.isFulfilled = true;
        order.fulfillment = {
            provider: provider,
            externalOrderId: fulfillmentResult.externalOrderId,
            status: fulfillmentResult.status || 'processing'
        };
        await order.save();
    }

    res.status(201).json({
        success: true,
        data: fulfillmentResult
    });
});

// @desc    Get the status of a dropshipped order
// @route   GET /api/dropshipping/status/:provider/:externalOrderId
// @access  Private/Admin
export const getDropshippingOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { provider, externalOrderId } = req.params;
    const status = await dropshippingService.getOrderStatus(provider, externalOrderId);
    res.status(200).json({ success: true, data: status });
});

// @desc    Fetch products from a specific dropshipping provider
// @route   GET /api/dropshipping/products/:provider
// @access  Private/Admin
export const getProviderProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { provider } = req.params;
    // Pass query parameters from the request to the service method
    const products = await dropshippingService.getProducts(provider, req.query);
    res.status(200).json({ success: true, count: products.length, data: products });
});
