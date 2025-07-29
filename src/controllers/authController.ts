import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import { sendTokenResponse } from '../utils/sendTokenResponse';
import AppError from '../utils/AppError';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.password) {
    return next(new AppError('Invalid credentials', 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('👤 Registration attempt:', {
      email: req.body.email,
      tenantId: req.headers['x-tenant-id']
    });

    const { firstName, lastName, email, password, role } = req.body;
    const tenantId = req.headers['x-tenant-id'] as string || process.env.DEFAULT_TENANT_ID || '6884bf4702e02fe6eb401303';

    if (!tenantId) {
      return next(new AppError('Tenant ID is required', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(),
      tenantId: tenantId 
    });

    if (existingUser) {
      console.log('❌ User already exists:', email);
      return next(new AppError('User already exists', 400));
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: role || 'customer',
      tenantId,
      isActive: true,
    });

    console.log('✅ User created successfully:', {
      userId: user._id,
      email: user.email,
      role: user.role
    });

    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    if (error.code === 11000) {
      return next(new AppError('User already exists', 400));
    }
    return next(new AppError('Registration failed', 500));
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Add this guard clause to satisfy TypeScript and for runtime safety
    if (!req.user) {
      return next(new AppError('User not found or not authenticated', 404));
    }
    
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('❌ Get me error:', error);
    return next(new AppError('Failed to get user profile', 500));
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};
