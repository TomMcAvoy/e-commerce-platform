'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, Star, ShoppingCart, Truck, Shield, RotateCcw, MessageCircle } from 'lucide-react'
import { useCart } from '../../../contexts/CartContext'
import { useToast } from '../../../contexts/ToastContext'

interface ProductDetailProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState('Standard')
  const [isLiked, setIsLiked] = useState(false)
  const [productId, setProductId] = useState<string>('')
  const { addToCart } = useCart()
  const { addToast } = useToast()

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setProductId(resolvedParams.id)
    }
    getParams()
  }, [params])

  // Mock product data - in real app this would come from API
  const product = {
    id: productId,
    name: "Premium Wireless Headphones",
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviewCount: 1247,
    description: "Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise cancellation, 30-hour battery life, and ultra-comfortable design.",
    images: [
      "/api/placeholder/600/600",
      "/api/placeholder/600/600",
      "/api/placeholder/600/600",
      "/api/placeholder/600/600"
    ],
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Quick charge: 10 min = 3 hours",
      "Premium build quality",
      "Universal compatibility"
    ],
    variants: ["Standard", "Premium", "Pro"],
    inStock: true,
    category: "Electronics",
    vendor: "TechVendor"
  }

  // Don't render until we have the product ID
  if (!productId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
      variant: selectedVariant
    })
    
    addToast({
      type: 'success',
      title: 'Added to Cart!',
      message: `${quantity} x ${product.name} (${selectedVariant}) added to your cart`,
      duration: 3000
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>›</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span>›</span>
          <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-blue-600">{product.category}</Link>
          <span>›</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Product Image {selectedImage + 1}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">{index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5-Math.floor(product.rating))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
                <button className="text-blue-600 hover:underline text-sm">Write a review</button>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-3xl font-bold text-green-600">${product.price}</span>
                <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>
              <p className="text-sm text-green-600">Save ${(product.originalPrice - product.price).toFixed(2)}</p>
            </div>

            {/* Variants */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Variant</h3>
              <div className="flex space-x-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedVariant === variant
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
                <span className="text-sm text-gray-600 ml-4">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
              </button>
              
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Buy Now
              </button>
            </div>

            {/* Shipping & Returns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over $35</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Warranty</p>
                  <p className="text-xs text-gray-600">1-year manufacturer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Description */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
              
              <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
                <button className="text-blue-600 hover:underline">Write a review</button>
              </div>
              
              <div className="space-y-6">
                {[
                  { name: "Sarah M.", rating: 5, time: "2 days ago", review: "Amazing sound quality! Exactly what I was looking for." },
                  { name: "Mike T.", rating: 4, time: "1 week ago", review: "Great headphones, very comfortable for long use." },
                  { name: "Lisa K.", rating: 5, time: "2 weeks ago", review: "Best purchase I've made this year. Highly recommend!" }
                ].map((review, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{review.name}</span>
                      <div className="flex text-yellow-400">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">{review.time}</span>
                    </div>
                    <p className="text-gray-700">{review.review}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Vendor Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Sold by</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">TV</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.vendor}</p>
                  <p className="text-sm text-gray-600">Verified Seller</p>
                </div>
              </div>
              <button className="w-full border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                View Store
              </button>
            </div>

            {/* Related Products */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">You might also like</h3>
              <div className="space-y-4">
                {[
                  { name: "Wireless Mouse", price: "$24.99" },
                  { name: "USB-C Cable", price: "$12.99" },
                  { name: "Phone Stand", price: "$15.99" }
                ].map((item, index) => (
                  <Link key={index} href="/products" className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-green-600">{item.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
