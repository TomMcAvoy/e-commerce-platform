'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Users, TrendingUp, Star, ExternalLink } from 'lucide-react'

export default function Home() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  const toggleLike = (postId: number) => {
    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  const socialPosts = [
    {
      id: 1,
      author: "TechGuru Mike",
      avatar: "TG",
      time: "2h",
      content: "Just discovered this amazing wireless headphone deal! The sound quality is incredible and they're 40% off today. Perfect for remote work! 🎧",
      image: "/api/placeholder/600/300",
      productName: "Premium Wireless Headphones",
      price: "$79.99",
      originalPrice: "$129.99",
      likes: 42,
      comments: 8,
      shares: 3,
      isAffiliate: true,
      affiliateLink: "/products/wireless-headphones"
    },
    {
      id: 2,
      author: "StyleInfluencer Sarah",
      avatar: "SS",
      time: "4h",
      content: "Summer fashion finds that won't break the bank! This outfit is perfect for both work and weekend. Link in comments! ✨👗",
      image: "/api/placeholder/600/400",
      productName: "Summer Dress Collection",
      price: "$34.99",
      originalPrice: "$59.99",
      likes: 127,
      comments: 23,
      shares: 15,
      isAffiliate: true,
      affiliateLink: "/products/summer-dress"
    },
    {
      id: 3,
      author: "FitnessCoach Alex",
      avatar: "FA",
      time: "6h",
      content: "Game-changing fitness tracker! Been using this for 2 weeks and already seeing improvements in my workouts. The heart rate monitoring is spot on! 💪",
      image: "/api/placeholder/600/350",
      productName: "Smart Fitness Watch Pro",
      price: "$199.99",
      originalPrice: "$299.99",
      likes: 89,
      comments: 15,
      shares: 7,
      isAffiliate: true,
      affiliateLink: "/products/fitness-watch"
    }
  ]

  const trendingProducts = [
    { id: 1, name: "Wireless Earbuds Pro", price: "$89.99", originalPrice: "$129.99", rating: 4.8, reviews: 2341, discount: "31% off" },
    { id: 2, name: "Smart Home Hub", price: "$149.99", originalPrice: "$199.99", rating: 4.6, reviews: 1456, discount: "25% off" },
    { id: 3, name: "Portable Charger", price: "$34.99", originalPrice: "$49.99", rating: 4.7, reviews: 892, discount: "30% off" },
    { id: 4, name: "Bluetooth Speaker", price: "$59.99", originalPrice: "$89.99", rating: 4.5, reviews: 1203, discount: "33% off" }
  ]

  const affiliatePartners = [
    { name: "Amazon Associates", logo: "AMZ", earnings: "$1,247", clicks: "12.4K" },
    { name: "Best Buy Affiliate", logo: "BB", earnings: "$892", clicks: "8.9K" },
    { name: "Target Partners", logo: "TG", earnings: "$634", clicks: "6.1K" },
    { name: "Walmart Connect", logo: "WM", earnings: "$445", clicks: "4.8K" }
  ]

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">JD</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">John Doe</h3>
                <p className="text-sm text-gray-600 mb-3">Digital Creator & Affiliate</p>
                <div className="flex justify-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">2.4K</div>
                    <div className="text-gray-500">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">$3.2K</div>
                    <div className="text-gray-500">Earned</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Products */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="font-semibold text-gray-900">Trending Now</h3>
              </div>
              <div className="space-y-3">
                {trendingProducts.map((product) => (
                  <Link key={product.id} href="/products" className="block hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-green-600">{product.price}</span>
                          <span className="text-xs text-gray-500 line-through">{product.originalPrice}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400 text-xs">
                            {'★'.repeat(Math.floor(product.rating))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Affiliate Dashboard */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Affiliate Partners</h3>
              <div className="space-y-3">
                {affiliatePartners.map((partner, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{partner.logo}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{partner.name}</p>
                        <p className="text-xs text-gray-500">{partner.clicks} clicks</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{partner.earnings}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Feed */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div className="flex-1">
                  <button className="w-full text-left p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                    Share a product recommendation...
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">Add Product Link</span>
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Post
                </button>
              </div>
            </div>

            {/* Social Posts */}
            {socialPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border">
                
                {/* Post Header */}
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{post.avatar}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{post.author}</h4>
                        <p className="text-sm text-gray-500">{post.time}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 py-3">
                  <p className="text-gray-900 mb-3">{post.content}</p>
                </div>

                {/* Product Image */}
                <div className="px-4">
                  <div className="bg-gray-200 rounded-lg h-48 mb-3 flex items-center justify-center">
                    <span className="text-gray-500">Product Image</span>
                  </div>
                </div>

                {/* Product Card */}
                {post.isAffiliate && (
                  <div className="mx-4 mb-4 border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            Affiliate Link
                          </span>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-1">{post.productName}</h5>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg font-bold text-green-600">{post.price}</span>
                          <span className="text-sm text-gray-500 line-through">{post.originalPrice}</span>
                          <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                            {Math.round(((parseFloat(post.originalPrice.replace('$', '')) - parseFloat(post.price.replace('$', ''))) / parseFloat(post.originalPrice.replace('$', ''))) * 100)}% OFF
                          </span>
                        </div>
                      </div>
                      <Link href={post.affiliateLink} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Shop Now
                      </Link>
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center space-x-2 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors ${
                          likedPosts.has(post.id) ? 'text-red-600' : 'text-gray-600'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                        <span className="text-sm">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:bg-green-50 px-3 py-1 rounded-lg transition-colors">
                        <Share2 className="h-5 w-5" />
                        <span className="text-sm">{post.shares}</span>
                      </button>
                    </div>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Load More */}
            <div className="text-center py-6">
              <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                Load More Posts
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Suggested Connections */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Suggested for you</h3>
                <button className="text-sm text-blue-600 hover:underline">See all</button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "TechReviewer", handle: "@techreviewer", followers: "45K" },
                  { name: "FashionFinds", handle: "@fashionfinds", followers: "32K" },
                  { name: "HomeDecorGuru", handle: "@homedecor", followers: "28K" }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{user.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.followers} followers</p>
                      </div>
                    </div>
                    <button className="text-sm text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Top Categories</h3>
              <div className="space-y-2">
                {[
                  { name: "Electronics", count: "1.2K products" },
                  { name: "Fashion", count: "856 products" },
                  { name: "Home & Garden", count: "743 products" },
                  { name: "Health & Beauty", count: "621 products" },
                  { name: "Sports & Fitness", count: "489 products" }
                ].map((category, index) => (
                  <Link key={index} href="/categories" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-sm text-gray-900">{category.name}</span>
                    <span className="text-xs text-gray-500">{category.count}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Posts this month</span>
                  <span className="font-semibold text-gray-900">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total earnings</span>
                  <span className="font-semibold text-green-600">$3,218</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conversion rate</span>
                  <span className="font-semibold text-blue-600">4.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg. commission</span>
                  <span className="font-semibold text-purple-600">$12.45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
