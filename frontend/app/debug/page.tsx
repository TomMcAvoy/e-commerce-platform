'use client'

import { useState, useEffect } from 'react'

interface TestResult {
  test: string
  success: boolean
  message: string
  timestamp: string
}

export default function DebugPage() {
  const [apiUrl, setApiUrl] = useState('')
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const API_BASE_URL = 'http://localhost:3000'

  useEffect(() => {
    // Check environment variables
    const nextPublicApiUrl = process.env.NEXT_PUBLIC_API_URL
    setApiUrl(nextPublicApiUrl || 'Not set')
    
    // Get all NEXT_PUBLIC_ environment variables
    const env: Record<string, string> = {}
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        env[key] = process.env[key] || 'undefined'
      }
    })
    setEnvVars(env)
  }, [])

  const addTestResult = (test: string, success: boolean, message: string) => {
    const result: TestResult = {
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }
    setTestResults(prev => [result, ...prev])
  }

  const testApi = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      const data = await response.json()
      addTestResult('Health Check', true, JSON.stringify(data, null, 2))
    } catch (error) {
      addTestResult('Health Check', false, (error as Error).message)
    }
    setIsLoading(false)
  }

  const testRegistration = async () => {
    setIsLoading(true)
    try {
      const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        firstName: 'Debug',
        lastName: 'Test',
        role: 'customer'
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      })

      const data = await response.json()
      addTestResult('Registration Test', response.ok, JSON.stringify(data, null, 2))
    } catch (error) {
      addTestResult('Registration Test', false, (error as Error).message)
    }
    setIsLoading(false)
  }

  const testProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`)
      const data = await response.json()
      addTestResult('Products Test', response.ok, `Found ${Array.isArray(data) ? data.length : 0} products`)
    } catch (error) {
      addTestResult('Products Test', false, (error as Error).message)
    }
    setIsLoading(false)
  }

  const runAllTests = async () => {
    setTestResults([])
    addTestResult('All Tests', true, 'Starting comprehensive API tests...')
    
    await testApi()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testRegistration()
    await new Promise(resolve => setTimeout(resolve, 500))
    await testProducts()
    
    addTestResult('All Tests', true, 'All tests completed!')
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Debug Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-700">API URL:</h3>
            <p className="text-sm bg-gray-100 p-2 rounded">{apiUrl}</p>
            <p className="text-sm text-gray-600">Backend running on: {API_BASE_URL}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-gray-700">Environment Variables:</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(envVars, null, 2)}
            </pre>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">API Tests</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              onClick={testApi}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
            >
              Test Health
            </button>
            
            <button 
              onClick={testRegistration}
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 text-sm"
            >
              Test Register
            </button>
            
            <button 
              onClick={testProducts}
              disabled={isLoading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 text-sm"
            >
              Test Products
            </button>
            
            <button 
              onClick={runAllTests}
              disabled={isLoading}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50 text-sm"
            >
              Run All Tests
            </button>
          </div>
          
          <button 
            onClick={clearResults}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm w-full"
          >
            Clear Results
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        
        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Running tests...</p>
          </div>
        )}
        
        {testResults.length === 0 && !isLoading && (
          <p className="text-gray-500 text-center py-8">No test results yet. Click a test button to start.</p>
        )}
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {testResults.map((result, index) => (
            <div 
              key={index}
              className={`p-3 rounded border-l-4 ${
                result.success 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium">{result.test}</span>
                <span className="text-xs text-gray-500">{result.timestamp}</span>
              </div>
              <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32 whitespace-pre-wrap">
                {result.message}
              </pre>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick Access Links */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Quick Access:</h3>
        <div className="flex gap-4 text-sm">
          <a href="/debug-api.html" target="_blank" className="text-blue-600 hover:underline">
            Static Debug Page
          </a>
          <a href="http://localhost:3000/health" target="_blank" className="text-blue-600 hover:underline">
            Health Endpoint
          </a>
          <a href="http://localhost:3000/api/status" target="_blank" className="text-blue-600 hover:underline">
            API Status
          </a>
        </div>
      </div>
    </div>
  )
}
