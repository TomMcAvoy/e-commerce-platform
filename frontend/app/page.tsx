'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '../components/navigation/Navigation';
import { AffiliateSidebar } from '../components/affiliate/AffiliateSidebar';
import { apiClient } from '../lib/api';
import { ShieldCheckIcon, LockClosedIcon, CheckBadgeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    vendors: 0,
    orders: 0,
    satisfied: 98
  });
  const [showAffiliateSidebar, setShowAffiliateSidebar] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
    loadStats();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await apiClient.getFeaturedProducts();
      if (response.success) {
        setFeaturedProducts(response.data?.slice(0, 8) || []);
      }
    } catch (error) {
      console.error('Failed to load featured products:', error);
    }
  };

  const loadStats = async () => {
    // Mock stats following API Endpoints Structure
    setStats({
      totalProducts: 50000,
      vendors: 1500,
      orders: 125000,
      satisfied: 98
    });
  };

  const categories = [
    {
      title: 'Secure Mens Fashion',
      subtitle: 'Verified premium clothing & accessories',
      href: '/mens',
      color: 'from-gray-800 to-gray-600',
      stats: '15K+ Verified Products',
      icon: <ShieldCheckIcon className="w-8 h-8 text-white mb-4" />
    },
    {
      title: 'Secure Sports Equipment',
      subtitle: 'Authenticated professional grade gear',
      href: '/sports', 
      color: 'from-green-600 to-emerald-500',
      stats: '8K+ Certified Products',
      icon: <CheckBadgeIcon className="w-8 h-8 text-white mb-4" />
    },
    {
      title: 'Secure Hardware Tools',
      subtitle: 'Validated professional & DIY tools',
      href: '/hardware',
      color: 'from-red-600 to-orange-500',
      stats: '12K+ Verified Products',
      icon: <LockClosedIcon className="w-8 h-8 text-white mb-4" />
    }
  ];

  const securityFeatures = [
    {
      title: 'Encrypted Shipping',
      description: 'End-to-end secure delivery with tracking validation',
      icon: '🔒'
    },
    {
      title: 'Verified Payments',
      description: 'Multi-layer security with fraud protection',
      icon: '🛡️'
    },
    {
      title: 'Security Guarantee',
      description: 'Comprehensive protection on all transactions',
      icon: '⭐'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Main Content with Affiliate Sidebar Layout */}
      <div className="flex">
        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${showAffiliateSidebar ? 'mr-80' : ''}`}>
          {/* Hero Section following Critical Integration Points */}
          <section className="hero-section bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <div className="absolute inset-0 opacity-5"></div>
            <div className="hero-content">
              <div className="flex items-center justify-center mb-6">
                <ShieldCheckIcon className="w-16 h-16 text-blue-600 mr-4" />
                <div className="text-center">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-2">
                    Whitestart System Security
                  </h1>
                  <p className="text-xl md:text-2xl lg:text-3xl text-blue-600 font-semibold">
                    Premiumhub Marketplace
                  </p>
                </div>
              </div>
              <p className="hero-subtitle">
                The most secure e-commerce platform with verified vendors, encrypted transactions, 
                and comprehensive buyer protection. Experience premium shopping with enterprise-level security.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/products" className="cta-button">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  Shop Secure Marketplace
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link href="/social" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                  Security Feed
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Floating stats following Debugging & Testing Ecosystem */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden lg:flex space-x-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{stats.totalProducts.toLocaleString()}+</div>
                <div className="text-sm text-gray-600">Verified Products</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-green-200">
                <div className="text-2xl font-bold text-green-600">{stats.vendors.toLocaleString()}+</div>
                <div className="text-sm text-gray-600">Trusted Vendors</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">{stats.satisfied}%</div>
                <div className="text-sm text-gray-600">Security Score</div>
              </div>
            </div>
          </section>

          {/* Category Showcase following Dropshipping Service Architecture */}
          <section className="py-20 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Secure Product Categories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every product verified through our comprehensive security validation system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <Link key={category.title} href={category.href} className="group">
                  <div className="category-card group h-80">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`}></div>
                    <div className="category-card-content">
                      {category.icon}
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                          {category.stats}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                      <p className="text-white/90 mb-4">{category.subtitle}</p>
                      <div className="flex items-center text-white font-semibold group-hover:text-yellow-300 transition-colors">
                        Browse Secure Collection
                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Security Features Section following Security Considerations */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose Whitestart System Security?
                </h2>
                <p className="text-xl text-gray-600">
                  Enterprise-level security meets premium marketplace experience
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="stats-card hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Security Metrics */}
              <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold mb-2">256-bit</div>
                    <div className="text-blue-100">SSL Encryption</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">99.9%</div>
                    <div className="text-blue-100">Uptime SLA</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <div className="text-blue-100">Security Monitoring</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">Zero</div>
                    <div className="text-blue-100">Data Breaches</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section following Critical Integration Points */}
          <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="max-w-4xl mx-auto text-center px-4">
              <ShieldCheckIcon className="w-16 h-16 mx-auto mb-6 text-blue-200" />
              <h2 className="text-4xl font-bold mb-6">
                Ready for Secure Shopping?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of customers who trust Whitestart System Security for their premium purchases
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  <LockClosedIcon className="w-5 h-5 mr-2" />
                  Start Secure Shopping
                </Link>
                <Link href="/debug" className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  System Status
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Affiliate Sidebar - Fixed Position */}
        {showAffiliateSidebar && (
          <div className="fixed right-4 top-20 w-80 h-[calc(100vh-6rem)] z-40">
            <AffiliateSidebar 
              isVisible={showAffiliateSidebar}
              onClose={() => setShowAffiliateSidebar(false)}
            />
          </div>
        )}

        {/* Toggle Button for Affiliate Sidebar */}
        {!showAffiliateSidebar && (
          <button
            onClick={() => setShowAffiliateSidebar(true)}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-purple-700 transition-colors z-40"
            title="Show Affiliate Deals"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <div className="text-xs mt-1 writing-mode-vertical transform rotate-180">
              Affiliate Deals
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
