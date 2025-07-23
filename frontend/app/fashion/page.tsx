'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';
import { SparklesIcon, StarIcon, HeartIcon, ShoppingCartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function FashionPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAffiliateSidebar, setShowAffiliateSidebar] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const mockProducts = [
        {
          id: 'fashion-1',
          name: 'Designer Handbag - Luxury Collection',
          price: 299.99,
          originalPrice: 450.00,
          rating: 4.8,
          reviews: 2341,
          image: '/api/placeholder/300/300',
          verified: true,
          description: 'Premium leather handbag with gold hardware',
          brand: 'LuxeBrand'
        },
        {
          id: 'fashion-2',
          name: 'Casual Summer Dress',
          price: 79.99,
          originalPrice: 120.00,
          rating: 4.6,
          reviews: 1567,
          image: '/api/placeholder/300/300',
          verified: true,
          description: 'Flowing summer dress perfect for any occasion',
          brand: 'StyleCo'
        },
        {
          id: 'fashion-3',
          name: 'Premium Denim Jeans',
          price: 149.99,
          originalPrice: 200.00,
          rating: 4.7,
          reviews: 3421,
          image: '/api/placeholder/300/300',
          verified: true,
          description: 'High-quality denim with perfect fit',
          brand: 'DenimPro'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to load fashion products:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Fashion Hero - Pink gradient */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <SparklesIcon className="w-12 h-12 mr-4" />
            <div>
              <h1 className="text-4xl font-bold">👗 Fashion & Style</h1>
              <p className="text-pink-100 text-lg">Trending fashion, designer clothes and accessories</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex max-w-7xl mx-auto">
        <div className={`flex-1 p-6 ${showAffiliateSidebar ? 'mr-80' : ''}`}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
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
                <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fashion Affiliate Sidebar */}
        {showAffiliateSidebar && (
          <div className="fixed right-4 top-20 w-80 h-[calc(100vh-6rem)] z-40">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-gray-800">✨ Fashion Deals</h3>
              
              <div className="border rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800">Amazon Fashion</h4>
                <span className="text-sm bg-pink-100 text-pink-800 px-2 py-1 rounded">Up to 10%</span>
                <button className="w-full bg-pink-600 text-white py-2 px-4 rounded mt-2">
                  Shop Fashion →
                </button>
              </div>

              <div className="border rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800">Zalando</h4>
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">3-8%</span>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded mt-2">
                  Visit Zalando →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
