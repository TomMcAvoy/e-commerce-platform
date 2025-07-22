'use client'
import React, { useState } from 'react'
import { TrendingUp, Star, ExternalLink, ShoppingCart, Eye, Award, Gift, Target, DollarSign, Users } from 'lucide-react'

interface AffiliateProduct {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category: string
  commission: number
  trending?: boolean
  featured?: boolean
}

interface AffiliateRightSidebarProps {
  products?: AffiliateProduct[]
}

export default function AffiliateRightSidebar({ products = defaultProducts }: AffiliateRightSidebarProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'recommended' | 'earnings'>('trending')

  return (
    <div className="space-y-4">
      {/* Affiliate Dashboard */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Your Affiliate Stats
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="This Month"
            value="$247.50"
            icon={DollarSign}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            label="Referrals"
            value="23"
            icon={Users}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            label="Clicks"
            value="1,234"
            icon={Eye}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            label="Conversion"
            value="3.2%"
            icon={Award}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
        </div>
      </div>

      {/* Product Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <TabButton
            active={activeTab === 'trending'}
            onClick={() => setActiveTab('trending')}
            label="Trending"
            icon={TrendingUp}
          />
          <TabButton
            active={activeTab === 'recommended'}
            onClick={() => setActiveTab('recommended')}
            label="For You"
            icon={Star}
          />
          <TabButton
            active={activeTab === 'earnings'}
            onClick={() => setActiveTab('earnings')}
            label="Top Earning"
            icon={DollarSign}
          />
        </div>

        <div className="p-4">
          {activeTab === 'trending' && <TrendingProducts products={products.filter(p => p.trending)} />}
          {activeTab === 'recommended' && <RecommendedProducts products={products.filter(p => p.featured)} />}
          {activeTab === 'earnings' && <TopEarningProducts products={products.sort((a, b) => b.commission - a.commission)} />}
        </div>
      </div>

      {/* Special Offer */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-4 text-white">
        <div className="flex items-center mb-2">
          <Gift className="h-5 w-5 mr-2" />
          <h4 className="font-semibold">Limited Time Offer</h4>
        </div>
        <p className="text-sm opacity-90 mb-3">
          Get 20% bonus commission on electronics this week!
        </p>
        <button className="bg-white text-purple-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 w-full">
          Browse Electronics
        </button>
      </div>

      {/* Referral Program */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Invite Friends</h4>
        <p className="text-sm text-gray-600 mb-3">
          Earn $25 for each friend who joins and makes their first purchase
        </p>
        <div className="flex space-x-2">
          <input
            type="text"
            value="https://yoursite.com/ref/ABC123"
            readOnly
            className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded"
          />
          <button className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            Copy
          </button>
        </div>
      </div>

      {/* Ad Space */}
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <div className="text-gray-400 mb-2">
          <ExternalLink className="h-8 w-8 mx-auto" />
        </div>
        <p className="text-sm text-gray-600">Sponsored Content</p>
        <p className="text-xs text-gray-500 mt-1">Your ad could be here</p>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  bgColor 
}: {
  label: string
  value: string
  icon: any
  color: string
  bgColor: string
}) {
  return (
    <div className={`${bgColor} rounded-lg p-3`}>
      <div className="flex items-center justify-between mb-1">
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className="text-lg font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  )
}

// Tab Button Component
function TabButton({ 
  active, 
  onClick, 
  label, 
  icon: Icon 
}: {
  active: boolean
  onClick: () => void
  label: string
  icon: any
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center space-x-1 py-3 text-sm font-medium border-b-2 transition-colors ${
        active 
          ? 'border-blue-600 text-blue-600 bg-blue-50' 
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}

// Product List Components
function TrendingProducts({ products }: { products: AffiliateProduct[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-gray-900">Hot Right Now 🔥</h5>
      </div>
      {products.slice(0, 4).map((product) => (
        <ProductCard key={product.id} product={product} showTrending />
      ))}
    </div>
  )
}

function RecommendedProducts({ products }: { products: AffiliateProduct[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-gray-900">Recommended for You</h5>
      </div>
      {products.slice(0, 4).map((product) => (
        <ProductCard key={product.id} product={product} showCommission />
      ))}
    </div>
  )
}

function TopEarningProducts({ products }: { products: AffiliateProduct[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="font-medium text-gray-900">Top Earners</h5>
      </div>
      {products.slice(0, 4).map((product) => (
        <ProductCard key={product.id} product={product} showCommission />
      ))}
    </div>
  )
}

// Product Card Component
function ProductCard({ 
  product, 
  showTrending = false, 
  showCommission = false 
}: {
  product: AffiliateProduct
  showTrending?: boolean
  showCommission?: boolean
}) {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-16 h-16 object-cover rounded-lg"
        />
        {showTrending && product.trending && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🔥</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h6 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
          {product.name}
        </h6>
        
        <div className="flex items-center space-x-1 mt-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">
                -{discountPercent}%
              </span>
            )}
          </div>
          
          {showCommission && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
              ${product.commission} comm.
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">{product.category}</span>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Default products data
const defaultProducts: AffiliateProduct[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 79.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviews: 2341,
    image: "/api/placeholder/100/100",
    category: "Electronics",
    commission: 12.00,
    trending: true,
    featured: true
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 299.99,
    rating: 4.6,
    reviews: 1856,
    image: "/api/placeholder/100/100",
    category: "Fitness",
    commission: 30.00,
    trending: true
  },
  {
    id: 3,
    name: "Eco-Friendly Water Bottle",
    price: 24.99,
    originalPrice: 39.99,
    rating: 4.9,
    reviews: 892,
    image: "/api/placeholder/100/100",
    category: "Lifestyle",
    commission: 3.75,
    featured: true
  },
  {
    id: 4,
    name: "Portable Phone Charger",
    price: 34.99,
    originalPrice: 49.99,
    rating: 4.7,
    reviews: 1203,
    image: "/api/placeholder/100/100",
    category: "Electronics",
    commission: 5.25,
    trending: true
  },
  {
    id: 5,
    name: "Organic Cotton T-Shirt",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.5,
    reviews: 634,
    image: "/api/placeholder/100/100",
    category: "Fashion",
    commission: 3.75,
    featured: true
  }
]
