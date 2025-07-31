import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import Category from '../models/Category';
import AppError from '../utils/AppError';

/**
 * Categories Controller following API Endpoints Structure from Copilot Instructions
 * Database-driven category management for multi-vendor e-commerce platform
 */

export const getCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const query = Category.find({}).sort({ name: 1 });

    if (limit) {
      query.limit(limit);
    }

    const categories = await query;

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Create a category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({
      name,
      description
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get single category by slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate('products');
    
    if (!category) {
      return next(new AppError(`Category not found with slug of ${req.params.slug}`, 404));
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new AppError(`Category not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(new AppError('Server error fetching category', 500));
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return next(new AppError(`Category not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(new AppError('Error updating category', 400));
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new AppError(`Category not found with id of ${req.params.id}`, 404));
    }
    await category.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(new AppError('Error deleting category', 500));
  }
});
