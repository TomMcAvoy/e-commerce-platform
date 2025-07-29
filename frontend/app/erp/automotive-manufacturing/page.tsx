'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProductionLine {
  id: string;
  name: string;
  model: string;
  unitsPerHour: number;
  efficiency: number;
  status: 'Running' | 'Maintenance' | 'Changeover' | 'Down';
  defectRate: number;
  currentShift: string;
}

interface QualityCheck {
  id: string;
  vehicle: string;
  station: string;
  inspector: string;
  timestamp: string;
  result: 'Pass' | 'Fail' | 'Rework';
  defects: string[];
}

interface SupplierPart {
  id: string;
  partNumber: string;
  supplier: string;
  description: string;
  inventory: number;
  leadTime: number;
  qualityRating: number;
  status: 'Active' | 'Critical' | 'Discontinued';
}

export default function AutomotiveManufacturingModule() {
  const [activeTab, setActiveTab] = useState('overview');

  const productionLines: ProductionLine[] = [
    { id: 'LINE001', name: 'Assembly Line A', model: 'Sedan Model X', unitsPerHour: 45, efficiency: 94.2, status: 'Running', defectRate: 0.8, currentShift: 'Day Shift' },
    { id: 'LINE002', name: 'Assembly Line B', model: 'SUV Model Y', unitsPerHour: 38, efficiency: 91.5, status: 'Running', defectRate: 1.2, currentShift: 'Day Shift' },
    { id: 'LINE003', name: 'Engine Assembly', model: 'V6 Engine', unitsPerHour: 52, efficiency: 88.7, status: 'Maintenance', defectRate: 0.5, currentShift: 'Day Shift' }
  ];

  const qualityChecks: QualityCheck[] = [
    { id: 'QC001', vehicle: 'VIN123456789', station: 'Final Inspection', inspector: 'John Smith', timestamp: '2024-01-15 14:30', result: 'Pass', defects: [] },
    { id: 'QC002', vehicle: 'VIN987654321', station: 'Paint Quality', inspector: 'Sarah Johnson', timestamp: '2024-01-15 14:25', result: 'Rework', defects: ['Paint defect', 'Surface scratch'] },
    { id: 'QC003', vehicle: 'VIN456789123', station: 'Engine Test', inspector: 'Mike Davis', timestamp: '2024-01-15 14:20', result: 'Pass', defects: [] }
  ];

  const supplierParts: SupplierPart[] = [
    { id: 'SP001', partNumber: 'ENG-V6-2024', supplier: 'PowerTech Motors', description: 'V6 Engine Block', inventory: 45, leadTime: 14, qualityRating: 98.5, status: 'Active' },
    { id: 'SP002', partNumber: 'TRANS-AUTO-X1', supplier: 'GearBox Solutions', description: 'Automatic Transmission', inventory: 12, leadTime: 21, qualityRating: 96.8, status: 'Critical' },
    { id: 'SP003', partNumber: 'BRAKE-DISC-F', supplier: 'SafeStop Components', description: 'Front Brake Disc', inventory: 234, leadTime: 7, qualityRating: 99.2, status: 'Active' }
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
              <span className="text-slate-600 font-medium">Automotive Manufacturing</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                Production Order
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'production', 'quality', 'suppliers', 'lean', 'maintenance', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-slate-500 text-slate-600'
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
          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">🚗</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Automotive Manufacturing</h1>
            <p className="text-gray-600">Toyota Production System inspired manufacturing operations</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏭</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Daily Production</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">OEE</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(productionLines.reduce((sum, line) => sum + line.efficiency, 0) / productionLines.length)}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">First Pass Yield</p>
                    <p className="text-2xl font-bold text-gray-900">96.8%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Inventory Turns</p>
                    <p className="text-2xl font-bold text-gray-900">24.5x</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Toyota Production System</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Just-in-Time Manufacturing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Continuous Improvement (Kaizen)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Poka-Yoke (Error Prevention)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Andon System</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">5S Workplace Organization</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Standards</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">ISO/TS 16949</span>
                    <span className="text-green-600 font-semibold">Certified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Six Sigma</span>
                    <span className="text-green-600 font-semibold">Black Belt</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">APQP/PPAP</span>
                    <span className="text-green-600 font-semibold">Compliant</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">SPC Implementation</span>
                    <span className="text-green-600 font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'production' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Production Lines Status</h2>
              <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                Line Control
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate (UPH)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Defect Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productionLines.map((line) => (
                    <tr key={line.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{line.name}</div>
                        <div className="text-sm text-gray-500">{line.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{line.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{line.unitsPerHour}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${line.efficiency}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-900">{line.efficiency}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{line.defectRate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{line.currentShift}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          line.status === 'Running' ? 'bg-green-100 text-green-800' :
                          line.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          line.status === 'Changeover' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {line.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Quality Control Checks</h2>
              <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                New Inspection
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Defects</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {qualityChecks.map((check) => (
                    <tr key={check.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{check.vehicle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{check.station}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{check.inspector}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{check.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          check.result === 'Pass' ? 'bg-green-100 text-green-800' :
                          check.result === 'Rework' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {check.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {check.defects.length > 0 ? check.defects.join(', ') : 'None'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Supplier Parts Management</h2>
              <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                Add Supplier
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {supplierParts.map((part) => (
                    <tr key={part.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{part.partNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.supplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{part.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.inventory}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{part.leadTime} days</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{part.qualityRating}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          part.status === 'Active' ? 'bg-green-100 text-green-800' :
                          part.status === 'Critical' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {part.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'lean' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kaizen Events</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-3">
                  <div className="font-medium text-gray-900">Line Efficiency Improvement</div>
                  <div className="text-sm text-gray-500">Completed: +3.2% efficiency</div>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <div className="font-medium text-gray-900">Waste Reduction Initiative</div>
                  <div className="text-sm text-gray-500">In Progress: 45% complete</div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3">
                  <div className="font-medium text-gray-900">Setup Time Reduction</div>
                  <div className="text-sm text-gray-500">Planned: Next week</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lean Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Takt Time</span>
                  <span className="font-semibold">1.33 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cycle Time</span>
                  <span className="font-semibold">1.28 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lead Time</span>
                  <span className="font-semibold">2.1 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Value Stream Efficiency</span>
                  <span className="font-semibold text-green-600">87%</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Andon System</h3>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-green-600 mb-2">All Clear</div>
                <p className="text-gray-600">No active alerts</p>
                <p className="text-sm text-gray-500 mt-2">Last alert: 2 hours ago</p>
                <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Pull Andon
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preventive Maintenance</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-medium text-gray-900">Robot Arm Calibration</div>
                  <div className="text-sm text-gray-500">Completed: Line A - Jan 15</div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="font-medium text-gray-900">Conveyor Belt Service</div>
                  <div className="text-sm text-gray-500">Due: Line B - Jan 20</div>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="font-medium text-gray-900">Hydraulic System Check</div>
                  <div className="text-sm text-gray-500">Overdue: Engine Line - Jan 18</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Overall Equipment Effectiveness</span>
                  <span className="font-semibold">91.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mean Time Between Failures</span>
                  <span className="font-semibold">342 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mean Time To Repair</span>
                  <span className="font-semibold">1.8 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Planned Maintenance %</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Analytics</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart: Production vs Target</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manufacturing KPIs</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Units per Employee</span>
                  <span className="font-semibold">12.4/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost per Unit</span>
                  <span className="font-semibold">$18,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">On-Time Delivery</span>
                  <span className="font-semibold text-green-600">98.7%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}