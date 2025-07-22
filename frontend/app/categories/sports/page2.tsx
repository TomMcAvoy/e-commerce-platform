'use client'

import { useState } from 'react'
import { useCart } from '../../../contexts/CartContext'

export default function SportsPage2() {
  const [searchTerm, setSearchTerm] = useState('')
  const { addToCart } = useCart()

  const mockProducts = [
    {
      id: 's1',
      name: 'Professional Basketball',
      price: 29.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 1876
    },
    {
      id: 's2',
      name: 'Yoga Mat Premium',
      price: 39.99,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 2341
    },
    {
      id: 's3',
      name: 'Running Shoes Elite',
      price: 119.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 3654
    }
  ]

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: 'sports'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Sports & Fitness</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Everything you need to stay active and reach your fitness goals.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Top sports and fitness equipment for athletes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-gray-600">
                      {product.rating} ⭐ ({product.reviews.toLocaleString()} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-green-600">${product.price}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
