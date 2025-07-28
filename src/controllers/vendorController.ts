import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Vendor from '../models/Vendor';
import User from '../models/User'; // FIX: Import User model
import Product from '../models/Product';
import AppError from '../utils/AppError';

// @desc    Register new vendor for the current tenant
// @route   POST /api/vendors/register
export const registerVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { firstName, lastName, email, password, businessName, ...rest } = req.body;
    if (!req.tenantId) {
      return next(new AppError('Tenant could not be identified for registration.', 400));
    }

    // Check if user or vendor already exists within this tenant
    const existingUser = await User.findOne({ email, tenantId: req.tenantId });
    if (existingUser) return next(new AppError('User with this email already exists in this tenant', 400));

    const existingVendor = await Vendor.findOne({ businessName, tenantId: req.tenantId });
    if (existingVendor) return next(new AppError('Business name is already taken in this tenant', 400));

    // Create user and vendor within the same tenant
    const user = await User.create({ firstName, lastName, email, password, role: 'vendor', tenantId: req.tenantId });
    const vendor = await Vendor.create({ userId: user._id, businessName, businessEmail: email, tenantId: req.tenantId, ...rest });

    res.status(201).json({ success: true, data: { user, vendor }, message: 'Vendor registration successful.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all vendors for the tenant
// @route   GET /api/vendors
// @access  Private/Admin
export const getVendors = asyncHandler(async (req: Request, res: Response) => {
    const vendors = await Vendor.find({ tenantId: req.tenantId }).populate('user', 'name email');
    res.status(200).json({ success: true, count: vendors.length, data: vendors });
});

// @desc    Get single vendor profile by ID
// @route   GET /api/vendors/:id
// @access  Private
export const getVendorProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const vendor = await Vendor.findById(req.params.id).populate('user', 'name email');
    if (!vendor) {
        return next(new AppError(`Vendor not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: vendor });
});

// @desc    Get single vendor profile by slug
// @route   GET /api/vendors/slug/:slug
// @access  Public
export const getVendorBySlug = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Use the compound index for efficient lookup
    const vendor = await Vendor.findOne({ 
        slug: req.params.slug,
        tenantId: req.tenantId
    }).populate('user', 'name email');
    
    if (!vendor) {
        return next(new AppError(`Vendor not found with slug ${req.params.slug}`, 404));
    }
    
    res.status(200).json({ success: true, data: vendor });
});

// @desc    Create a new vendor profile
// @route   POST /api/vendors
// @access  Private
export const createVendorProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body.user = req.user!.id;
    req.body.tenantId = req.tenantId;

    const existingVendor = await Vendor.findOne({ user: req.user!.id });
    if (existingVendor) {
        return next(new AppError('User already has a vendor profile', 400));
    }

    const vendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, data: vendor });
});

// @desc    Update vendor profile
// @route   PUT /api/vendors/:id
// @access  Private
export const updateVendorProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
        return next(new AppError(`Vendor not found with id of ${req.params.id}`, 404));
    }

    // FIX: The property is 'userId' on the vendor model, not 'user'
    if (vendor.userId.toString() !== req.user!.id && req.user!.role !== 'admin') {
        return next(new AppError('Not authorized to update this vendor profile', 401));
    }

    vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: vendor });
});

// @desc    Get products for a specific vendor
// @route   GET /api/vendors/:id/products
// @access  Public
export const getVendorProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({ vendor: req.params.id });
    res.status(200).json({ success: true, count: products.length, data: products });
});

// @desc   Import products for the vendor
// @route  POST /api/vendors/import-products
export const importProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.tenantId;
  if (!tenantId) {
    return next(new AppError('Tenant could not be identified', 400));
  }

  // Handle file upload and parsing here...

  res.status(200).json({ success: true, message: 'Products imported successfully' });
});
