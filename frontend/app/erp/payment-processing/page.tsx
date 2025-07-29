'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PaymentTransaction {
  id: string;
  merchant: string;
  amount: number;
  currency: string;
  paymentMethod: 'Credit Card' | 'ACH' | 'Wire Transfer' | 'Digital Wallet';
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Refunded';
  timestamp: string;
  fees: number;
}

interface MerchantAccount {
  id: string;
  businessName: string;
  accountType: 'Standard' | 'Premium' | 'Enterprise';
  monthlyVolume: number;
  transactionCount: number;
  status: 'Active' | 'Suspended' | 'Under Review';
  riskLevel: 'Low' | 'Medium' | 'High';
}

export default function PaymentProcessingModule() {
  const [activeTab, setActiveTab] = useState('overview');

  const transactions: PaymentTransaction[] = [
    { id: 'TXN001', merchant: 'TechCorp Store', amount: 1250.00, currency: 'USD', paymentMethod: 'Credit Card', status: 'Completed', timestamp: '2024-01-15 14:30:22', fees: 36.25 },
    { id: 'TXN002', merchant: 'Online Retailer', amount: 89.99, currency: 'USD', paymentMethod: 'Digital Wallet', status: 'Processing', timestamp: '2024-01-15 14:28:15', fees: 2.61 },
    { id: 'TXN003', merchant: 'Service Provider', amount: 5000.00, currency: 'USD', paymentMethod: 'ACH', status: 'Pending', timestamp: '2024-01-15 14:25:10', fees: 15.00 }
  ];

  const merchants: MerchantAccount[] = [
    { id: 'MERCH001', businessName: 'TechCorp Store', accountType: 'Enterprise', monthlyVolume: 2500000, transactionCount: 15420, status: 'Active', riskLevel: 'Low' },
    { id: 'MERCH002', businessName: 'Online Retailer', accountType: 'Premium', monthlyVolume: 850000, transactionCount: 8930, status: 'Active', riskLevel: 'Medium' },
    { id: 'MERCH003', businessName: 'Service Provider', accountType: 'Standard', monthlyVolume: 125000, transactionCount: 2340, status: 'Under Review', riskLevel: 'High' }
  ];

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
              <span className="text-cyan-600 font-medium">Payment Processing</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Process Payment
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'transactions', 'merchants', 'settlements', 'fraud', 'compliance', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">💳</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Processing Platform</h1>
            <p className="text-gray-600">Comprehensive payment gateway and merchant services management</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Daily Volume</p>
                    <p className="text-2xl font-bold text-gray-900">${transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{transactions.length.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">98.7%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏪</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Merchants</p>
                    <p className="text-2xl font-bold text-gray-900">{merchants.filter(m => m.status === 'Active').length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Credit/Debit Cards</span>
                    <span className="font-semibold">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Digital Wallets</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">ACH/Bank Transfer</span>
                    <span className="font-semibold">12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Wire Transfer</span>
                    <span className="font-semibold">3%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Real-time Transaction Processing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Multi-currency Support</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Advanced Fraud Detection</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">PCI DSS Compliance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">API Integration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Settlement Management</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">Export</button>
                <button className="px-3 py-1 bg-cyan-600 text-white rounded text-sm">Refresh</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.merchant}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${transaction.amount.toFixed(2)} {transaction.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.fees.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          transaction.status === 'Failed' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'merchants' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Merchant Accounts</h2>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                Add Merchant
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Volume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {merchants.map((merchant) => (
                    <tr key={merchant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{merchant.businessName}</div>
                        <div className="text-sm text-gray-500">{merchant.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          merchant.accountType === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                          merchant.accountType === 'Premium' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {merchant.accountType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${merchant.monthlyVolume.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{merchant.transactionCount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          merchant.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                          merchant.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {merchant.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          merchant.status === 'Active' ? 'bg-green-100 text-green-800' :
                          merchant.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {merchant.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settlements' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settlement Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Settlement</span>
                  <span className="font-semibold">$145,670</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Transit</span>
                  <span className="font-semibold">$89,340</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Settled Today</span>
                  <span className="font-semibold text-green-600">$234,560</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settlement Schedule</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3">
                  <div className="font-medium text-gray-900">Next Settlement</div>
                  <div className="text-sm text-gray-500">Tomorrow at 9:00 AM</div>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <div className="font-medium text-gray-900">Daily Auto-Settlement</div>
                  <div className="text-sm text-gray-500">Enabled for all merchants</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settlement Fees</h3>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900 mb-2">2.9%</div>
                <p className="text-gray-600">Average processing fee</p>
                <p className="text-sm text-gray-500 mt-2">+ $0.30 per transaction</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fraud' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud Detection</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transactions Screened</span>
                  <span className="font-semibold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fraud Detected</span>
                  <span className="font-semibold text-red-600">0.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">False Positives</span>
                  <span className="font-semibold">0.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blocked Amount</span>
                  <span className="font-semibold">$12,450</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Velocity Checks</span>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Geolocation Filtering</span>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Device Fingerprinting</span>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Machine Learning</span>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">PCI DSS Level 1</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Certified</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">SOX Compliance</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Compliant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">GDPR</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Compliant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">AML/KYC</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-3">
                  <div className="font-medium text-gray-900">PCI Audit Completed</div>
                  <div className="text-sm text-gray-500">January 10, 2024</div>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <div className="font-medium text-gray-900">Security Scan</div>
                  <div className="text-sm text-gray-500">January 15, 2024</div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3">
                  <div className="font-medium text-gray-900">Compliance Review Due</div>
                  <div className="text-sm text-gray-500">February 1, 2024</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Analytics</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart: Transaction Volume Trends</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Transaction Size</span>
                  <span className="font-semibold">$127.50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Speed</span>
                  <span className="font-semibold text-green-600">1.2s avg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chargeback Rate</span>
                  <span className="font-semibold">0.4%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}