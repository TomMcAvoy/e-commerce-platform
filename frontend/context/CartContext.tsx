'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

/**
 * Cart Context following Context Pattern from Copilot Instructions
 * Updated for dynamic category pages with proper error handling
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  category?: string;
  vendor?: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

// Cart reducer following Error Handling Pattern
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100,
        error: null,
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100,
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'LOAD_CART': {
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100,
        isLoading: false,
      };
    }
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (id: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

// CartProvider following Context Pattern from Copilot Instructions
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage following Development vs Production patterns
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('whitestart_cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: cartItems });
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved cart' });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && state.items.length >= 0) {
        localStorage.setItem('whitestart_cart', JSON.stringify(state.items));
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  // Cart actions following API Integration patterns
  const addItem = (item: CartItem): void => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'ADD_ITEM', payload: item });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeItem = (id: string): void => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item from cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantity = (id: string, quantity: number): void => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update item quantity' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = (): void => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getItem = (id: string): CartItem | undefined => {
    return state.items.find(item => item.id === id);
  };

  const contextValue: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook with proper error handling following Error Handling Pattern
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error(
      'useCart must be used within a CartProvider. ' +
      'Make sure your component is wrapped with <CartProvider> in the app layout.'
    );
  }
  return context;
};

export default CartContext;
