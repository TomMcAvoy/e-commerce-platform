/**
 * Standard API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  pagination?: PaginationInfo;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Error response
 */
export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  stack?: string;
  statusCode: number;
}

/**
 * Success response with data
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Success response with paginated data
 */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  count: number;
  pagination: PaginationInfo;
  message?: string;
}

/**
 * Authentication response with token
 */
export interface AuthResponse {
  success: true;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  success: true;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}