import { FilterParams, PaginationParams, SortParams } from '../models/common';

/**
 * Base request interface
 */
export interface BaseRequest {
  tenantId?: string;
}

/**
 * Authentication request
 */
export interface AuthRequest extends BaseRequest {
  email: string;
  password: string;
}

/**
 * Registration request
 */
export interface RegisterRequest extends AuthRequest {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest extends BaseRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Password forgot request
 */
export interface PasswordForgotRequest extends BaseRequest {
  email: string;
}

/**
 * List request with pagination, sorting, and filtering
 */
export interface ListRequest extends BaseRequest, PaginationParams {
  sort?: string; // Format: "field:order" (e.g., "createdAt:desc")
  [key: string]: any; // Additional filter parameters
}

/**
 * Search request
 */
export interface SearchRequest extends ListRequest {
  query: string;
  fields?: string[]; // Fields to search in
}

/**
 * ID request
 */
export interface IdRequest extends BaseRequest {
  id: string;
}

/**
 * Slug request
 */
export interface SlugRequest extends BaseRequest {
  slug: string;
}

/**
 * Query parameters for API requests
 */
export interface QueryParameters {
  pagination?: PaginationParams;
  sort?: SortParams;
  filters?: FilterParams;
  search?: {
    query: string;
    fields?: string[];
  };
}