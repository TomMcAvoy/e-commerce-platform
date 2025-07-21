import { Request, Response, NextFunction } from 'express';
import { DropshippingService } from '../services/dropshipping/DropshippingService';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse, ProductSearchQuery } from '../types';

interface AuthenticatedRequest extends Request {
  user?: any;
}

// Initialize dropshipping service
const dropshippingService = new DropshippingService();

// Initialize all providers on startup
dropshippingService.initializeAll().catch(console.error);

// @desc    Get available dropshipping providers
// @route   GET /api/dropshipping/providers
// @access  Public
export const getProviders = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const providers = dropshippingService.getProviders();
    
    res.status(200).json({
      success: true,
      data: {
        providers,
        count: providers.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products across dropshipping providers
// @route   GET /api/dropshipping/search
// @access  Private
export const searchProducts = async (
  req: Request<{}, ApiResponse, {}, ProductSearchQuery>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
      sortBy,
      sortOrder,
      provider
    } = req.query;

    const searchParams = {
      keyword: q,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as 'price' | 'rating' | 'sales' | 'newest' | undefined,
      sortOrder: sortOrder as 'asc' | 'desc' | undefined
    };

    const results = await dropshippingService.searchProducts(searchParams, provider as string);

    res.status(200).json({
      success: true,
      data: {
        results,
        searchParams,
        totalProviders: results.length,
        totalProducts: results.reduce((sum, result) => sum + result.products.length, 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product from dropshipping provider
// @route   GET /api/dropshipping/products/:provider/:productId
// @access  Private
export const getProduct = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { provider, productId } = req.params;

    const product = await dropshippingService.getProduct(productId, provider);

    res.status(200).json({
      success: true,
      data: {
        product,
        provider
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Import product from dropshipping provider
// @route   POST /api/dropshipping/import
// @access  Private (Vendor/Admin)
export const importProduct = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, provider } = req.body;

    if (!productId || !provider) {
      return next(new AppError('Product ID and provider are required', 400));
    }

    const result = await dropshippingService.importProduct(productId, provider);

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync inventory for dropshipping products
// @route   POST /api/dropshipping/sync-inventory
// @access  Private (Vendor/Admin)
export const syncInventory = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { productMappings } = req.body;

    if (!productMappings || !Array.isArray(productMappings)) {
      return next(new AppError('Product mappings array is required', 400));
    }

    const updates = await dropshippingService.syncInventory(productMappings);

    res.status(200).json({
      success: true,
      data: {
        updates,
        syncedCount: updates.length
      },
      message: `Synced inventory for ${updates.length} products`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create dropshipping order
// @route   POST /api/dropshipping/orders
// @access  Private (Vendor/Admin)
export const createOrder = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { orderData, provider } = req.body;

    if (!orderData) {
      return next(new AppError('Order data is required', 400));
    }

    const result = await dropshippingService.createOrder(orderData, provider);

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dropshipping order status
// @route   GET /api/dropshipping/orders/:provider/:orderId
// @access  Private (Vendor/Admin)
export const getOrderStatus = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { provider, orderId } = req.params;

    const status = await dropshippingService.getOrderStatus(orderId, provider);

    res.status(200).json({
      success: true,
      data: {
        status,
        provider
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Health check for dropshipping providers
// @route   GET /api/dropshipping/health
// @access  Public
export const healthCheck = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const health = await dropshippingService.healthCheck();

    res.status(200).json({
      success: true,
      data: {
        providers: health,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product recommendations
// @route   GET /api/dropshipping/recommendations
// @access  Private
export const getRecommendations = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, limit = 20 } = req.query;

    const recommendations = await dropshippingService.getRecommendations(
      category as string,
      Number(limit)
    );

    res.status(200).json({
      success: true,
      data: {
        recommendations,
        count: recommendations.length,
        category
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk import products
// @route   POST /api/dropshipping/bulk-import
// @access  Private (Vendor/Admin)
export const bulkImport = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { searchQuery, provider, maxProducts = 50 } = req.body;

    if (!searchQuery || !provider) {
      return next(new AppError('Search query and provider are required', 400));
    }

    const results = await dropshippingService.bulkImport(
      searchQuery,
      provider,
      Number(maxProducts)
    );

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    res.status(200).json({
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: failureCount
        }
      },
      message: `Bulk import completed: ${successCount} successful, ${failureCount} failed`
    });
  } catch (error) {
    next(error);
  }
};
