import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest, ApiResponse, PaginatedResponse } from '../types'
import Vendor from '../models/Vendor'
import User from '../models/User'
import AppError from '../utils/AppError'

// @desc    Register new vendor
// @route   POST /api/vendors/register
// @access  Public
export const registerVendor = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      // Personal Information
      firstName,
      lastName,
      email,
      password,
      phone,
      
      // Business Information
      businessName,
      businessType,
      businessDescription,
      businessAddress,
      city,
      state,
      country,
      zipCode,
      taxId
    } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !businessName) {
      return next(new AppError('Please provide all required fields', 400))
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new AppError('User already exists with this email', 400))
    }

    // Check if business name is already taken
    const existingVendor = await Vendor.findOne({ businessName })
    if (existingVendor) {
      return next(new AppError('Business name is already taken', 400))
    }

    // Create user account with vendor role
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber: phone,
      role: 'vendor'
    })

    // Create vendor profile
    const vendor = await Vendor.create({
      userId: user._id,
      businessName,
      businessEmail: email,
      businessPhone: phone,
      businessAddress: {
        firstName,
        lastName,
        address1: businessAddress,
        city,
        state,
        postalCode: zipCode,
        country,
        isDefault: true
      },
      taxId,
      isVerified: false // Will need admin approval
    })

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        },
        vendor: {
          _id: vendor._id,
          businessName: vendor.businessName,
          isVerified: vendor.isVerified
        }
      },
      message: 'Vendor registration successful. Your account is pending approval.'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all vendors
// @route   GET /api/vendors
// @access  Public
export const getVendors = async (
  req: Request,
  res: Response<PaginatedResponse<any>>,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const query: any = {}
    
    // Only show verified vendors to public
    if (req.query.verified !== 'false') {
      query.isVerified = true
    }

    const vendors = await Vendor.find(query)
      .populate('userId', 'firstName lastName')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Vendor.countDocuments(query)

    res.status(200).json({
      success: true,
      data: vendors,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single vendor
// @route   GET /api/vendors/:id
// @access  Public
export const getVendor = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const vendor = await Vendor.findById(req.params.id)
      .populate('userId', 'firstName lastName email')

    if (!vendor) {
      return next(new AppError('Vendor not found', 404))
    }

    res.status(200).json({
      success: true,
      data: vendor
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update vendor profile
// @route   PUT /api/vendors/:id
// @access  Private (Vendor/Admin)
export const updateVendor = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const vendor = await Vendor.findById(req.params.id)

    if (!vendor) {
      return next(new AppError('Vendor not found', 404))
    }

    // Check if user owns this vendor profile or is admin
    if (vendor.userId !== req.user._id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to update this vendor profile', 403))
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email')

    res.status(200).json({
      success: true,
      data: updatedVendor
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete vendor
// @route   DELETE /api/vendors/:id
// @access  Private (Admin only)
export const deleteVendor = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const vendor = await Vendor.findById(req.params.id)

    if (!vendor) {
      return next(new AppError('Vendor not found', 404))
    }

    await vendor.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Vendor deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Verify vendor (Admin only)
// @route   PUT /api/vendors/:id/verify
// @access  Private (Admin only)
export const verifyVendor = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email')

    if (!vendor) {
      return next(new AppError('Vendor not found', 404))
    }

    res.status(200).json({
      success: true,
      data: vendor,
      message: 'Vendor verified successfully'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get vendor dashboard stats
// @route   GET /api/vendors/:id/stats
// @access  Private (Vendor/Admin)
export const getVendorStats = async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const vendor = await Vendor.findById(req.params.id)

    if (!vendor) {
      return next(new AppError('Vendor not found', 404))
    }

    // Check if user owns this vendor profile or is admin
    if (vendor.userId !== req.user._id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to view this vendor stats', 403))
    }

    // TODO: Implement actual stats calculation when Product and Order models are ready
    const stats = {
      totalProducts: vendor.products.length,
      totalSales: vendor.totalSales,
      rating: vendor.rating,
      isVerified: vendor.isVerified,
      // These would be calculated from actual data:
      // monthlyRevenue: 0,
      // totalOrders: 0,
      // pendingOrders: 0,
      // completedOrders: 0
    }

    res.status(200).json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
}
