'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, StarIcon, TagIcon, ShoppingBagIcon, TruckIcon } from '@heroicons/react/24/outline';

interface AffiliateProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  affiliate: {
    commission: number;
    provider: string;
    url: string;
    verified: boolean;
  };
}

interface AffiliateSidebarProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export function AffiliateSidebar({ isVisible = true, onClose }: AffiliateSidebarProps) {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trending' | 'high-commission' | 'verified'>('trending');

  useEffect(() => {
    loadAffiliateProducts();
  }, [activeTab]);

  const loadAffiliateProducts = async () => {
    setIsLoading(true);
    try {
      // Mock affiliate products following Dropshipping Service Architecture
      const mockProducts: AffiliateProduct[] = [
        {
          id: 'aff-1',
          name: 'Premium Wireless Security Headphones',
          price: 199.99,
          originalPrice: 299.99,
          discount: 33,
          rating: 4.8,
          reviews: 2847,
          image: '/api/placeholder/150/150',
          category: 'Electronics',
          affiliate: {
            commission: 12.5,
            provider: 'Amazon',
            url: 'https://amazon.com/premium-headphones',
            verified: true
          }
        },
        {
          id: 'aff-2',
          name: 'Smart Fitness Tracker with Health Monitoring',
          price: 89.99,
          originalPrice: 129.99,
          discount: 31,
          rating: 4.6,
          reviews: 1523,
          image: '/api/placeholder/150/150',
          category: 'Sports',
          affiliate: {
            commission: 15.0,
            provider: 'Best Buy',
            url: 'https://bestbuy.com/fitness-tracker',
            verified: true
          }
        },
        {
          id: 'aff-3',
          name: 'Professional Tool Set - 128 Pieces',
          price: 159.99,
          originalPrice: 219.99,
          discount: 27,
          rating: 4.9,
          reviews: 892,
          image: '/api/placeholder/150/150',
          category: 'Hardware',
          affiliate: {
            commission: 18.0,
            provider: 'Home Depot',
            url: 'https://homedepot.com/tool-set',
            verified: true
          }
        },
        {
          id: 'aff-4',
          name: 'Luxury Men\'s Watch - Waterproof',
          price: 249.99,
          originalPrice: 399.99,
          discount: 37,
          rating: 4.7,
          reviews: 654,
          image: '/api/placeholder/150/150',
          category: 'Fashion',
          affiliate: {
            commission: 20.0,
            provider: 'Nordstrom',
            url: 'https://nordstrom.com/luxury-watch',
            verified: true
          }
        },
        {
          id: 'aff-5',
          name: 'Gaming Chair with RGB Lighting',
          price: 329.99,
          originalPrice: 449.99,
          discount: 27,
          rating: 4.5,
          reviews: 1234,
          image: '/api/placeholder/150/150',
          category: 'Gaming',
          affiliate: {
            commission: 14.5,
            provider: 'Newegg',
            url: 'https://newegg.com/gaming-chair',
            verified: true
          }
        }
      ];

      // Filter based on active tab following Testing Infrastructure patterns
      let filteredProducts = mockProducts;
      if (activeTab === 'high-commission') {
        filteredProducts = mockProducts.filter(p => p.affiliate.commission >= 15);
      } else if (activeTab === 'verified') {
        filteredProducts = mockProducts.filter(p => p.affiliate.verified);
      }

      // Simulate API delay following Critical Integration Points
      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Failed to load affiliate products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAffiliateClick = (product: AffiliateProduct) => {
    // Track affiliate click following Analytics patterns
    console.log(`Affiliate click: ${product.name} (${product.affiliate.provider}) - Commission: ${product.affiliate.commission}%`);
    
    // Analytics tracking (simulate)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        'event_category': 'affiliate',
        'event_label': product.name,
        'value': product.affiliate.commission
      });
    }
    
    // Open affiliate link in new tab
    window.open(product.affiliate.url, '_blank', 'noopener,noreferrer');
  };

  if (!isVisible) return null;

  return (
    <div className="affiliate-sidebar bg-white shadow-2xl border border-gray-200 rounded-xl overflow-hidden">
      {/* Header following UI Component patterns with Whitestart branding */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ShoppingBagIcon className="w-5 h-5 mr-2 text-purple-600" />
            Premium Affiliate Deals
          </h3>
          <p className="text-sm text-gray-600">Curated by Whitestart Security</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Tab Navigation following Frontend Structure patterns */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {[
          { key: 'trending', label: 'Trending', icon: '🔥' },
          { key: 'high-commission', label: 'High %', icon: '💰' },
          { key: 'verified', label: 'Verified', icon: '✅' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium text-center transition-colors ${
              activeTab === tab.key
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content following Cross-Service Communication patterns */}
      <div className="flex-1 overflow-y-auto max-h-96">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2">
            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBagIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No products found for this filter</p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="affiliate-item group cursor-pointer p-3 rounded-lg hover:bg-purple-50 transition-all"
                  onClick={() => handleAffiliateClick(product)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA2MEw5MCA4MEg2MEw3NSA2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                        }}
                      />
                      {product.discount && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                          -{product.discount}%
                        </div>
                      )}
                      {product.affiliate.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {product.name}
                      </h4>
                      
                      {/* Rating */}
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          {product.rating} ({product.reviews.toLocaleString()})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-sm font-bold text-gray-900">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Affiliate Info */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-purple-600 font-medium">
                          <TagIcon className="w-3 h-3 mr-1" />
                          {product.affiliate.commission}% commission
                        </div>
                        <div className="flex items-center text-xs text-gray-500 font-medium">
                          <TruckIcon className="w-3 h-3 mr-1" />
                          {product.affiliate.provider}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer CTA following Conversion Optimization patterns */}
      <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-3">
            💰 Earn up to 20% commission on qualified purchases
          </p>
          <button 
            onClick={() => window.open('/affiliate/dashboard', '_blank')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-md"
          >
            View Affiliate Dashboard
          </button>
          <p className="text-xs text-purple-600 mt-2 font-medium">
            🔒 Secured by Whitestart System
          </p>
        </div>
      </div>
    </div>
  );
}
