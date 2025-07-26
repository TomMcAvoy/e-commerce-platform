import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';
import { sendTokenResponse } from '../utils/sendTokenResponse';
import { TenantRequest } from '../middleware/tenantResolver';

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req: TenantRequest, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!req.tenantId) {
    return next(new AppError('Tenant ID is required for registration.', 400));
  }

  try {
    const user = await User.create({
      tenantId: req.tenantId,
      firstName,
      lastName,
      email,
      password,
      role,
    });

    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req: TenantRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }
  
  if (!req.tenantId) {
    return next(new AppError('Tenant ID is required for login.', 400));
  }

  const user = await User.findOne({ email, tenantId: req.tenantId }).select('+password');

  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
export const getMe = async (req: TenantRequest, res: Response, next: NextFunction) => {
  // @ts-ignore - req.user is set by the 'protect' middleware
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({ success: true, data: user });
};
