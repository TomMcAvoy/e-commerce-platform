'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '../contexts/CartContext'

const Header = () => {
  const { totalItems } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const accountMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="bg-gray-900 text-white">
      {/* Main Header */}
      <div className="bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center mr-4">
              <div className="bg-white text-black px-2 py-1 rounded">
                <span className="font-bold text-xl">shop</span>
                <span className="text-orange-500 font-bold">cart</span>
              </div>
            </Link>

            {/* Delivery Location */}
            <div className="hidden md:flex items-center mr-4 text-sm">
              <div className="mr-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-300">Deliver to</div>
                <div className="font-bold">United States</div>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4">
              <div className="flex">
                <select className="bg-gray-200 text-black border-2 border-orange-400 rounded-l px-2 py-2 text-sm">
                  <option>All</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home</option>
                  <option>Books</option>
                </select>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="search-amazon flex-1"
                />
                <button
                  type="submit"
                  className="search-amazon-btn"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Language Selector */}
            <div className="hidden md:flex items-center mr-4 text-sm">
              <div className="flex items-center border border-transparent hover:border-white rounded px-2 py-1 cursor-pointer">
                <span className="mr-1">🇺🇸</span>
                <span className="font-bold">EN</span>
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Account Menu */}
            <div className="relative mr-4" ref={accountMenuRef}>
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center text-sm border border-transparent hover:border-white rounded px-2 py-1"
              >
                <div className="text-left">
                  <div className="text-xs text-gray-300">Hello, Sign in</div>
                  <div className="font-bold flex items-center">
                    Account & Lists
                    <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </button>

              {isAccountMenuOpen && (
                <div className="dropdown-amazon mt-2 w-96">
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <Link href="/auth/login" className="btn-amazon-primary w-full block py-2">
                        Sign In
                      </Link>
                      <p className="text-sm text-gray-600 mt-2">
                        New customer? <Link href="/auth/register" className="text-blue-600 hover:underline">Start here.</Link>
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div>
                        <h3 className="font-bold mb-2">Your Lists</h3>
                        <ul className="space-y-1">
                          <li><Link href="/wishlist" className="text-gray-600 hover:text-orange-600">Create a List</Link></li>
                          <li><Link href="/wishlist" className="text-gray-600 hover:text-orange-600">Find a List or Registry</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Your Account</h3>
                        <ul className="space-y-1">
                          <li><Link href="/orders" className="text-gray-600 hover:text-orange-600">Your Orders</Link></li>
                          <li><Link href="/account" className="text-gray-600 hover:text-orange-600">Your Account</Link></li>
                          <li><Link href="/vendors/register" className="text-gray-600 hover:text-orange-600">Sell on ShopCart</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <Link href="/orders" className="hidden md:flex items-center text-sm border border-transparent hover:border-white rounded px-2 py-1 mr-4">
              <div className="text-left">
                <div className="text-xs text-gray-300">Returns</div>
                <div className="font-bold">& Orders</div>
              </div>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex items-center text-sm border border-transparent hover:border-white rounded px-2 py-1">
              <div className="relative mr-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h12.75M7 13v6m10-6v6" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-300">Cart</div>
                <div className="font-bold">{totalItems}</div>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden ml-2 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center h-10 text-sm">
            <button className="flex items-center mr-4 hover:border border-white rounded px-2 py-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All
            </button>
            
            <nav className="hidden md:flex space-x-6">
              <Link href="/categories" className="hover:border border-white rounded px-2 py-1">Today's Deals</Link>
              <Link href="/categories/electronics" className="hover:border border-white rounded px-2 py-1">Electronics</Link>
              <Link href="/categories/fashion" className="hover:border border-white rounded px-2 py-1">Fashion</Link>
              <Link href="/categories/home" className="hover:border border-white rounded px-2 py-1">Home & Garden</Link>
              <Link href="/categories/books" className="hover:border border-white rounded px-2 py-1">Books</Link>
              <Link href="/categories/sports" className="hover:border border-white rounded px-2 py-1">Sports</Link>
              <Link href="/vendors/register" className="hover:border border-white rounded px-2 py-1">Sell</Link>
            </nav>

            <div className="ml-auto hidden md:flex items-center text-orange-400 font-bold">
              <span>Free shipping on orders over $25</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-2 space-y-2">
            <Link href="/categories" className="block py-2 hover:text-orange-400">Today's Deals</Link>
            <Link href="/categories/electronics" className="block py-2 hover:text-orange-400">Electronics</Link>
            <Link href="/categories/fashion" className="block py-2 hover:text-orange-400">Fashion</Link>
            <Link href="/categories/home" className="block py-2 hover:text-orange-400">Home & Garden</Link>
            <Link href="/categories/books" className="block py-2 hover:text-orange-400">Books</Link>
            <Link href="/categories/sports" className="block py-2 hover:text-orange-400">Sports</Link>
            <Link href="/vendors/register" className="block py-2 hover:text-orange-400">Sell on ShopCart</Link>
            <Link href="/auth/login" className="block py-2 hover:text-orange-400">Sign In</Link>
            <Link href="/orders" className="block py-2 hover:text-orange-400">Your Orders</Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
