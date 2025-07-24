'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';
import { StarIcon, ShoppingCartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const mockProducts = [
      {
        id: 'home-1',
        name: 'Smart Security Door Lock',
        price: 249.99,
        originalPrice: 349.99,
        rating: 4.9,
        reviews: 1523,
        image: '/api/placeholder/300/300',
        verified: true,
        description: 'Fingerprint and app-controlled smart lock'
      },
      {
        id: 'home-2',
        name: 'Security Window Film',
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.6,
        reviews: 678,
        image: '/api/placeholder/300/300',
        verified: true,
        description: 'Shatter-resistant security window film'
      },
      {
        id: 'home-3',
        name: 'Garden Security Motion Light',
        price: 129.99,
        originalPrice: 179.99,
        rating: 4.8,
        reviews: 934,
        image: '/api/placeholder/300/300',
        verified: true,
        description: 'Solar powered security light with motion detection'
      }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setProducts(mockProducts);
    setIsLoading(false);
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
      
      <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <span className="text-6xl mr-4">🏠</span>
            <div>
              <h1 className="text-4xl font-bold">Home & Garden Security</h1>
              <p className="text-green-100 text-lg">Secure your home and garden spaces</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                {product.verified && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <ShieldCheckIcon className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">{product.rating} ({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <ShoppingCartIcon className="w-4 h-4 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
