// filepath: /Users/thomasmcavoy/GitHub/shoppingcart/src/controllers/productController.ts
import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product/ProductService';
import { AppError } from '../middleware/errorHandler';

const productService = ProductService.getInstance();

/**
 * Get products by category with filters
 * Following authController.ts sendTokenResponse pattern
 */
export const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category } = req.params;
    const filters = {
      subcategory: req.query.subcategory as string,
      brand: req.query.brand as string,
      size: req.query.size as string,
      color: req.query.color as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      sortBy: req.query.sortBy as any,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 12
    };

    const result = await productService.getProductsByCategory(category, filters);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Products fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured products for homepage
 */
export const getFeaturedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
    const products = await productService.getFeaturedProducts(limit);

    res.status(200).json({
      success: true,
      data: products,
      message: 'Featured products fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all categories with product counts
 */
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await productService.getCategories();

    res.status(200).json({
      success: true,
      data: categories,
      message: 'Categories fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search products
 */
export const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query) {
      throw new AppError('Search query is required', 400);
    }

    // Mock search - in production would use database search
    const allCategories = ['mens', 'womens', 'cosmetics', 'sports', 'hardware', 'electronics'];
    const results = await Promise.all(
      allCategories.map(cat => productService.getProductsByCategory(cat, { limit: 20 }))
    );

    const allProducts = results.flatMap(result => result.products);
    const filteredProducts = allProducts.filter(product =>
      product.name.toLowerCase().includes((query as string).toLowerCase()) ||
      product.description.toLowerCase().includes((query as string).toLowerCase()) ||
      product.brand?.toLowerCase().includes((query as string).toLowerCase())
    );

    res.status(200).json({
      success: true,
      data: {
        products: filteredProducts.slice(0, 20),
        totalCount: filteredProducts.length,
        query
      },
      message: 'Search completed successfully'
    });
  } catch (error) {
    next(error);
  }
};
