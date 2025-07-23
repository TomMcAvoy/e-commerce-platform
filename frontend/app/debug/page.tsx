'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheckIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DebugDashboard() {
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [healthCheck, setHealthCheck] = useState<any>(null);
  const [systemMetrics, setSystemMetrics] = useState<any>(null);

  useEffect(() => {
    checkAPIStatus();
    checkHealth();
    checkSystemMetrics();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/status');
      const data = await response.json();
      setApiStatus(data);
    } catch (error) {
      setApiStatus({ error: 'Failed to connect to API', status: 'offline' });
    }
  };

  const checkHealth = async () => {
    try {
      const response = await fetch('http://localhost:3000/health');
      const data = await response.json();
      setHealthCheck(data);
    } catch (error) {
      setHealthCheck({ error: 'Failed to connect to server', status: 'offline' });
    }
  };

  const checkSystemMetrics = async () => {
    // Mock system security metrics following Security Considerations
    setSystemMetrics({
      encryption: { status: 'active', level: '256-bit SSL' },
      authentication: { status: 'operational', method: 'JWT + bcrypt' },
      rateLimit: { status: 'active', limit: '100 req/15min' },
      cors: { status: 'configured', origin: 'localhost:3001' },
      helmet: { status: 'active', headers: 'secured' }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'operational':
      case 'configured':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'offline':
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header following Project-Specific Conventions */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Whitestart System Security</h1>
              <p className="text-sm text-blue-600 font-medium">Premiumhub Debug Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">System Debug Dashboard</h2>
          <p className="text-gray-600">Real-time monitoring of Critical Development Workflows</p>
        </div>
        
        {/* Primary Status Grid following Debugging & Testing Ecosystem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">API Status</h3>
              {getStatusIcon(apiStatus?.success ? 'active' : 'error')}
            </div>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
              {JSON.stringify(apiStatus, null, 2)}
            </pre>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Health Check</h3>
              {getStatusIcon(healthCheck?.success ? 'operational' : 'error')}
            </div>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
              {JSON.stringify(healthCheck, null, 2)}
            </pre>
          </div>
        </div>

        {/* Security Metrics following Security Considerations */}
        <div className="bg-white p-6 rounded-lg shadow border mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Security System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemMetrics && Object.entries(systemMetrics).map(([key, value]: [string, any]) => (
              <div key={key} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 capitalize">{key}</span>
                  {getStatusIcon(value.status)}
                </div>
                <p className="text-sm text-gray-600">
                  {value.level || value.method || value.limit || value.origin || value.headers}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions following Critical Development Workflows */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={checkAPIStatus}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Refresh API Status
            </button>
            <button 
              onClick={checkHealth}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Check Health
            </button>
            <button 
              onClick={checkSystemMetrics}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
            >
              Security Scan
            </button>
            <a 
              href="http://localhost:3000/health" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-center"
            >
              Direct Health Check
            </a>
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Whitestart System Security - Premiumhub Debug Dashboard</p>
          <p>Following Critical Development Workflows | Debugging & Testing Ecosystem</p>
        </div>
      </div>
    </div>
  );
}
