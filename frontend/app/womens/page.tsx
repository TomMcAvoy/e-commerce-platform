'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { AffiliateSidebar } from '../../components/affiliate/AffiliateSidebar';
import { ShieldCheckIcon, StarIcon, HeartIcon, ShoppingCartIcon, SparklesIcon } from '@heroicons/react/24/outline';
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
  sizes: string[];
  colors: string[];
}

export default function WomensFashionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showAffiliateSidebar, setShowAffiliateSidebar] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedSize, selectedColor, sortBy]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Mock women's fashion products following API Endpoints Structure
      const mockProducts: Product[] = [
        {
          id: 'womens-1',
          name: 'Professional Security Blazer - Navy',
          price: 189.99,
          originalPrice: 269.99,
          rating: 4.9,
          reviews: 342,
          image: '/api/placeholder/300/300',
          category: 'blazers',
          verified: true,
          description: 'Premium tailored blazer perfect for security executives and professional settings',
          brand: 'Whitestart Professional',
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Navy', 'Black', 'Charcoal']
        },
        {
          id: 'womens-2',
          name: 'Executive Security Dress - Black',
          price: 149.99,
          originalPrice: 199.99,
          rating: 4.8,
          reviews: 276,
          image: '/api/placeholder/300/300',
          category: 'dresses',
          verified: true,
          description: 'Elegant professional dress with concealed security features and comfort fit',
          brand: 'Whitestart Elite',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Black', 'Navy', 'Burgundy']
        },
        {
          id: 'womens-3',
          name: 'Tactical Yoga Pants with Hidden Pockets',
          price: 79.99,
          originalPrice: 109.99,
          rating: 4.7,
          reviews: 523,
          image: '/api/placeholder/300/300',
          category: 'activewear',
          verified: true,
          description: 'Performance activewear with concealed tactical pockets for security professionals',
          brand: 'SecureFit',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['Black', 'Charcoal', 'Navy']
        },
        {
          id: 'womens-4',
          name: 'Professional Security Blouse - White',
          price: 69.99,
          originalPrice: 89.99,
          rating: 4.6,
          reviews: 198,
          image: '/api/placeholder/300/300',
          category: 'blouses',
          verified: true,
          description: 'Crisp professional blouse with moisture-wicking fabric and badge attachments',
          brand: 'Whitestart Professional',
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          colors: ['White', 'Light Blue', 'Cream']
        },
        {
          id: 'womens-5',
          name: 'Designer Security Handbag with RFID Block',
          price: 229.99,
          originalPrice: 329.99,
          rating: 4.9,
          reviews: 167,
          image: '/api/placeholder/300/300',
          category: 'accessories',
          verified: true,
          description: 'Luxury handbag with built-in RFID protection and security compartments',
          brand: 'SecureLux',
          sizes: ['One Size'],
          colors: ['Black', 'Brown', 'Navy']
        },
        {
          id: 'womens-6',
          name: 'Executive High Heels with Comfort Tech',
          price: 159.99,
          originalPrice: 219.99,
          rating: 4.5,
          reviews: 289,
          image: '/api/placeholder/300/300',
          category: 'footwear',
          verified: true,
          description: 'Professional heels with all-day comfort technology for security executives',
          brand: 'ComfortSecure',
          sizes: ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'],
          colors: ['Black', 'Navy', 'Brown']
        }
      ];

      // Apply filters following Frontend Structure patterns
      let filteredProducts = mockProducts;
      
      if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
      }
      
      if (selectedSize !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.sizes.includes(selectedSize));
      }
      
      if (selectedColor !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.colors.includes(selectedColor));
      }

      // Apply sorting
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
      console.error('Failed to load women\'s fashion products:', error);
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
    { id: 'all', name: 'All Women\'s Fashion', count: 6 },
    { id: 'blazers', name: 'Professional Blazers', count: 1 },
    { id: 'dresses', name: 'Executive Dresses', count: 1 },
    { id: 'blouses', name: 'Professional Blouses', count: 1 },
    { id: 'activewear', name: 'Tactical Activewear', count: 1 },
    { id: 'accessories', name: 'Security Accessories', count: 1 },
    { id: 'footwear', name: 'Professional Footwear', count: 1 }
  ];

  const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['all', 'Black', 'Navy', 'White', 'Brown', 'Charcoal'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section following Critical Integration Points */}
      <section className="bg-gradient-to-r from-pink-600 to-rose-500 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <SparklesIcon className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-4xl font-bold">Secure Women's Fashion</h1>
              <p className="text-pink-100 text-lg">Professional & executive attire with security features</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">20K+ Premium Pieces</h3>
              <p className="text-pink-100">Security-verified fashion</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Executive Grade</h3>
              <p className="text-pink-100">Professional approved styles</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-pink-100">Encrypted transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar Layout */}
      <div className="flex max-w-7xl mx-auto">
        {/* Advanced Filters Sidebar */}
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
                      ? 'bg-pink-100 text-pink-700 font-medium'
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
            <h3 className="text-lg font-semibold mb-4">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedSize === size
                      ? 'bg-pink-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {size === 'all' ? 'All' : size}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Color</h3>
            <div className="space-y-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                    selectedColor === color
                      ? 'bg-pink-100 text-pink-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {color === 'all' ? 'All Colors' : color}
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
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTIwTDE4MCAxNjBIMTIwTDE1MCAxMjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LXNpemU9IjE0Ij5Xb21lbnMgRmFzaGlvbjwvdGV4dD4KPC9zdmc+';
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
                      <span className="text-xs text-gray-500 font-medium">{product.brand}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
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
                        {product.rating} ({product.reviews} reviews)
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
                        className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center"
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

      {/* Affiliate Sidebar */}
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
