import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import Product from '../models/Product';
import AppError from '../utils/AppError';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tenantId = (req as any).tenantId || process.env.DEFAULT_TENANT_ID || '6884bf4702e02fe6eb401303';
  
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  
  let query: any = { tenantId };
  
  // Add search functionality
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }
  
  // Add category filter
  if (req.query.category) {
    query.category = req.query.category;
  }
  
  const products = await Product.find(query)
    .populate('vendorId', 'name slug')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
    
  // Transform data for frontend compatibility
  const transformedProducts = products.map(product => ({
    ...product.toObject(),
    stock: product.inventory.quantity,
    vendor: product.vendorId
  }));
  
  const total = await Product.countDocuments(query);
  
  res.status(200).json({ 
    success: true, 
    count: products.length,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total
    },
    data: transformedProducts 
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tenantId = (req as any).tenantId || process.env.DEFAULT_TENANT_ID || '6884bf4702e02fe6eb401303';
  
  const product = await Product.findOne({ _id: req.params.id, tenantId })
    .populate('vendorId', 'name slug');
    
  if (!product) {
    return next(new AppError(`Product not found with id of ${req.params.id}`, 404));
  }
  
  // Transform data for frontend compatibility
  const transformedProduct = {
    ...product.toObject(),
    stock: product.inventory.quantity,
    vendor: product.vendorId
  };
  
  res.status(200).json({ success: true, data: transformedProduct });
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
    const products = await Product.find({ tenantId: req.tenantId, isFeatured: true });
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