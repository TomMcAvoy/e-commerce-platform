import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

/**
 * Middleware to check if user has required role(s)
 * Used for protecting admin/moderator routes
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      // Get user role (assuming it's stored in the user object)
      const userRole = req.user.role || 'user';
      
      // Check if user has one of the allowed roles
      if (!allowedRoles.includes(userRole)) {
        return next(new AppError('Insufficient permissions', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = requireRole(['admin']);

/**
 * Middleware to check if user is admin or moderator
 */
export const requireModerator = requireRole(['admin', 'moderator']);

/**
 * Middleware to check if user is vendor
 */
export const requireVendor = requireRole(['admin', 'vendor']);

/**
 * Helper function to check if user has specific role
 */
export const hasRole = (user: any, role: string): boolean => {
  if (!user || !user.role) return false;
  return user.role === role;
};

/**
 * Helper function to check if user has any of the specified roles
 */
export const hasAnyRole = (user: any, roles: string[]): boolean => {
  if (!user || !user.role) return false;
  return roles.includes(user.role);
};