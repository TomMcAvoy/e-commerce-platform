'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

export default function Header() {
  const { getItemCount } = useCart();
  const { isAuthenticated, isLoading, logout } = useAuth();

  const totalItems = getItemCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Whitestart
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/products" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  All Products
                </Link>
                <Link href="/categories" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Categories
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative text-gray-400 hover:text-gray-600 p-2">
              <span className="sr-only">View shopping cart</span>
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <div className="h-9">
              {isLoading ? (
                <div className="h-full w-36 bg-gray-200 rounded-md animate-pulse"></div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/account">Account</Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}