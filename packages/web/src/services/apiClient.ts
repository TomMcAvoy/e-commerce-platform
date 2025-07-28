/**
 * API Client for making requests to the backend
 */

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || '6884bf4702e02fe6eb401303'; // fallback for dev

// Request options type
type ApiRequestOptions = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

/**
 * Make an API request
 * 
 * @param endpoint API endpoint (e.g., '/products')
 * @param options Request options including Next.js caching options
 * @returns Response data
 */
export async function apiClient<T = any>(
  endpoint: string, 
  options: ApiRequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Set up headers
  const headers = {
    'Content-Type': 'application/json',
    'x-tenant-id': TENANT_ID,
    ...options.headers,
  };

  // Configure request
  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Required for http-only cookies
  };

  try {
    // Make the request
    const response = await fetch(url, config);
    
    // Parse response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API Client Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * API client for public and authenticated requests
 */
export const api = {
  /**
   * Make a public request (no authentication required)
   */
  publicRequest: <T = any>(endpoint: string, options?: ApiRequestOptions) => 
    apiClient<T>(endpoint, options),
  
  /**
   * Make an authenticated request (requires user to be logged in)
   */
  privateRequest: <T = any>(endpoint: string, options?: ApiRequestOptions) => 
    apiClient<T>(endpoint, options),
};