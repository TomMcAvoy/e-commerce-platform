'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '../components/navigation/Navigation';
import { useCart } from '../context/CartContext';
import { ShieldCheckIcon, CheckBadgeIcon, TruckIcon, StarIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const { cart, getItemCount } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 50000,
    vendors: 1500,
    orders: 125000,
    satisfied: 98
  });

  // FIXED: Categories that actually exist in the app
  const workingCategories = [
    {
      title: 'Mens Fashion',
      subtitle: 'Professional security attire',
      href: '/mens',
      color: 'from-gray-800 to-gray-600',
      stats: '15K+ Products',
      icon: <ShieldCheckIcon className="w-8 h-8 text-white mb-4" />
    },
    {
      title: 'Womens Fashion',
      subtitle: 'Executive professional wear',
      href: '/womens',
      color: 'from-pink-600 to-rose-500',
      stats: '12K+ Products',
      icon: <CheckBadgeIcon className="w-8 h-8 text-white mb-4" />
    },
    {
      title: 'Electronics',
      subtitle: 'Security tech & gadgets',
      href: '/electronics',
      color: 'from-blue-600 to-purple-600',
      stats: '8K+ Products',
      icon: <span className="text-4xl mb-4">📱</span>
    },
    {
      title: 'Fashion & Apparel',
      subtitle: 'General fashion items',
      href: '/fashion',
      color: 'from-pink-500 to-purple-500',
      stats: '20K+ Products',
      icon: <span className="text-4xl mb-4">👕</span>
    },
    {
      title: 'Home & Garden',
      subtitle: 'Home security solutions',
      href: '/home',
      color: 'from-green-600 to-emerald-500',
      stats: '10K+ Products',
      icon: <span className="text-4xl mb-4">🏠</span>
    },
    {
      title: 'Sports & Fitness',
      subtitle: 'Tactical sports gear',
      href: '/sports',
      color: 'from-orange-500 to-red-500',
      stats: '5K+ Products',
      icon: <span className="text-4xl mb-4">⚽</span>
    },
    {
      title: 'Beauty & Health',
      subtitle: 'Professional cosmetics',
      href: '/cosmetics',
      color: 'from-purple-600 to-pink-500',
      stats: '3K+ Products',
      icon: <span className="text-4xl mb-4">💄</span>
    },
    {
      title: 'Hardware Tools',
      subtitle: 'Professional grade tools',
      href: '/hardware',
      color: 'from-red-600 to-orange-500',
      stats: '7K+ Products',
      icon: <span className="text-4xl mb-4">🔧</span>
    }
  ];

  const features = [
    {
      icon: <ShieldCheckIcon className="w-12 h-12 text-blue-600" />,
      title: 'Security Verified',
      description: 'All products undergo security validation'
    },
    {
      icon: <TruckIcon className="w-12 h-12 text-green-600" />,
      title: 'Fast Shipping',
      description: 'Professional delivery in 2-3 business days'
    },
    {
      icon: <CheckBadgeIcon className="w-12 h-12 text-purple-600" />,
      title: 'Quality Guaranteed',
      description: '30-day return policy on all items'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Premium Marketplace for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Everything</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover curated collections of professional gear, fashion, electronics, and more. 
            Join thousands of satisfied customers in our secure marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products" className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
              Shop All Categories
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/social" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
              Explore Social Feed
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Floating stats */}
        <div className="relative max-w-7xl mx-auto px-4 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalProducts.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.vendors.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Vendors</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.orders.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Orders</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.satisfied}%</div>
              <div className="text-sm text-gray-600">Satisfied</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase - FIXED LINKS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Collections
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Carefully curated categories featuring premium brands and trusted vendors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workingCategories.map((category, index) => (
            <Link key={category.title} href={category.href} className="group">
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`}></div>
                <div className="relative p-6 h-full flex flex-col justify-between text-white">
                  {category.icon}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                      {category.stats}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-white/90 text-sm mb-4">{category.subtitle}</p>
                    <div className="flex items-center text-white font-semibold group-hover:text-yellow-300 transition-colors">
                      Browse Collection
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform</h2>
            <p className="text-xl text-gray-600">Professional-grade marketplace with security focus</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied customers and discover premium products today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Browse All Products
            </Link>
            <Link href="/social" className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Join Social Feed
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
