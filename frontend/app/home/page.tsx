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
