'use client';

import React from 'react';
import Link from 'next/link';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * Categories Error Component
 * Following Error Handling Pattern from Copilot Instructions
 */

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function CategoriesError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Security System Error
        </h1>
        
        <p className="text-gray-600 mb-6">
          Unable to load security categories. This may be a temporary connection issue 
          with our secure servers.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Retry Connection
          </button>
          
          <Link 
            href="/"
            className="block text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Return to Whitestart Security Platform
          </Link>
        </div>
        
        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">
              Debug Information
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
