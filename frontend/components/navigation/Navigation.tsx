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
