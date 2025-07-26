import { Response, NextFunction } from 'express';
import Product from '../models/Product';
import Category from '../models/Category'; // Assuming a Category model exists
import AppError from '../utils/AppError';
import { TenantRequest } from '../middleware/tenantResolver';

// @desc    Get all products for the tenant
// @route   GET /api/products
export const getProducts = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find({ tenantId: req.tenantId }).populate('category vendor');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProduct = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, tenantId: req.tenantId }).populate('category vendor');
        if (!product) {
            return next(new AppError(`Product not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: product });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const product = await Product.create({ ...req.body, tenantId: req.tenantId });
        res.status(201).json({ success: true, data: product });
    } catch (error: any) {
        next(new AppError(error.message, 400));
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findOneAndUpdate({ _id: req.params.id, tenantId: req.tenantId }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            return next(new AppError(`Product not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: product });
    } catch (error: any) {
        next(new AppError(error.message, 400));
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!product) {
            return next(new AppError(`Product not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
export const getFeaturedProducts = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find({ tenantId: req.tenantId, isFeatured: true }).limit(10).populate('category vendor');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Get all product categories
// @route   GET /api/products/categories
export const getCategories = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find({ tenantId: req.tenantId });
        res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Search for products
// @route   GET /api/products/search
export const searchProducts = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const query = req.query.q as string;
        if (!query) {
            return next(new AppError('Please provide a search query', 400));
        }
        const products = await Product.find({
            tenantId: req.tenantId,
            $text: { $search: query }
        }).populate('category vendor');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Get products by category slug
// @route   GET /api/products/category/:category
export const getProductsByCategory = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const category = await Category.findOne({ slug: req.params.category, tenantId: req.tenantId });
        if (!category) {
            return next(new AppError(`Category not found: ${req.params.category}`, 404));
        }
        const products = await Product.find({ tenantId: req.tenantId, category: category._id }).populate('category vendor');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};