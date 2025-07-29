const fs = require('fs');
const path = require('path');

const erpModules = [
  {
    slug: 'erp',
    name: 'ERP Dashboard',
    title: 'WhiteStart Enterprise Resource Planning',
    modules: [
      { name: 'Financial Management', slug: 'finance', icon: '💰', color: 'blue' },
      { name: 'Human Resources', slug: 'hr', icon: '👥', color: 'green' },
      { name: 'Supply Chain', slug: 'scm', icon: '🚚', color: 'purple' },
      { name: 'Manufacturing', slug: 'manufacturing', icon: '🏭', color: 'orange' },
      { name: 'Customer Relationship', slug: 'crm', icon: '🤝', color: 'red' },
      { name: 'Project Management', slug: 'ppm', icon: '📊', color: 'indigo' },
      { name: 'Procurement', slug: 'procurement', icon: '🛒', color: 'yellow' },
      { name: 'Risk Management', slug: 'risk', icon: '⚠️', color: 'pink' }
    ]
  }
];

const subModules = {
  finance: [
    { name: 'General Ledger', slug: 'gl', features: ['Chart of Accounts', 'Journal Entries', 'Financial Reporting', 'Period Close'] },
    { name: 'Accounts Payable', slug: 'ap', features: ['Vendor Management', 'Invoice Processing', 'Payment Processing', 'Expense Reports'] },
    { name: 'Accounts Receivable', slug: 'ar', features: ['Customer Billing', 'Collections', 'Credit Management', 'Cash Application'] },
    { name: 'Fixed Assets', slug: 'fa', features: ['Asset Tracking', 'Depreciation', 'Asset Transfers', 'Disposal Management'] }
  ],
  hr: [
    { name: 'Core HR', slug: 'core', features: ['Employee Records', 'Organization Management', 'Position Management', 'Workforce Analytics'] },
    { name: 'Payroll', slug: 'payroll', features: ['Salary Processing', 'Tax Management', 'Benefits Administration', 'Time & Attendance'] },
    { name: 'Talent Management', slug: 'talent', features: ['Recruitment', 'Performance Management', 'Learning Management', 'Succession Planning'] },
    { name: 'Workforce Planning', slug: 'planning', features: ['Budgeting', 'Forecasting', 'Scenario Planning', 'Analytics'] }
  ],
  scm: [
    { name: 'Inventory Management', slug: 'inventory', features: ['Stock Control', 'Warehouse Management', 'Cycle Counting', 'ABC Analysis'] },
    { name: 'Order Management', slug: 'orders', features: ['Sales Orders', 'Purchase Orders', 'Order Fulfillment', 'Backorder Management'] },
    { name: 'Logistics', slug: 'logistics', features: ['Transportation', 'Distribution', 'Route Optimization', 'Carrier Management'] },
    { name: 'Demand Planning', slug: 'demand', features: ['Forecasting', 'Demand Sensing', 'Collaborative Planning', 'S&OP'] }
  ]
};

function generateERPDashboard() {
  return `'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ERPDashboard() {
  const [activeModule, setActiveModule] = useState(null);

  const modules = [
    { name: 'Financial Management', slug: 'finance', icon: '💰', color: 'blue', users: '1,234', transactions: '45.2K' },
    { name: 'Human Resources', slug: 'hr', icon: '👥', color: 'green', users: '856', transactions: '12.8K' },
    { name: 'Supply Chain', slug: 'scm', icon: '🚚', color: 'purple', users: '642', transactions: '89.1K' },
    { name: 'Manufacturing', slug: 'manufacturing', icon: '🏭', color: 'orange', users: '423', transactions: '23.7K' },
    { name: 'Customer Relationship', slug: 'crm', icon: '🤝', color: 'red', users: '789', transactions: '67.3K' },
    { name: 'Project Management', slug: 'ppm', icon: '📊', color: 'indigo', users: '345', transactions: '15.9K' },
    { name: 'Procurement', slug: 'procurement', icon: '🛒', color: 'yellow', users: '567', transactions: '34.6K' },
    { name: 'Risk Management', slug: 'risk', icon: '⚠️', color: 'pink', users: '234', transactions: '8.4K' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/whitestart-logo.svg" alt="WhiteStart" className="h-8 w-auto" />
              <span className="ml-3 text-xl font-semibold text-gray-900">Enterprise ERP</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">Welcome, Admin User</div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ERP Dashboard</h1>
          <p className="text-gray-600">Manage your enterprise operations from a single platform</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💼</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$2.4M</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">4,567</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">297K</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">94.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* ERP Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => (
            <Link
              key={module.slug}
              href={\`/erp/\${module.slug}\`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
              onMouseEnter={() => setActiveModule(module.slug)}
              onMouseLeave={() => setActiveModule(null)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={\`w-12 h-12 bg-\${module.color}-100 rounded-lg flex items-center justify-center group-hover:bg-\${module.color}-200 transition-colors\`}>
                  <span className="text-2xl">{module.icon}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Active Users</div>
                  <div className="font-semibold text-gray-900">{module.users}</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transactions: {module.transactions}</span>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: 'Invoice #INV-2024-001 processed', module: 'Finance', time: '2 minutes ago', status: 'success' },
                { action: 'New employee onboarding completed', module: 'HR', time: '15 minutes ago', status: 'success' },
                { action: 'Purchase order PO-2024-045 approved', module: 'Procurement', time: '1 hour ago', status: 'pending' },
                { action: 'Manufacturing order MO-2024-123 started', module: 'Manufacturing', time: '2 hours ago', status: 'info' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className={\`w-2 h-2 rounded-full mr-3 \${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }\`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.module} • {activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}