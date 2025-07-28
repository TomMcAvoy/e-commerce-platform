'use client';

import React, { createContext, useReducer, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '../lib/api';

// Define the shape of a cart item and the cart's state
interface CartItem {
  product: any; // Replace 'any' with a proper Product type
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// Define the actions that can be dispatched
type CartAction =
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Define the type for the context value as an object
export interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

// Create the context with a default value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Reducer function to manage cart state
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload.product._id
      );
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product._id !== action.payload.productId),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0), // Also remove if quantity is 0
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

// Debounce utility
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

// Provider component to wrap the application
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const { isAuthenticated, isLoading } = useAuth();

  // Debounced function to save the cart to the backend
  const saveCartToBackend = useCallback(
    debounce(async (items: CartItem[]) => {
      if (isAuthenticated) {
        try {
          await apiClient.privateRequest('/cart', {
            method: 'PUT',
            body: JSON.stringify({ items }),
          });
        } catch (error) {
          console.error("Failed to save cart:", error);
        }
      }
    }, 1000),
    [isAuthenticated]
  );

  // Effect to sync state to backend
  useEffect(() => {
    // Don't sync the initial empty state on load
    if (state.items.length > 0) {
      saveCartToBackend(state.items);
    }
  }, [state.items, saveCartToBackend]);

  // Fetch cart from backend on login
  useEffect(() => {
    const fetchCart = async () => {
      if (isAuthenticated) {
        try {
          const res = await apiClient.privateRequest('/cart');
          if (res.data && res.data.items) {
            dispatch({ type: 'SET_CART', payload: res.data.items });
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      } else {
        // Clear cart on logout
        dispatch({ type: 'CLEAR_CART' });
      }
    };
    if (!isLoading) {
      fetchCart();
    }
  }, [isAuthenticated, isLoading]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
