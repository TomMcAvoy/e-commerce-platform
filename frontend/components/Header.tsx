'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Search, ShoppingBag, Bell, MessageCircle, Users, Home, Briefcase, User, Settings, LogOut } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useIsClient } from '../lib/hooks'

export default function SocialHeader() {
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const isClient = useIsClient()
  const { totalItems, setIsOpen } = useCart()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <span className="hidden md:block text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WhiteStartups
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products, brands, and people..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            
            {/* Home */}
            <Link href="/" className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <Home className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
              <span className="text-xs text-gray-600 group-hover:text-blue-600 mt-1 hidden md:block">Home</span>
            </Link>

            {/* Network */}
            <Link href="/network" className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <Users className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
              <span className="text-xs text-gray-600 group-hover:text-blue-600 mt-1 hidden md:block">Network</span>
            </Link>

            {/* Business */}
            <Link href="/business" className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <Briefcase className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
              <span className="text-xs text-gray-600 group-hover:text-blue-600 mt-1 hidden md:block">Business</span>
            </Link>

            {/* LinkedIn Style */}
            <Link href="/linkedin" className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <div className="w-6 h-6 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                in
              </div>
              <span className="text-xs text-gray-600 group-hover:text-blue-600 mt-1 hidden md:block">LinkedIn</span>
            </Link>

            {/* Messages */}
            <Link href="/messages" className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors group relative">
              <MessageCircle className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
              <span className="text-xs text-gray-600 group-hover:text-blue-600 mt-1 hidden md:block">Messages</span>
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </div>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors group relative"
              >
                <Bell className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
                <span className="text-xs text-gray-600 group-hover:text-blue-600 mt-1 hidden md:block">Notifications</span>
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  5
                </div>
              </button>

              {/* Notifications Dropdown */}
              {isClient && showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {[
                      { title: "New deal on Wireless Headphones", time: "2m ago", unread: true },
                      { title: "Sarah liked your product post", time: "1h ago", unread: true },
                      { title: "Flash sale ending soon!", time: "3h ago", unread: false },
                      { title: "Your order has shipped", time: "1d ago", unread: false }
                    ].map((notification, idx) => (
                      <div key={idx} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${notification.unread ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                          <div>
                            <p className="text-sm text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg transition-colors group relative"
            >
              <ShoppingBag className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
              <span className="text-xs text-gray-600 group-hover:text-blue-600 mt-1 hidden md:block">Cart</span>
              {isClient && totalItems > 0 && (
                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </div>
              )}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  U
                </div>
                <span className="hidden md:block text-sm text-gray-700">Me</span>
              </button>

              {/* Account Dropdown */}
              {isClient && showAccountMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        U
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">John Doe</h3>
                        <p className="text-sm text-gray-500">Social Shopper</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4 mr-3" />
                      View Profile
                    </Link>
                    <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings & Privacy
                    </Link>
                    <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <ShoppingBag className="h-4 w-4 mr-3" />
                      My Orders
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link href="/vendor/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Briefcase className="h-4 w-4 mr-3" />
                      Vendor Dashboard
                    </Link>
                    <Link href="/auth/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 py-2 overflow-x-auto">
            {[
              'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty', 'Automotive', 'Books', 'Health'
            ].map((category) => (
              <Link
                key={category}
                href={`/categories/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="whitespace-nowrap text-sm text-gray-600 hover:text-blue-600 py-1 px-2 rounded hover:bg-white transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for dropdowns */}
      {(showAccountMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowAccountMenu(false)
            setShowNotifications(false)
          }}
        />
      )}
    </header>
  )
}
