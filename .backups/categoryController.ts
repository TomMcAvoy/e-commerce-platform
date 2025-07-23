import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import { ApiResponse, PaginatedResponse, AuthenticatedRequest } from '../types';
import AppError from '../utils/AppError';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (
  req: Request,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      active = 'true',
      parent,
      sort = 'sortOrder',
      limit = '50',
      page = '1'
    } = req.query;

    // Build query
    const query: any = {};
    
    if (active !== 'all') {
      query.isActive = active === 'true';
    }

    if (parent) {
      if (parent === 'none') {
        query.parentCategory = { $exists: false };
      } else {
        query.parentCategory = parent;
      }
    }

    // Parse pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    // Get categories with pagination
    const categories = await Category.find(query)
      .sort(sort as string)
      .limit(limitNum)
      .skip(skip)
      .populate('parentCategory', 'name slug');

    // Get total count for pagination
    const total = await Category.countDocuments(query);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id)
      .populate('parentCategory', 'name slug');

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
export const getCategoryBySlug = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true })
      .populate('parentCategory', 'name slug');

    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Admin only)
export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(new AppError('Not authorized to create categories', 403));
    }

    const {
      name,
      slug,
      description,
      parentCategory,
      image,
      isActive = true,
      sortOrder = 0
    } = req.body;

    // Validate required fields
    if (!name) {
      return next(new AppError('Category name is required', 400));
    }

    if (!slug) {
      return next(new AppError('Category slug is required', 400));
    }

    // Check if slug is unique
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return next(new AppError('Category slug already exists', 400));
    }

    // Validate parent category if provided
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return next(new AppError('Parent category not found', 404));
      }
    }

    const category = await Category.create({
      name,
      slug,
      description,
      parentCategory,
      image,
      isActive,
      sortOrder
    });

    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update categories', 403));
    }

    const { id } = req.params;
    const {
      name,
      slug,
      description,
      parentCategory,
      image,
      isActive,
      sortOrder
    } = req.body;

    // Find category
    const category = await Category.findById(id);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    // Check if new slug is unique (if slug is being changed)
    if (slug && slug !== category.slug) {
      const existingCategory = await Category.findOne({ slug });
      if (existingCategory) {
        return next(new AppError('Category slug already exists', 400));
      }
    }

    // Validate parent category if provided
    if (parentCategory && parentCategory !== category.parentCategory?.toString()) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return next(new AppError('Parent category not found', 404));
      }

      // Prevent circular reference
      if (parentCategory === id) {
        return next(new AppError('Category cannot be its own parent', 400));
      }
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(parentCategory !== undefined && { parentCategory }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder })
      },
      { new: true, runValidators: true }
    ).populate('parentCategory', 'name slug');

    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(new AppError('Not authorized to delete categories', 403));
    }

    const { id } = req.params;

    // Find category
    const category = await Category.findById(id);
    if (!category) {
      return next(new AppError('Category not found', 404));
    }

    // Check if category has subcategories
    const subcategories = await Category.countDocuments({ parentCategory: id });
    if (subcategories > 0) {
      return next(new AppError('Cannot delete category with subcategories', 400));
    }

    // TODO: Check if category has products (when Product model is updated)
    // const productsCount = await Product.countDocuments({ category: id });
    // if (productsCount > 0) {
    //   return next(new AppError('Cannot delete category with products', 400));
    // }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category tree (hierarchical structure)
// @route   GET /api/categories/tree
// @access  Public
export const getCategoryTree = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { active = 'true' } = req.query;

    // Build query
    const query: any = {};
    if (active !== 'all') {
      query.isActive = active === 'true';
    }

    // Get all categories
    const categories = await Category.find(query)
      .sort('sortOrder')
      .lean();

    // Build tree structure
    const buildTree = (parentId: string | null = null): any[] => {
      return categories
        .filter(cat => {
          if (parentId === null) {
            return !cat.parentCategory;
          }
          return cat.parentCategory?.toString() === parentId;
        })
        .map(cat => ({
          ...cat,
          children: buildTree(cat._id.toString())
        }));
    };

    const tree = buildTree();

    res.status(200).json({
      success: true,
      data: tree
    });
  } catch (error) {
    next(error);
  }
};
