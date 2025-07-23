#!/bin/bash
# filepath: restore-comprehensive-frontend.sh

set -e

echo "🔧 Restoring Comprehensive Frontend Following Coding Instructions"
echo "Multi-vendor e-commerce platform with full debugging ecosystem..."

cd frontend

# Install comprehensive dependencies following your architecture patterns
echo "📦 Installing comprehensive frontend dependencies..."
cat > package.json << 'EOF'
{
  "name": "whitestartups-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint",
    "dev:debug": "next dev -p 3001 --turbo",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "@radix-ui/react-dialog": "1.1.14",
    "@radix-ui/react-dropdown-menu": "2.1.15",
    "@radix-ui/react-toast": "1.2.14",
    "autoprefixer": "10.4.21",
    "axios": "1.10.0",
    "lucide-react": "0.525.0",
    "next": "^15.4.3",
    "postcss": "8.5.6",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "tailwindcss": "4.1.11"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "^30.0.0",
    "@types/node": "^24.1.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "next-router-mock": "^1.0.2",
    "ts-jest": "^29.4.0",
    "typescript": "^5.8.3"
  }
}
EOF

# Clean install comprehensive dependencies
echo "🧹 Installing comprehensive dependencies..."
rm -rf node_modules
npm install

# Create comprehensive Tailwind configuration
echo "🎨 Creating Tailwind CSS configuration..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#faf5ff',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
EOF

# Create PostCSS configuration
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Create comprehensive globals.css with Tailwind and custom styles
echo "🎨 Creating comprehensive globals.css..."
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Custom base styles */
@layer base {
  body {
    @apply bg-gray-50 text-gray-900 font-sans;
  }
  
  * {
    @apply border-gray-200;
  }
}

/* Custom component styles */
@layer components {
  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  /* Button variants */
  .btn {
    @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50;
  }

  .btn-primary {
    @apply btn bg-primary-500 text-white hover:bg-primary-600 px-4 py-2;
  }

  .btn-secondary {
    @apply btn bg-secondary-500 text-white hover:bg-secondary-600 px-4 py-2;
  }

  .btn-success {
    @apply btn bg-success-500 text-white hover:bg-success-600 px-4 py-2;
  }

  .btn-warning {
    @apply btn bg-warning-500 text-white hover:bg-warning-600 px-4 py-2;
  }

  .btn-danger {
    @apply btn bg-danger-500 text-white hover:bg-danger-600 px-4 py-2;
  }

  .btn-outline {
    @apply btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2;
  }

  /* Card styles */
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
  }

  .card-header {
    @apply border-b border-gray-200 pb-4 mb-4;
  }

  .card-title {
    @apply text-lg font-semibold text-gray-900;
  }

  /* Debug dashboard specific styles */
  .debug-container {
    @apply container mx-auto px-4 py-8;
  }

  .debug-card {
    @apply card hover:shadow-md transition-shadow;
  }

  .debug-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
  }

  .debug-status {
    @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium;
  }

  .debug-status-success {
    @apply debug-status bg-success-50 text-success-700;
  }

  .debug-status-error {
    @apply debug-status bg-danger-50 text-danger-700;
  }

  .debug-status-warning {
    @apply debug-status bg-warning-50 text-warning-700;
  }

  /* Form styles */
  .form-input {
    @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  /* Animation utilities */
  .fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .slide-up {
    animation: slideUp 0.3s ease-out;
  }
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading spinner */
.spinner {
  @apply animate-spin rounded-full border-2 border-gray-300 border-t-primary-500;
}

/* Code blocks for debug pages */
.code-block {
  @apply bg-gray-100 rounded-md p-3 text-xs font-mono overflow-x-auto;
}

/* Responsive utilities */
@layer utilities {
  .debug-responsive {
    @apply text-xs sm:text-sm;
  }
}
EOF

# Create comprehensive CartContext following Context Pattern
echo "🛒 Creating comprehensive CartContext (Context Pattern)..."
cat > context/CartContext.tsx << 'EOF'
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  sku: string;
  variantId?: string;
  image?: string;
  vendor?: string;
  category?: string;
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  userId?: string;
  sessionId?: string;
  updatedAt: Date;
}

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string, variantId?: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  getItemCount: () => number;
  getSubtotal: () => number;
  isInCart: (productId: string, variantId?: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ 
    items: [], 
    totalPrice: 0, 
    totalItems: 0,
    updatedAt: new Date()
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate session ID for guest users following auth patterns
  const getSessionId = useCallback(() => {
    if (typeof window === 'undefined') return '';
    
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
  }, []);

  // API call helper following API integration patterns
  const apiCall = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const sessionId = getSessionId();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId,
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }, [getSessionId]);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiCall('/cart');
      setCart({
        ...data.data,
        totalItems: data.data.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Failed to refresh cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh cart');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const addToCart = useCallback(async (item: CartItem) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiCall('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ 
          productId: item.productId, 
          quantity: item.quantity,
          variantId: item.variantId 
        }),
      });
      
      await refreshCart();
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  }, [apiCall, refreshCart]);

  const removeFromCart = useCallback(async (productId: string, variantId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiCall('/cart/remove', {
        method: 'DELETE',
        body: JSON.stringify({ productId, variantId }),
      });
      
      await refreshCart();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to remove from cart');
    } finally {
      setLoading(false);
    }
  }, [apiCall, refreshCart]);

  const updateQuantity = useCallback(async (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      await removeFromCart(productId, variantId);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await apiCall('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity, variantId }),
      });
      
      await refreshCart();
    } catch (error) {
      console.error('Failed to update cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  }, [apiCall, refreshCart, removeFromCart]);

  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await apiCall('/cart/clear', {
        method: 'DELETE',
      });
      
      setCart({ 
        items: [], 
        totalPrice: 0, 
        totalItems: 0,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setError(error instanceof Error ? error.message : 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  // Helper functions
  const getItemCount = useCallback(() => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart.items]);

  const getSubtotal = useCallback(() => {
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart.items]);

  const isInCart = useCallback((productId: string, variantId?: string) => {
    return cart.items.some(item => 
      item.productId === productId && 
      (variantId ? item.variantId === variantId : true)
    );
  }, [cart.items]);

  // Initialize cart on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      refreshCart();
    }
  }, [refreshCart]);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loading,
    error,
    refreshCart,
    getItemCount,
    getSubtotal,
    isInCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
EOF

# Create comprehensive API integration following API patterns
echo "🔗 Creating comprehensive API integration (lib/api.ts)..."
cat > lib/api.ts << 'EOF'
// Comprehensive Frontend API integration following coding instructions
// Cross-Service Communication: Frontend → Backend direct HTTP calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendor: string;
  sku: string;
  images: string[];
  variants?: ProductVariant[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  attributes: Record<string, string>;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  variantId?: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'vendor' | 'admin';
  isActive: boolean;
  createdAt: string;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add session ID for guest users
    if (typeof window !== 'undefined') {
      const sessionId = localStorage.getItem('cart_session_id');
      if (sessionId) {
        headers['x-session-id'] = sessionId;
      }

      // Add auth token if user is logged in
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Health & Status endpoints
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3000/health');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getAPIStatus(): Promise<APIResponse> {
    return this.request('/status');
  }

  // Product API methods
  async getProducts(params?: PaginationParams & { 
    category?: string; 
    vendor?: string; 
    search?: string; 
    minPrice?: number; 
    maxPrice?: number; 
  }): Promise<APIResponse<{ products: Product[]; total: number; page: number; pages: number }>> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/products${queryString}`);
  }

  async getProduct(productId: string): Promise<APIResponse<Product>> {
    return this.request(`/products/${productId}`);
  }

  async getFeaturedProducts(): Promise<APIResponse<Product[]>> {
    return this.request('/products/featured');
  }

  async getProductsByCategory(category: string, params?: PaginationParams): Promise<APIResponse<Product[]>> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/products/category/${category}${queryString}`);
  }

  // Cart API methods following sendTokenResponse() pattern
  async getCart(): Promise<APIResponse> {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity: number, variantId?: string): Promise<APIResponse> {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, variantId }),
    });
  }

  async updateCartItem(productId: string, quantity: number, variantId?: string): Promise<APIResponse> {
    return this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity, variantId }),
    });
  }

  async removeFromCart(productId: string, variantId?: string): Promise<APIResponse> {
    return this.request('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ productId, variantId }),
    });
  }

  async clearCart(): Promise<APIResponse> {
    return this.request('/cart/clear', {
      method: 'DELETE',
    });
  }

  // Order API methods
  async createOrder(orderData: {
    items: OrderItem[];
    shippingAddress: Address;
    billingAddress?: Address;
    paymentMethod: string;
  }): Promise<APIResponse<Order>> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params?: PaginationParams): Promise<APIResponse<Order[]>> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/orders${queryString}`);
  }

  async getOrder(orderId: string): Promise<APIResponse<Order>> {
    return this.request(`/orders/${orderId}`);
  }

  // User/Auth API methods
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<APIResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string): Promise<APIResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<APIResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<APIResponse<User>> {
    return this.request('/auth/profile');
  }

  // Dropshipping API methods (matching DropshippingService patterns)
  async getDropshippingStatus(): Promise<APIResponse> {
    return this.request('/dropshipping/status');
  }

  async getDropshippingProducts(provider?: string, params?: PaginationParams): Promise<APIResponse> {
    const queryParams = new URLSearchParams();
    if (provider) queryParams.set('provider', provider);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.set(key, value.toString());
      });
    }
    const queryString = queryParams.toString() ? '?' + queryParams.toString() : '';
    return this.request(`/dropshipping/products${queryString}`);
  }

  async getDropshippingProviders(): Promise<APIResponse> {
    return this.request('/dropshipping/providers');
  }

  // Categories API methods
  async getCategories(): Promise<APIResponse> {
    return this.request('/categories');
  }

  // Vendors API methods
  async getVendors(params?: PaginationParams): Promise<APIResponse> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/vendors${queryString}`);
  }

  async getVendor(vendorId: string): Promise<APIResponse> {
    return this.request(`/vendors/${vendorId}`);
  }
}

export const apiClient = new APIClient(API_BASE_URL);
export default apiClient;
EOF

# Create comprehensive UI components
echo "🧩 Creating comprehensive UI components..."
mkdir -p components/{ui,cart,product,layout}

# Create Loading component
cat > components/ui/Loading.tsx << 'EOF'
import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loading({ size = 'md', text, className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`spinner ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}
EOF

# Create Button component
cat > components/ui/Button.tsx << 'EOF'
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    warning: 'btn-warning',
    danger: 'btn-danger',
    outline: 'btn-outline'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="spinner h-4 w-4 mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}
EOF

# Create Card component
cat > components/ui/Card.tsx << 'EOF'
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  header?: React.ReactNode;
}

export function Card({ children, className = '', title, header }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {(title || header) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {header}
        </div>
      )}
      {children}
    </div>
  );
}
EOF

# Create comprehensive home page
echo "🏠 Creating comprehensive home page..."
cat > app/page.tsx << 'EOF'
'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';

export default function HomePage() {
  const { cart, loading: cartLoading, getItemCount } = useCart();
  const [systemStatus, setSystemStatus] = useState({
    backend: 'checking',
    dropshipping: 'checking',
    database: 'checking'
  });
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    checkSystemStatus();
    loadFeaturedProducts();
  }, []);

  const checkSystemStatus = async () => {
    // Check backend health
    const backendHealthy = await apiClient.healthCheck();
    
    // Check dropshipping status
    const dropshippingStatus = await apiClient.getDropshippingStatus();
    
    setSystemStatus({
      backend: backendHealthy ? 'healthy' : 'error',
      dropshipping: dropshippingStatus.success ? 'healthy' : 'error',
      database: backendHealthy ? 'healthy' : 'error' // Assume DB is connected if backend is healthy
    });
  };

  const loadFeaturedProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await apiClient.getFeaturedProducts();
      if (response.success) {
        setFeaturedProducts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load featured products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const StatusIndicator = ({ status }: { status: string }) => {
    const statusConfig = {
      healthy: { color: 'text-success-600', icon: '✅', text: 'Healthy' },
      checking: { color: 'text-warning-600', icon: '🔄', text: 'Checking...' },
      error: { color: 'text-danger-600', icon: '❌', text: 'Error' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.error;
    
    return (
      <span className={`${config.color} font-medium`}>
        {config.icon} {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Multi-Vendor E-Commerce Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Amazon/Temu-style marketplace with dropshipping integration
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                <Link href="/products" className="flex items-center">
                  🛍️ Browse Products
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                <Link href="/debug" className="flex items-center">
                  🔧 Debug Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-3xl mb-3">🛒</div>
              <h3 className="font-semibold mb-2">Shopping Cart</h3>
              <p className="text-gray-600 text-sm mb-4">
                {cartLoading ? (
                  <Loading size="sm" />
                ) : (
                  `${getItemCount()} items • $${cart.totalPrice?.toFixed(2) || '0.00'}`
                )}
              </p>
              <Button variant="primary" size="sm" className="w-full">
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-3xl mb-3">🛍️</div>
              <h3 className="font-semibold mb-2">Products</h3>
              <p className="text-gray-600 text-sm mb-4">
                Browse our marketplace
              </p>
              <Button variant="success" size="sm" className="w-full">
                <Link href="/products">Browse All</Link>
              </Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-semibold mb-2">Orders</h3>
              <p className="text-gray-600 text-sm mb-4">
                Track your purchases
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                <Link href="/orders">View Orders</Link>
              </Button>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="font-semibold mb-2">Account</h3>
              <p className="text-gray-600 text-sm mb-4">
                Manage your profile
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </Card>
        </div>

        {/* System Status */}
        <Card title="Platform Status" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-medium mb-2">Backend API</h4>
              <StatusIndicator status={systemStatus.backend} />
              <p className="text-sm text-gray-500 mt-1">localhost:3000</p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Dropshipping Service</h4>
              <StatusIndicator status={systemStatus.dropshipping} />
              <p className="text-sm text-gray-500 mt-1">Printful, Spocket</p>
            </div>
            <div className="text-center">
              <h4 className="font-medium mb-2">Database</h4>
              <StatusIndicator status={systemStatus.database} />
              <p className="text-sm text-gray-500 mt-1">MongoDB</p>
            </div>
          </div>
        </Card>

        {/* Featured Products */}
        <Card title="Featured Products" className="mb-12">
          {loadingProducts ? (
            <Loading text="Loading featured products..." />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.slice(0, 6).map((product: any) => (
                <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-200 rounded-md mb-3"></div>
                  <h4 className="font-medium mb-1">{product.name}</h4>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary-600">${product.price}</span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No featured products available</p>
              <Button variant="primary" className="mt-4">
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          )}
        </Card>

        {/* Development Tools */}
        <Card title="Development Tools" className="bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="http://localhost:3000/health" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition-colors text-center"
            >
              <div className="font-medium">🔍 Health Check</div>
              <div className="text-sm">Backend Status</div>
            </a>
            <Link 
              href="/debug"
              className="p-3 bg-secondary-50 text-secondary-700 rounded-md hover:bg-secondary-100 transition-colors text-center"
            >
              <div className="font-medium">🔧 Debug Dashboard</div>
              <div className="text-sm">API Testing</div>
            </Link>
            <a 
              href="/debug-api.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-warning-50 text-warning-700 rounded-md hover:bg-warning-100 transition-colors text-center"
            >
              <div className="font-medium">🌐 Static Debug</div>
              <div className="text-sm">CORS Testing</div>
            </a>
            <a 
              href="http://localhost:3000/api/status" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-success-50 text-success-700 rounded-md hover:bg-success-100 transition-colors text-center"
            >
              <div className="font-medium">📊 API Status</div>
              <div className="text-sm">Service Health</div>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
EOF

echo ""
echo "🎉 Comprehensive Frontend Restored!"
echo ""
echo "📋 Comprehensive features implemented following coding instructions:"
echo "1. ✅ Tailwind CSS with custom design system"
echo "2. ✅ Comprehensive CartContext with error handling"
echo "3. ✅ Full API integration layer (lib/api.ts)"
echo "4. ✅ UI component library (Button, Card, Loading)"
echo "5. ✅ Enhanced home page with system status"
echo "6. ✅ Featured products integration"
echo "7. ✅ Responsive design with mobile-first approach"
echo "8. ✅ TypeScript interfaces for all data types"
echo "9. ✅ Loading states and error handling"
echo "10. ✅ Development tools integration"
echo ""
echo "🚀 Your comprehensive debugging ecosystem includes:"
echo "• Enhanced home page: http://localhost:3001"
echo "• Primary Debug Dashboard: http://localhost:3001/debug"
echo "• Static Debug Page: http://localhost:3001/debug-api.html"
echo "• Comprehensive API integration matching DropshippingService patterns"
echo "• Full cart functionality with Context Pattern"
echo "• UI component library for consistent design"
echo ""
echo "Next: Run npm run dev:all to start your comprehensive platform!"

cd ..
echo "✅ Frontend restoration complete - ready for npm run dev:all"
