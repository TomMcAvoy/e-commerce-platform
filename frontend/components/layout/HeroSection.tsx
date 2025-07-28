'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  ShieldCheckIcon, 
  CameraIcon, 
  KeyIcon, 
  BellAlertIcon, 
  FireIcon,
  GlobeAmericasIcon,
  NewspaperIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Featured categories with icons
  const featuredCategories = [
    { name: 'CCTV Cameras', slug: 'cctv-cameras', icon: <CameraIcon className="w-5 h-5" /> },
    { name: 'Access Control', slug: 'access-control', icon: <KeyIcon className="w-5 h-5" /> },
    { name: 'Alarm Systems', slug: 'alarm-systems', icon: <BellAlertIcon className="w-5 h-5" /> },
    { name: 'Fire Safety', slug: 'fire-safety', icon: <FireIcon className="w-5 h-5" /> }
  ];

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
            <ShieldCheckIcon className="w-4 h-4 mr-1" />
            Trusted by 10,000+ Security Professionals
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

        {/* Quick Categories with Icons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {featuredCategories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.slug}`}
              className="flex items-center px-5 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
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

        {/* Additional Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* News Section Link */}
          <Link href="/news" className="group bg-gradient-to-br from-indigo-900 to-indigo-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <NewspaperIcon className="w-10 h-10 mb-3 text-indigo-300 group-hover:text-white transition-colors" />
            <h3 className="text-xl font-bold mb-2 text-white">Latest News</h3>
            <p className="text-indigo-200 text-sm">Stay updated with security news from CNN, Fox News, and international sources</p>
          </Link>
          
          {/* Social Media Link */}
          <Link href="/social" className="group bg-gradient-to-br from-purple-900 to-purple-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <UserGroupIcon className="w-10 h-10 mb-3 text-purple-300 group-hover:text-white transition-colors" />
            <h3 className="text-xl font-bold mb-2 text-white">Community</h3>
            <p className="text-purple-200 text-sm">Join discussions with security professionals and enthusiasts</p>
          </Link>
          
          {/* International Section Link */}
          <Link href="/international" className="group bg-gradient-to-br from-emerald-900 to-emerald-700 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <GlobeAmericasIcon className="w-10 h-10 mb-3 text-emerald-300 group-hover:text-white transition-colors" />
            <h3 className="text-xl font-bold mb-2 text-white">International</h3>
            <p className="text-emerald-200 text-sm">Products and services for USA, Canada, UK, and Scotland</p>
          </Link>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center bg-white/5 p-5 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Fast Shipping</h3>
            <p className="text-sm text-gray-300">Same-day dispatch on most orders</p>
          </div>
          <div className="text-center bg-white/5 p-5 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Secure Payments</h3>
            <p className="text-sm text-gray-300">Bank-level encryption & protection</p>
          </div>
          <div className="text-center bg-white/5 p-5 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-sm text-gray-300">Only certified security equipment</p>
          </div>
        </div>
      </div>
    </section>
  );
}