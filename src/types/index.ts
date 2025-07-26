import { Request } from 'express';
import { IUser } from '../models/User';

/**
 * Type definitions following Project-Specific Conventions from Copilot Instructions
 * Used throughout backend for consistent API responses and request handling
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

// Additional types for API endpoints following API Endpoints Structure
export interface QueryParams {
  page?: string;
  limit?: string;
  sort?: string;
  active?: string;
  role?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  stack?: string;
}

// Cart types following Shopping Cart Operations pattern
export interface CartItem {
  productId: string;
  quantity: number;
  variantId?: string;
  price: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Vendor types following multi-vendor e-commerce patterns
export interface VendorProfile {
  businessName: string;
  businessType: string;
  taxId?: string;
  verified: boolean;
  rating?: number;
}