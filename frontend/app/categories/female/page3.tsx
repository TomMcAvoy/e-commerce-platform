'use client'

import { useState } from 'react'
import { useCart } from '../../../contexts/CartContext'

export default function FemalePage3() {
  const [searchTerm, setSearchTerm] = useState('')
  const { addToCart } = useCart()

  const mockProducts = [
    {
      id: 'f1',
      name: 'Summer Floral Dress',
      price: 29.99,
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 2847
    },
    {
      id: 'f2',
      name: 'Designer Crossbody Bag',
      price: 49.99,
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 1642
    },
    {
      id: 'f3',
      name: 'Gold Layered Necklace Set',
      price: 24.99,
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 923
    }
  ]

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: 'female'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Women's Fashion</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the latest trends in women's fashion. From elegant dresses to stunning accessories.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Handpicked selection of the most popular women's fashion items
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
                    <span className="text-2xl font-bold text-pink-600">${product.price}</span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
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
