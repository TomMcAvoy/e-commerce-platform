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
