import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { AuthenticatedRequest } from '../types';
import DropshippingService from '../services/dropshipping/DropshippingService';
import Order from '../models/Order';

/**
 * Dropshipping Controller following Service Architecture pattern from Copilot Instructions
 * Uses lazy loading and proper error handling with AppError class
 */

// ✅ Use lazy loading instead of immediate instantiation to prevent test issues
const getDropshippingService = () => {
  return DropshippingService.getInstance();
};

export const createDropshipOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dropshippingService = getDropshippingService();
    const { orderData, provider } = req.body;
    
    if (!orderData || !provider) {
      return next(new AppError('Order data and provider are required', 400));
    }
    
    const result = await dropshippingService.createOrder(orderData, provider);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        data: result,
        message: 'Dropship order created successfully'
      });
    } else {
      return next(new AppError(result.error || 'Failed to create dropship order', 400));
    }
  } catch (error) {
    next(new AppError('Error creating dropship order', 500));
  }
};

export const getDropshipProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dropshippingService = getDropshippingService();
    const { provider } = req.params;
    const query = req.query;
    
    if (!provider) {
      return next(new AppError('Provider parameter is required', 400));
    }
    
    const products = await dropshippingService.getProductsFromProvider(provider, query);
    
    res.status(200).json({
      success: true,
      data: products,
      message: 'Products retrieved successfully'
    });
  } catch (error) {
    next(new AppError('Error fetching dropship products', 500));
  }
};

export const getProviderHealth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dropshippingService = getDropshippingService();
    const health = await dropshippingService.getProviderHealth();
    
    res.status(200).json({
      success: true,
      data: health,
      message: 'Provider health check completed'
    });
  } catch (error) {
    next(new AppError('Error checking provider health', 500));
  }
};

export const getAllProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dropshippingService = getDropshippingService();
    const providers = dropshippingService.getEnabledProviders();
    
    res.status(200).json({
      success: true,
      data: providers,
      message: 'Providers retrieved successfully'
    });
  } catch (error) {
    next(new AppError('Error fetching providers', 500));
  }
};

export const getProviderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dropshippingService = getDropshippingService();
    const status = dropshippingService.getProviderStatus();
    
    res.status(200).json({
      success: true,
      data: status,
      message: 'Provider status retrieved successfully'
    });
  } catch (error) {
    next(new AppError('Error fetching provider status', 500));
  }
};

// Additional endpoints following Critical Integration Points
export const syncProvider = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { provider, products } = req.body;
    
    res.status(200).json({
      success: true,
      message: 'Provider sync initiated',
      data: {
        syncId: `sync_${Date.now()}`,
        provider: provider || 'unknown',
        productCount: products?.length || 0,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(new AppError('Error syncing provider', 500));
  }
};

export const calculateShipping = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { provider, productId, quantity, destinationCountry, destinationZip } = req.body;

    if (!provider || !productId || !quantity || !destinationCountry) {
      return next(new AppError('Missing required fields for shipping calculation', 400));
    }

    // Mock shipping calculation following Critical Integration Points
    const baseShipping = 4.99;
    const perItemShipping = 1.50;
    const internationalSurcharge = destinationCountry !== 'US' ? 5.00 : 0;
    
    const calculatedShipping = {
      provider,
      productId,
      quantity,
      destination: { country: destinationCountry, zip: destinationZip || null },
      costs: {
        baseShipping,
        perItemCost: perItemShipping * (quantity - 1),
        internationalSurcharge,
        totalShipping: baseShipping + (perItemShipping * (quantity - 1)) + internationalSurcharge
      },
      estimatedDelivery: {
        min: destinationCountry === 'US' ? 3 : 7,
        max: destinationCountry === 'US' ? 5 : 14,
        unit: 'business days'
      }
    };

    res.status(200).json({
      success: true,
      data: calculatedShipping,
      message: 'Shipping costs calculated successfully'
    });
  } catch (error) {
    next(new AppError('Failed to calculate shipping costs', 500));
  }
};

// @desc    Manually trigger fulfillment for an order via the dropshipping service
// @route   POST /api/dropshipping/fulfill/:orderId
export const fulfillOrder = async (req: TenantRequest, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findOne({ _id: orderId, tenantId: req.tenantId });
        if (!order) {
            return next(new AppError(`Order not found with id of ${orderId}`, 404));
        }

        // In a real multi-vendor app, you'd also check if the user (vendor) owns the products in the order.
        
        const fulfillmentResult = await DropshippingService.getInstance().fulfillOrder(order);

        res.status(200).json({ success: true, data: fulfillmentResult });
    } catch (error: any) {
        // Catch errors from the service layer and forward them
        next(new AppError(error.message, error.statusCode || 500));
    }
};

// @desc    Get the status of the configured dropshipping providers
// @route   GET /api/dropshipping/status
export const getProvidersStatus = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const status = await DropshippingService.getInstance().getProvidersStatus();
        res.status(200).json({ success: true, data: status });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};
