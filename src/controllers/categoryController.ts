import { Response, NextFunction } from 'express';
import Category from '../models/Category';
import AppError from '../utils/AppError';
import { TenantRequest } from '../middleware/tenantResolver';

/**
 * Categories Controller following API Endpoints Structure from Copilot Instructions
 * Database-driven category management for multi-vendor e-commerce platform
 */

// @desc    Get all categories for the tenant
// @route   GET /api/categories
export const getCategories = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find({ tenantId: req.tenantId });
        res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
export const getCategory = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, tenantId: req.tenantId });
        if (!category) {
            return next(new AppError(`Category not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: category });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Create a new category
// @route   POST /api/categories
export const createCategory = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const category = await Category.create({ ...req.body, tenantId: req.tenantId });
        res.status(201).json({ success: true, data: category });
    } catch (error: any) {
        next(new AppError(error.message, 400));
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
export const updateCategory = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const category = await Category.findOneAndUpdate({ _id: req.params.id, tenantId: req.tenantId }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!category) {
            return next(new AppError(`Category not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: category });
    } catch (error: any) {
        next(new AppError(error.message, 400));
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const category = await Category.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!category) {
            return next(new AppError(`Category not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};
