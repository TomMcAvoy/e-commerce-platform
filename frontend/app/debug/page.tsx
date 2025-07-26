'use client';

import { useState } from 'react';
import { 
  getCategories, 
  getFeaturedProducts, 
  getFeaturedVendors,
  getCategoryBySlug,
  getProducts,
  getVendors,
} from '@/lib/api';

function JsonViewer({ data }: { data: any }) {
  if (!data) return null;
  return (
    <pre className="bg-gray-800 p-4 rounded-lg text-sm text-green-300 overflow-x-auto whitespace-pre-wrap break-all">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default function DebugPage() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testSlug, setTestSlug] = useState('surveillance-cameras');

  const runTest = async (testFn: () => Promise<any>) => {
    setIsLoading(true);
    setError(null);
    setApiResponse(null);
    try {
      const result = await testFn();
      setApiResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const tests = {
    'Homepage API': [
      { name: 'Get Featured Categories', fn: () => getCategories({ limit: 8 }) },
      { name: 'Get Featured Products', fn: () => getFeaturedProducts({ limit: 4 }) },
      { name: 'Get Featured Vendors', fn: () => getFeaturedVendors({ limit: 6 }) },
    ],
    'Category Page API': [
      { name: `Get Category by Slug: "${testSlug}"`, fn: () => getCategoryBySlug(testSlug) },
      { name: `Get Products for Category: "${testSlug}"`, fn: async () => {
          const category = await getCategoryBySlug(testSlug);
          if (!category?._id) throw new Error(`Could not find category with slug "${testSlug}" to get its products.`);
          return getProducts({ category: category._id, limit: 10 });
        }
      },
    ],
    'General API & Pagination': [
        { name: 'Get All Products (Page 1)', fn: () => getProducts({ page: 1, limit: 5 }) },
        { name: 'Get All Products (Page 2)', fn: () => getProducts({ page: 2, limit: 5 }) },
        { name: 'Get All Vendors', fn: () => getVendors({ limit: 10 }) },
    ]
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold">API Debug Dashboard</h1>
          <p className="text-lg text-gray-400 mt-2">
            A tool to directly test frontend API calls to the backend.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 bg-gray-800 p-6 rounded-lg self-start space-y-8">
            <div>
              <label htmlFor="testSlug" className="block text-sm font-medium text-gray-300 mb-2">
                Test Category Slug
              </label>
              <input
                type="text"
                id="testSlug"
                value={testSlug}
                onChange={(e) => setTestSlug(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., access-control"
              />
            </div>
            {Object.entries(tests).map(([groupName, testCases]) => (
              <div key={groupName}>
                <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">{groupName}</h2>
                <ul className="space-y-2">
                  {testCases.map(test => (
                    <li key={test.name}>
                      <button
                        onClick={() => runTest(test.fn)}
                        disabled={isLoading}
                        className="w-full text-left bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        {test.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <main className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">API Response</h2>
            <div className="bg-black border border-gray-700 rounded-lg min-h-[600px] p-4 font-mono">
              {isLoading && <p className="text-yellow-400 animate-pulse">Loading...</p>}
              {error && <div className="text-red-400 bg-red-900/50 border border-red-700 p-4 rounded-lg whitespace-pre-wrap">{error}</div>}
              <JsonViewer data={apiResponse} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
