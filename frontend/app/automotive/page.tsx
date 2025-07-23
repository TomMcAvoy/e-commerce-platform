'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';

export default function AutomotivePage() {
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
        id: 'auto-1',
        name: 'Premium Car Dash Cam',
        price: 129.99,
        originalPrice: 179.99,
        rating: 4.7,
        reviews: 1834,
        image: '/api/placeholder/300/300',
        verified: true,
        description: '4K dash cam with night vision and GPS tracking',
        brand: 'AutoTech'
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
      
      {/* Automotive Hero - Blue gradient */}
      <section className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">�� Automotive & Parts</h1>
            <p className="text-blue-100 text-lg">Car accessories, parts and maintenance products</p>
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
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Automotive Affiliate Sidebar */}
        <div className="fixed right-4 top-20 w-80 h-[calc(100vh-6rem)] z-40">
          <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">🔧 Auto Deals</h3>
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-semibold">AutoZone</h4>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">3-5%</span>
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded mt-2">
                Shop AutoZone →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
