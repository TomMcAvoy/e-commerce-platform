'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiConfig, apiRequest } from '../../../lib/api'

interface VendorData {
  _id: string
  businessName: string
  businessEmail: string
  isVerified: boolean
  rating: number
  totalSales: number
  createdAt: string
}

export default function VendorDashboard() {
  const [vendor, setVendor] = useState<VendorData | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchVendorData()
  }, [])

  const fetchVendorData = async () => {
    try {
      // Get current user
      const userData = await apiRequest(apiConfig.endpoints.auth.login.replace('/login', '/me'))
      setUser(userData.data)

      if (userData.data.role !== 'vendor') {
        setError('Access denied. Vendor account required.')
        return
      }

      // Get vendor profile
      const vendorResponse = await apiRequest(`${apiConfig.endpoints.vendors}?userId=${userData.data._id}`)
      if (vendorResponse.data && vendorResponse.data.length > 0) {
        setVendor(vendorResponse.data[0])
      } else {
        setError('Vendor profile not found.')
      }
    } catch (err) {
      setError('Failed to load vendor data. Please try again.')
      console.error('Vendor data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.firstName}</p>
              </div>
              <Link
                href="/auth/logout"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Logout
              </Link>
            </div>
          </div>
          
          {/* Verification Status */}
          <div className="px-6 py-4">
            {vendor?.isVerified ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">Account Verified</h3>
                    <p className="text-sm">Your vendor account has been verified and you can start selling.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">Pending Verification</h3>
                    <p className="text-sm">Your vendor account is under review. You will be notified once verified.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                    <dd className="text-lg font-medium text-gray-900">{vendor?.totalSales || 0}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                    <dd className="text-lg font-medium text-gray-900">${vendor?.totalSales?.toFixed(2) || '0.00'}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Rating</dt>
                    <dd className="text-lg font-medium text-gray-900">{vendor?.rating?.toFixed(1) || '0.0'} / 5.0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/vendor/products"
                className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center hover:bg-blue-700 transition-colors"
              >
                Manage Products
              </Link>
              <Link
                href="/vendor/orders"
                className="bg-green-600 text-white px-4 py-3 rounded-lg text-center hover:bg-green-700 transition-colors"
              >
                View Orders
              </Link>
              <Link
                href="/vendor/profile"
                className="bg-purple-600 text-white px-4 py-3 rounded-lg text-center hover:bg-purple-700 transition-colors"
              >
                Edit Profile
              </Link>
              <Link
                href="/vendor/analytics"
                className="bg-orange-600 text-white px-4 py-3 rounded-lg text-center hover:bg-orange-700 transition-colors"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Business Information */}
        {vendor && (
          <div className="bg-white shadow rounded-lg mt-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Business Information</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{vendor.businessName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Business Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{vendor.businessEmail}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vendor.isVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vendor.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
