'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  ShoppingCartIcon, 
  UserCircleIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { Logo } from '@/components/Logo';

export function Header() {
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = Array.isArray(cart) ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

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
            <Link href="/track-order" className="hover:text-blue-400 transition-colors">
              Track Order
            </Link>
            <Link href="/help" className="hover:text-blue-400 transition-colors">
              Help
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-10 w-auto" />
                <div className="hidden sm:block">
                  <div className="font-bold text-xl text-gray-800">Whitestart</div>
                  <div className="text-xs text-gray-500 -mt-1">System Security</div>
                </div>
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search security equipment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Categories
              </Link>
              <Link href="/vendors" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Vendors
              </Link>
              <Link href="/deals" className="text-red-600 hover:text-red-700 font-medium transition-colors">
                Deals
              </Link>
              <Link href="/social" className="hover:text-blue-600 flex items-center">
                <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                Community
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search Icon */}
              <button className="lg:hidden p-2 text-gray-600 hover:text-blue-600">
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>

              {/* Account */}
              <Link href="/login" className="text-gray-600 hover:text-blue-600 flex items-center space-x-1 transition-colors">
                <UserCircleIcon className="w-6 h-6" />
                <span className="hidden sm:block text-sm font-medium">Account</span>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
                <ShoppingCartIcon className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search security equipment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link href="/categories" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                  Categories
                </Link>
                <Link href="/vendors" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                  Vendors
                </Link>
                <Link href="/deals" className="block py-2 text-red-600 hover:text-red-700 font-medium">
                  Deals
                </Link>
                <Link href="/track-order" className="block py-2 text-gray-700 hover:text-blue-600">
                  Track Order
                </Link>
                <Link href="/help" className="block py-2 text-gray-700 hover:text-blue-600">
                  Help
                </Link>
                <Link href="/social" className="block py-2 text-gray-700 hover:text-blue-600 flex items-center">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                  Community
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}