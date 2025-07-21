'use client'

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [apiUrl, setApiUrl] = useState('')
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

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

  const testApi = async () => {
    try {
      const response = await fetch('http://localhost:3000/health')
      const data = await response.json()
      alert('Health check successful: ' + JSON.stringify(data))
    } catch (error) {
      alert('Health check failed: ' + (error as Error).message)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">API URL Configuration:</h2>
        <p>NEXT_PUBLIC_API_URL: {apiUrl}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">All NEXT_PUBLIC_ Environment Variables:</h2>
        <pre className="bg-gray-100 p-2 rounded">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>

      <button 
        onClick={testApi}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test API Connection
      </button>
    </div>
  )
}
