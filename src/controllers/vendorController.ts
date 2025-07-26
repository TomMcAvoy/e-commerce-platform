import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../types';
import Vendor from '../models/Vendor';
import User from '../models/User';
import AppError from '../utils/AppError';
import { TenantRequest } from '../middleware/tenantResolver';

// @desc    Register new vendor for the current tenant
// @route   POST /api/vendors/register
export const registerVendor = async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
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
export const getVendors = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const vendors = await Vendor.find({ tenantId: req.tenantId }).populate('user', 'name email');
        res.status(200).json({ success: true, count: vendors.length, data: vendors });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Get single vendor
// @route   GET /api/vendors/:id
export const getVendor = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const vendor = await Vendor.findOne({ _id: req.params.id, tenantId: req.tenantId }).populate('user', 'name email');
        if (!vendor) {
            return next(new AppError(`Vendor not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: vendor });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Create a new vendor (Admin only)
// @route   POST /api/vendors
export const createVendor = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        // A user must exist before they can be promoted to a vendor
        const vendor = await Vendor.create({ ...req.body, tenantId: req.tenantId });
        res.status(201).json({ success: true, data: vendor });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Update vendor profile for the current tenant
// @route   PUT /api/vendors/:id
export const updateVendor = async (req: AuthenticatedRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
  try {
    // Scope query to the tenant
    const vendor = await Vendor.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!vendor) return next(new AppError('Vendor not found in this tenant', 404));

    if (vendor.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this vendor profile', 403));
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: updatedVendor });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vendor for the current tenant
// @route   DELETE /api/vendors/:id
export const deleteVendor = async (req: AuthenticatedRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
  try {
    // Scope query to the tenant
    const vendor = await Vendor.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
    if (!vendor) return next(new AppError('Vendor not found in this tenant', 404));
    // Also delete the associated user
    await User.findByIdAndDelete(vendor.userId);
    res.status(200).json({ success: true, message: 'Vendor and associated user deleted successfully' });
  } catch (error) {
    next(error);
  }
};
