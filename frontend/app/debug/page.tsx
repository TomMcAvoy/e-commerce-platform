'use client';

import React, { useState, useEffect } from 'react';
import { 
  apiClient, 
  refreshNews,
  fetchMajorNews,
  fetchScottishNews,
  fetchCanadianNews,
  getCategories,
  importDropshippingProducts
} from '../../lib/api';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CloudArrowDownIcon,
  ArchiveBoxArrowDownIcon,
  LockClosedIcon // Import new icon
} from '@heroicons/react/24/outline';

/**
 * Primary Debug Dashboard following Debugging & Testing Ecosystem from Copilot Instructions
 * Real-time system health monitoring with API testing capabilities
 */
interface SystemCheck {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
  endpoint?: string;
}

interface Category {
  _id: string;
  name: string;
}

export default function DebugPage() {
  const { isAuthenticated, isLoading } = useAuth(); // Use the auth context
  const [systemChecks, setSystemChecks] = useState<SystemCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [newsRefreshStatus, setNewsRefreshStatus] = useState(''); // State for news refresh
  const [specificFetchStatus, setSpecificFetchStatus] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('Printful'); // Add state for provider
  const [importStatus, setImportStatus] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const BACKEND_URL = API_BASE_URL.replace('/api', '');

  const runComprehensiveSystemCheck = async () => {
    if (refreshing) return;
    setLoading(true);
    setRefreshing(true);
    
    const checks: SystemCheck[] = [];
    console.log('🔍 Starting comprehensive system check...');

    // 1. Test Backend Health
    try {
      const healthResponse = await fetch(`${BACKEND_URL}/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        checks.push({
          name: 'Backend Server Health',
          status: 'success',
          message: `Server online - ${healthData.message || 'OK'}`,
          details: healthData,
          endpoint: `${BACKEND_URL}/health`
        });
      } else {
        throw new Error(`HTTP ${healthResponse.status}`);
      }
    } catch (error) {
      checks.push({ name: 'Backend Server Health', status: 'error', message: `Backend server unreachable: ${error}`, endpoint: `${BACKEND_URL}/health` });
    }

    // 2. Test Categories API & Database
    try {
      const categoriesData = await apiClient.publicRequest('/categories?limit=5');
      checks.push({
        name: 'Categories API & Database',
        status: 'success',
        message: `Database connected - ${categoriesData.total || categoriesData.data.length} categories found`,
        details: { count: categoriesData.total, sample: categoriesData.data },
        endpoint: `${API_BASE_URL}/categories`
      });
    } catch (error) {
      checks.push({ name: 'Categories API & Database', status: 'error', message: `Database connection failed: ${error}`, endpoint: `${API_BASE_URL}/categories` });
    }

    // 3. Test Authentication System
    try {
      // This endpoint might not exist, a 404 is a warning, not an error.
      const authResponse = await fetch(`${API_BASE_URL}/auth/status`);
      if (authResponse.ok) {
        checks.push({ name: 'Authentication System', status: 'success', message: 'Auth endpoints accessible', endpoint: `${API_BASE_URL}/auth/status` });
      } else if (authResponse.status === 404) {
        checks.push({ name: 'Authentication System', status: 'warning', message: 'Auth status endpoint not found (404)', endpoint: `${API_BASE_URL}/auth/status` });
      } else {
        throw new Error(`Auth returned ${authResponse.status}`);
      }
    } catch (error) {
      checks.push({ name: 'Authentication System', status: 'error', message: `Auth system check failed: ${error}`, endpoint: `${API_BASE_URL}/auth/status` });
    }

    setSystemChecks(checks);
    setLastUpdated(new Date().toLocaleString());
    setLoading(false);
    setRefreshing(false);
    console.log('🎉 System check completed.');
  };

  useEffect(() => {
    runComprehensiveSystemCheck();
  }, []);

  // Handler for the new refresh button
  const handleRefreshNews = async () => {
    setNewsRefreshStatus('Refreshing...');
    setRefreshing(true);
    try {
      const result = await refreshNews();
      setNewsRefreshStatus(`Successfully refreshed news. Fetched ${result.data.totalArticles} articles.`);
      // Optionally, re-run system checks to see updated data
      await runComprehensiveSystemCheck();
    } catch (error: any) {
      setNewsRefreshStatus(`Error refreshing news: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSpecificFetch = async (fetchFn: () => Promise<any>, name: string) => {
    setSpecificFetchStatus(`Fetching ${name} news...`);
    setRefreshing(true);
    try {
      const result = await fetchFn();
      const count = result.data?.articleCount || result.data?.totalArticles || 0;
      setSpecificFetchStatus(`Successfully fetched ${count} articles from ${name}.`);
      await runComprehensiveSystemCheck();
    } catch (error: any) {
      setSpecificFetchStatus(`Error fetching ${name} news: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const runSystemChecks = async () => {
    // 1. Test Backend Health
    try {
      const healthResponse = await fetch(`${BACKEND_URL}/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setSystemChecks((prev) => [...prev, {
          name: 'Backend Server Health',
          status: 'success',
          message: `Server online - ${healthData.message || 'OK'}`,
          details: healthData,
          endpoint: `${BACKEND_URL}/health`
        }]);
      } else {
        setSystemChecks((prev) => [...prev, { name: 'Backend Server Health', status: 'error', message: `Backend server unreachable: HTTP ${healthResponse.status}`, endpoint: `${BACKEND_URL}/health` }]);
      }
    } catch (error) {
      setSystemChecks((prev) => [...prev, { name: 'Backend Server Health', status: 'error', message: `Backend server unreachable: ${error}`, endpoint: `${BACKEND_URL}/health` }]);
    }

    // 2. Test Categories API & Database
    try {
      const categoriesData = await apiClient.publicRequest('/categories?limit=5');
      setCategories(categoriesData.data);
      setSelectedCategory(categoriesData.data[0]?._id || '');
      setSystemChecks((prev) => [...prev, {
        name: 'Categories API & Database',
        status: 'success',
        message: `Database connected - ${categoriesData.total || categoriesData.data.length} categories found`,
        details: { count: categoriesData.total, sample: categoriesData.data },
        endpoint: `${API_BASE_URL}/categories`
      }]);
    } catch (error) {
      setSystemChecks((prev) => [...prev, { name: 'Categories API & Database', status: 'error', message: `Database connection failed: ${error}`, endpoint: `${API_BASE_URL}/categories` }]);
    }

    // 3. Test Authentication System
    try {
      const authResponse = await fetch(`${API_BASE_URL}/auth/status`);
      if (authResponse.ok) {
        setSystemChecks((prev) => [...prev, { name: 'Authentication System', status: 'success', message: 'Auth endpoints accessible', endpoint: `${API_BASE_URL}/auth/status` }]);
      } else {
        setSystemChecks((prev) => [...prev, { name: 'Authentication System', status: 'error', message: `Auth system check failed: HTTP ${authResponse.status}`, endpoint: `${API_BASE_URL}/auth/status` }]);
      }
    } catch (error) {
      setSystemChecks((prev) => [...prev, { name: 'Authentication System', status: 'error', message: `Auth system check failed: ${error}`, endpoint: `${API_BASE_URL}/auth/status` }]);
    }

    // Fetch categories for the dropdown
    const fetchedCategories = await getCategories();
    setCategories(fetchedCategories);
    if (fetchedCategories.length > 0) {
      setSelectedCategory(fetchedCategories[0].name);
    }
  };

  useEffect(() => {
    runSystemChecks();
  }, []);

  const handleProductImport = async () => {
    if (!selectedCategory || !selectedProvider) {
      setImportStatus('Please select a category and a provider first.');
      return;
    }
    setImportStatus(`Importing products for '${selectedCategory}' from '${selectedProvider}'...`);
    try {
      const result = await importDropshippingProducts(selectedCategory, selectedProvider);
      setImportStatus(result.message);
    } catch (error: any) {
      setImportStatus(`Error importing products: ${error.message}`);
    }
  };

  const handleSeedDatabase = async () => {
    setImportStatus('Seeding database with sample data...');
    try {
      // Use privateRequest with method 'POST' for authenticated admin actions
      const result = await apiClient.privateRequest('/admin/seed', { method: 'POST' });
      setImportStatus(`Database seeded: ${result.data.message}`);
    } catch (error: any) {
      setImportStatus(`Error seeding database: ${error.message}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default: return <CpuChipIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-200 bg-green-50 text-green-900';
      case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-900';
      case 'error': return 'border-red-200 bg-red-50 text-red-900';
      default: return 'border-gray-200 bg-gray-50 text-gray-900';
    }
  };

  // Add a variable to check if actions should be disabled
  const actionsDisabled = isLoading || !isAuthenticated;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <ShieldCheckIcon className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Primary Debug Dashboard</h1>
              <p className="text-gray-500">Real-time system monitoring. Last updated: {lastUpdated}</p>
            </div>
          </div>
          <button
            onClick={runComprehensiveSystemCheck}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh All'}</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">System Health Checks</h2>
          {loading ? (
            <p>Running checks...</p>
          ) : (
            <div className="space-y-4">
              {systemChecks.map((check, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getStatusColor(check.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <h3 className="font-semibold">{check.name}</h3>
                        <p className="text-sm opacity-80">{check.message}</p>
                        {check.endpoint && (
                          <a href={check.endpoint} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1">
                            🔗 Test endpoint directly
                          </a>
                        )}
                      </div>
                    </div>
                    {check.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer opacity-60">Details</summary>
                        <pre className="mt-2 p-2 bg-black bg-opacity-5 rounded text-xs overflow-auto max-w-md">
                          {JSON.stringify(check.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card for Manual Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Manual Actions</h2>
          
          {actionsDisabled && (
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
              <div className="flex">
                <div className="py-1"><LockClosedIcon className="h-5 w-5 text-yellow-500 mr-3" /></div>
                <div>
                  <p className="font-bold">Authentication Required</p>
                  <p className="text-sm">Please sign in as an administrator to use these debug tools.</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefreshNews}
                disabled={actionsDisabled || refreshing}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <CloudArrowDownIcon className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh All (Scheduler)'}
              </button>
              {newsRefreshStatus && !specificFetchStatus && (
                <p className="text-sm text-gray-600">{newsRefreshStatus}</p>
              )}
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Fetch Specific Sources</h3>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => handleSpecificFetch(fetchMajorNews, 'Major Sources')} disabled={actionsDisabled || refreshing} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">Major News</button>
                <button onClick={() => handleSpecificFetch(fetchScottishNews, 'Scottish Sources')} disabled={actionsDisabled || refreshing} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">Scottish News</button>
                <button onClick={() => handleSpecificFetch(fetchCanadianNews, 'Canadian Sources')} disabled={actionsDisabled || refreshing} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">Canadian News</button>
              </div>
              {specificFetchStatus && (
                <p className="text-sm text-gray-600 mt-4">{specificFetchStatus}</p>
              )}
            </div>
          </div>
        </div>

        {/* New Card for Dropshipping Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dropshipping Actions</h2>
          <div className="flex items-end space-x-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category to Import
              </label>
              <select
                id="category"
                name="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                Provider
              </label>
              <select
                id="provider"
                name="provider"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option>Printful</option>
                <option>Spocket</option>
              </select>
            </div>
            <button
              onClick={handleProductImport}
              disabled={isImporting}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ArchiveBoxArrowDownIcon className={`w-5 h-5 mr-2 ${isImporting ? 'animate-spin' : ''}`} />
              {isImporting ? 'Importing...' : 'Import Products'}
            </button>
          </div>
          {importStatus && (
            <p className="text-sm text-gray-600 mt-4">{importStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}
