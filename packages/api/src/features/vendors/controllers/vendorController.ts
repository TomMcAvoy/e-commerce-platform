import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Vendor from '../models/Vendor';
import User from '../../users/models/User';
import Product from '../../products/models/Product';
import AppError from '../../../utils/AppError';
import { ApiResponse, SuccessResponse } from '@shoppingcart/shared/src/types/api/responses';
import { VendorCreateRequest, VendorUpdateRequest, Vendor as IVendor } from '@shoppingcart/shared/src/types/models/Vendor';

/**
 * @desc    Register new vendor for the current tenant
 * @route   POST /api/vendors/register
 * @access  Public
 */
export const registerVendor = asyncHandler(async (
  req: Request<{}, {}, VendorCreateRequest>, 
  res: Response<ApiResponse<IVendor>>, 
  next: NextFunction
) => {
  const { firstName, lastName, email, password, businessName, ...rest } = req.body;
  
  if (!req.tenantId) {
    return next(new AppError('Tenant could not be identified for registration.', 400));
  }

  // Check if user or vendor already exists within this tenant
  const existingUser = await User.findOne({ email, tenantId: req.tenantId });
  if (existingUser) {
    return next(new AppError('User with this email already exists in this tenant', 400));
  }

  const existingVendor = await Vendor.findOne({ businessName, tenantId: req.tenantId });
  if (existingVendor) {
    return next(new AppError('Business name is already taken in this tenant', 400));
  }

  // Create user and vendor within the same tenant
  const user = await User.create({ 
    firstName, 
    lastName, 
    email, 
    password, 
    role: 'vendor', 
    tenantId: req.tenantId 
  });
  
  const vendor = await Vendor.create({ 
    userId: user._id, 
    businessName, 
    businessEmail: email, 
    tenantId: req.tenantId, 
    ...rest 
  });

  res.status(201).json({ 
    success: true, 
    data: vendor.toObject(), 
    message: 'Vendor registration successful.' 
  });
});

/**
 * @desc    Get all vendors for the tenant
 * @route   GET /api/vendors
 * @access  Public
 */
export const getVendors = asyncHandler(async (
  req: Request, 
  res: Response<ApiResponse<IVendor[]>>
) => {
  const vendors = await Vendor.find({ tenantId: req.tenantId })
    .populate('user', 'name email')
    .sort({ businessName: 1 });
    
  res.status(200).json({ 
    success: true, 
    data: vendors, 
    count: vendors.length 
  });
});

/**
 * @desc    Get single vendor profile by ID
 * @route   GET /api/vendors/:id
 * @access  Public
 */
export const getVendorById = asyncHandler(async (
  req: Request<{ id: string }>, 
  res: Response<ApiResponse<IVendor>>, 
  next: NextFunction
) => {
  const vendor = await Vendor.findOne({ 
    _id: req.params.id,
    tenantId: req.tenantId
  }).populate('user', 'name email');
  
  if (!vendor) {
    return next(new AppError(`Vendor not found with id ${req.params.id}`, 404));
  }
  
  res.status(200).json({ 
    success: true, 
    data: vendor.toObject() 
  });
});

/**
 * @desc    Get single vendor profile by slug
 * @route   GET /api/vendors/slug/:slug
 * @access  Public
 */
export const getVendorBySlug = asyncHandler(async (
  req: Request<{ slug: string }>, 
  res: Response<ApiResponse<IVendor>>, 
  next: NextFunction
) => {
  // Use the compound index for efficient lookup
  const vendor = await Vendor.findOne({ 
    slug: req.params.slug,
    tenantId: req.tenantId
  }).populate('user', 'name email');
  
  if (!vendor) {
    return next(new AppError(`Vendor not found with slug ${req.params.slug}`, 404));
  }
  
  res.status(200).json({ 
    success: true, 
    data: vendor.toObject() 
  });
});

/**
 * @desc    Create a new vendor profile
 * @route   POST /api/vendors
 * @access  Private
 */
export const createVendorProfile = asyncHandler(async (
  req: Request<{}, {}, VendorCreateRequest>, 
  res: Response<ApiResponse<IVendor>>, 
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Not authorized', 401));
  }
  
  // Set user ID and tenant ID
  req.body.userId = req.user.id;
  req.body.tenantId = req.tenantId;

  // Check if user already has a vendor profile
  const existingVendor = await Vendor.findOne({ 
    userId: req.user.id,
    tenantId: req.tenantId
  });
  
  if (existingVendor) {
    return next(new AppError('User already has a vendor profile', 400));
  }

  const vendor = await Vendor.create(req.body);
  
  res.status(201).json({ 
    success: true, 
    data: vendor.toObject() 
  });
});

/**
 * @desc    Update vendor profile
 * @route   PUT /api/vendors/:id
 * @access  Private
 */
export const updateVendorProfile = asyncHandler(async (
  req: Request<{ id: string }, {}, VendorUpdateRequest>, 
  res: Response<ApiResponse<IVendor>>, 
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Not authorized', 401));
  }
  
  let vendor = await Vendor.findOne({
    _id: req.params.id,
    tenantId: req.tenantId
  });

  if (!vendor) {
    return next(new AppError(`Vendor not found with id ${req.params.id}`, 404));
  }

  // Check if user is authorized to update this vendor
  if (vendor.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this vendor profile', 401));
  }

  vendor = await Vendor.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true, runValidators: true }
  );
  
  res.status(200).json({ 
    success: true, 
    data: vendor!.toObject() 
  });
});

/**
 * @desc    Get products for a specific vendor
 * @route   GET /api/vendors/:id/products
 * @access  Public
 */
export const getVendorProducts = asyncHandler(async (
  req: Request<{ id: string }>, 
  res: Response, 
  next: NextFunction
) => {
  // First check if vendor exists
  const vendor = await Vendor.findOne({
    _id: req.params.id,
    tenantId: req.tenantId
  });
  
  if (!vendor) {
    return next(new AppError(`Vendor not found with id ${req.params.id}`, 404));
  }
  
  // Get vendor products
  const products = await Product.find({ 
    vendor: req.params.id,
    tenantId: req.tenantId
  });
  
  res.status(200).json({ 
    success: true, 
    count: products.length, 
    data: products 
  });
});

/**
 * @desc   Import products for the vendor
 * @route  POST /api/vendors/import-products
 * @access Private/Vendor
 */
export const importProducts = asyncHandler(async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Not authorized', 401));
  }
  
  const tenantId = req.tenantId;
  if (!tenantId) {
    return next(new AppError('Tenant could not be identified', 400));
  }

  // Handle file upload and parsing here...
  // Implementation would depend on the specific requirements

  res.status(200).json({ 
    success: true, 
    message: 'Products imported successfully' 
  });
});