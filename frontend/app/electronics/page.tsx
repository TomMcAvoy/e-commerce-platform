'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { AffiliateSidebar } from '../../components/affiliate/AffiliateSidebar';
import { DevicePhoneMobileIcon, StarIcon, HeartIcon, ShoppingCartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  verified: boolean;
  description: string;
  brand: string;
  features: string[];
}

export default function ElectronicsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showAffiliateSidebar, setShowAffiliateSidebar] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedBrand, sortBy]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Following DropshippingService.test.ts patterns for mock data structure
      const mockProducts: Product[] = [
        {
          id: 'elec-1',
          name: 'iPhone 15 Pro Max - 256GB',
          price: 1199.99,
          originalPrice: 1299.99,
          rating: 4.8,
          reviews: 15420,
          image: '/api/placeholder/300/300',
          category: 'smartphones',
          verified: true,
          description: 'Latest iPhone with Pro camera system and A17 Pro chip',
          brand: 'Apple',
          features: ['A17 Pro Chip', '48MP Camera', '5G', 'Face ID']
        },
        {
          id: 'elec-2',
          name: 'Samsung 65" 4K Smart TV',
          price: 899.99,
          originalPrice: 1299.99,
          rating: 4.6,
          reviews: 8934,
          image: '/api/placeholder/300/300',
          category: 'tv-audio',
          verified: true,
          description: 'Crystal UHD 4K TV with smart features and HDR support',
          brand: 'Samsung',
          features: ['4K UHD', 'Smart Hub', 'HDR10+', 'Gaming Mode']
        },
        {
          id: 'elec-3',
          name: 'MacBook Air M3 - 13"',
          price: 1099.99,
          originalPrice: 1199.99,
          rating: 4.9,
          reviews: 12456,
          image: '/api/placeholder/300/300',
          category: 'laptops',
          verified: true,
          description: 'Ultra-thin laptop with M3 chip and all-day battery life',
          brand: 'Apple',
          features: ['M3 Chip', '18hr Battery', 'Retina Display', 'Touch ID']
        },
        {
          id: 'elec-4',
          name: 'AirPods Pro (3rd Gen)',
          price: 249.99,
          originalPrice: 299.99,
          rating: 4.7,
          reviews: 23671,
          image: '/api/placeholder/300/300',
          category: 'audio',
          verified: true,
          description: 'Active noise cancellation with transparency mode',
          brand: 'Apple',
          features: ['ANC', 'Spatial Audio', 'H2 Chip', 'MagSafe Case']
        },
        {
          id: 'elec-5',
          name: 'PlayStation 5 Console',
          price: 499.99,
          originalPrice: 499.99,
          rating: 4.8,
          reviews: 18923,
          image: '/api/placeholder/300/300',
          category: 'gaming',
          verified: true,
          description: 'Next-gen gaming console with 4K gaming and ray tracing',
          brand: 'Sony',
          features: ['4K Gaming', 'Ray Tracing', 'SSD Storage', 'DualSense']
        },
        {
          id: 'elec-6',
          name: 'Ring Video Doorbell Pro',
          price: 199.99,
          originalPrice: 249.99,
          rating: 4.5,
          reviews: 7834,
          image: '/api/placeholder/300/300',
          category: 'smart-home',
          verified: true,
          description: 'Smart doorbell with 1080p HD video and motion detection',
          brand: 'Ring',
          features: ['1080p HD', 'Motion Alerts', 'Two-Way Talk', 'Night Vision']
        }
      ];

      // Apply filters following Frontend Structure patterns
      let filteredProducts = mockProducts;
      
      if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
      }
      
      if (selectedBrand !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
      }

      // Apply sorting following API Endpoints Structure
      if (sortBy === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Failed to load electronics products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    console.log(`Added ${product.name} to cart`);
  };

  const categories = [
    { id: 'all', name: 'All Electronics', count: 6 },
    { id: 'smartphones', name: 'Smartphones', count: 1 },
    { id: 'laptops', name: 'Laptops & Computers', count: 1 },
    { id: 'tv-audio', name: 'TV & Audio', count: 1 },
    { id: 'gaming', name: 'Gaming', count: 1 },
    { id: 'smart-home', name: 'Smart Home', count: 1 },
    { id: 'audio', name: 'Headphones & Audio', count: 1 }
  ];

  const brands = ['all', 'Apple', 'Samsung', 'Sony', 'Ring', 'Google', 'Amazon'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section with Electronics theme - Blue gradient */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <DevicePhoneMobileIcon className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-4xl font-bold">📱 Electronics & Technology</h1>
              <p className="text-blue-100 text-lg">Latest gadgets, smartphones, laptops and smart home devices</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">🚀 Latest Tech</h3>
              <p className="text-blue-100">Cutting-edge electronics and gadgets</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">💰 Best Deals</h3>
              <p className="text-blue-100">Competitive prices on top brands</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">🛡️ Verified Products</h3>
              <p className="text-blue-100">Authentic products with warranty</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar Layout */}
      <div className="flex max-w-7xl mx-auto">
        {/* Filters Sidebar */}
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
                      ? 'bg-blue-100 text-blue-700 font-medium'
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

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Brands</h3>
            <div className="space-y-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                    selectedBrand === brand
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {brand === 'all' ? 'All Brands' : brand}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className={`flex-1 p-6 ${showAffiliateSidebar ? 'mr-80' : ''}`}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTIwTDE4MCAxNjBIMTIwTDE1MCAxMjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LXNpemU9IjE0Ij5FbGVjdHJvbmljczwvdGV4dD4KPC9zdmc+';
                      }}
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
                      <span className="text-xs text-blue-600 font-medium">{product.brand}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {product.features.length > 2 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            +{product.features.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                    
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
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
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

      {/* Affiliate Sidebar following Critical Integration Points */}
      {showAffiliateSidebar && (
        <div className="fixed right-4 top-20 w-80 h-[calc(100vh-6rem)] z-40">
          <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">💎 Electronics Deals</h3>
            
            {/* Amazon Electronics Affiliate */}
            <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Amazon Electronics</h4>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Up to 8%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Latest tech deals and exclusive offers</p>
              <button className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors">
                Shop Amazon →
              </button>
            </div>

            {/* Best Buy Affiliate */}
            <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Best Buy Tech</h4>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">4-6%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Electronics with Geek Squad support</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                Visit Best Buy →
              </button>
            </div>

            {/* Newegg Affiliate */}
            <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Newegg</h4>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">2-4%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">PC components and gaming gear</p>
              <button className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors">
                Shop Newegg →
              </button>
            </div>

            {/* Featured Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
              <h4 className="font-bold mb-2">🎯 Tech Flash Sale</h4>
              <p className="text-sm mb-3">Limited time: Extra 10% off electronics</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded font-semibold text-sm w-full">
                Claim Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
