'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FoodSafetyRecord {
  id: string;
  facility: string;
  inspectionDate: string;
  inspector: string;
  score: number;
  violations: number;
  status: 'Pass' | 'Conditional Pass' | 'Fail';
  nextInspection: string;
}

interface HACCPPlan {
  id: string;
  productLine: string;
  criticalControlPoints: number;
  lastReview: string;
  status: 'Current' | 'Needs Review' | 'Expired';
  temperature: number;
  ph: number;
}

export default function FoodSafetyModule() {
  const [activeTab, setActiveTab] = useState('overview');

  const safetyRecords: FoodSafetyRecord[] = [
    { id: 'FS001', facility: 'Main Processing Plant', inspectionDate: '2024-01-10', inspector: 'FDA Inspector Smith', score: 95, violations: 2, status: 'Pass', nextInspection: '2024-07-10' },
    { id: 'FS002', facility: 'Cold Storage Facility', inspectionDate: '2024-01-08', inspector: 'State Inspector Jones', score: 88, violations: 5, status: 'Conditional Pass', nextInspection: '2024-04-08' },
    { id: 'FS003', facility: 'Packaging Center', inspectionDate: '2024-01-05', inspector: 'Local Health Dept', score: 92, violations: 3, status: 'Pass', nextInspection: '2024-07-05' }
  ];

  const haccpPlans: HACCPPlan[] = [
    { id: 'HACCP001', productLine: 'Frozen Vegetables', criticalControlPoints: 8, lastReview: '2024-01-01', status: 'Current', temperature: -18, ph: 6.2 },
    { id: 'HACCP002', productLine: 'Fresh Produce', criticalControlPoints: 12, lastReview: '2023-12-15', status: 'Needs Review', temperature: 4, ph: 5.8 },
    { id: 'HACCP003', productLine: 'Processed Foods', criticalControlPoints: 15, lastReview: '2023-11-20', status: 'Expired', temperature: 2, ph: 4.5 }
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
              <span className="text-lime-600 font-medium">Food Safety Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">
                New Inspection
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'inspections', 'haccp', 'traceability', 'recalls', 'compliance', 'training'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-lime-500 text-lime-600'
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
          <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">🍃</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Food Safety Management</h1>
            <p className="text-gray-600">Comprehensive food safety compliance and quality assurance</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏭</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Facilities</p>
                    <p className="text-2xl font-bold text-gray-900">{safetyRecords.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round((safetyRecords.filter(r => r.status === 'Pass').length / safetyRecords.length) * 100)}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Score</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(safetyRecords.reduce((sum, r) => sum + r.score, 0) / safetyRecords.length)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚠️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Open Violations</p>
                    <p className="text-2xl font-bold text-gray-900">{safetyRecords.reduce((sum, r) => sum + r.violations, 0)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Safety Standards</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">FDA Food Safety Modernization Act</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">HACCP Implementation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">SQF Certification</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">BRC Global Standards</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-lime-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Organic Certification</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Control Points</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Temperature Control</span>
                    <span className="text-green-600 font-semibold">✓ Monitored</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">pH Levels</span>
                    <span className="text-green-600 font-semibold">✓ Monitored</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Metal Detection</span>
                    <span className="text-green-600 font-semibold">✓ Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Pathogen Testing</span>
                    <span className="text-yellow-600 font-semibold">⚠ Review</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'inspections' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Safety Inspections</h2>
              <button className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">
                Schedule Inspection
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Violations</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Inspection</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {safetyRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.facility}</div>
                        <div className="text-sm text-gray-500">{record.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.inspector}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.inspectionDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.score}/100</div>
                        <div className={`text-xs ${record.score >= 90 ? 'text-green-600' : record.score >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {record.score >= 90 ? 'Excellent' : record.score >= 80 ? 'Good' : 'Needs Improvement'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.violations}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.status === 'Pass' ? 'bg-green-100 text-green-800' :
                          record.status === 'Conditional Pass' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.nextInspection}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'haccp' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">HACCP Plans</h2>
              <button className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition-colors">
                Create HACCP Plan
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Line</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CCPs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">pH Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Review</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {haccpPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{plan.productLine}</div>
                        <div className="text-sm text-gray-500">{plan.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.criticalControlPoints}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.temperature}°C</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.ph}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.lastReview}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          plan.status === 'Current' ? 'bg-green-100 text-green-800' :
                          plan.status === 'Needs Review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {plan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'traceability' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lot Tracking</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-3">
                  <div className="font-medium text-gray-900">Lot #2024-001</div>
                  <div className="text-sm text-gray-500">Frozen Vegetables - 5,000 units</div>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <div className="font-medium text-gray-900">Lot #2024-002</div>
                  <div className="text-sm text-gray-500">Fresh Produce - 2,500 units</div>
                </div>
                <div className="border-l-4 border-purple-500 pl-3">
                  <div className="font-medium text-gray-900">Lot #2024-003</div>
                  <div className="text-sm text-gray-500">Processed Foods - 1,200 units</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain Visibility</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Suppliers Tracked</span>
                  <span className="font-semibold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trace Time</span>
                  <span className="font-semibold text-green-600">< 2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documentation</span>
                  <span className="font-semibold">Complete</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blockchain Integration</h3>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900 mb-2">Enabled</div>
                <p className="text-gray-600">Immutable record keeping</p>
                <p className="text-sm text-gray-500 mt-2">End-to-end traceability</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recalls' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recall Management</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Recalls</span>
                  <span className="font-semibold text-red-600">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recall Readiness</span>
                  <span className="font-semibold text-green-600">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time Target</span>
                  <span className="font-semibold">< 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mock Recalls (Annual)</span>
                  <span className="font-semibold">4</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-3">
                  <div className="font-medium text-gray-900">FDA Emergency</div>
                  <div className="text-sm text-gray-500">1-888-SAFEFOOD</div>
                </div>
                <div className="border-l-4 border-orange-500 pl-3">
                  <div className="font-medium text-gray-900">Quality Manager</div>
                  <div className="text-sm text-gray-500">ext. 2345</div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3">
                  <div className="font-medium text-gray-900">Legal Department</div>
                  <div className="text-sm text-gray-500">ext. 3456</div>
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
                  <span className="text-gray-700">FDA Registration</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Current</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">USDA Certification</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Organic Certification</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Certified</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">SQF Certification</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Renewal Due</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Schedule</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-3">
                  <div className="font-medium text-gray-900">Internal Audit</div>
                  <div className="text-sm text-gray-500">Completed: January 15, 2024</div>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <div className="font-medium text-gray-900">Third-Party Audit</div>
                  <div className="text-sm text-gray-500">Scheduled: March 1, 2024</div>
                </div>
                <div className="border-l-4 border-purple-500 pl-3">
                  <div className="font-medium text-gray-900">Customer Audit</div>
                  <div className="text-sm text-gray-500">Scheduled: April 15, 2024</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Programs</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Food Safety Fundamentals</span>
                  <span className="font-semibold text-green-600">95% Complete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">HACCP Principles</span>
                  <span className="font-semibold text-green-600">88% Complete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Allergen Management</span>
                  <span className="font-semibold text-yellow-600">72% Complete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Personal Hygiene</span>
                  <span className="font-semibold text-green-600">100% Complete</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certification Status</h3>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">247</div>
                <p className="text-gray-600">Certified employees</p>
                <p className="text-sm text-gray-500 mt-2">out of 260 total staff</p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}