import Link from 'next/link';
import { HeartIcon, ShoppingBagIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img src="/whitestart-logo.svg" alt="Whitestart" className="h-8 w-auto mr-3" />
              <span className="text-2xl font-bold">Whitestart</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The future of e-commerce and social shopping. AI-powered experiences, global marketplace, and intelligent community features all in one platform.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
            </div>
          </div>
          
          {/* Shopping */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              Shopping
            </h4>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="text-gray-300 hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/products?featured=true" className="text-gray-300 hover:text-white transition-colors">Featured Items</Link></li>
              <li><Link href="/products?sale=true" className="text-gray-300 hover:text-white transition-colors">Sale Items</Link></li>
              <li><Link href="/vendors" className="text-gray-300 hover:text-white transition-colors">Our Vendors</Link></li>
              <li><Link href="/international" className="text-gray-300 hover:text-white transition-colors">International</Link></li>
            </ul>
          </div>
          
          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Community
            </h4>
            <ul className="space-y-3">
              <li><Link href="/social" className="text-gray-300 hover:text-white transition-colors">Social Feed</Link></li>
              <li><Link href="/social/pets" className="text-gray-300 hover:text-white transition-colors">Pet Community</Link></li>
              <li><Link href="/social/technology" className="text-gray-300 hover:text-white transition-colors">Tech Discussions</Link></li>
              <li><Link href="/social/health-wellness" className="text-gray-300 hover:text-white transition-colors">Health & Wellness</Link></li>
              <li><Link href="/news" className="text-gray-300 hover:text-white transition-colors">News & Updates</Link></li>
              <li><Link href="/features" className="text-gray-300 hover:text-white transition-colors">Platform Features</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <HeartIcon className="h-5 w-5 mr-2" />
              Support
            </h4>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/track-order" className="text-gray-300 hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/account" className="text-gray-300 hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Feature Highlights */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white">AI-Powered</h5>
                <p className="text-sm text-gray-400">Smart recommendations & auto-categorization</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Social Commerce</h5>
                <p className="text-sm text-gray-400">Connect, share, and discover together</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <ShoppingBagIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-white">Global Marketplace</h5>
                <p className="text-sm text-gray-400">Worldwide vendors & fast shipping</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2024 Whitestart E-Commerce. All rights reserved. Built with ❤️ for the future of shopping.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
            <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link>
            <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}