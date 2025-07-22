'use client'

import Link from 'next/link'
import { useState } from 'react'
import { apiConfig, apiRequest } from '../../../lib/api'

export default function VendorRegisterPage() {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Business Information
    businessName: '',
    businessType: '',
    businessDescription: '',
    businessAddress: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    taxId: '',
    
    // Dropshipping
    dropshippingInterest: false,
    preferredProviders: [] as string[],
    
    // Terms
    acceptTerms: false,
    acceptPrivacy: false
  })

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'LLC',
    'Corporation',
    'Other'
  ]

  const dropshippingProviders = [
    'Printful',
    'Spocket',
    'AliExpress',
    'Modalyst',
    'DHgate',
    'SaleHoo'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      alert('Please accept the terms and privacy policy')
      return
    }

    try {
      // Use the new vendor registration endpoint
      const response = await apiRequest(`${apiConfig.endpoints.vendors}/register`, {
        method: 'POST',
        body: JSON.stringify({
          // Personal Information
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          
          // Business Information
          businessName: formData.businessName,
          businessType: formData.businessType,
          businessDescription: formData.businessDescription,
          businessAddress: formData.businessAddress,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          taxId: formData.taxId
        }),
      })

      alert('Vendor application submitted successfully! You will be notified once your application is reviewed.')
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('Vendor registration error:', error)
      alert(error instanceof Error ? error.message : 'An error occurred during registration. Please try again.')
    }
  }

  const handleProviderChange = (provider: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        preferredProviders: [...formData.preferredProviders, provider]
      })
    } else {
      setFormData({
        ...formData,
        preferredProviders: formData.preferredProviders.filter(p => p !== provider)
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold text-blue-600">ShopCart</h1>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Become a Vendor
          </h2>
          <p className="mt-2 text-gray-600">
            Join our marketplace and start selling your products worldwide
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8 p-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Business Name *
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    required
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Business Type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
                    Tax ID / EIN
                  </label>
                  <input
                    id="taxId"
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700">
                    Business Description *
                  </label>
                  <textarea
                    id="businessDescription"
                    rows={3}
                    required
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what your business sells and your target market..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700">
                    Business Address *
                  </label>
                  <input
                    id="businessAddress"
                    type="text"
                    required
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State/Province *
                  </label>
                  <input
                    id="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <input
                    id="country"
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP/Postal Code *
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    required
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Dropshipping Integration */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dropshipping Integration</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="dropshippingInterest"
                    type="checkbox"
                    checked={formData.dropshippingInterest}
                    onChange={(e) => setFormData({...formData, dropshippingInterest: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="dropshippingInterest" className="ml-2 block text-sm text-gray-900">
                    I'm interested in dropshipping integration
                  </label>
                </div>
                
                {formData.dropshippingInterest && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Dropshipping Providers (select all that apply):
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {dropshippingProviders.map((provider) => (
                        <div key={provider} className="flex items-center">
                          <input
                            id={provider}
                            type="checkbox"
                            checked={formData.preferredProviders.includes(provider)}
                            onChange={(e) => handleProviderChange(provider, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={provider} className="ml-2 block text-sm text-gray-900">
                            {provider}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Terms & Conditions</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    required
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/vendor-agreement" className="text-blue-600 hover:text-blue-500">
                      Vendor Agreement
                    </Link>
                    {' *'}
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="acceptPrivacy"
                    type="checkbox"
                    required
                    checked={formData.acceptPrivacy}
                    onChange={(e) => setFormData({...formData, acceptPrivacy: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptPrivacy" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                      Privacy Policy
                    </Link>
                    {' *'}
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Vendor Application
              </button>
              
              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
