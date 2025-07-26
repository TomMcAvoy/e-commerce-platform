import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Tenant from "../models/Tenant";
import AppError from "../utils/AppError";

// Extend the Express Request interface to include tenantId
export interface TenantRequest extends Request {
  tenantId?: mongoose.Types.ObjectId;
}

/**
 * Tenant Resolver Middleware
 * Resolves tenant from X-Tenant-ID header and attaches it to the request.
 */
export const tenantResolver = async (req: TenantRequest, res: Response, next: NextFunction) => {
  const tenantIdHeader = req.headers["x-tenant-id"] as string;

  if (!tenantIdHeader) {
    // Allow requests without a tenant ID to proceed.
    // Subsequent middleware or controllers are responsible for checking
    // if tenantId is required for their specific operation.
    return next();
  }

  try {
    // In a real-world scenario, you might want to cache this lookup (e.g., in Redis)
    // to avoid hitting the database on every single request.
    const tenant = await Tenant.findOne({ slug: tenantIdHeader }).lean();

    if (!tenant) {
      return next(new AppError(`Tenant not found: ${tenantIdHeader}`, 404));
    }

    req.tenantId = tenant._id;
    next();
  } catch (error) {
    console.error("Error resolving tenant:", error);
    return next(new AppError("Internal server error while resolving tenant.", 500));
  }
};

