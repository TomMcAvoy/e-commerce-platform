import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Tenant from '../models/Tenant';
import AppError from '../utils/AppError';

const getTenantIdFromRequest = (req: Request): string | null => {
  // Example: extract from subdomain like 'my-tenant.localhost'
  const hostnameParts = req.hostname.split('.');
  if (hostnameParts.length > 2) {
    return hostnameParts[0];
  }
  // Example: extract from header like 'X-Tenant-ID'
  const tenantHeader = req.headers['x-tenant-id'];
  if (typeof tenantHeader === 'string') {
    return tenantHeader;
  }
  return null;
};

const tenantResolver = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const tenantIdentifier = getTenantIdFromRequest(req);

    if (!tenantIdentifier) {
      // Allow request to proceed if no tenant identifier is found
      return next();
    }

    try {
      const tenant = await Tenant.findOne({ slug: tenantIdentifier }).lean();

      if (!tenant) {
        console.warn(`[Tenant Resolver] Tenant not found for identifier: ${tenantIdentifier}`);
        return next();
      }

      if (tenant && !Array.isArray(tenant)) {
        req.tenantId = tenant._id as string;
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `[Tenant Resolver] Tenant resolved: ${tenant.name} (${req.tenantId})`
          );
        }
      } else {
        console.warn(`[Tenant Resolver] Unexpected tenant data format for identifier: ${tenantIdentifier}`);
      }

      next();
    } catch (error) {
      console.error('[Tenant Resolver] Error:', error);
      return next(
        new AppError("Server error while resolving tenant information.", 500)
      );
    }
});

export default tenantResolver;

