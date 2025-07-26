'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';
import { StarIcon, ShoppingCartIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function FashionPage() {
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
        id: 'fashion-1',
        name: 'Unisex Security Jacket',
        price: 199.99,
        originalPrice: 279.99,
        rating: 4.8,
        reviews: 892,
        image: '/api/placeholder/300/300',
        verified: true,
        description: 'Professional security jacket with concealed pockets'
      },
      {
        id: 'fashion-2',
        name: 'Tactical Cargo Pants',
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.7,
        reviews: 1156,
        image: '/api/placeholder/300/300',
        verified: true,
        description: 'Durable cargo pants with multiple utility pockets'
      },
      {
        id: 'fashion-3',
        name: 'Professional Belt with Hidden Compartment',
        price: 59.99,
        originalPrice: 89.99,
        rating: 4.9,
        reviews: 743,
        image: '/api/placeholder/300/300',
        verified: true,
        description: 'Leather belt with concealed security features'
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
      
      <section className="bg-gradient-to-r from-pink-600 to-rose-500 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <span className="text-6xl mr-4">👔</span>
            <div>
              <h1 className="text-4xl font-bold">Fashion & Apparel</h1>
              <p className="text-pink-100 text-lg">Professional and tactical fashion for all</p>
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
                  className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center"
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
