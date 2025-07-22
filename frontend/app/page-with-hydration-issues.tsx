'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Users, TrendingUp, Star, ExternalLink } from 'lucide-react'

export default function Home() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())

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
      content: "Transform your home workout routine with this compact equipment set. I've been using it for 3 months and the results speak for themselves! 💪",
      image: "/api/placeholder/600/350",
      productName: "Home Fitness Kit",
      price: "$149.99",
      originalPrice: "$199.99",
      likes: 89,
      comments: 12,
      shares: 7,
      isAffiliate: true,
      affiliateLink: "/products/fitness-kit"
    }
  ]

  const affiliateAds = [
    {
      id: 1,
      title: "Top-Rated Products This Week",
      description: "Discover the highest-rated products our community is loving",
      products: [
        { name: "Smart Watch Pro", price: "$199", rating: 4.8, image: "/api/placeholder/100/100", discount: undefined },
        { name: "Noise-Canceling Earbuds", price: "$89", rating: 4.7, image: "/api/placeholder/100/100", discount: undefined },
        { name: "Wireless Charger", price: "$29", rating: 4.6, image: "/api/placeholder/100/100", discount: undefined }
      ]
    },
    {
      id: 2,
      title: "Limited Time Deals",
      description: "Exclusive discounts ending soon",
      products: [
        { name: "Laptop Stand", price: "$45", rating: 4.5, image: "/api/placeholder/100/100", discount: "30% OFF" },
        { name: "Blue Light Glasses", price: "$25", rating: 4.4, image: "/api/placeholder/100/100", discount: "25% OFF" }
      ]
    }
  ]

  const stories = [
    { id: 1, name: "Electronics", color: "from-blue-400 to-blue-600" },
    { id: 2, name: "Fashion", color: "from-pink-400 to-purple-600" },
    { id: 3, name: "Home", color: "from-green-400 to-green-600" },
    { id: 4, name: "Tech", color: "from-orange-400 to-red-600" },
    { id: 5, name: "Fitness", color: "from-purple-400 to-indigo-600" }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - LinkedIn Style */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile Card */}
            <div className="linkedin-sidebar">
              <div className="linkedin-profile-card">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-blue-600 font-bold text-xl">
                    U
                  </div>
                  <h3 className="font-semibold">Welcome back!</h3>
                  <p className="text-blue-100 text-sm">Discover amazing deals</p>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Profile views</span>
                    <span className="text-blue-600 font-medium">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Product saves</span>
                    <span className="text-blue-600 font-medium">23</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Categories */}
            <div className="linkedin-sidebar">
              <h3 className="font-semibold mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                Trending Now
              </h3>
              <div className="space-y-2">
                {['Wireless Earbuds', 'Smart Home', 'Fitness Gear', 'Summer Fashion', 'Tech Gadgets'].map((trend, idx) => (
                  <Link key={idx} href="/products" className="block p-2 hover:bg-gray-50 rounded text-sm">
                    <div className="font-medium">{trend}</div>
                    <div className="text-gray-500 text-xs">{Math.floor(Math.random() * 1000) + 100} products</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Affiliate Ad Sidebar */}
            <div className="affiliate-ad">
              <h3 className="font-semibold mb-2">Recommended for You</h3>
              <div className="space-y-3">
                {affiliateAds[0].products.slice(0, 2).map((product, idx) => (
                  <Link key={idx} href="/products" className="flex items-center space-x-3 hover:bg-white hover:bg-opacity-50 p-2 rounded">
                    <div className="w-10 h-10 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stories Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="stories-container">
                {stories.map((story) => (
                  <div key={story.id} className={`story-item bg-gradient-to-b ${story.color}`}>
                    <span className="text-white text-xs font-medium text-center">{story.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Posts with Affiliate Products */}
            {socialPosts.map((post) => (
              <div key={post.id} className="social-post">
                <div className="social-post-header">
                  <div className="social-avatar">{post.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{post.author}</h3>
                        <p className="text-gray-500 text-xs">{post.time} ago</p>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="social-post-content">
                  <p className="text-gray-800 mb-3">{post.content}</p>
                  
                  {/* Product Image */}
                  <div className="relative mb-3">
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Product Image</span>
                    </div>
                    {post.isAffiliate && (
                      <div className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                        Sponsored
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="affiliate-product-card mb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{post.productName}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-2xl font-bold text-green-600">{post.price}</span>
                          <span className="text-sm text-gray-500 line-through">{post.originalPrice}</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className="flex text-yellow-400">
                            ★★★★★
                          </div>
                          <span className="ml-1 text-sm text-gray-600">(4.8)</span>
                        </div>
                      </div>
                      <Link href={post.affiliateLink} className="btn-amazon-orange flex items-center">
                        Shop Now
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Social Engagement */}
                <div className="social-engagement">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center space-x-1 ${likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                    >
                      <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">{post.shares}</span>
                    </button>
                  </div>
                  
                  <button className="text-gray-500 hover:text-gray-700">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar - Facebook Style Ads */}
          <div className="lg:col-span-1 space-y-4">
            {/* People You May Know */}
            <div className="linkedin-sidebar">
              <h3 className="font-semibold mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                Brands to Follow
              </h3>
              <div className="space-y-3">
                {['TechDeals Pro', 'Fashion Forward', 'Home Essentials', 'Fitness First'].map((brand, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {brand[0]}
                      </div>
                      <span className="text-sm font-medium">{brand}</span>
                    </div>
                    <button className="btn-linkedin text-xs px-3 py-1">Follow</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsored Products */}
            {affiliateAds.map((ad) => (
              <div key={ad.id} className="affiliate-ad">
                <h3 className="font-semibold mb-2">{ad.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{ad.description}</p>
                <div className="space-y-3">
                  {ad.products.map((product, idx) => (
                    <Link key={idx} href="/products" className="affiliate-product-card block">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-green-600">{product.price}</span>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                            </div>
                          </div>
                          {product.discount && (
                            <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full mt-1">
                              {product.discount}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Footer Links */}
            <div className="linkedin-sidebar">
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <Link href="/about" className="hover:text-blue-600">About</Link>
                <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
                <Link href="/terms" className="hover:text-blue-600">Terms</Link>
                <Link href="/advertising" className="hover:text-blue-600">Advertising</Link>
                <Link href="/business" className="hover:text-blue-600">Business</Link>
                <Link href="/help" className="hover:text-blue-600">Help</Link>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                © 2025 ShopCart Social Commerce
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
