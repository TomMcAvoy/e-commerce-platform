
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import AppError from '../utils/AppError';
import User, { IUserDocument } from '../models/User';
import { config } from '../config';
import { JWTPayload } from '../types';

// Define a custom request interface to include the user property
export interface AuthRequest extends Request {
  user?: IUserDocument;
}

// Middleware to protect routes, requiring a valid JWT
export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Fallback to check for token in cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // Ensure token exists
  if (!token) {
    return next(new AppError('Not authorized, no token provided', 401));
  }

  try {
    // Verify the token using the secret from our config
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    // Find the user by the ID from the token payload
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Assert the type to satisfy the strict IUserDocument interface
    req.user = user as IUserDocument;

    next();
  } catch (error) {
    return next(new AppError('Not authorized, token failed verification', 401));
  }
});
 export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authorized to access this route', 403));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`User role '${req.user.role}' is not authorized to access this route`, 403));
    }
    next();
  };
};
// Middleware to optionally identify a user, but not fail if no token is present
export const optionalAuth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // If there's no token, we can just proceed without a user
  if (!token) {
    return next();
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    // Find user and attach to request object if they exist
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      // Assert the type here as well
      req.user = user as IUserDocument;
    }
  } catch (err) {
    // Token is invalid or expired, but we don't block the request.
    // We simply proceed without an authenticated user.
    console.error('Optional auth check failed: Invalid token provided.');
  }
  
  next();
});