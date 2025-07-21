'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { logout } from '../lib/api'

interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogout = async () => {
    setIsLoading(true)
    await logout()
    setUser(null)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">ShopCart</h1>
            </div>
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ShopCart
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-gray-900">
              Categories
            </Link>
            <Link href="/vendors" className="text-gray-600 hover:text-gray-900">
              Vendors
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              // Logged in state
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, {user.firstName}
                </span>
                
                {user.role === 'vendor' && (
                  <Link 
                    href="/vendor/dashboard" 
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Dashboard
                  </Link>
                )}
                
                {user.role === 'admin' && (
                  <Link 
                    href="/admin/dashboard" 
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Admin
                  </Link>
                )}
                
                <Link 
                  href="/profile" 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Profile
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Logged out state
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
