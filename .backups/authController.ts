import { Request, Response, NextFunction } from 'express';
import User, { IUserDocument } from '../models/User';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';

// Helper function to send token response
const sendTokenResponse = (user: IUserDocument, statusCode: number, res: Response): void => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    }
  });
};

// Register user
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      throw new AppError('Please provide an email and password', 400);
    }

    // Check for user (include password since it's select: false)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Get current logged in user
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById((req.user as IUserDocument)._id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Update user details
export const updateDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    };

    const user = await User.findByIdAndUpdate((req.user as IUserDocument)._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Update password
export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById((req.user as IUserDocument)._id).select('+password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check current password
    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) {
      throw new AppError('Password is incorrect', 401);
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Logout user / clear cookie
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Get authentication status
export const getStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: 'Authentication service is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};
