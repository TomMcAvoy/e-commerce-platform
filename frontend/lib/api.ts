/**
 * Secure API Client following Cross-Service Communication patterns
 * All sensitive logic is handled server-side via backend API endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || '6884bf4702e02fe6eb401303'; // fallback for dev

// Enhanced API class following API Integration patterns
export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * The core request method. This was missing, causing the crash.
   * It's configured to work with the backend's HTTP-only cookie authentication.
   */
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    // FIX: Add the tenant ID header to every outgoing request.
    // This is required by the backend for the current single-tenant setup.
    headers.set('x-tenant-id', TENANT_ID);

    // This configuration is critical for HTTP-only cookie-based auth.
    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Tells the browser to send cookies with the request.
    };

    const response = await fetch(url, config);

    // Handle responses that might not have a JSON body (e.g., 204 No Content).
    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || 'API request failed');
    }

    // Handle responses with no content
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  // This method now correctly calls the core request handler.
  publicRequest(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, options);
  }

  // This method now correctly calls the core request handler.
  privateRequest(endpoint: string, options?: RequestInit) {
    return this.request(endpoint, options);
  }

  // The login method will now function correctly.
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // The register method will now function correctly.
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // The logout method will now function correctly.
  async logout() {
    return this.request('/auth/logout', { method: 'GET' });
  }
}

export const apiClient = new ApiClient();

// --- User Functions ---
export async function getCurrentUser() {
  return await apiClient.request('/auth/me', {
    method: 'GET',
  });
}

export async function updateUser(userData: any) {
  return await apiClient.request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

// --- News Functions ---
export async function refreshNews() {
  return await apiClient.request('/news/refresh', { method: 'POST' });
}

export async function fetchMajorNews() {
  return await apiClient.request('/news/region/major');
}

export async function fetchScottishNews() {
  return await apiClient.request('/news/region/scottish');
}

export async function fetchCanadianNews() {
  return await apiClient.request('/news/region/canadian');
}

// --- Dropshipping Functions ---
export async function importDropshippingProducts(provider: string, categoryId: string) {
  return await apiClient.request('/dropshipping/import', {
    method: 'POST',
    body: JSON.stringify({ provider, categoryId }),
  });
}


/**
 * Fetches a single category by its slug.
 * Designed for use in Next.js Server Components.
 * @param {string} slug - The slug of the category to fetch.
 * @returns {Promise<any>} The category data.
 */
export async function getCategoryBySlug(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${slug}`, {
      headers: { 'x-tenant-id': TENANT_ID },
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return null; // Return null if category is not found (404)
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch category:', error);
    throw new Error('Failed to fetch category data.');
  }
}

/**
 * Fetches a list of categories.
 * @param {object} params - Optional parameters like limit.
 * @returns {Promise<any[]>} An array of category data.
 */
export async function getCategories(params: { limit?: number } = {}) {
  const url = new URL(`${API_BASE_URL}/categories`);
  if (params.limit) {
    url.searchParams.append('limit', String(params.limit));
  }
  const res = await fetch(url.toString(), {
    headers: { 'x-tenant-id': TENANT_ID },
    next: { revalidate: 300 }
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  return data.data || [];
}

/**
 * Fetches a list of featured products.
 * @param {object} params - Optional parameters like limit.
 * @returns {Promise<any[]>} An array of product data.
 */
export async function getFeaturedProducts(params: { limit?: number } = {}) {
  const url = new URL(`${API_BASE_URL}/products`);
  if (params.limit) {
    url.searchParams.append('limit', String(params.limit));
  }
  url.searchParams.append('sort', '-rating');
  const res = await fetch(url.toString(), {
    headers: { 'x-tenant-id': TENANT_ID },
    next: { revalidate: 300 }
  });
  if (!res.ok) throw new Error('Failed to fetch featured products');
  const data = await res.json();
  return data.data || [];
}

/**
 * Fetches a list of featured vendors.
 * @param {object} params - Optional parameters like limit.
 * @returns {Promise<any[]>} An array of vendor data.
 */
export async function getFeaturedVendors(params: { limit?: number } = {}) {
  const url = new URL(`${API_BASE_URL}/vendors`);
  if (params.limit) {
    url.searchParams.append('limit', String(params.limit));
  }
  url.searchParams.append('sort', '-rating');
  const res = await fetch(url.toString(), {
    headers: { 'x-tenant-id': TENANT_ID },
    next: { revalidate: 3600 }
  });
  if (!res.ok) throw new Error('Failed to fetch featured vendors');
  const data = await res.json();
  return data.data || [];
}

/**
 * Fetches a list of news.
 * @param {object} params - Optional parameters like limit.
 * @returns {Promise<any[]>} An array of news data.
 */
export async function getNews(params: { limit?: number } = {}) {
  const url = new URL(`${API_BASE_URL}/news`);
  if (params.limit) {
    url.searchParams.append('limit', String(params.limit));
  }
  const res = await fetch(url.toString(), {
    headers: { 'x-tenant-id': TENANT_ID },
    next: { revalidate: 300 }
  });
  if (!res.ok) throw new Error('Failed to fetch news');
  const data = await res.json();
  return data.data || [];
}

/**
 * Fetches a list of news categories for server components.
 * @returns {Promise<any[]>} An array of news category data.
 */
export async function getNewsCategories() {
  const url = new URL(`${API_BASE_URL}/news-categories`);
  const res = await fetch(url.toString(), {
    headers: { 'x-tenant-id': TENANT_ID },
    next: { revalidate: 900 } // Revalidate every 15 minutes
  });
  if (!res.ok) {
    throw new Error('Failed to fetch news categories');
  }
  const data = await res.json();
  return data.data || [];
}

/**
 * Fetches the cached external news feed for server components.
 * @param {object} params - Optional parameters like source.
 * @returns {Promise<any>} The news feed data.
 */
export async function getNewsFeed(params: { source?: string } = {}) {
  const url = new URL(`${API_BASE_URL}/news/feed`);
  if (params.source) {
    url.searchParams.append('source', params.source);
  }
  const res = await fetch(url.toString(), {
    headers: { 'x-tenant-id': TENANT_ID },
    next: { revalidate: 300 } // Revalidate every 5 minutes
  });
  if (!res.ok) {
    throw new Error('Failed to fetch news feed');
  }
  return res.json();
}

/**
 * Fetches a single news article by its slug for server components.
 * @param {string} slug - The slug of the news article.
 * @returns {Promise<any>} A single news article object.
 */
export async function getNewsArticleBySlug(slug: string) {
  const url = new URL(`${API_BASE_URL}/news/slug/${slug}`);
  const res = await fetch(url.toString(), {
    headers: { 'x-tenant-id': TENANT_ID },
    next: { revalidate: 900 } // Revalidate every 15 minutes
  });
  if (!res.ok) {
    // This will be caught by the not-found mechanism in Next.js
    if (res.status === 404) return null;
    throw new Error('Failed to fetch news article');
  }
  const data = await res.json();
  return data.data;
}
