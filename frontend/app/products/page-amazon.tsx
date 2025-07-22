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
      _id: '4',
      name: 'Home Aromatherapy Diffuser',
      description: 'Create a relaxing atmosphere with essential oils',
      price: 34.99,
      originalPrice: 49.99,
      image: '/api/placeholder/300/300',
      vendor: { _id: '4', name: 'HomeEssentials' },
      category: { _id: '4', name: 'Home' },
      rating: 4.4,
      reviewCount: 623,
      inStock: true
    },
    {
      _id: '5',
      name: 'Professional Yoga Mat',
      description: 'Non-slip yoga mat for comfortable practice',
      price: 49.99,
      originalPrice: 69.99,
      image: '/api/placeholder/300/300',
      vendor: { _id: '5', name: 'YogaLife' },
      category: { _id: '5', name: 'Sports' },
      rating: 4.6,
      reviewCount: 941,
      inStock: true
    },
    {
      _id: '6',
      name: 'Organic Skincare Set',
      description: 'Complete skincare routine with natural ingredients',
      price: 89.99,
      originalPrice: 119.99,
      image: '/api/placeholder/300/300',
      vendor: { _id: '6', name: 'NaturalBeauty' },
      category: { _id: '6', name: 'Beauty' },
      rating: 4.3,
      reviewCount: 512,
      inStock: false
    }
  ]

  const displayProducts = products.length > 0 ? products : mockProducts

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-orange-600">Home</Link>
          <span className="mx-2">›</span>
          <span>All Products</span>
        </nav>

        {/* Search Bar */}
        <div className="card-amazon p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-amazon w-full"
              />
            </div>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({...filters, sort: e.target.value})}
              className="input-amazon"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-amazon p-6 sticky top-4">
              <h3 className="font-bold text-lg mb-4">Filters</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm">Under $25</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm">$25 to $50</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm">$50 to $100</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="mr-2" />
                    <span className="text-sm">Over $100</span>
                  </label>
                </div>
              </div>

              {/* Customer Rating */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Customer Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input type="radio" name="rating" className="mr-2" />
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 text-sm">
                          {'★'.repeat(rating)}{'☆'.repeat(5-rating)}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Category</h4>
                <div className="space-y-2">
                  {['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'].map((category) => (
                    <label key={category} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Brand</h4>
                <div className="space-y-2">
                  {['TechVendor', 'FashionCo', 'FitTech', 'HomeEssentials'].map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="card-amazon p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Results ({displayProducts.length} products)
                </h2>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="card-amazon p-4 animate-pulse">
                      <div className="w-full h-48 bg-gray-300 rounded mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProducts.map((product) => (
                    <Link key={product._id} href={`/products/${product._id}`} className="group">
                      <div className="card-amazon p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
                        <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                          <span className="text-gray-500">Product Image</span>
                        </div>
                        
                        <h3 className="font-medium text-lg mb-2 line-clamp-2 group-hover:text-orange-600">
                          {product.name}
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        <div className="rating-amazon mb-3">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5-Math.floor(product.rating))}
                            </div>
                            <span className="ml-1 text-blue-600 text-sm">({product.reviewCount.toLocaleString()})</span>
                          </div>
                        </div>
                        
                        <div className="mt-auto">
                          <div className="flex items-center mb-2">
                            <span className="price-amazon text-xl">${product.price}</span>
                            {product.originalPrice && (
                              <span className="price-original-amazon ml-2">${product.originalPrice}</span>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2">
                            Sold by <span className="text-blue-600">{product.vendor.name}</span>
                          </p>
                          
                          {product.inStock ? (
                            <div className="flex items-center text-green-600 text-sm">
                              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                              In Stock
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600 text-sm">
                              <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                              Out of Stock
                            </div>
                          )}
                          
                          <p className="text-xs text-gray-600 mt-1">FREE delivery</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
