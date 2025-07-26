import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import AppError from '../utils/AppError';

/**
 * Categories Controller following API Endpoints Structure from Copilot Instructions
 * Database-driven category management for multi-vendor e-commerce platform
 */

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { includeInactive = false, parent = null } = req.query;
    
    // Build query following Database Patterns
    const query: any = {};
    
    if (!includeInactive) {
      query.isActive = true;
    }
    
    if (parent === 'null' || parent === null) {
      query.parentCategory = null;
    } else if (parent) {
      query.parentCategory = parent;
    }

    const categories = await Category.find(query)
      .populate('productCount')
      .sort({ name: 1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      data: categories,
      message: 'Categories retrieved successfully',
      count: categories.length
    });
  } catch (error) {
    next(new AppError('Error retrieving categories', 500));
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true })
      .populate('productCount')
      .populate('parentCategory', 'name slug')
      .select('-__v');

    if (!category) {
      return next(new AppError(`Category with slug '${slug}' not found`, 404));
    }

    // Get subcategories if this is a parent category
    const subcategories = await Category.find({ 
      parentCategory: category._id, 
      isActive: true 
    }).select('name slug');

    const categoryData = {
      ...category.toObject(),
      subcategories: subcategories
    };

    res.status(200).json({
      success: true,
      data: categoryData,
      message: 'Category retrieved successfully'
    });
  } catch (error) {
    next(new AppError('Error retrieving category', 500));
  }
};

// @desc    Get products by category
// @route   GET /api/categories/:slug/products
// @access  Public
export const getCategoryProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      sort = 'createdAt', 
      order = 'desc',
      minPrice,
      maxPrice,
      inStock,
      vendor
    } = req.query;

    // Find category first
    const category = await Category.findOne({ slug, isActive: true });
    
    if (!category) {
      return next(new AppError(`Category with slug '${slug}' not found`, 404));
    }

    // Build product query following Database Patterns
    const productQuery: any = { category: category._id };
    
    if (minPrice || maxPrice) {
      productQuery.price = {};
      if (minPrice) productQuery.price.$gte = Number(minPrice);
      if (maxPrice) productQuery.price.$lte = Number(maxPrice);
    }
    
    if (inStock === 'true') {
      productQuery.stock = { $gt: 0 };
    }
    
    if (vendor) {
      productQuery.vendor = vendor;
    }

    // Calculate pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj: any = {};
    sortObj[sort as string] = sortOrder;

    // Execute queries with compound indexes for performance
    const [products, totalProducts] = await Promise.all([
      Product.find(productQuery)
        .populate('vendor', 'name slug verified')
        .populate('category', 'name slug')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .select('-__v'),
      Product.countDocuments(productQuery)
    ]);

    const pagination = {
      page: pageNum,
      limit: limitNum,
      total: totalProducts,
      pages: Math.ceil(totalProducts / limitNum),
      hasNext: pageNum < Math.ceil(totalProducts / limitNum),
      hasPrev: pageNum > 1
    };

    res.status(200).json({
      success: true,
      data: products,
      pagination,
      message: 'Category products retrieved successfully'
    });
  } catch (error) {
    next(new AppError('Error retrieving category products', 500));
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin only)
export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return next(new AppError('Category slug already exists', 400));
    }
    next(new AppError('Error creating category', 500));
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    next(new AppError('Error updating category', 500));
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(new AppError('Error deleting category', 500));
  }
};
