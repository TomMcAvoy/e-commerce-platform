'use client'
import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, DollarSign, Users, Eye, ExternalLink, Copy, Share2, BarChart3, Calendar, Target } from 'lucide-react'

export default function AffiliateDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const stats = {
    '7d': {
      earnings: 247.83,
      clicks: 1423,
      conversions: 28,
      impressions: 8942
    },
    '30d': {
      earnings: 1094.67,
      clicks: 6234,
      conversions: 124,
      impressions: 34567
    },
    '90d': {
      earnings: 3247.91,
      clicks: 18756,
      conversions: 387,
      impressions: 98234
    }
  }

  const affiliateProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      brand: "TechSound",
      commission: "15%",
      earnings: "$67.20",
      clicks: 234,
      conversions: 8,
      imageUrl: "/api/placeholder/100/100",
      affiliateLink: "https://whitestartups.com/ref/tech-headphones-123?user=john_doe",
      socialShareCount: 42
    },
    {
      id: 2,
      name: "Premium Cotton T-Shirt",
      brand: "ComfortWear",
      commission: "20%",
      earnings: "$89.40",
      clicks: 567,
      conversions: 12,
      imageUrl: "/api/placeholder/100/100",
      affiliateLink: "https://whitestartups.com/ref/cotton-tshirt-456?user=john_doe",
      socialShareCount: 67
    },
    {
      id: 3,
      name: "Smart Fitness Watch",
      brand: "FitTech",
      commission: "12%",
      earnings: "$91.23",
      clicks: 789,
      conversions: 15,
      imageUrl: "/api/placeholder/100/100",
      affiliateLink: "https://whitestartups.com/ref/fitness-watch-789?user=john_doe",
      socialShareCount: 89
    }
  ]

  const topPerformers = [
    { name: "Smart Home Bundle", earnings: "$234.56", growth: "+23%" },
    { name: "Wireless Earbuds", earnings: "$178.90", growth: "+18%" },
    { name: "Laptop Stand", earnings: "$156.78", growth: "+15%" },
    { name: "Blue Light Glasses", earnings: "$123.45", growth: "+12%" }
  ]

  const copyToClipboard = (link: string, productId: number) => {
    navigator.clipboard.writeText(link)
    setCopiedLink(productId.toString())
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const currentStats = stats[selectedPeriod as keyof typeof stats]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Dashboard</h1>
          <p className="text-gray-600">Track your earnings, manage affiliate links, and grow your social commerce presence</p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Performance Overview</h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { label: '7 Days', value: '7d' },
                { label: '30 Days', value: '30d' },
                { label: '90 Days', value: '90d' }
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-700">${currentStats.earnings}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Clicks</p>
                  <p className="text-2xl font-bold text-blue-700">{currentStats.clicks.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Conversions</p>
                  <p className="text-2xl font-bold text-purple-700">{currentStats.conversions}</p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Conversion Rate</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {((currentStats.conversions / currentStats.clicks) * 100).toFixed(1)}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Affiliate Products */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Your Affiliate Products</h2>
                <Link href="/affiliate/browse" className="btn-linkedin">
                  Browse More Products
                </Link>
              </div>

              <div className="space-y-4">
                {affiliateProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">IMG</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">by {product.brand}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Commission</p>
                            <p className="font-semibold text-green-600">{product.commission}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Earnings</p>
                            <p className="font-semibold">{product.earnings}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Clicks</p>
                            <p className="font-semibold">{product.clicks}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Conversions</p>
                            <p className="font-semibold">{product.conversions}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={product.affiliateLink}
                            readOnly
                            className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded px-3 py-2"
                          />
                          <button
                            onClick={() => copyToClipboard(product.affiliateLink, product.id)}
                            className="btn-amazon-secondary text-xs p-2"
                          >
                            {copiedLink === product.id.toString() ? 'Copied!' : <Copy className="w-4 h-4" />}
                          </button>
                          <Link
                            href={`/social/share?product=${product.id}`}
                            className="btn-facebook text-xs p-2"
                          >
                            <Share2 className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Top Performers */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Top Performers
              </h3>
              <div className="space-y-3">
                {topPerformers.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.earnings}</p>
                    </div>
                    <span className="text-green-600 text-sm font-medium">{item.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/affiliate/browse" className="block w-full btn-linkedin text-center">
                  Find New Products
                </Link>
                <Link href="/social/create-post" className="block w-full btn-facebook text-center">
                  Create Social Post
                </Link>
                <Link href="/affiliate/payments" className="block w-full btn-amazon-orange text-center">
                  Request Payment
                </Link>
                <Link href="/affiliate/analytics" className="block w-full btn-amazon-secondary text-center">
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Commission Tiers */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold mb-4">Commission Tiers</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bronze (0-10 sales)</span>
                  <span className="font-semibold text-orange-600">5-10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Silver (11-50 sales)</span>
                  <span className="font-semibold text-gray-600">10-15%</span>
                </div>
                <div className="flex justify-between items-center bg-blue-50 p-2 rounded">
                  <span className="text-sm font-medium">Gold (51-100 sales)</span>
                  <span className="font-semibold text-blue-600">15-20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Platinum (100+ sales)</span>
                  <span className="font-semibold text-purple-600">20-25%</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                Current tier: Gold (67 sales this month)
              </div>
            </div>

            {/* Social Performance */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold mb-4">Social Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Posts Created</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Likes</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shares</span>
                  <span className="font-semibold">89</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="font-semibold">456</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
