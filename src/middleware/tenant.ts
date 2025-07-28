import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import mongoose from 'mongoose';

const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.headers['x-tenant-id'];

  // Allow health checks to pass without a tenant ID
  if (req.path === '/health' || req.path === '/api/status') {
    return next();
  }

  if (!tenantId) {
    return next(new AppError('Tenant ID is required', 400));
  }
  // No need to cast, Mongoose handles string to ObjectId conversion
  req.tenantId = tenantId as any; 
  next();
};

// FIX: Use a default export for consistency and to prevent import resolution issues.
export default tenantMiddleware;