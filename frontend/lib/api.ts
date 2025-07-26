/**
 * Secure API Client following Cross-Service Communication patterns
 * All sensitive logic is handled server-side via backend API endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Generic fetch function following your AppError pattern
async function fetchAPI(
  endpoint: string, 
  params: Record<string, any> = {}, 
  options: RequestInit = {}
) {
  try {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);
    
    // Add query parameters for GET requests
    if (!options.method || options.method === 'GET') {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const config: RequestInit = {
      cache: 'no-store', // Fresh data for development
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // For POST/PUT requests, add body
    if (options.method && ['POST', 'PUT', 'PATCH'].includes(options.method)) {
      config.body = options.body || JSON.stringify(params);
    }

    const response = await fetch(url.toString(), config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle backend response structure: { success: true, data: [...] }
    if (data && typeof data === 'object' && data.success && data.data) {
      return data.data;
    }
    
    // Fallback for direct array responses
    return data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
}

// Export all required functions for the homepage and other components.
export function getCategories(params: { limit?: number } = {}) {
  return fetchAPI('categories', params);
}

export function getFeaturedProducts(params: { limit?: number } = {}) {
  return fetchAPI('products', { ...params, featured: 'true' });
}

export function getFeaturedVendors(params: { limit?: number } = {}) {
  return fetchAPI('vendors', { ...params, featured: 'true' });
}

export function getCategoryBySlug(slug: string) {
  return fetchAPI(`categories/slug/${slug}`);
}

export function getProducts(params: Record<string, any> = {}) {
  return fetchAPI('products', params);
}

export function getVendors(params: Record<string, any> = {}) {
  return fetchAPI('vendors', params);
}

export function getProductBySlug(slug: string) {
  return fetchAPI(`products/slug/${slug}`);
}

export function getVendorBySlug(slug: string) {
  return fetchAPI(`vendors/slug/${slug}`);
}

// Authentication API calls following sendTokenResponse() pattern
export function login(credentials: { email: string; password: string }) {
  return fetchAPI('auth/login', credentials, {
    method: 'POST',
  });
}

export function register(userData: { name: string; email: string; password: string; role?: string }) {
  return fetchAPI('auth/register', userData, {
    method: 'POST',
  });
}

export function logout() {
  return fetchAPI('auth/logout', {}, {
    method: 'POST',
  });
}

// Cart API calls (server-side cart integration)
export function getCart() {
  return fetchAPI('cart');
}

export function addToCart(productId: string, quantity: number) {
  return fetchAPI('cart/add', { productId, quantity }, {
    method: 'POST',
  });
}

export function updateCartItem(itemId: string, quantity: number) {
  return fetchAPI(`cart/update/${itemId}`, { quantity }, {
    method: 'PUT',
  });
}

export function removeFromCart(itemId: string) {
  return fetchAPI(`cart/remove/${itemId}`, {}, {
    method: 'DELETE',
  });
}

// Search API following your backend route structure
export function searchProducts(query: string, filters: Record<string, any> = {}) {
  return fetchAPI('products/search', { q: query, ...filters });
}

// Order API calls following your backend patterns
export function getOrders() {
  return fetchAPI('orders');
}

export function getOrderById(orderId: string) {
  return fetchAPI(`orders/${orderId}`);
}

export function createOrder(orderData: any) {
  return fetchAPI('orders', orderData, {
    method: 'POST',
  });
}

// Additional API functions for complete integration
export function getProductsByCategory(categorySlug: string, params: Record<string, any> = {}) {
  return fetchAPI(`categories/${categorySlug}/products`, params);
}

export function getVendorProducts(vendorSlug: string, params: Record<string, any> = {}) {
  return fetchAPI(`vendors/${vendorSlug}/products`, params);
}

// Dropshipping API integration (following your DropshippingService pattern)
export function syncDropshippingProducts(providerId: string) {
  return fetchAPI(`dropshipping/${providerId}/sync`, {}, {
    method: 'POST',
  });
}

export function getDropshippingProviders() {
  return fetchAPI('dropshipping/providers');
}
