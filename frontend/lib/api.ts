// filepath: /Users/thomasmcavoy/GitHub/shoppingcart/frontend/lib/api.ts

/**
 * Secure API Client following Cross-Service Communication patterns
 * All sensitive logic is handled server-side via backend API endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Product endpoints following API Endpoints Structure
  async getProductsByCategory(category: string, filters: any = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key].toString());
      }
    });
    
    const queryString = params.toString();
    const endpoint = `/products/category/${category}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getFeaturedProducts(limit?: number) {
    const endpoint = `/products/featured${limit ? `?limit=${limit}` : ''}`;
    return this.request(endpoint);
  }

  async getCategories() {
    return this.request('/products/categories');
  }

  async searchProducts(query: string) {
    return this.request(`/products/search?query=${encodeURIComponent(query)}`);
  }

  // Authentication endpoints (existing)
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Cart endpoints (secure server-side)
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(item: any) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async removeFromCart(itemId: string) {
    return this.request(`/cart/remove/${itemId}`, {
      method: 'DELETE',
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request(`/cart/update/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
