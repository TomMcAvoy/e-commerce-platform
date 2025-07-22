'use client'
import Link from 'next/link'
import LinkedInLayout from '../../components/LinkedInLayout'
import LinkedInFeed from '../../components/LinkedInFeed'
import AffiliateRightSidebar from '../../components/AffiliateRightSidebar'

export default function LinkedInStylePage() {
  return (
    <div>
      {/* Original Style Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">🛍️</span>
              </div>
              <div>
                <h3 className="font-semibold">LinkedIn-Style Social Commerce</h3>
                <p className="text-sm text-purple-100">Professional networking meets affiliate marketing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link 
                href="/linkedin-authentic" 
                className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-800 transition-colors"
              >
                🎯 Exact LinkedIn Clone
              </Link>
              <Link 
                href="/" 
                className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-50 transition-colors"
              >
                Switch to Original View
              </Link>
            </div>
          </div>
        </div>
      </div>

      <LinkedInLayout rightSidebar={<AffiliateRightSidebar />}>
        <LinkedInFeed />
      </LinkedInLayout>
    </div>
  )
}
