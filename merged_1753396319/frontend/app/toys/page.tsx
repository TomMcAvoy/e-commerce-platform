'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';

export default function ToysPage() {
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
        id: 'toys-1',
        name: 'Educational STEM Kit',
        price: 49.99,
        originalPrice: 69.99,
        rating: 4.9,
        reviews: 1523,
        image: '/api/placeholder/300/300',
        verified: true,
        description: 'Interactive learning kit for kids 8-12',
        brand: 'EduToys'
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
      
      {/* Toys Hero - Purple gradient */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🎮 Toys & Games</h1>
            <p className="text-purple-100 text-lg">Educational toys, games and entertainment</p>
          </div>
        </div>
      </section>

      <div className="flex max-w-7xl mx-auto">
        <div className="flex-1 p-6 mr-80">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold">${product.price}</span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toys Affiliate Sidebar */}
        <div className="fixed right-4 top-20 w-80 h-[calc(100vh-6rem)] z-40">
          <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">🎯 Toy Deals</h3>
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-semibold">Target Toys</h4>
              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">2-5%</span>
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded mt-2">
                Shop Target →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
