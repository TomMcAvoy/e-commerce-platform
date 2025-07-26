#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/fix-all-cart-files.sh

echo "�� Comprehensive Cart Context Fix following Architecture Patterns..."
echo "📁 Working directory: $(pwd)"

# Colors following Project-Specific Conventions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Safety check
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in project root directory${NC}"
    echo "Please navigate to /Users/thomasmcavoy/GitHub/shoppingcart first"
    exit 1
fi

echo -e "${YELLOW}📦 Creating backup before making changes...${NC}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="../cart_fix_backup_${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}"
cp -r frontend "${BACKUP_DIR}/" 2>/dev/null || echo "No frontend directory to backup"
echo -e "✅ Backup created at: ${BACKUP_DIR}"
echo ""

echo -e "${BLUE}📋 Creating directory structure following Frontend Structure...${NC}"
mkdir -p frontend/app/{categories,cart,product/[id],vendor/[slug]}
mkdir -p frontend/app/{fashion,sports,home-garden,beauty-health,automotive,books-media,toys-games}
mkdir -p frontend/context
mkdir -p frontend/lib
mkdir -p frontend/components/{navigation,UI}

echo -e "${CYAN}🔧 STEP 1: Creating Root Layout with CartProvider${NC}"
cat > frontend/app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';

/**
 * Root Layout following Frontend Structure from Copilot Instructions
 * CRITICAL: CartProvider wraps entire application for useCart hook to work
 */

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Whitestart System Security - Premiumhub',
  description: 'Multi-vendor e-commerce platform with dropshipping integration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* CartProvider wraps ENTIRE app following Context Pattern */}
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
EOF
echo "✅ Created: frontend/app/layout.tsx"

echo -e "${CYAN}🔧 STEP 2: Creating Updated CartContext${NC}"
cat > frontend/context/CartContext.tsx << 'EOF'
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
EOF
echo "✅ Created: frontend/context/CartContext.tsx"

echo -e "${CYAN}🔧 STEP 3: Creating Navigation Component${NC}"
cat > frontend/components/navigation/Navigation.tsx << 'EOF'
'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { ShoppingCartIcon, HomeIcon } from '@heroicons/react/24/outline';

/**
 * Navigation Component following Component Organization from Copilot Instructions
 */

export const Navigation: React.FC = () => {
  const { state } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <HomeIcon className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Whitestart</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/categories" className="text-gray-700 hover:text-blue-600">
              Categories
            </Link>
            <Link href="/debug" className="text-gray-700 hover:text-blue-600">
              Debug
            </Link>
            <Link href="/cart" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Cart</span>
              {state.totalItems > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
EOF
echo "✅ Created: frontend/components/navigation/Navigation.tsx"

echo -e "${CYAN}🔧 STEP 4: Creating Homepage${NC}"
cat > frontend/app/page.tsx << 'EOF'
'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from '../components/navigation/Navigation';
import { useCart } from '../context/CartContext';

/**
 * Homepage following Frontend Structure from Copilot Instructions
 */

export default function HomePage() {
  const { state } = useCart();

  const categories = [
    { name: 'Electronics', slug: 'electronics', emoji: '📱', color: 'from-blue-500 to-cyan-500' },
    { name: 'Fashion', slug: 'fashion', emoji: '👕', color: 'from-pink-500 to-rose-500' },
    { name: 'Sports & Fitness', slug: 'sports', emoji: '⚽', color: 'from-green-500 to-emerald-500' },
    { name: 'Home & Garden', slug: 'home-garden', emoji: '🏠', color: 'from-orange-500 to-amber-500' },
    { name: 'Beauty & Health', slug: 'beauty-health', emoji: '💄', color: 'from-purple-500 to-violet-500' },
    { name: 'Automotive', slug: 'automotive', emoji: '🚗', color: 'from-red-500 to-pink-500' },
    { name: 'Books & Media', slug: 'books-media', emoji: '📚', color: 'from-indigo-500 to-blue-500' },
    { name: 'Toys & Games', slug: 'toys-games', emoji: '🎮', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="text-blue-600">Whitestart</span>
            </h1>
            <p className="hero-subtitle">
              Multi-vendor e-commerce platform with dropshipping integration
            </p>
            
            {state.totalItems > 0 && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-8 max-w-md mx-auto">
                <p className="text-green-800">
                  🛒 Cart: {state.totalItems} items (${state.totalPrice.toFixed(2)})
                </p>
                <Link href="/cart" className="text-green-600 hover:text-green-800 font-semibold">
                  View Cart →
                </Link>
              </div>
            )}
            
            <Link href="/categories" className="cta-button">
              Explore Categories
            </Link>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.slug}
                href={`/${category.slug}`}
                className="group"
              >
                <div className={`category-card h-48 bg-gradient-to-br ${category.color}`}>
                  <div className="category-card-content">
                    <div className="text-6xl mb-4">{category.emoji}</div>
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-white/80 group-hover:text-white transition-colors">
                      Explore collection →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
EOF
echo "✅ Created: frontend/app/page.tsx"

echo -e "${CYAN}🔧 STEP 5: Creating Categories Page${NC}"
cat > frontend/app/categories/page.tsx << 'EOF'
'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';

/**
 * Categories Page following Frontend Structure from Copilot Instructions
 */

export default function CategoriesPage() {
  const { state } = useCart();

  const categories = [
    { name: 'Electronics', slug: 'electronics', emoji: '📱', description: 'Professional security electronics and gadgets', color: 'from-blue-500 to-cyan-500' },
    { name: 'Fashion', slug: 'fashion', emoji: '👕', description: 'Security apparel and tactical clothing', color: 'from-pink-500 to-rose-500' },
    { name: 'Sports & Fitness', slug: 'sports', emoji: '⚽', description: 'Tactical fitness and outdoor gear', color: 'from-green-500 to-emerald-500' },
    { name: 'Home & Garden', slug: 'home-garden', emoji: '🏠', description: 'Home security and garden tools', color: 'from-orange-500 to-amber-500' },
    { name: 'Beauty & Health', slug: 'beauty-health', emoji: '💄', description: 'Health and wellness products', color: 'from-purple-500 to-violet-500' },
    { name: 'Automotive', slug: 'automotive', emoji: '🚗', description: 'Vehicle security and accessories', color: 'from-red-500 to-pink-500' },
    { name: 'Books & Media', slug: 'books-media', emoji: '📚', description: 'Security training and educational materials', color: 'from-indigo-500 to-blue-500' },
    { name: 'Toys & Games', slug: 'toys-games', emoji: '🎮', description: 'Educational toys and training games', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        <section className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">All Categories</h1>
            <p className="text-blue-100 text-lg">
              Explore our comprehensive range of security and professional products
            </p>
            
            {state.totalItems > 0 && (
              <div className="bg-blue-600/20 border border-blue-300 rounded-lg p-4 mt-6 max-w-md">
                <p className="text-blue-100">
                  🛒 Cart: {state.totalItems} items (${state.totalPrice.toFixed(2)})
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.slug}
                href={`/${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                  <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <span className="text-6xl">{category.emoji}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <span className="text-blue-600 font-semibold group-hover:text-blue-800">
                      Explore Collection →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
EOF
echo "✅ Created: frontend/app/categories/page.tsx"

echo -e "${CYAN}🔧 STEP 6: Creating Cart Page${NC}"
cat > frontend/app/cart/page.tsx << 'EOF'
'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

/**
 * Cart Page following Frontend Structure from Copilot Instructions
 */

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart to get started.</p>
            <Link href="/categories" className="btn-primary">
              Shop Now
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        <section className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart ({state.totalItems} items)
          </h1>

          {state.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || '/api/placeholder/80/80'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                      <p className="font-bold text-blue-600">${item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        disabled={state.isLoading}
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        disabled={state.isLoading}
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center mt-1"
                        disabled={state.isLoading}
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({state.totalItems} items)</span>
                    <span>${state.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${state.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <button className="w-full btn-primary mb-2">
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full btn-outline"
                  disabled={state.isLoading}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
EOF
echo "✅ Created: frontend/app/cart/page.tsx"

echo -e "${CYAN}🔧 STEP 7: Creating Category Page Template Function${NC}"
create_category_page() {
    local category_name="$1"
    local category_slug="$2"
    local category_emoji="$3"
    local category_color="$4"
    local category_description="$5"

cat > "frontend/app/${category_slug}/page.tsx" << EOF
'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';
import { StarIcon, ShoppingCartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

/**
 * ${category_name} Page following Frontend Structure from Copilot Instructions
 */

export default function ${category_name}Page() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem, state } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    // Mock products for ${category_name}
    const mockProducts = [
      {
        id: '${category_slug}-1',
        name: '${category_name} Product 1',
        price: 99.99,
        originalPrice: 129.99,
        rating: 4.8,
        reviews: 247,
        image: '/api/placeholder/300/300',
        verified: true,
        description: 'Premium ${category_name.toLowerCase()} product with advanced features',
        category: '${category_name}',
      },
      {
        id: '${category_slug}-2',
        name: '${category_name} Product 2',
        price: 149.99,
        originalPrice: 199.99,
        rating: 4.9,
        reviews: 891,
        image: '/api/placeholder/300/300',
        verified: true,
        description: 'Professional grade ${category_name.toLowerCase()} equipment',
        category: '${category_name}',
      },
      {
        id: '${category_slug}-3',
        name: '${category_name} Product 3',
        price: 79.99,
        originalPrice: 99.99,
        rating: 4.7,
        reviews: 156,
        image: '/api/placeholder/300/300',
        verified: true,
        description: 'Essential ${category_name.toLowerCase()} gear for professionals',
        category: '${category_name}',
      }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setProducts(mockProducts);
    setIsLoading(false);
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      description: product.description,
      category: product.category,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="bg-gradient-to-r ${category_color} text-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <span className="text-6xl mr-4">${category_emoji}</span>
            <div>
              <h1 className="text-4xl font-bold">${category_name}</h1>
              <p className="text-white/80 text-lg">${category_description}</p>
            </div>
          </div>
          
          {state.totalItems > 0 && (
            <div className="bg-white/20 border border-white/30 rounded-lg p-4 mt-4">
              <p className="text-white/90">
                🛒 Cart: {state.totalItems} items (\${state.totalPrice.toFixed(2)})
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto p-6">
        {isLoading ? (
          <div className="product-grid">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  {product.verified && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <ShieldCheckIcon className="w-3 h-3 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={\`w-4 h-4 \${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">{product.rating} ({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">\${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">\${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={state.isLoading}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <ShoppingCartIcon className="w-4 h-4 mr-2" />
                    {state.isLoading ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
EOF
    echo "✅ Created: frontend/app/${category_slug}/page.tsx"
}

echo -e "${CYAN}🔧 STEP 8: Creating All Category Pages${NC}"
create_category_page "Fashion" "fashion" "��" "from-pink-500 to-rose-500" "Security apparel and tactical clothing"
create_category_page "Sports" "sports" "⚽" "from-green-500 to-emerald-500" "Tactical fitness and outdoor gear"
create_category_page "HomeGarden" "home-garden" "🏠" "from-orange-500 to-amber-500" "Home security and garden tools"
create_category_page "BeautyHealth" "beauty-health" "💄" "from-purple-500 to-violet-500" "Health and wellness products"
create_category_page "Automotive" "automotive" "🚗" "from-red-500 to-pink-500" "Vehicle security and accessories"
create_category_page "BooksMedia" "books-media" "📚" "from-indigo-500 to-blue-500" "Security training and educational materials"
create_category_page "ToysGames" "toys-games" "🎮" "from-yellow-500 to-orange-500" "Educational toys and training games"

echo ""
echo -e "${GREEN}✅ ALL CART CONTEXT FILES CREATED AND UPDATED!${NC}"
echo ""
echo -e "${PURPLE}📊 SUMMARY OF CHANGES:${NC}"
echo "  ✅ Root Layout with CartProvider wrapper"
echo "  ✅ Updated CartContext with proper API (addItem, removeItem, etc.)"
echo "  ✅ Navigation component with cart indicator"
echo "  ✅ Homepage with category showcase"
echo "  ✅ Categories listing page"
echo "  ✅ Complete shopping cart page"
echo "  ✅ All 7 category pages with consistent cart integration"
echo ""
echo -e "${BLUE}�� NEXT STEPS following Critical Development Workflows:${NC}"
echo "1. Start development environment: npm run dev:all"
echo "2. Test Primary Debug Dashboard: http://localhost:3001/debug"
echo "3. Test homepage: http://localhost:3001"
echo "4. Test categories: http://localhost:3001/categories"
echo "5. Test cart functionality: http://localhost:3001/cart"
echo "6. Test API Health: curl http://localhost:3000/health"
echo ""
echo -e "${GREEN}💡 All pages now use consistent cart API following Architecture Patterns!${NC}"
echo -e "${YELLOW}📦 Backup preserved at: ${BACKUP_DIR}${NC}"
