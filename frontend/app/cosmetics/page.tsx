'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { AffiliateSidebar } from '../../components/affiliate/AffiliateSidebar';
import { SparklesIcon, StarIcon, HeartIcon, ShoppingCartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';

export default function CosmeticsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [showAffiliateSidebar, setShowAffiliateSidebar] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedBrand]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const mockProducts = [
        {
          id: 'cosmetics-1',
          name: 'Professional Long-Wear Foundation',
          price: 89.99,
          originalPrice: 119.99,
          rating: 4.8,
          reviews: 1247,
          image: '/api/placeholder/300/300',
          category: 'makeup',
          brand: 'SecureBeauty Pro',
          verified: true,
          description: 'Professional-grade foundation that lasts 16+ hours, perfect for security professionals'
        },
        {
          id: 'cosmetics-2',
          name: 'Executive Anti-Aging Serum',
          price: 129.99,
          originalPrice: 179.99,
          rating: 4.9,
          reviews: 856,
          image: '/api/placeholder/300/300',
          category: 'skincare',
          brand: 'Whitestart Luxury',
          verified: true,
          description: 'Premium anti-aging serum with clinical-grade ingredients for executive professionals'
        },
        {
          id: 'cosmetics-3',
          name: 'Waterproof Mascara - Security Black',
          price: 39.99,
          originalPrice: 54.99,
          rating: 4.7,
          reviews: 2134,
          image: '/api/placeholder/300/300',
          category: 'makeup',
          brand: 'SecureBeauty',
          verified: true,
          description: 'Smudge-proof, waterproof mascara designed for long shifts and all-weather conditions'
        },
        {
          id: 'cosmetics-4',
          name: 'Professional Concealer Palette',
          price: 59.99,
          originalPrice: 79.99,
          rating: 4.6,
          reviews: 743,
          image: '/api/placeholder/300/300',
          category: 'makeup',
          brand: 'SecureBeauty Pro',
          verified: true,
          description: 'Multi-shade concealer palette for flawless professional appearance'
        },
        {
          id: 'cosmetics-5',
          name: 'Hydrating Night Recovery Cream',
          price: 79.99,
          originalPrice: 109.99,
          rating: 4.8,
          reviews: 567,
          image: '/api/placeholder/300/300',
          category: 'skincare',
          brand: 'Whitestart Luxury',
          verified: true,
          description: 'Intensive overnight treatment for stress recovery and skin repair'
        },
        {
          id: 'cosmetics-6',
          name: 'Professional Hair Styling Kit',
          price: 149.99,
          originalPrice: 199.99,
          rating: 4.7,
          reviews: 423,
          image: '/api/placeholder/300/300',
          category: 'haircare',
          brand: 'SecureStyle',
          verified: true,
          description: 'Complete styling kit for maintaining professional appearance throughout long shifts'
        }
      ];

      let filteredProducts = mockProducts;
      
      if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
      }
      
      if (selectedBrand !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Failed to load cosmetics products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  const categories = [
    { id: 'all', name: 'All Beauty Products', count: 6 },
    { id: 'skincare', name: 'Professional Skincare', count: 2 },
    { id: 'makeup', name: 'Long-Wear Makeup', count: 3 },
    { id: 'haircare', name: 'Professional Hair Care', count: 1 }
  ];

  const brands = [
    { id: 'all', name: 'All Brands' },
    { id: 'SecureBeauty Pro', name: 'SecureBeauty Pro' },
    { id: 'Whitestart Luxury', name: 'Whitestart Luxury' },
    { id: 'SecureBeauty', name: 'SecureBeauty' },
    { id: 'SecureStyle', name: 'SecureStyle' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <SparklesIcon className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-4xl font-bold">Professional Cosmetics</h1>
              <p className="text-purple-100 text-lg">Premium beauty products for security professionals</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Professional Grade</h3>
              <p className="text-purple-100">Long-wearing formulas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Verified Authentic</h3>
              <p className="text-purple-100">Security-validated products</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Premium Brands</h3>
              <p className="text-purple-100">Executive quality standards</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex max-w-7xl mx-auto">
        <div className="w-64 p-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs text-gray-500">({category.count})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Brands</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                    selectedBrand === brand.id
                      ? 'bg-purple-100 text-purple-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`flex-1 p-6 ${showAffiliateSidebar ? 'mr-80' : ''}`}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                    {product.verified && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <ShieldCheckIcon className="w-3 h-3 mr-1" />
                        Verified
                      </div>
                    )}
                    {product.originalPrice && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-purple-600 font-medium">{product.brand}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {product.rating} ({product.reviews.toLocaleString()} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                      >
                        <ShoppingCartIcon className="w-4 h-4 mr-2" />
                        Add to Cart
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <HeartIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAffiliateSidebar && (
        <div className="fixed right-4 top-20 w-80 h-[calc(100vh-6rem)] z-40">
          <AffiliateSidebar 
            isVisible={showAffiliateSidebar}
            onClose={() => setShowAffiliateSidebar(false)}
          />
        </div>
      )}
    </div>
  );
}
