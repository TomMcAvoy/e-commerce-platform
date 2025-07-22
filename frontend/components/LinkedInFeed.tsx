'use client'
import React, { useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ExternalLink, ShoppingCart, Eye, Smile, Camera, Video, Calendar } from 'lucide-react'

interface SocialPost {
  id: number
  author: string
  avatar: string
  title?: string
  time: string
  content: string
  likes: number
  comments: number
  shares: number
  isAffiliate: boolean
  productName?: string
  price?: number
  originalPrice?: number
  affiliateLink?: string
  image?: string
  category?: string
}

interface LinkedInFeedProps {
  posts?: SocialPost[]
}

export default function LinkedInFeed({ posts = defaultPosts }: LinkedInFeedProps) {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())

  const toggleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts)
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId)
    } else {
      newLikedPosts.add(postId)
    }
    setLikedPosts(newLikedPosts)
  }

  return (
    <div className="space-y-4">
      {/* Create Post Card */}
      <CreatePostCard />
      
      {/* Posts Feed */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isLiked={likedPosts.has(post.id)}
          onToggleLike={() => toggleLike(post.id)}
        />
      ))}
    </div>
  )
}

// Create Post Component
function CreatePostCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-medium">You</span>
        </div>
        <button className="flex-1 text-left px-4 py-3 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 border border-gray-200">
          Share a product recommendation...
        </button>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <PostAction icon={Camera} label="Photo" color="text-blue-600" />
        <PostAction icon={Video} label="Video" color="text-green-600" />
        <PostAction icon={Calendar} label="Event" color="text-orange-600" />
        <PostAction icon={ShoppingCart} label="Product" color="text-purple-600" />
      </div>
    </div>
  )
}

// Post Action Button
function PostAction({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <button className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer">
      <Icon className={`h-5 w-5 ${color}`} />
      <span className="text-sm text-gray-600">{label}</span>
    </button>
  )
}

// Post Card Component
function PostCard({ post, isLiked, onToggleLike }: {
  post: SocialPost
  isLiked: boolean
  onToggleLike: () => void
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Post Header */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">{post.avatar}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{post.author}</h3>
              {post.title && <p className="text-sm text-gray-600">{post.title}</p>}
              <p className="text-xs text-gray-500">{post.time} • 🌐</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-50 rounded-full">
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 py-3">
        <p className="text-gray-800 text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* Product Card (if affiliate post) */}
      {post.isAffiliate && post.productName && (
        <div className="mx-4 mb-3">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {post.image && (
              <div className="aspect-w-16 aspect-h-9">
                <img src={post.image} alt={post.productName} className="w-full h-48 object-cover" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{post.productName}</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-bold text-green-600">${post.price}</span>
                    {post.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${post.originalPrice}</span>
                    )}
                    {post.originalPrice && post.price && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        {Math.round(((post.originalPrice - post.price) / post.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <span className="inline-block text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {post.category}
                  </span>
                </div>
                <button className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Image (if not affiliate) */}
      {!post.isAffiliate && post.image && (
        <div className="mx-4 mb-3">
          <img src={post.image} alt="Post content" className="w-full rounded-lg" />
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <div className="flex -space-x-1">
                <div className="w-4 h-4 bg-blue-500 rounded-full border border-white flex items-center justify-center">
                  <Heart className="h-2 w-2 text-white fill-current" />
                </div>
                <div className="w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center">
                  <span className="text-white text-xs">👍</span>
                </div>
              </div>
              <span>{post.likes}</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{post.comments} comments</span>
            <span>{post.shares} shares</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <ActionButton
            icon={Heart}
            label="Like"
            active={isLiked}
            onClick={onToggleLike}
            activeColor="text-red-500"
          />
          <ActionButton icon={MessageCircle} label="Comment" />
          <ActionButton icon={Share2} label="Share" />
          <ActionButton icon={Bookmark} label="Save" />
        </div>
      </div>

      {/* Comment Input */}
      <div className="px-4 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-xs">You</span>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full px-3 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Smile className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Action Button Component
function ActionButton({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick, 
  activeColor = "text-blue-600" 
}: { 
  icon: any
  label: string
  active?: boolean
  onClick?: () => void
  activeColor?: string 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer ${
        active ? activeColor : 'text-gray-600'
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? 'fill-current' : ''}`} />
      <span className="text-sm">{label}</span>
    </button>
  )
}

// Default posts data
const defaultPosts: SocialPost[] = [
  {
    id: 1,
    author: "Sarah Chen",
    avatar: "SC",
    title: "Product Marketing Manager at TechCorp",
    time: "2h",
    content: "Just discovered these amazing wireless headphones! The sound quality is incredible and they're perfect for my daily workouts. The noise cancellation feature is a game-changer for focusing during work. Highly recommend! 🎧💪 #ProductReview #TechLife",
    likes: 47,
    comments: 12,
    shares: 5,
    isAffiliate: true,
    productName: "Premium Wireless Headphones",
    price: 79.99,
    originalPrice: 129.99,
    affiliateLink: "/products/1",
    image: "/api/placeholder/600/400",
    category: "Electronics"
  },
  {
    id: 2,
    author: "Mike Rodriguez",
    avatar: "MR",
    title: "Sustainability Consultant",
    time: "4h",
    content: "This organic cotton t-shirt is so comfortable! Perfect for casual days and the quality is outstanding. Plus it's sustainable and ethically made. Supporting brands that care about our planet! 🌱👕 #SustainableFashion #EthicalBrands",
    likes: 32,
    comments: 8,
    shares: 3,
    isAffiliate: true,
    productName: "Organic Cotton Essential Tee",
    price: 24.99,
    originalPrice: 34.99,
    affiliateLink: "/products/2",
    image: "/api/placeholder/600/400",
    category: "Fashion"
  },
  {
    id: 3,
    author: "Jennifer Park",
    avatar: "JP",
    title: "Fitness Coach & Wellness Expert",
    time: "6h",
    content: "Excited to share my thoughts on building authentic connections in the digital age. It's not just about the number of followers, but the genuine relationships we create. Quality over quantity always wins! 💪✨ #NetworkingTips #DigitalWellness",
    likes: 89,
    comments: 23,
    shares: 12,
    isAffiliate: false,
    image: "/api/placeholder/600/400"
  }
]
