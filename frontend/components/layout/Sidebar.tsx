'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  slug: string;
  isAffiliate?: boolean;
  affiliateUrl?: string;
}

export default function Sidebar() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.publicRequest('/products?featured=true&limit=5');
        setFeaturedProducts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-80 bg-gray-50 p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4">
              <div className="h-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 p-4 space-y-6">
      {/* Featured Offers */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Featured Offers</h3>
        <div className="space-y-4">
          {featuredProducts.map((product) => (
            <div key={product._id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex space-x-3">
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link 
                    href={product.isAffiliate ? product.affiliateUrl || '#' : `/products/${product.slug}`}
                    target={product.isAffiliate ? '_blank' : '_self'}
                    className="block"
                  >
                    <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2">
                      {product.name}
                    </h4>
                  </Link>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-semibold text-green-600">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.isAffiliate && (
                    <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1">
                      Affiliate
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Shop by Category</h3>
        <div className="space-y-2">
          {[
            { name: 'Fashion & Apparel', href: '/products?category=fashion', icon: '👗' },
            { name: 'Electronics', href: '/products?category=electronics', icon: '📱' },
            { name: 'Home & Garden', href: '/products?category=home', icon: '🏠' },
            { name: 'Sports & Fitness', href: '/products?category=sports', icon: '⚽' },
            { name: 'Beauty & Health', href: '/products?category=beauty', icon: '💄' },
            { name: 'Books & Media', href: '/products?category=books', icon: '📚' }
          ].map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm text-gray-700 hover:text-blue-600">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* News Categories */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Latest News</h3>
        <div className="space-y-2">
          {[
            { name: 'Breaking News', href: '/news', icon: '📰' },
            { name: 'Sports', href: '/news?category=sports', icon: '🏆' },
            { name: 'Entertainment', href: '/news?category=entertainment', icon: '🎬' },
            { name: 'Technology', href: '/news?category=technology', icon: '💻' },
            { name: 'Business', href: '/news?category=business', icon: '💼' },
            { name: 'Health', href: '/news?category=health', icon: '🏥' }
          ].map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-sm text-gray-700 hover:text-blue-600">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}