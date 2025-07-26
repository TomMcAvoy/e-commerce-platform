import React from 'react';

/**
 * Categories Loading Component
 * Following Frontend Structure and Component Organization from Copilot Instructions
 */

export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="h-12 bg-white/20 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-white/10 rounded w-64 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Categories Grid Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-pulse"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Loading Message */}
      <div className="text-center pb-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading Whitestart Security Categories...</p>
      </div>
    </div>
  );
}