import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/Product';
import AppError from '../utils/AppError';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ tenantId: req.tenantId }).populate('category vendor');
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!product) {
      return next(new AppError(`Product not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, tenantId: req.tenantId });
    if (!product) {
      return next(new AppError(`Product not found with slug of ${req.params.slug}`, 404));
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ tenantId: req.tenantId, isFeatured: true }).populate('category vendor');
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
});

// CREATE a new product
export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.tenantId = req.tenantId;
    const newProduct = await Product.create(req.body);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    next(error);
  }
});

// UPDATE a product
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return next(new AppError(`Product not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// DELETE a product
export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
    if (!product) {
      return next(new AppError(`Product not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});