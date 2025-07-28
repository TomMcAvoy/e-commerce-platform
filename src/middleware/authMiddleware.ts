import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import AppError from '../utils/AppError';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Not authorized, no token', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return next(new AppError('No user found with this id', 404));
    }

    next();
  } catch (error) {
    return next(new AppError('Not authorized, token failed', 401));
  }
});

/**
 * Authorizes users based on their role.
 * @param {...string} roles - List of roles allowed to access the route.
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new AppError('User not found, authorization failed', 404));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};