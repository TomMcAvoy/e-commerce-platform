'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export function Navigation() {
  const { getItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Complete category list following API Endpoints Structure - FIXED ROUTES
  const categories = [
    { name: 'Electronics', href: '/electronics', icon: '📱' },
    { name: 'Mens Fashion', href: '/mens', icon: '👔' },
    { name: 'Fashion', href: '/fashion', icon: '��' },
    { name: 'Home & Garden', href: '/home', icon: '🏠' },
    { name: 'Beauty & Health', href: '/cosmetics', icon: '💄' },
    { name: 'Sports', href: '/sports', icon: '⚽' },
    { name: 'Automotive', href: '/automotive', icon: '🚗' },
    { name: 'Books & Media', href: '/books', icon: '📚' },
    { name: 'Toys & Games', href: '/toys', icon: '🎮' },
    { name: 'Baby & Kids', href: '/baby', icon: '👶' },
    { name: 'Social Feed', href: '/social', icon: '👥' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo following Project-Specific Conventions with security theme */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-700 rounded-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-tight">Whitestart System Security</span>
              <span className="text-sm text-blue-600 font-medium leading-tight">Marketplace</span>
            </div>
          </Link>

          {/* Desktop Navigation following Architecture Patterns */}
          <div className="hidden lg:flex items-center space-x-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="font-medium transition-colors text-gray-600 hover:text-blue-600 flex items-center space-x-1 text-sm"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side icons following Authentication Flow patterns */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCartIcon className="w-6 h-6" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>
            
            <Link href="/auth/login" className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <UserIcon className="w-6 h-6" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation following Frontend Structure patterns */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
