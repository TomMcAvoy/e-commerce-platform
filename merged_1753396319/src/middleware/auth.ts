import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import AppError from '../utils/AppError';
import { AuthenticatedRequest } from '../types';

/**
 * Authentication middleware following Authentication Flow from Copilot Instructions
 * Protects routes and provides role-based authorization
 */

// Protect middleware - verifies JWT token
export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Not authorized, no token', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new AppError('No user found with this token', 401));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new AppError('Not authorized, invalid token', 401));
    }
  } catch (error) {
    next(new AppError('Authentication error', 500));
  }
};

// Authorize middleware - checks user roles
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(`User role ${req.user.role} is not authorized to access this route`, 403));
    }

    next();
  };
};
