'use client';

import Link from 'next/link';
import { ShoppingBagIcon, HeartIcon, GlobeAltIcon, ShieldCheckIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">Whitestart</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your modern e-commerce destination where innovation meets style. We're building the future of online shopping with AI-powered features, social commerce, and an amazing user experience.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/products" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Start Shopping
            </Link>
            <Link 
              href="/social" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Special
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're not just another online store. We're a complete ecosystem that combines shopping, social interaction, and cutting-edge technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg mb-4">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Experience</h3>
              <p className="text-gray-600">
                Smart product recommendations, automated content moderation, and personalized shopping experiences powered by artificial intelligence.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-lg mb-4">
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Social Commerce</h3>
              <p className="text-gray-600">
                Share posts, discover trends, and connect with fellow shoppers in our intelligent social media platform with auto-categorization.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-lg mb-4">
                <GlobeAltIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Marketplace</h3>
              <p className="text-gray-600">
                Access products from vendors worldwide with integrated dropshipping, multi-currency support, and international shipping.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-lg mb-4">
                <HeartIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Collections</h3>
              <p className="text-gray-600">
                Discover handpicked products across fashion, electronics, home goods, beauty, and lifestyle categories.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-600 text-white rounded-lg mb-4">
                <ShieldCheckIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Enterprise-grade security, encrypted payments, and reliable order fulfillment you can trust.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-lg transition-shadow duration-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-lg mb-4">
                <ShoppingBagIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Shopping</h3>
              <p className="text-gray-600">
                Intuitive interface, advanced filters, real-time inventory, and seamless checkout experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
          </div>

          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-lg leading-relaxed mb-6">
              <strong className="text-gray-900">Whitestart</strong> was born from a simple idea: online shopping should be more than just buying products. It should be an experience that connects people, discovers trends, and makes every purchase feel special.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              We noticed that traditional e-commerce platforms were missing something essential – the social aspect of shopping that makes it fun and engaging. So we set out to build a platform that combines the best of online retail with social media, powered by intelligent technology.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Today, our platform features advanced AI that automatically categorizes content, moderates discussions, and personalizes your experience. Whether you're sharing a post about your new pet, discussing the latest tech gadgets, or discovering fashion trends, our smart system ensures everything finds its perfect place.
            </p>

            <p className="text-lg leading-relaxed">
              We're not just building an e-commerce site – we're creating a community where shopping, social interaction, and technology come together to create something truly special.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Highlights
            </h2>
            <p className="text-lg text-gray-600">
              Discover what makes our platform unique
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🤖 Intelligent Social Media</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-700"><strong>Auto-Categorization:</strong> Posts about pets automatically go to the pets section, tech content to technology, etc.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-700"><strong>Content Moderation:</strong> AI automatically rewrites inappropriate content to maintain community standards.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-700"><strong>Smart Notifications:</strong> Get notified when your posts are moved to better categories or content is improved.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">🛍️ Advanced E-Commerce</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-700"><strong>Multi-Vendor Marketplace:</strong> Shop from multiple vendors in one seamless experience.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-700"><strong>Dropshipping Integration:</strong> Access products from global suppliers with automated fulfillment.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-700"><strong>Real-Time Inventory:</strong> Always know what's in stock with live inventory tracking.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories We Cover */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You'll Find Here
            </h2>
            <p className="text-lg text-gray-600">
              From everyday essentials to unique finds
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Fashion & Beauty', icon: '👗', desc: 'Latest trends and timeless styles' },
              { name: 'Electronics & Tech', icon: '📱', desc: 'Cutting-edge gadgets and devices' },
              { name: 'Home & Garden', icon: '🏠', desc: 'Transform your living space' },
              { name: 'Health & Wellness', icon: '💊', desc: 'Products for a healthier lifestyle' },
              { name: 'Sports & Fitness', icon: '⚽', desc: 'Gear for active lifestyles' },
              { name: 'Books & Education', icon: '📚', desc: 'Learn and discover new things' },
              { name: 'Toys & Games', icon: '🎮', desc: 'Fun for all ages' },
              { name: 'Food & Beverages', icon: '🍕', desc: 'Gourmet and everyday treats' }
            ].map((category, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience the Future of Shopping?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community and discover why thousands of users love shopping with us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/register" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Create Account
            </Link>
            <Link 
              href="/products" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}