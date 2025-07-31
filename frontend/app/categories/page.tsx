'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBagIcon,
  SparklesIcon,
  TagIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FireIcon,
  StarIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';

// Category icons mapping
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('fashion') || name.includes('clothing') || name.includes('apparel')) return '👗';
  if (name.includes('electronics') || name.includes('tech') || name.includes('gadget')) return '📱';
  if (name.includes('home') || name.includes('garden') || name.includes('furniture')) return '🏠';
  if (name.includes('beauty') || name.includes('cosmetic') || name.includes('makeup')) return '💄';
  if (name.includes('sports') || name.includes('fitness') || name.includes('exercise')) return '⚽';
  if (name.includes('book') || name.includes('education') || name.includes('learning')) return '📚';
  if (name.includes('toy') || name.includes('game') || name.includes('kid')) return '🎮';
  if (name.includes('food') || name.includes('beverage') || name.includes('drink')) return '🍕';
  if (name.includes('health') || name.includes('medical') || name.includes('wellness')) return '💊';
  if (name.includes('automotive') || name.includes('car') || name.includes('vehicle')) return '🚗';
  if (name.includes('jewelry') || name.includes('accessories') || name.includes('watch')) return '💎';
  if (name.includes('pet') || name.includes('animal')) return '🐾';
  return '🛍️'; // Default shopping icon
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  productCount?: number;
  image?: string;
}

// Sample categories for initial render and fallback
const sampleCategories: Category[] = [
  {
    _id: '1',
    name: 'Electronics & Technology',
    slug: 'electronics-technology',
    description: 'Latest electronics, smartphones, computers, and tech gadgets',
    productCount: 4,
    isFeatured: true,
    isPopular: true,
    level: 0,
    parentCategory: null,
    children: []
  },
  {
    _id: '2',
    name: 'Fashion & Apparel',
    slug: 'fashion-apparel',
    description: 'Trendy clothing, shoes, accessories, and fashion',
    productCount: 7,
    isFeatured: true,
    isPopular: true,
    level: 0,
    parentCategory: null,
    children: []
  },
  {
    _id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement, furniture, kitchen appliances, and garden supplies',
    productCount: 15,
    isFeatured: true,
    isPopular: true,
    level: 0,
    parentCategory: null,
    children: []
  },
  {
    _id: '4',
    name: 'Health & Beauty',
    slug: 'health-beauty',
    description: 'Beauty products, skincare, makeup, health supplements',
    productCount: 11,
    isFeatured: true,
    isPopular: true,
    level: 0,
    parentCategory: null,
    children: []
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Only fetch on client side
    if (typeof window === 'undefined') return;
    
    async function fetchCategories() {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        console.log('🔍 Fetching categories from:', `${apiUrl}/api/categories`);
        
        const response = await fetch(`${apiUrl}/api/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ API Response:', data);
          
          // Backend returns { success: true, count: X, data: [...] }
          if (data.success && data.data && data.data.length > 0) {
            console.log(`🎉 Found ${data.data.length} real categories!`);
            setCategories(data.data);
          } else {
            console.log('⚠️ No categories in API response, using samples');
            setCategories(sampleCategories);
          }
        } else {
          console.log('❌ API request failed:', response.status);
          setCategories(sampleCategories);
        }
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        setCategories(sampleCategories);
      } finally {
        setLoading(false);
      }
    }

    // Delay slightly to ensure DOM is ready
    setTimeout(fetchCategories, 100);
  }, []);

  const displayCategories = categories.length > 0 ? categories : sampleCategories;

  const filteredCategories = displayCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Categories</h2>
            <p className="text-gray-500">Discovering amazing product categories for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SparklesIcon className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <ShoppingBagIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Shop by <span className="text-blue-600">Category</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover our carefully curated product categories. From the latest fashion trends to cutting-edge technology, find exactly what you're looking for in our organized marketplace.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-4">
                <TagIcon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{displayCategories.length}+</h3>
              <p className="text-gray-600">Product Categories</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-lg mb-4">
                <FireIcon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">5000+</h3>
              <p className="text-gray-600">Total Products</p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-lg mb-4">
                <TrendingUpIcon className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Daily</h3>
              <p className="text-gray-600">New Arrivals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">No categories found</h2>
              <p className="text-gray-500 mb-6">Try adjusting your search terms or browse all categories</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Show All Categories
              </button>
            </div>
          ) : (
            <>
              {/* Featured Categories */}
              <div className="mb-12">
                <div className="flex items-center justify-center mb-8">
                  <StarIcon className="h-6 w-6 text-yellow-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCategories.slice(0, 3).map((category, index) => (
                    <Link
                      key={category._id}
                      href={`/categories/${category.slug}`}
                      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-300"></div>
                      <div className="relative p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div className="text-5xl">{getCategoryIcon(category.name)}</div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Products</div>
                            <div className="text-xl font-bold text-blue-600">{category.productCount || Math.floor(Math.random() * 1000) + 100}</div>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 mb-6 line-clamp-2">
                          {category.description || `Discover amazing ${category.name.toLowerCase()} products from trusted vendors worldwide.`}
                        </p>
                        <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-semibold">
                          <span>Explore Category</span>
                          <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* All Categories Grid */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">All Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredCategories.map((category, index) => (
                    <Link
                      key={category._id}
                      href={`/categories/${category.slug}`}
                      className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="text-center">
                          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                            {getCategoryIcon(category.name)}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            {category.productCount || Math.floor(Math.random() * 500) + 50} products
                          </p>
                          <div className="text-blue-600 group-hover:text-blue-700 text-sm font-medium flex items-center justify-center">
                            <span>Browse</span>
                            <ArrowRightIcon className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our AI-powered search can help you discover products across all categories, or get personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/products" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Browse All Products
            </Link>
            <Link 
              href="/social" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Ask the Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}