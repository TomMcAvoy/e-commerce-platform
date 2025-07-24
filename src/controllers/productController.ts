
import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product/ProductService';
import { AppError } from '../middleware/errorHandler';

const productService = ProductService.getInstance();

interface AuthRequest extends Request {
  user?: any;
}

/**
 * Get all products with pagination and filters
 * Following API Endpoints Structure from Copilot instructions
 */
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = {
      category: req.query.category as string,
      vendor: req.query.vendor as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 12,
      sortBy: req.query.sortBy as any
    };

    // If category is specified, use existing category function
    if (filters.category) {
      const result = await productService.getProductsByCategory(filters.category, filters);
      return res.status(200).json({
        success: true,
        data: result,
        message: 'Products fetched successfully'
      });
    }

    // Get all products from all categories
    const allCategories = ['mens', 'womens', 'cosmetics', 'sports', 'hardware', 'electronics'];
    const results = await Promise.all(
      allCategories.map(cat => productService.getProductsByCategory(cat, { limit: 50 }))
    );

    const allProducts = results.flatMap(result => result.products);
    
    // Apply filters
    let filteredProducts = allProducts;
    if (filters.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
    }

    // Pagination
    const startIndex = (filters.page - 1) * filters.limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + filters.limit);

    res.status(200).json({
      success: true,
      data: paginatedProducts,
      pagination: {
        currentPage: filters.page,
        totalPages: Math.ceil(filteredProducts.length / filters.limit),
        totalItems: filteredProducts.length,
        itemsPerPage: filters.limit
      },
      message: 'Products fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by ID
 * Following Error Handling Pattern from Copilot instructions
 */
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Search through all categories to find the product
    const allCategories = ['mens', 'womens', 'cosmetics', 'sports', 'hardware', 'electronics'];
    let foundProduct = null;

    for (const category of allCategories) {
      const result = await productService.getProductsByCategory(category, { limit: 1000 });
      foundProduct = result.products.find(p => p.id === id);
      if (foundProduct) break;
    }

    if (!foundProduct) {
      throw new AppError('Product not found', 404);
    }

    res.status(200).json({
      success: true,
      data: foundProduct,
      message: 'Product fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product
 * Following Authentication Flow from Copilot instructions
 */
export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const productData = {
      ...req.body,
      vendor: req.user.id, // Add vendor from authenticated user
      createdAt: new Date().toISOString()
    };

    // In a real implementation, this would save to database
    // For now, return mock response following the pattern
    const mockProduct = {
      id: `prod_${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: mockProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing product
 * Following Security Considerations from Copilot instructions
 */
export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { id } = req.params;
    
    // Find the product first
    const allCategories = ['mens', 'womens', 'cosmetics', 'sports', 'hardware', 'electronics'];
    let foundProduct = null;

    for (const category of allCategories) {
      const result = await productService.getProductsByCategory(category, { limit: 1000 });
      foundProduct = result.products.find(p => p.id === id);
      if (foundProduct) break;
    }

    if (!foundProduct) {
      throw new AppError('Product not found', 404);
    }

    // Check if user owns this product or is admin
    if (foundProduct.vendor !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this product', 403);
    }

    // Mock update response
    const updatedProduct = {
      ...foundProduct,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 * Following Security Considerations from Copilot instructions
 */
export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { id } = req.params;
    
    // Find the product first
    const allCategories = ['mens', 'womens', 'cosmetics', 'sports', 'hardware', 'electronics'];
    let foundProduct = null;

    for (const category of allCategories) {
      const result = await productService.getProductsByCategory(category, { limit: 1000 });
      foundProduct = result.products.find(p => p.id === id);
      if (foundProduct) break;
    }

    if (!foundProduct) {
      throw new AppError('Product not found', 404);
    }

    // Check if user owns this product or is admin
    if (foundProduct.vendor !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this product', 403);
    }

    // Mock deletion (in real app would remove from database)
    res.status(204).json({
      success: true,
      data: null,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get products by category with filters
 * Following existing pattern from your codebase
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
 * Following existing pattern from your codebase
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
 * Following existing pattern from your codebase
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
 * Following existing pattern from your codebase
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