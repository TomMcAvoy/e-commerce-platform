'use client';

import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBagIcon, UserCircleIcon, PhoneIcon, EnvelopeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { cartItems } = useCart() || { cartItems: [] }; 
  const { isAuthenticated, isLoading } = useAuth();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gray-800 text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" />
              <span>Support: 1-800-SECURITY</span>
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4" />
              <span>sales@whitestartsecurity.com</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/track-order" className="hover:text-blue-400 transition-colors">Track Order</Link>
            <Link href="/help" className="hover:text-blue-400 transition-colors">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
                Whitestart Security
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search for products..."
                  className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Right-side Icons */}
            <div className="flex items-center gap-x-6">
              {isLoading ? (
                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
              ) : isAuthenticated ? (
                <Link href="/account" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  <UserCircleIcon className="h-6 w-6" />
                  <span>My Account</span>
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  <UserCircleIcon className="h-6 w-6" />
                  <span>Login</span>
                </Link>
              )}

              <Link href="/cart" className="relative flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                <ShoppingBagIcon className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}