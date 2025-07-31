'use client';

import Link from 'next/link';
import { 
  SparklesIcon, 
  UserGroupIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon,
  BoltIcon,
  HeartIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Platform <span className="text-blue-600">Features</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover all the innovative features that make Whitestart the most advanced e-commerce and social platform. From AI-powered shopping to intelligent social media, we've built everything you need.
          </p>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* AI-Powered Features */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">AI-Powered Intelligence</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Smart Product Recommendations</h3>
                    <p className="text-gray-600">AI analyzes your browsing and purchase history to suggest products you'll love</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Auto-Categorization</h3>
                    <p className="text-gray-600">Posts and products are automatically sorted into the most relevant categories</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Content Moderation</h3>
                    <p className="text-gray-600">AI automatically maintains community standards and improves content quality</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Personalized Experience</h3>
                    <p className="text-gray-600">Every aspect of the platform adapts to your preferences and behavior</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Commerce */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Social Commerce</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Intelligent Social Feed</h3>
                    <p className="text-gray-600">Share posts that are automatically categorized by topic and interest</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Community Categories</h3>
                    <p className="text-gray-600">Pets, technology, health, fashion - find your community automatically</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Product Integration</h3>
                    <p className="text-gray-600">Share and discover products directly within social conversations</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Smart Notifications</h3>
                    <p className="text-gray-600">Get notified when your content is moved to better categories</p>
                  </div>
                </div>
              </div>
            </div>

            {/* E-Commerce Features */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <ShoppingBagIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Advanced E-Commerce</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multi-Vendor Marketplace</h3>
                    <p className="text-gray-600">Shop from multiple vendors in one seamless experience</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dropshipping Integration</h3>
                    <p className="text-gray-600">Access global suppliers with automated order fulfillment</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-Time Inventory</h3>
                    <p className="text-gray-600">Always know what's in stock with live inventory tracking</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Advanced Search & Filters</h3>
                    <p className="text-gray-600">Find exactly what you need with powerful search capabilities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security & Trust */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <ShieldCheckIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Security & Trust</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Enterprise Security</h3>
                    <p className="text-gray-600">Bank-level encryption and security for all transactions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Verified Vendors</h3>
                    <p className="text-gray-600">All vendors are vetted and verified for quality and reliability</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure Payments</h3>
                    <p className="text-gray-600">Multiple payment options with fraud protection</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Privacy Protection</h3>
                    <p className="text-gray-600">Your data is protected with industry-leading privacy controls</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Innovative features that set us apart from traditional e-commerce platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BoltIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Optimized performance with instant loading and smooth interactions</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">User-Centered</h3>
              <p className="text-gray-600">Every feature is designed with user experience and satisfaction in mind</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">Connect with vendors and customers worldwide with localized experiences</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community First</h3>
              <p className="text-gray-600">Built around community interaction and social commerce experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-lg text-gray-600">
              Powered by the latest technologies for performance, security, and scalability
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Frontend Technologies</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Next.js 15 - React Framework</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">TypeScript - Type Safety</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Tailwind CSS - Modern Styling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Radix UI - Accessible Components</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Backend Technologies</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Node.js - Runtime Environment</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-700">Express.js - Web Framework</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">MongoDB - Database</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">OpenAI - AI Intelligence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Experience These Features Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already enjoying the future of online shopping and social commerce.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/register" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Get Started Free
            </Link>
            <Link 
              href="/social" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Explore Social Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}