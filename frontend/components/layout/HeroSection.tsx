'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32 text-center z-20">
        {/* Trust Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            ✅ Trusted by 10,000+ Security Professionals
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
          Professional Security Equipment
          <span className="block text-blue-400">For Every Need</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-8">
          CCTV Systems • Access Control • Alarms • Surveillance • Fire Safety
        </p>

        {/* Prominent Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cameras, alarms, access control..."
                className="flex-1 px-6 py-4 text-lg text-gray-900 bg-white rounded-l-lg border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-r-lg flex items-center gap-2 transition-colors"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Quick Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['CCTV Cameras', 'Access Control', 'Alarm Systems', 'Fire Safety'].map((category) => (
            <Link
              key={category}
              href={`/categories/${category.toLowerCase().replace(' ', '-')}`}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            Browse All Products
          </Link>
          <Link 
            href="/vendors"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-lg text-white bg-transparent hover:bg-white hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
          >
            Find Vendors
          </Link>
        </div>

        {/* Value Propositions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-2">🚚</div>
            <h3 className="font-semibold mb-1">Fast Shipping</h3>
            <p className="text-sm text-gray-300">Same-day dispatch on most orders</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold mb-1">Secure Payments</h3>
            <p className="text-sm text-gray-300">Bank-level encryption & protection</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-semibold mb-1">Quality Guaranteed</h3>
            <p className="text-sm text-gray-300">Only certified security equipment</p>
          </div>
        </div>
      </div>
    </section>
  );
}