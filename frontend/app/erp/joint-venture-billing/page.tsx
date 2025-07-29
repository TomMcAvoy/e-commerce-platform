'use client';

import { useState } from 'react';
import Link from 'next/link';

interface JointVenture {
  id: string;
  propertyName: string;
  operator: string;
  partners: { name: string; interest: number }[];
  totalCosts: number;
  billingPeriod: string;
  status: 'Draft' | 'Approved' | 'Billed' | 'Paid';
}

interface AFE {
  id: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  approvalDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Complete';
  operator: string;
}

export default function JointVentureBillingModule() {
  const [activeTab, setActiveTab] = useState('overview');

  const jointVentures: JointVenture[] = [
    {
      id: 'JV001',
      propertyName: 'Montney Block 15-22',
      operator: 'CNRL',
      partners: [
        { name: 'CNRL', interest: 60.0 },
        { name: 'Chevron', interest: 25.0 },
        { name: 'ConocoPhillips', interest: 15.0 }
      ],
      totalCosts: 2450000,
      billingPeriod: '2024-01',
      status: 'Approved'
    },
    {
      id: 'JV002',
      propertyName: 'Duvernay Pad 08-15',
      operator: 'Suncor',
      partners: [
        { name: 'Suncor', interest: 50.0 },
        { name: 'CNRL', interest: 30.0 },
        { name: 'Imperial Oil', interest: 20.0 }
      ],
      totalCosts: 1890000,
      billingPeriod: '2024-01',
      status: 'Billed'
    }
  ];

  const afes: AFE[] = [
    { id: 'AFE001', description: 'Drilling - Montney 15-22-01', estimatedCost: 8500000, actualCost: 8234000, approvalDate: '2024-01-05', status: 'Complete', operator: 'CNRL' },
    { id: 'AFE002', description: 'Completion - Duvernay 08-15-02', estimatedCost: 4200000, actualCost: 0, approvalDate: '2024-01-10', status: 'Approved', operator: 'Suncor' },
    { id: 'AFE003', description: 'Facility Upgrade - Battery 1', estimatedCost: 1500000, actualCost: 0, approvalDate: '', status: 'Pending', operator: 'CNRL' }
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
              <span className="text-emerald-600 font-medium">Joint Venture Billing</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Create JV Bill
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'joint-ventures', 'afe', 'billing', 'revenue', 'partners', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">🤝</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Joint Venture Billing</h1>
            <p className="text-gray-600">JD Edwards JV Billing (Module 77) integration</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏢</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active JVs</p>
                    <p className="text-2xl font-bold text-gray-900">{jointVentures.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Billing</p>
                    <p className="text-2xl font-bold text-gray-900">${(jointVentures.reduce((sum, jv) => sum + jv.totalCosts, 0) / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active AFEs</p>
                    <p className="text-2xl font-bold text-gray-900">{afes.filter(afe => afe.status !== 'Complete').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Bills</p>
                    <p className="text-2xl font-bold text-gray-900">{jointVentures.filter(jv => jv.status === 'Draft' || jv.status === 'Approved').length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">JDE Integration (Module 77)</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Joint Venture Master Setup</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Partner Interest Management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">AFE Cost Authorization</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Automated Billing Generation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Revenue Distribution</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total JV Properties</span>
                    <span className="font-semibold">47</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Operating Partners</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Non-Operating Partners</span>
                    <span className="font-semibold">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Processing Time</span>
                    <span className="font-semibold text-green-600">3.2 days</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'joint-ventures' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Joint Venture Properties</h2>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Add JV Property
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {jointVentures.map((jv) => (
                  <div key={jv.id} className="border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{jv.propertyName}</h3>
                        <p className="text-sm text-gray-500">Operator: {jv.operator} | Period: {jv.billingPeriod}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${jv.totalCosts.toLocaleString()}</p>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          jv.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          jv.status === 'Billed' ? 'bg-blue-100 text-blue-800' :
                          jv.status === 'Approved' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {jv.status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Working Interest Partners</h4>
                        <div className="space-y-1">
                          {jv.partners.map((partner, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-600">{partner.name}</span>
                              <span className="font-medium">{partner.interest}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Cost Breakdown</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Drilling</span>
                            <span>${(jv.totalCosts * 0.6).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Completion</span>
                            <span>${(jv.totalCosts * 0.3).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Facilities</span>
                            <span>${(jv.totalCosts * 0.1).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Partner Billing</h4>
                        <div className="space-y-1 text-sm">
                          {jv.partners.filter(p => p.name !== jv.operator).map((partner, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-gray-600">{partner.name}</span>
                              <span className="font-medium">${(jv.totalCosts * partner.interest / 100).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'afe' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Authorization for Expenditure (AFE)</h2>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Create AFE
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AFE Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {afes.map((afe) => (
                    <tr key={afe.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{afe.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{afe.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{afe.operator}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${afe.estimatedCost.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {afe.actualCost > 0 ? `$${afe.actualCost.toLocaleString()}` : 'TBD'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {afe.actualCost > 0 ? (
                          <span className={afe.actualCost > afe.estimatedCost ? 'text-red-600' : 'text-green-600'}>
                            {((afe.actualCost - afe.estimatedCost) / afe.estimatedCost * 100).toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          afe.status === 'Complete' ? 'bg-green-100 text-green-800' :
                          afe.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          afe.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {afe.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Draft Bills</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved Bills</span>
                  <span className="font-semibold">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sent Bills</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid Bills</span>
                  <span className="font-semibold text-green-600">25</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Outstanding Receivables</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">0-30 Days</span>
                  <span className="font-semibold">$2.4M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">31-60 Days</span>
                  <span className="font-semibold">$890K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">61-90 Days</span>
                  <span className="font-semibold">$234K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">90+ Days</span>
                  <span className="font-semibold text-red-600">$67K</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Cycle</h3>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900 mb-2">Monthly</div>
                <p className="text-gray-600">Billing frequency</p>
                <p className="text-sm text-gray-500 mt-2">Next cycle: Feb 1, 2024</p>
                <button className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Run Billing
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Revenue</span>
                  <span className="font-semibold">$45.6M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Royalties</span>
                  <span className="font-semibold">$6.8M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Net Revenue</span>
                  <span className="font-semibold">$38.8M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Partner Share</span>
                  <span className="font-semibold text-green-600">$15.5M</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Product</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Oil Revenue</span>
                  <span className="font-semibold">$28.9M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Gas Revenue</span>
                  <span className="font-semibold">$14.2M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">NGL Revenue</span>
                  <span className="font-semibold">$2.5M</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">JV Partners</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Chevron Canada</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Properties</span>
                      <span>12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Interest</span>
                      <span>25.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Outstanding</span>
                      <span className="text-red-600">$234K</span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">ConocoPhillips</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Properties</span>
                      <span>8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Interest</span>
                      <span>18.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Outstanding</span>
                      <span className="text-green-600">$0</span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Imperial Oil</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Properties</span>
                      <span>15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Interest</span>
                      <span>22.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Outstanding</span>
                      <span className="text-yellow-600">$89K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">JV Billing Analytics</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart: Monthly Billing Trends</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection Rate</span>
                  <span className="font-semibold text-green-600">96.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Days to Pay</span>
                  <span className="font-semibold">28.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing Accuracy</span>
                  <span className="font-semibold">99.2%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}