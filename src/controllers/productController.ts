import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse, PaginatedResponse, ProductSearchQuery } from '../types';

interface AuthenticatedRequest extends Request {
  user?: any;
}

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (
  req: Request<{}, PaginatedResponse<any>>,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const query: any = { isActive: true };

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice as string);
    }

    // Sort
    let sortBy = '-createdAt'; // Default sort by newest
    if (req.query.sortBy) {
      const sortOrder = req.query.sortOrder === 'desc' ? '-' : '';
      sortBy = `${sortOrder}${req.query.sortBy}`;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('vendorId', 'businessName rating');

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private (Vendor/Admin)
export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Add vendor to req.body
    req.body.vendorId = req.user._id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor/Admin)
export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Make sure user is product owner or admin
    if (product.vendorId !== req.user._id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this product', 401));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor/Admin)
export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Make sure user is product owner or admin
    if (product.vendorId !== req.user._id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete this product', 401));
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (
  req: Request<{}, PaginatedResponse<any>, {}, ProductSearchQuery>,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      q,
      category,
      subcategory,
      vendor,
      minPrice,
      maxPrice,
      tags,
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const skip = ((page as number) - 1) * (limit as number);

    let query: any = { isActive: true };
    let sort: any = {};

    // Text search
    if (q) {
      query.$text = { $search: q };
      sort.score = { $meta: 'textScore' };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    // Vendor filter
    if (vendor) {
      query.vendorId = vendor;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Tags filter
    if (tags && Array.isArray(tags)) {
      query.tags = { $in: tags };
    }

    // Sorting
    if (sortBy === 'price') {
      sort.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'name') {
      sort.name = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'newest') {
      sort.createdAt = -1;
    } else if (sortBy === 'rating') {
      // TODO: Add rating field or calculate from reviews
      sort.createdAt = -1;
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit as number);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: page as number,
        limit: limit as number,
        total,
        pages: Math.ceil(total / (limit as number))
      }
    });
  } catch (error) {
    next(error);
  }
};
