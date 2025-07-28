/**
 * Common type definitions shared across models
 */

/**
 * MongoDB ObjectId type
 */
export type ObjectId = string;

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Sort parameters
 */
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Filter parameters
 */
export interface FilterParams {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
}

/**
 * Query parameters combining pagination, sorting, and filtering
 */
export interface QueryParams extends PaginationParams {
  sort?: SortParams;
  filters?: FilterParams;
}

/**
 * Base model with common fields
 */
export interface BaseModel {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tenant-specific model
 */
export interface TenantModel extends BaseModel {
  tenantId: ObjectId;
}

/**
 * SEO metadata
 */
export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string;
  slug: string;
}

/**
 * Address information
 */
export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

/**
 * Contact information
 */
export interface ContactInfo {
  email: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

/**
 * Color scheme for UI customization
 */
export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  gradient?: string;
}