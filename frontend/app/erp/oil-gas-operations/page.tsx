'use client';

import { useState } from 'react';
import Link from 'next/link';

interface WellProduction {
  id: string;
  wellName: string;
  location: string;
  oilProduction: number;
  gasProduction: number;
  waterProduction: number;
  status: 'Producing' | 'Shut-in' | 'Maintenance' | 'Abandoned';
  operator: string;
  workingInterest: number;
}

interface Facility {
  id: string;
  name: string;
  type: 'Battery' | 'Compressor' | 'Pipeline' | 'Processing Plant';
  capacity: number;
  utilization: number;
  status: 'Online' | 'Offline' | 'Maintenance';
  location: string;
}

export default function OilGasOperationsModule() {
  const [activeTab, setActiveTab] = useState('overview');

  const wellProduction: WellProduction[] = [
    { id: 'WELL001', wellName: 'Montney-15-22', location: 'Alberta', oilProduction: 145.5, gasProduction: 2850, waterProduction: 12.3, status: 'Producing', operator: 'CNRL', workingInterest: 75.5 },
    { id: 'WELL002', wellName: 'Duvernay-08-15', location: 'Alberta', oilProduction: 89.2, gasProduction: 1950, waterProduction: 8.7, status: 'Producing', operator: 'CNRL', workingInterest: 100.0 },
    { id: 'WELL003', wellName: 'Cardium-12-09', location: 'Alberta', oilProduction: 0, gasProduction: 0, waterProduction: 0, status: 'Maintenance', operator: 'CNRL', workingInterest: 60.0 }
  ];

  const facilities: Facility[] = [
    { id: 'FAC001', name: 'Horizon Battery 1', type: 'Battery', capacity: 50000, utilization: 87.5, status: 'Online', location: 'Fort McMurray' },
    { id: 'FAC002', name: 'Montney Compressor', type: 'Compressor', capacity: 150, utilization: 92.3, status: 'Online', location: 'Dawson Creek' },
    { id: 'FAC003', name: 'Upgrader Unit 1', type: 'Processing Plant', capacity: 250000, utilization: 78.9, status: 'Maintenance', location: 'Fort McMurray' }
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
              <span className="text-stone-600 font-medium">Oil & Gas Operations</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors">
                Production Report
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'production', 'facilities', 'reserves', 'drilling', 'compliance', 'economics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-stone-500 text-stone-600'
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
          <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">🛢️</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Oil & Gas Operations</h1>
            <p className="text-gray-600">Integrated upstream operations management system</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🛢️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Oil Production</p>
                    <p className="text-2xl font-bold text-gray-900">{wellProduction.reduce((sum, well) => sum + well.oilProduction, 0).toFixed(1)} bbl/d</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💨</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Gas Production</p>
                    <p className="text-2xl font-bold text-gray-900">{wellProduction.reduce((sum, well) => sum + well.gasProduction, 0).toLocaleString()} mcf/d</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏭</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Wells</p>
                    <p className="text-2xl font-bold text-gray-900">{wellProduction.filter(w => w.status === 'Producing').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Facility Uptime</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round((facilities.filter(f => f.status === 'Online').length / facilities.length) * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">JD Edwards Integration</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-stone-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Production Accounting (JDE 15)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-stone-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Joint Venture Billing (JDE 77)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-stone-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Land Management (JDE 13)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-stone-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Fixed Assets (JDE 12)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-stone-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">General Ledger (JDE 09)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Oil Price (WTI)</span>
                    <span className="font-semibold">$78.45/bbl</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gas Price (AECO)</span>
                    <span className="font-semibold">$2.85/mcf</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Operating Cost</span>
                    <span className="font-semibold">$18.50/boe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Netback</span>
                    <span className="font-semibold text-green-600">$45.20/boe</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'production' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Well Production Data</h2>
              <button className="px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors">
                Export Production
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Well Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oil (bbl/d)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gas (mcf/d)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Water (bbl/d)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WI %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wellProduction.map((well) => (
                    <tr key={well.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{well.wellName}</div>
                        <div className="text-sm text-gray-500">{well.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{well.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{well.oilProduction.toFixed(1)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{well.gasProduction.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{well.waterProduction.toFixed(1)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{well.workingInterest}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          well.status === 'Producing' ? 'bg-green-100 text-green-800' :
                          well.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          well.status === 'Shut-in' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {well.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Production Facilities</h2>
              <button className="px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors">
                Add Facility
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facilities.map((facility) => (
                    <tr key={facility.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{facility.name}</div>
                        <div className="text-sm text-gray-500">{facility.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          facility.type === 'Battery' ? 'bg-blue-100 text-blue-800' :
                          facility.type === 'Compressor' ? 'bg-green-100 text-green-800' :
                          facility.type === 'Pipeline' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {facility.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{facility.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{facility.capacity.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${facility.utilization}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-900">{facility.utilization}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          facility.status === 'Online' ? 'bg-green-100 text-green-800' :
                          facility.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {facility.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reserves' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Proved Reserves</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Oil (MMbbl)</span>
                  <span className="font-semibold">1,247.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gas (Bcf)</span>
                  <span className="font-semibold">8,934.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">BOE (MMboe)</span>
                  <span className="font-semibold">2,736.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reserve Life</span>
                  <span className="font-semibold text-green-600">18.5 years</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Probable Reserves</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Oil (MMbbl)</span>
                  <span className="font-semibold">892.3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gas (Bcf)</span>
                  <span className="font-semibold">6,245.8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">BOE (MMboe)</span>
                  <span className="font-semibold">1,933.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NPV10 ($MM)</span>
                  <span className="font-semibold">$12,450</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reserve Evaluation</h3>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900 mb-2">Annual</div>
                <p className="text-gray-600">Reserve evaluation</p>
                <p className="text-sm text-gray-500 mt-2">Last updated: Dec 31, 2023</p>
                <button className="mt-4 px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors">
                  View Report
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'drilling' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Drilling</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-medium text-gray-900">Montney Pad 15-22</div>
                  <div className="text-sm text-gray-500">Drilling - 65% complete</div>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-medium text-gray-900">Duvernay Pad 08-15</div>
                  <div className="text-sm text-gray-500">Completion - 30% complete</div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="font-medium text-gray-900">Cardium Pad 12-09</div>
                  <div className="text-sm text-gray-500">Planning - Spud date: Feb 15</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Drilling Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Wells Drilled (YTD)</span>
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Days/Well</span>
                  <span className="font-semibold">12.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Cost/Well</span>
                  <span className="font-semibold">$8.2MM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">94.7%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regulatory Compliance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">AER Reporting</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Current</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Environmental Permits</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Valid</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Safety Compliance</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Review Due</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Royalty Reporting</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Submitted</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">GHG Emissions (tCO2e)</span>
                  <span className="font-semibold">245,670</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Water Usage (m³)</span>
                  <span className="font-semibold">1,234,567</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waste Disposal (tonnes)</span>
                  <span className="font-semibold">8,945</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Spill Incidents</span>
                  <span className="font-semibold text-green-600">0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'economics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Economic Analysis</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart: Production Economics</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue (Monthly)</span>
                  <span className="font-semibold">$145.6MM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operating Costs</span>
                  <span className="font-semibold">$67.8MM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">EBITDA</span>
                  <span className="font-semibold text-green-600">$77.8MM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IRR</span>
                  <span className="font-semibold">24.5%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}