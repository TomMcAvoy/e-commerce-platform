const fs = require('fs');
const path = require('path');

const erpModules = [
  {
    slug: 'finance',
    name: 'Financial Management',
    icon: '💰',
    color: 'blue',
    subModules: [
      { name: 'General Ledger', slug: 'gl', features: ['Chart of Accounts', 'Journal Entries', 'Financial Reporting', 'Period Close'] },
      { name: 'Accounts Payable', slug: 'ap', features: ['Vendor Management', 'Invoice Processing', 'Payment Processing', 'Expense Reports'] },
      { name: 'Accounts Receivable', slug: 'ar', features: ['Customer Billing', 'Collections', 'Credit Management', 'Cash Application'] },
      { name: 'Fixed Assets', slug: 'fa', features: ['Asset Tracking', 'Depreciation', 'Asset Transfers', 'Disposal Management'] }
    ]
  },
  {
    slug: 'hr',
    name: 'Human Resources',
    icon: '👥',
    color: 'green',
    subModules: [
      { name: 'Core HR', slug: 'core', features: ['Employee Records', 'Organization Management', 'Position Management', 'Workforce Analytics'] },
      { name: 'Payroll', slug: 'payroll', features: ['Salary Processing', 'Tax Management', 'Benefits Administration', 'Time & Attendance'] },
      { name: 'Talent Management', slug: 'talent', features: ['Recruitment', 'Performance Management', 'Learning Management', 'Succession Planning'] },
      { name: 'Workforce Planning', slug: 'planning', features: ['Budgeting', 'Forecasting', 'Scenario Planning', 'Analytics'] }
    ]
  },
  {
    slug: 'scm',
    name: 'Supply Chain Management',
    icon: '🚚',
    color: 'purple',
    subModules: [
      { name: 'Inventory Management', slug: 'inventory', features: ['Stock Control', 'Warehouse Management', 'Cycle Counting', 'ABC Analysis'] },
      { name: 'Order Management', slug: 'orders', features: ['Sales Orders', 'Purchase Orders', 'Order Fulfillment', 'Backorder Management'] },
      { name: 'Logistics', slug: 'logistics', features: ['Transportation', 'Distribution', 'Route Optimization', 'Carrier Management'] },
      { name: 'Demand Planning', slug: 'demand', features: ['Forecasting', 'Demand Sensing', 'Collaborative Planning', 'S&OP'] }
    ]
  }
];

function generateModulePage(module) {
  return `'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ${module.name.replace(/\s+/g, '')}Module() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/erp" className="flex items-center hover:opacity-80">
                <img src="/whitestart-logo.svg" alt="WhiteStart" className="h-8 w-auto" />
                <span className="ml-3 text-xl font-semibold text-gray-900">Enterprise ERP</span>
              </Link>
              <span className="mx-3 text-gray-400">/</span>
              <span className="text-${module.color}-600 font-medium">${module.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-${module.color}-600 text-white rounded-lg hover:bg-${module.color}-700 transition-colors">
                New Transaction
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'transactions', 'reports', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={\`py-4 px-1 border-b-2 font-medium text-sm capitalize \${
                  activeTab === tab
                    ? 'border-${module.color}-500 text-${module.color}-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }\`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 bg-${module.color}-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">${module.icon}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">${module.name}</h1>
            <p className="text-gray-600">Comprehensive ${module.name.toLowerCase()} operations and analytics</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-${module.color}-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Records</p>
                    <p className="text-2xl font-bold text-gray-900">12,456</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Processed</p>
                    <p className="text-2xl font-bold text-gray-900">8,923</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">2,134</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">❌</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Errors</p>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${module.subModules.map((subModule) => `
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">${subModule.name}</h3>
                <div className="space-y-2">
                  ${subModule.features.map(feature => `
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-${module.color}-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">${feature}</span>
                  </div>
                  `).join('')}
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-${module.color}-50 text-${module.color}-700 rounded-lg hover:bg-${module.color}-100 transition-colors">
                  Access ${subModule.name}
                </button>
              </div>
              `).join('')}
            </div>
          </>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TXN-0001</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Payment</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$5,234.56</td><td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-15</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TXN-0002</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Invoice</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$2,876.43</td><td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-14</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Chart</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart Placeholder</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Volume</span>
                  <span className="font-semibold">$2.4M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Rate</span>
                  <span className="font-semibold text-green-600">+12.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efficiency</span>
                  <span className="font-semibold">94.2%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-${module.color}-600 text-white rounded-lg hover:bg-${module.color}-700 transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}`;
}

// Create ERP module pages
erpModules.forEach(module => {
  const moduleDir = path.join(__dirname, `../frontend/app/erp/${module.slug}`);
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(moduleDir, 'page.tsx'), generateModulePage(module));
  console.log(`✅ Created: /erp/${module.slug}`);
});

console.log('🎉 ERP modules created!');