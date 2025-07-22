'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  vendor: {
    _id: string
    name: string
  }
  category: {
    _id: string
    name: string
  }
  rating: number
  reviewCount: number
  inStock: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    rating: '',
    sort: 'featured'
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [filters, searchTerm])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (searchTerm) queryParams.append('search', searchTerm)
      if (filters.category) queryParams.append('category', filters.category)
      if (filters.sort) queryParams.append('sort', filters.sort)

      const response = await fetch(`http://localhost:3000/api/products?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        console.error('Failed to fetch products')
        setProducts([])
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const mockProducts: Product[] = [
    {
      _id: '1',
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 79.99,
      originalPrice: 129.99,
      image: '/api/placeholder/300/300',
      vendor: { _id: '1', name: 'TechVendor' },
      category: { _id: '1', name: 'Electronics' },
      rating: 4.5,
      reviewCount: 1247,
      inStock: true
    },
    {
      _id: '2',
      name: 'Premium Cotton T-Shirt',
      description: 'Comfortable and stylish cotton t-shirt for everyday wear',
      price: 24.99,
      originalPrice: 39.99,
      image: '/api/placeholder/300/300',
      vendor: { _id: '2', name: 'FashionCo' },
      category: { _id: '2', name: 'Fashion' },
      rating: 4.2,
      reviewCount: 856,
      inStock: true
    },
    {
      _id: '3',
      name: 'Smart Fitness Watch',
      description: 'Track your fitness goals with this advanced smartwatch',
      price: 199.99,
      originalPrice: 299.99,
      image: '/api/placeholder/300/300',
      vendor: { _id: '3', name: 'FitTech' },
      category: { _id: '3', name: 'Sports' },
      rating: 4.7,
      reviewCount: 2103,
      inStock: true
    },
    {
      id: 4,
      name: 'Minimalist Watch',
      price: 199.99,
      originalPrice: 249.99,
      image: '/api/placeholder/300/300',
      category: 'Fashion & Apparel',
      vendor: 'TimeStyle',
      rating: 4.6,
      reviews: 203,
      dropshipping: true,
      provider: 'AliExpress'
    }
  ]

  const categories = ['Fashion & Apparel', 'Electronics', 'Beauty & Makeup', 'Home & Living', 'Sports & Fitness']

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ShopCart
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/products" className="text-blue-600 font-medium">
                Products
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                Categories
              </Link>
              <Link href="/vendors" className="text-gray-600 hover:text-gray-900">
                Vendors
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative">
                <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                {product.dropshipping && (
                  <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Dropship: {product.provider}
                  </div>
                )}
                {product.originalPrice > product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Sale
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  By {product.vendor}
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors">
            Load More Products
          </button>
        </div>
      </main>
    </div>
  )
}
