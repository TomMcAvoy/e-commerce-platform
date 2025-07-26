'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { AffiliateSidebar } from '../../components/affiliate/AffiliateSidebar';
import { UserIcon, StarIcon, HeartIcon, ShoppingCartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
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
  subcategory: string;
  verified: boolean;
  description: string;
  brand: string;
  features: string[];
  sizes: string[];
  colors: string[];
}

export default function MensFashionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showAffiliateSidebar, setShowAffiliateSidebar] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedBrand, selectedSize, sortBy]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Following DropshippingService.test.ts patterns for mock data structure
      const mockProducts: Product[] = [
        {
          id: 'mens-1',
          name: 'Premium Business Suit - Charcoal',
          price: 299.99,
          originalPrice: 450.00,
          rating: 4.8,
          reviews: 2341,
          image: '/api/placeholder/300/300',
          category: 'mens',
          subcategory: 'suits',
          verified: true,
          description: 'Professional tailored suit perfect for business meetings',
          brand: 'Executive Pro',
          features: ['Tailored Fit', 'Wrinkle Resistant', 'Premium Wool', 'Dry Clean'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Charcoal', 'Navy', 'Black']
        },
        {
          id: 'mens-2',
          name: 'Casual Button-Down Shirt',
          price: 49.99,
          originalPrice: 79.99,
          rating: 4.6,
          reviews: 1567,
          image: '/api/placeholder/300/300',
          category: 'mens',
          subcategory: 'shirts',
          verified: true,
          description: 'Versatile cotton shirt for work or weekend',
          brand: 'StyleCraft',
          features: ['100% Cotton', 'Easy Care', 'Classic Fit', 'Non-Iron'],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['White', 'Blue', 'Light Gray']
        },
        {
          id: 'mens-3',
          name: 'Premium Leather Dress Shoes',
          price: 179.99,
          originalPrice: 250.00,
          rating: 4.9,
          reviews: 892,
          image: '/api/placeholder/300/300',
          category: 'mens',
          subcategory: 'shoes',
          verified: true,
          description: 'Handcrafted leather oxfords for professional wear',
          brand: 'Gentleman\'s Choice',
          features: ['Genuine Leather', 'Cushioned Sole', 'Handcrafted', 'Goodyear Welt'],
          sizes: ['7', '8', '9', '10', '11', '12'],
          colors: ['Black', 'Brown', 'Cognac']
        },
        {
          id: 'mens-4',
          name: 'Slim Fit Chinos - Khaki',
          price: 69.99,
          originalPrice: 99.99,
          rating: 4.7,
          reviews: 2156,
          image: '/api/placeholder/300/300',
          category: 'mens',
          subcategory: 'pants',
          verified: true,
          description: 'Modern slim-fit chinos for contemporary style',
          brand: 'Urban Classic',
          features: ['Slim Fit', 'Stretch Fabric', 'Machine Wash', 'Versatile'],
          sizes: ['28', '30', '32', '34', '36', '38'],
          colors: ['Khaki', 'Navy', 'Black', 'Olive']
        },
        {
          id: 'mens-5',
          name: 'Casual Weekend Polo',
          price: 39.99,
          originalPrice: 59.99,
          rating: 4.5,
          reviews: 1789,
          image: '/api/placeholder/300/300',
          category: 'mens',
          subcategory: 'polos',
          verified: true,
          description: 'Comfortable polo shirt for casual occasions',
          brand: 'Comfort Wear',
          features: ['Pique Cotton', 'Regular Fit', 'Moisture Wicking', 'Fade Resistant'],
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Navy', 'White', 'Gray', 'Green']
        },
        {
          id: 'mens-6',
          name: 'Designer Watch - Classic Steel',
          price: 199.99,
          originalPrice: 299.99,
          rating: 4.8,
          reviews: 634,
          image: '/api/placeholder/300/300',
          category: 'mens',
          subcategory: 'accessories',
          verified: true,
          description: 'Elegant timepiece with precision movement',
          brand: 'TimeClassic',
          features: ['Stainless Steel', 'Water Resistant', 'Sapphire Crystal', 'Swiss Movement'],
          sizes: ['One Size'],
          colors: ['Silver', 'Gold', 'Black']
        }
      ];

      // Apply filters following Frontend Structure patterns
      let filteredProducts = mockProducts;
      
      if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.subcategory === selectedCategory);
      }
      
      if (selectedBrand !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.brand === selectedBrand);
      }

      if (selectedSize !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.sizes.includes(selectedSize));
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
      console.error('Failed to load mens fashion products:', error);
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
    { id: 'all', name: 'All Mens Fashion', count: 6 },
    { id: 'suits', name: 'Suits & Blazers', count: 1 },
    { id: 'shirts', name: 'Dress Shirts', count: 1 },
    { id: 'pants', name: 'Pants & Chinos', count: 1 },
    { id: 'shoes', name: 'Dress Shoes', count: 1 },
    { id: 'polos', name: 'Polos & Casual', count: 1 },
    { id: 'accessories', name: 'Accessories', count: 1 }
  ];

  const brands = ['all', 'Executive Pro', 'StyleCraft', 'Gentleman\'s Choice', 'Urban Classic', 'Comfort Wear', 'TimeClassic'];
  const sizes = ['all', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section with Mens Fashion theme - Professional Gray/Blue gradient */}
      <section className="bg-gradient-to-r from-slate-700 via-gray-700 to-blue-800 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <UserIcon className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-4xl font-bold">👔 Mens Fashion & Style</h1>
              <p className="text-slate-200 text-lg">Professional attire, casual wear and accessories for the modern man</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">🤵 Professional Attire</h3>
              <p className="text-slate-200">Business suits and formal wear</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">👕 Casual Comfort</h3>
              <p className="text-slate-200">Weekend and everyday essentials</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">👞 Quality Accessories</h3>
              <p className="text-slate-200">Shoes, watches and finishing touches</p>
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
                      ? 'bg-slate-100 text-slate-700 font-medium'
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
                      ? 'bg-slate-100 text-slate-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {brand === 'all' ? 'All Brands' : brand}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Sizes</h3>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2 py-1 rounded text-sm transition-colors ${
                    selectedSize === size
                      ? 'bg-slate-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size === 'all' ? 'All' : size}
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
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTIwTDE4MCAxNjBIMTIwTDE1MCAxMjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LXNpemU9IjE0Ij5NZW5zIEZhc2hpb248L3RleHQ+Cjwvc3ZnPg==';
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
                      <span className="text-xs text-slate-600 font-medium">{product.brand}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    {/* Size options */}
                    <div className="mb-3">
                      <span className="text-xs text-gray-500 mb-1 block">Available Sizes:</span>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.slice(0, 4).map((size, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 4 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            +{product.sizes.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((feature, index) => (
                          <span key={index} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
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
                        className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
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
            <h3 className="text-xl font-bold mb-4 text-gray-800">🎯 Mens Fashion Deals</h3>
            
            {/* Amazon Men's Fashion Affiliate */}
            <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Amazon Men's Fashion</h4>
                <span className="text-sm bg-slate-100 text-slate-800 px-2 py-1 rounded">Up to 10%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Professional and casual menswear</p>
              <button className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors">
                Shop Amazon →
              </button>
            </div>

            {/* Men's Wearhouse Affiliate */}
            <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Men's Wearhouse</h4>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">5-8%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Professional suits and formalwear</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                Visit Store →
              </button>
            </div>

            {/* Nordstrom Men's Affiliate */}
            <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Nordstrom Men's</h4>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">2-6%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Designer and luxury menswear</p>
              <button className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors">
                Shop Nordstrom →
              </button>
            </div>

            {/* Jos. A. Bank Affiliate */}
            <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Jos. A. Bank</h4>
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">3-7%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Business attire and accessories</p>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
                View Deals →
              </button>
            </div>

            {/* Featured Banner */}
            <div className="bg-gradient-to-r from-slate-600 to-blue-700 text-white p-4 rounded-lg">
              <h4 className="font-bold mb-2">🤵 Professional Sale</h4>
              <p className="text-sm mb-3">Limited time: 25% off business attire</p>
              <button className="bg-white text-slate-700 px-4 py-2 rounded font-semibold text-sm w-full">
                Shop Professional →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
