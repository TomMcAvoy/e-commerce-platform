#!/bin/bash

set -e

echo "🏗️ Building Comprehensive E-Commerce Platform with Specialized Landing Pages"
echo "Following coding instructions - Multi-vendor platform with affiliate marketing..."

cd frontend

# Update package.json with comprehensive dependencies for advanced features
echo "📦 Installing comprehensive dependencies for landing pages and social features..."
cat > package.json << 'EOF'
{
  "name": "whitestartups-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "next lint",
    "dev:debug": "next dev -p 3001 --turbo",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "@headlessui/react": "^2.0.4",
    "@heroicons/react": "^2.1.5",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-toast": "^1.2.14",
    "framer-motion": "^11.11.17",
    "lucide-react": "^0.525.0",
    "next": "^15.4.3",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-intersection-observer": "^9.14.0",
    "swiper": "^11.1.14",
    "tailwindcss": "^4.1.11",
    "typescript": "^5.8.3"
  },
  "devDependencies": {
    "@types/node": "^24.1.0",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6"
  }
}
EOF

npm install

# Enhanced Tailwind configuration for landing pages
echo "🎨 Creating enhanced Tailwind configuration for specialized landing pages..."
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        // Category-specific colors
        mens: {
          50: '#f8fafc',
          500: '#475569',
          600: '#334155',
          700: '#1e293b',
        },
        sports: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        hardware: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        social: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        affiliate: {
          50: '#fdf4ff',
          500: '#c084fc',
          600: '#a855f7',
          700: '#9333ea',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-right': 'slideRight 0.8s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'gradient': 'gradient 6s ease infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-mens': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'hero-sports': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'hero-hardware': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
EOF

# Enhanced globals.css with landing page styles
echo "🎨 Creating enhanced globals.css for specialized landing pages..."
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Landing page specific styles */
@layer components {
  .hero-section {
    @apply relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 overflow-hidden;
  }

  .hero-content {
    @apply text-center z-10 max-w-4xl mx-auto px-6;
  }

  .hero-title {
    @apply text-4xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6 animate-fade-in;
  }

  .hero-subtitle {
    @apply text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto animate-slide-up;
  }

  .cta-button {
    @apply inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300;
  }

  .category-card {
    @apply group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500;
  }

  .category-card-content {
    @apply absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white;
  }

  .product-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
  }

  .product-card {
    @apply bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden;
  }

  .affiliate-sidebar {
    @apply fixed right-4 top-20 w-80 h-[calc(100vh-6rem)] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-40;
  }

  .affiliate-item {
    @apply flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer;
  }

  .social-feed {
    @apply bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden;
  }

  .social-post {
    @apply p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors;
  }

  .stats-card {
    @apply bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center;
  }

  .feature-icon {
    @apply w-12 h-12 mx-auto mb-4 text-brand-600;
  }
}

/* Responsive utilities */
@layer utilities {
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  .bg-blur {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.9);
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-600;
}
EOF

# Create comprehensive layout with affiliate sidebar
echo "🏗️ Creating comprehensive layout with affiliate marketing integration..."
cat > app/layout.tsx << 'EOF'
import { CartProvider } from '../context/CartContext';
import { AffiliateSidebar } from '../components/affiliate/AffiliateSidebar';
import './globals.css';

export const metadata = {
  title: 'Premium Marketplace - Multi-Vendor E-Commerce Platform',
  description: 'Discover premium mens fashion, sports equipment, hardware tools, and more with integrated affiliate marketing',
  keywords: 'e-commerce, mens fashion, sports goods, hardware tools, affiliate marketing, premium marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        <CartProvider>
          <div className="relative min-h-screen">
            {children}
            <AffiliateSidebar />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
EOF

# Create comprehensive navigation component
echo "🧭 Creating comprehensive navigation component..."
mkdir -p components/{navigation,landing,product,affiliate,social}

cat > components/navigation/Navigation.tsx << 'EOF'
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Navigation() {
  const { getItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'Mens Fashion', href: '/mens', color: 'mens' },
    { name: 'Sports Goods', href: '/sports', color: 'sports' },
    { name: 'Hardware Tools', href: '/hardware', color: 'hardware' },
    { name: 'Social Feed', href: '/social', color: 'social' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg"></div>
            <span className="text-xl font-display font-bold text-gray-900">PremiumHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`text-gray-700 hover:text-${category.color}-600 font-medium transition-colors`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-brand-600 transition-colors">
              <ShoppingCartIcon className="w-6 h-6" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>
            
            <Link href="/auth/login" className="p-2 text-gray-700 hover:text-brand-600 transition-colors">
              <UserIcon className="w-6 h-6" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-700 hover:text-brand-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
EOF

# Create main landing page
echo "🏠 Creating main landing page with category highlights..."
cat > app/page.tsx << 'EOF'
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '../components/navigation/Navigation';
import { apiClient } from '../lib/api';
import { ArrowRightIcon, StarIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    vendors: 0,
    orders: 0,
    satisfied: 98
  });

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
    // Mock stats - in real app would come from API
    setStats({
      totalProducts: 50000,
      vendors: 1500,
      orders: 125000,
      satisfied: 98
    });
  };

  const categories = [
    {
      title: 'Mens Fashion',
      subtitle: 'Premium clothing & accessories',
      href: '/mens',
      image: '/api/placeholder/600/400',
      color: 'from-gray-800 to-gray-600',
      stats: '15K+ Products'
    },
    {
      title: 'Sports Equipment',
      subtitle: 'Professional grade gear',
      href: '/sports', 
      image: '/api/placeholder/600/400',
      color: 'from-green-600 to-emerald-500',
      stats: '8K+ Products'
    },
    {
      title: 'Hardware Tools',
      subtitle: 'Professional & DIY tools',
      href: '/hardware',
      image: '/api/placeholder/600/400', 
      color: 'from-red-600 to-orange-500',
      stats: '12K+ Products'
    }
  ];

  const features = [
    {
      icon: TruckIcon,
      title: 'Fast Shipping',
      description: 'Free 2-day shipping on orders over $50'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Payment',
      description: 'SSL encrypted checkout with buyer protection'
    },
    {
      icon: StarIcon,
      title: 'Quality Guarantee',
      description: '30-day return policy on all items'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-br from-brand-50 via-white to-brand-50">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Premium Marketplace for
            <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent"> Everything</span>
          </h1>
          <p className="hero-subtitle">
            Discover curated collections of mens fashion, sports equipment, hardware tools, and more. 
            Join thousands of satisfied customers in our premium marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products" className="cta-button">
              Shop All Categories
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/social" className="text-brand-600 hover:text-brand-800 font-semibold flex items-center">
              Explore Social Feed
              <ArrowRightIcon className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden lg:flex space-x-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-brand-600">{stats.totalProducts.toLocaleString()}+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-brand-600">{stats.vendors.toLocaleString()}+</div>
            <div className="text-sm text-gray-600">Vendors</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-brand-600">{stats.satisfied}%</div>
            <div className="text-sm text-gray-600">Satisfied</div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Explore Our Collections
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Carefully curated categories featuring premium brands and trusted vendors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link key={category.title} href={category.href} className="group">
              <div className="category-card h-80">
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`}></div>
                <div className="category-card-content">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                      {category.stats}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">{category.title}</h3>
                  <p className="text-white/90 mb-4">{category.subtitle}</p>
                  <div className="flex items-center text-white font-semibold group-hover:text-yellow-300 transition-colors">
                    Shop Now
                    <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Why Choose PremiumHub?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="stats-card">
                <feature.icon className="feature-icon" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600">Hand-picked items from our premium collection</p>
            </div>
            
            <div className="product-grid">
              {featuredProducts.map((product: any) => (
                <div key={product._id} className="product-card">
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-brand-200"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-brand-600">${product.price}</span>
                      <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-display font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 text-brand-100">
            Join thousands of satisfied customers and discover premium products today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="inline-flex items-center px-8 py-4 bg-white text-brand-600 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Browse All Products
            </Link>
            <Link href="/social" className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-brand-600 transition-colors">
              Join Social Feed
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
EOF

# Create Affiliate Sidebar Component
echo "💰 Creating affiliate marketing sidebar..."
cat > components/affiliate/AffiliateSidebar.tsx << 'EOF'
'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, StarIcon, TagIcon } from '@heroicons/react/24/outline';

interface AffiliateProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  commission: number;
  image: string;
  rating: number;
  category: string;
  brand: string;
  discount?: number;
  affiliate_url: string;
}

export function AffiliateSidebar() {
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<'top' | 'middle' | 'bottom'>('top');
  const [affiliateProducts, setAffiliateProducts] = useState<AffiliateProduct[]>([]);

  useEffect(() => {
    // Load affiliate products - in real app would come from API
    const mockAffiliateProducts: AffiliateProduct[] = [
      {
        id: 'aff-1',
        name: 'Premium Swiss Watch Collection',
        price: 899.99,
        originalPrice: 1299.99,
        commission: 15,
        image: '/api/placeholder/80/80',
        rating: 4.8,
        category: 'Luxury',
        brand: 'SwissTime',
        discount: 31,
        affiliate_url: '#'
      },
      {
        id: 'aff-2', 
        name: 'Professional Camera Kit',
        price: 1499.99,
        commission: 12,
        image: '/api/placeholder/80/80',
        rating: 4.9,
        category: 'Electronics',
        brand: 'PhotoPro',
        affiliate_url: '#'
      },
      {
        id: 'aff-3',
        name: 'Designer Leather Jacket',
        price: 599.99,
        originalPrice: 899.99,
        commission: 20,
        image: '/api/placeholder/80/80',
        rating: 4.7,
        category: 'Fashion',
        brand: 'StyleCraft',
        discount: 33,
        affiliate_url: '#'
      },
      {
        id: 'aff-4',
        name: 'High-Performance Laptop',
        price: 2299.99,
        commission: 8,
        image: '/api/placeholder/80/80',
        rating: 4.9,
        category: 'Tech',
        brand: 'TechMaster',
        affiliate_url: '#'
      },
      {
        id: 'aff-5',
        name: 'Luxury Skincare Set',
        price: 299.99,
        originalPrice: 399.99,
        commission: 25,
        image: '/api/placeholder/80/80',
        rating: 4.6,
        category: 'Beauty',
        brand: 'GlowLux',
        discount: 25,
        affiliate_url: '#'
      }
    ];
    setAffiliateProducts(mockAffiliateProducts);
  }, []);

  const getProductsBySection = (section: 'top' | 'middle' | 'bottom') => {
    switch (section) {
      case 'top':
        return affiliateProducts.slice(0, 2);
      case 'middle':
        return affiliateProducts.slice(2, 4);
      case 'bottom':
        return affiliateProducts.slice(4, 6);
      default:
        return [];
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-affiliate-600 text-white p-3 rounded-l-lg shadow-lg z-50 hover:bg-affiliate-700 transition-colors"
      >
        <TagIcon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="affiliate-sidebar">
      {/* Header */}
      <div className="bg-gradient-to-r from-affiliate-600 to-affiliate-700 text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Premium Picks</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-affiliate-200 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-affiliate-100 text-xs mt-1">Curated high-end selections</p>
      </div>

      {/* Section Navigation */}
      <div className="flex border-b border-gray-200">
        {['top', 'middle', 'bottom'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section as any)}
            className={`flex-1 py-2 px-3 text-xs font-medium transition-colors ${
              activeSection === section
                ? 'bg-affiliate-50 text-affiliate-700 border-b-2 border-affiliate-600'
                : 'text-gray-600 hover:text-affiliate-600'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="flex-1 overflow-y-auto">
        {getProductsBySection(activeSection).map((product) => (
          <a
            key={product.id}
            href={product.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="affiliate-item group"
          >
            <div className="relative">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-affiliate-100 to-affiliate-200"></div>
              </div>
              {product.discount && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>
            
            <div className="flex-1 ml-3">
              <h4 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-affiliate-700 transition-colors">
                {product.name}
              </h4>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-gray-400 mx-2">•</span>
                <span className="text-xs text-affiliate-600 font-medium">{product.commission}% comm.</span>
              </div>
              <div className="mt-1">
                <span className="font-semibold text-affiliate-700">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through ml-2">${product.originalPrice}</span>
                )}
              </div>
              <span className="text-xs text-gray-500">{product.category}</span>
            </div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">Affiliate Marketing</p>
          <button className="text-xs bg-affiliate-600 text-white px-3 py-1.5 rounded-full hover:bg-affiliate-700 transition-colors">
            View All Deals
          </button>
        </div>
      </div>
    </div>
  );
}
EOF

echo ""
echo "🎉 Comprehensive Landing Pages Created!"
echo ""
echo "📋 What's been implemented following coding instructions:"
echo "1. ✅ Main landing page with hero section and category showcase"
echo "2. ✅ Comprehensive navigation with category links"
echo "3. ✅ Affiliate marketing sidebar with 3-section layout"
echo "4. ✅ Enhanced Tailwind configuration with category-specific colors"
echo "5. ✅ Premium design system with animations and gradients"
echo "6. ✅ Responsive layout for all device sizes"
echo "7. ✅ Product grid and feature sections"
echo "8. ✅ Social media integration preparation"
echo ""
echo "🎯 Next steps to complete the platform:"
echo "1. Create specialized landing pages (mens, sports, hardware)"
echo "2. Build LinkedIn-style social media feed"
echo "3. Implement affiliate product tracking"
echo "4. Add advanced product filtering and search"
echo "5. Integration with DropshippingService backend"
echo ""
echo "🚀 Your comprehensive platform structure:"
echo "• Main Landing: http://localhost:3001"
echo "• Mens Fashion: http://localhost:3001/mens (to be created)"
echo "• Sports Goods: http://localhost:3001/sports (to be created)"
echo "• Hardware Tools: http://localhost:3001/hardware (to be created)"
echo "• Social Feed: http://localhost:3001/social (to be created)"
echo "• Affiliate Sidebar: Always visible on right side"
echo ""
echo "Ready to continue with specialized landing pages? Run: npm run dev:all"

cd ..
echo "✅ Comprehensive landing page foundation complete!"
