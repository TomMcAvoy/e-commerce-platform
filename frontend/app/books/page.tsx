'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';

export default function BooksPage() {
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
        id: 'books-1',
        name: 'The Science of Security',
        price: 24.99,
        originalPrice: 34.99,
        rating: 4.8,
        reviews: 892,
        image: '/api/placeholder/300/300',
        verified: true,
        description: 'Comprehensive guide to modern security practices',
        brand: 'TechBooks'
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
      
      {/* Books Hero - Brown/Orange gradient */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">📚 Books & Media</h1>
            <p className="text-amber-100 text-lg">Books, audiobooks, movies and digital media</p>
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
                    className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Books Affiliate Sidebar */}
        <div className="fixed right-4 top-20 w-80 h-[calc(100vh-6rem)] z-40">
          <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">📖 Book Deals</h3>
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-semibold">Amazon Books</h4>
              <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">4-8%</span>
              <button className="w-full bg-orange-600 text-white py-2 px-4 rounded mt-2">
                Shop Books →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
