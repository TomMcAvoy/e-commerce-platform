'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Cart state interface following your API structure
interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Action types for cart operations
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
};

// Cart reducer following your Error Handling Pattern
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.productId === action.payload.productId
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
        totalPrice,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.productId !== action.payload);
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      return {
        ...state,
        items: newItems,
        totalItems,
        totalPrice,
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
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component following your Global Layout pattern
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Helper functions for common cart operations
  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value: CartContextType = {
    state,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context following your Authentication Flow pattern
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}