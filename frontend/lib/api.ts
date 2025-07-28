import { IProduct, ICategory, IVendor, INews } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || '6884bf4702e02fe6eb401303'; // fallback for dev

/**
 * A universal API client that centralizes all fetch logic, including headers,
 * error handling, and Next.js caching options.
 * @param endpoint - The API endpoint to call (e.g., '/products').
 * @param options - The options for the fetch request, including Next.js revalidation.
 * @returns The JSON data from the API response.
 */
async function apiClient(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'x-tenant-id': TENANT_ID, // Consistently apply the tenant ID
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Required for http-only cookies on client-side requests
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`API Client Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// --- Client-Side API Methods ---
// These are intended for use in client components.
export const api = {
  publicRequest: (endpoint: string, options?: RequestInit) => apiClient(endpoint, options),
  privateRequest: (endpoint: string, options?: RequestInit) => apiClient(endpoint, options),
};


// --- Server-Side Data Fetching Functions ---
// These functions use the apiClient and are designed for Server Components,
// often including Next.js caching options.

export async function getCategoryBySlug(slug: string): Promise<ICategory | null> {
  try {
    const data = await apiClient(`/categories/slug/${slug}`, { next: { revalidate: 60 } });
    return data.data;
  } catch (error) {
    // If the API throws a 404, apiClient will re-throw, we catch it and return null.
    return null;
  }
}

export async function getCategories(params: { limit?: number } = {}): Promise<ICategory[]> {
  const query = params.limit ? `?limit=${params.limit}` : '';
  const data = await apiClient(`/categories${query}`, { next: { revalidate: 300 } });
  return data.data || [];
}

export async function getFeaturedProducts(params: { limit?: number } = {}): Promise<IProduct[]> {
  const query = new URLSearchParams({
    sort: '-rating',
    ...(params.limit && { limit: String(params.limit) }),
  }).toString();
  const data = await apiClient(`/products?${query}`, { next: { revalidate: 300 } });
  return data.data || [];
}

export async function getFeaturedVendors(params: { limit?: number } = {}): Promise<IVendor[]> {
  const query = new URLSearchParams({
    sort: '-rating',
    ...(params.limit && { limit: String(params.limit) }),
  }).toString();
  const data = await apiClient(`/vendors?${query}`, { next: { revalidate: 3600 } });
  return data.data || [];
}

export async function getNews(params: { limit?: number } = {}): Promise<INews[]> {
  const query = params.limit ? `?limit=${params.limit}` : '';
  const data = await apiClient(`/news${query}`, { next: { revalidate: 300 } });
  return data.data || [];
}

export async function getNewsCategories(): Promise<any[]> { // Assuming a type for news categories
  const data = await apiClient('/news-categories', { next: { revalidate: 900 } });
  return data.data || [];
}

export async function getNewsFeed(params: { source?: string } = {}): Promise<any> {
  const query = params.source ? `?source=${params.source}` : '';
  return apiClient(`/news/feed${query}`, { next: { revalidate: 300 } });
}

export async function getNewsArticleBySlug(slug: string): Promise<INews | null> {
  try {
    const data = await apiClient(`/news/slug/${slug}`, { next: { revalidate: 900 } });
    return data.data;
  } catch (error) {
    // If the API throws a 404, apiClient will re-throw, we catch it and return null.
    return null;
  }
}
