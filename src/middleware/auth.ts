import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';
import User from '../models/User'; // Assuming a User model exists
import { AuthenticatedRequest } from '../types/auth';

/**
 * Authentication middleware following Authentication Flow from Copilot Instructions
 * Protects routes and provides role-based authorization
 */

// Protect middleware - verifies JWT token
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    return next(new AppError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // The 'iat' and 'exp' are standard JWT claims, we don't need them on the user object.
    const { iat, exp, ...userPayload } = decoded;

    // Attach user to the request object
    req.user = userPayload;

    next();
  } catch (err) {
    return next(new AppError('Not authorized to access this route', 401));
  }
};

// Authorize middleware - checks user roles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(`User role '${req.user?.role}' is not authorized to access this route`, 403)
      );
    }
    next();
  };
};
