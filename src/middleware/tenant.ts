import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle tenant identification
 */
export const setTenantId = (req: Request, res: Response, next: NextFunction): void => {
  // Get tenant ID from various sources in order of priority
  const tenantId = req.headers['x-tenant-id'] as string || 
                   req.query.tenantId as string ||
                   process.env.DEFAULT_TENANT_ID ||
                   '6884bf4702e02fe6eb401303';
  
  // Add tenantId to request object
  (req as any).tenantId = tenantId;
  
  next();
};