import { AuthenticatedRequest } from '../types';
import { AppError } from './AppError';

/**
 * Safe user access helper following copilot auth patterns
 * Ensures user exists and throws appropriate error if not
 */
export const requireUser = (req: AuthenticatedRequest) => {
  if (!req.user) {
    throw new AppError('User authentication required', 401);
  }
  return req.user;
};

/**
 * Safe admin check following copilot role-based authorization
 */
export const requireAdmin = (req: AuthenticatedRequest) => {
  const user = requireUser(req);
  if (user.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }
  return user;
};

/**
 * Safe vendor check with optional admin override
 */
export const requireVendorOrAdmin = (req: AuthenticatedRequest) => {
  const user = requireUser(req);
  if (user.role !== 'vendor' && user.role !== 'admin') {
    throw new AppError('Vendor or admin access required', 403);
  }
  return user;
};
