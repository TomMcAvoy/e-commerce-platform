'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Users, TrendingUp, Star, ExternalLink, ShoppingCart, User } from 'lucide-react'
import { useIsClient } from '../lib/hooks'
import { useCart } from '../contexts/CartContext'
import { useToast } from '../contexts/ToastContext'

export default function Home() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const isClient = useIsClient()
  const { addToCart } = useCart()
  const { addToast } = useToast()

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
      price: 79.99,
      originalPrice: 129.99,
      likes: 42,
      comments: 8,
      shares: 3,
      isAffiliate: true,
      affiliateLink: "/products/wireless-headphones",
      category: "Electronics"
    },
    {
      id: 2,
      author: "StyleInfluencer Sarah",
      avatar: "SS",
      time: "4h",
      content: "Summer fashion finds that won't break the bank! This outfit is perfect for both work and weekend. Link in comments! ✨👗",
      image: "/api/placeholder/600/400",
      productName: "Summer Dress Collection",
      price: 34.99,
      originalPrice: 59.99,
      likes: 127,
      comments: 23,
      shares: 15,
      isAffiliate: true,
      affiliateLink: "/products/summer-dress",
      category: "Fashion"
    },
    {
      id: 3,
      author: "FitnessCoach Alex",
      avatar: "FA",
      time: "6h",
      content: "Game-changing fitness tracker! Been using this for 2 weeks and already seeing improvements in my workouts. The heart rate monitoring is spot on! 💪",
      image: "/api/placeholder/600/350",
      productName: "Smart Fitness Watch Pro",
      price: 199.99,
      originalPrice: 299.99,
      likes: 89,
      comments: 15,
      shares: 7,
      isAffiliate: true,
      affiliateLink: "/products/fitness-watch",
      category: "Sports & Fitness"
    }
  ]

  const handleAddToCart = (post: typeof socialPosts[0]) => {
    addToCart({
      id: `social-${post.id}`,
      name: post.productName,
      price: post.price,
      image: post.image,
      category: post.category
    })
    
    addToast({
      type: 'success',
      title: 'Added to Cart!',
      message: `${post.productName} has been added to your cart`,
      duration: 3000
    })
  }

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
    <div className="min-h-screen bg-gray-100">
      {/* LinkedIn-style container with max width and proper spacing */}
      <div className="max-w-screen-xl mx-auto">
        <div className="flex gap-6 px-6 py-6">
          
          {/* Left Sidebar - Fixed width like LinkedIn */}
          <div className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-20 space-y-2">
              
              {/* Profile Card */}
              <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                {/* Cover Photo */}
                <div className="h-16 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                
                {/* Profile Content */}
                <div className="px-3 pb-3 -mt-6 text-center">
                  <div className="w-16 h-16 bg-white rounded-full border-4 border-white mx-auto mb-2">
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">John Doe</h3>
                  <p className="text-xs text-gray-600 mb-3 px-2">Social Commerce Enthusiast & Product Curator</p>
                  
                  {/* Stats */}
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Profile viewers</span>
                      <span className="text-blue-600 font-medium">23</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Post impressions</span>
                      <span className="text-blue-600 font-medium">1,247</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-gray-300 p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">You viewed 5 products today</p>
                  <p className="text-xs text-gray-600">2 new followers this week</p>
                  <p className="text-xs text-gray-600">Your post got 47 likes</p>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg border border-gray-300 p-3">
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Shop Categories</h4>
                <div className="space-y-2">
                  {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'].map((category) => (
                    <Link 
                      key={category}
                      href={`/categories/${category.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                      className="block text-xs text-gray-600 hover:text-blue-600 hover:underline transition-colors"
                    >
                      # {category}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed - Flexible center column */}
          <div className="flex-1 min-w-0 max-w-xl">
            <div className="space-y-2">
              
              {/* Post Composer */}
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <div className="flex space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 border transition-colors">
                      Share a product you love...
                    </button>
                  </div>
                </div>
                
                {/* Post Actions */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium">
                    <ExternalLink className="h-4 w-4" />
                    <span>Product</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors text-sm font-medium">
                    <MessageCircle className="h-4 w-4" />
                    <span>Review</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors text-sm font-medium">
                    <Star className="h-4 w-4" />
                    <span>Recommend</span>
                  </button>
                </div>
              </div>

              {/* Social Posts Feed */}
              {socialPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg border border-gray-300">
                  
                  {/* Post Header */}
                  <div className="px-4 pt-4 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{post.avatar}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{post.author}</h4>
                          <p className="text-xs text-gray-500">{post.time} • 🌍</p>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <MoreHorizontal className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                    
                    {/* Post Content */}
                    <div className="mt-3">
                      <p className="text-sm text-gray-900 leading-relaxed">{post.content}</p>
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="px-0">
                    <div className="bg-gray-200 h-64 flex items-center justify-center">
                      <span className="text-gray-500">Product Image</span>
                    </div>
                  </div>

                  {/* Product Card */}
                  {post.isAffiliate && (
                    <div className="mx-4 mt-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                              🛍️ Product
                            </span>
                          </div>
                          <h5 className="font-semibold text-gray-900 mb-1 text-sm">{post.productName}</h5>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-base font-bold text-green-600">${post.price}</span>
                            <span className="text-sm text-gray-500 line-through">${post.originalPrice}</span>
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              {Math.round(((post.originalPrice - post.price) / post.originalPrice) * 100)}% OFF
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 flex flex-col space-y-2">
                          <Link href={post.affiliateLink} className="px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium text-center hover:bg-blue-700 transition-colors">
                            View Product
                          </Link>
                          <button 
                            onClick={() => handleAddToCart(post)}
                            className="px-3 py-2 bg-orange-500 text-white rounded text-xs font-medium flex items-center justify-center space-x-1 hover:bg-orange-600 transition-colors"
                          >
                            <ShoppingCart className="h-3 w-3" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Post Engagement */}
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)} likes</span>
                      <span>{post.comments} comments • {post.shares} shares</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm font-medium ${
                          likedPosts.has(post.id) ? 'text-blue-600' : 'text-gray-600'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                        <span>Like</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600">
                        <MessageCircle className="h-4 w-4" />
                        <span>Comment</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 rounded hover:bg-gray-100 transition-colors text-sm font-medium text-gray-600">
                        <Bookmark className="h-4 w-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More */}
              <div className="text-center py-4">
                <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                  Show more posts
                </button>
              </div>
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
                          <span className="text-lg font-bold text-green-600">${post.price}</span>
                          <span className="text-sm text-gray-500 line-through">${post.originalPrice}</span>
                          <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                            {Math.round(((post.originalPrice - post.price) / post.originalPrice) * 100)}% OFF
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col space-y-2">
                        <Link href={post.affiliateLink} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center">
                          Shop Now
                        </Link>
                        <button 
                          onClick={() => handleAddToCart(post)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
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

          {/* Right Sidebar - Fixed width like LinkedIn */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-20 space-y-2">
              
              {/* Trending Products */}
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-base">Trending Products</h3>
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                </div>
                <div className="space-y-3">
                  {trendingProducts.slice(0, 4).map((product) => (
                    <Link key={product.id} href="/products" className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
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
                    </Link>
                  ))}
                </div>
              </div>

              {/* People to Follow */}
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 text-base">People to follow</h3>
                  <button className="text-xs text-blue-600 hover:underline">View all</button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "TechReviewer Pro", handle: "@techreviewer", followers: "45.2K", mutual: "12 mutual connections" },
                    { name: "Fashion Finds", handle: "@fashionfinds", followers: "32.8K", mutual: "8 mutual connections" },
                    { name: "Home Decor Guru", handle: "@homedecor", followers: "28.1K", mutual: "5 mutual connections" }
                  ].map((user, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{user.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.followers} followers</p>
                        <p className="text-xs text-gray-400">{user.mutual}</p>
                        <button className="mt-2 px-4 py-1 border border-blue-600 text-blue-600 rounded-full text-xs font-medium hover:bg-blue-50 transition-colors">
                          + Follow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Performance */}
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <h3 className="font-semibold text-gray-900 text-base mb-4">Your Performance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile views</span>
                    <span className="font-semibold text-gray-900">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Post impressions</span>
                    <span className="font-semibold text-gray-900">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Affiliate earnings</span>
                    <span className="font-semibold text-green-600">$3,218</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conversion rate</span>
                    <span className="font-semibold text-blue-600">4.7%</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-300 p-4">
                <h3 className="font-semibold text-gray-900 text-base mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/affiliate/dashboard" className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                    📊 View Analytics
                  </Link>
                  <Link href="/products" className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                    🛍️ Browse Products
                  </Link>
                  <Link href="/vendors/register" className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors">
                    🏪 Become a Vendor
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
