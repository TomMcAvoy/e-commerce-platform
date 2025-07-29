'use client';

import { useState } from 'react';
import Link from 'next/link';

interface WorkOrder {
  id: string;
  product: string;
  quantity: number;
  status: 'Planned' | 'Released' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  dueDate: string;
  progress: number;
}

interface ProductionLine {
  id: string;
  name: string;
  status: 'Running' | 'Idle' | 'Maintenance' | 'Down';
  efficiency: number;
  currentJob: string;
  capacity: number;
}

export default function ManufacturingModule() {
  const [activeTab, setActiveTab] = useState('overview');

  const workOrders: WorkOrder[] = [
    { id: 'WO-2024-001', product: 'Security Camera Pro', quantity: 100, status: 'In Progress', startDate: '2024-01-15', dueDate: '2024-01-25', progress: 65 },
    { id: 'WO-2024-002', product: 'Access Control Panel', quantity: 50, status: 'Released', startDate: '2024-01-20', dueDate: '2024-01-30', progress: 0 },
    { id: 'WO-2024-003', product: 'Motion Sensor', quantity: 200, status: 'Planned', startDate: '2024-01-25', dueDate: '2024-02-05', progress: 0 }
  ];

  const productionLines: ProductionLine[] = [
    { id: 'LINE-001', name: 'Camera Assembly Line', status: 'Running', efficiency: 92, currentJob: 'WO-2024-001', capacity: 150 },
    { id: 'LINE-002', name: 'Sensor Production Line', status: 'Idle', efficiency: 0, currentJob: '', capacity: 300 },
    { id: 'LINE-003', name: 'Control Panel Line', status: 'Maintenance', efficiency: 0, currentJob: '', capacity: 75 }
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
              <span className="text-orange-600 font-medium">Manufacturing</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                New Work Order
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'production', 'planning', 'quality', 'maintenance', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600'
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
          <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">🏭</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manufacturing Operations</h1>
            <p className="text-gray-600">Production planning, execution, and quality management</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Work Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{workOrders.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Efficiency</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(productionLines.reduce((sum, line) => sum + line.efficiency, 0) / productionLines.length)}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏃</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Running Lines</p>
                    <p className="text-2xl font-bold text-gray-900">{productionLines.filter(line => line.status === 'Running').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Units Produced</p>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Planning</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Master Production Schedule</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Material Requirements Planning</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Capacity Planning</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Shop Floor Control</span>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                  Access Planning
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Management</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Quality Control</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Statistical Process Control</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Non-Conformance Management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Corrective Actions</span>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                  Access Quality
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Management</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Equipment Maintenance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Preventive Maintenance</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Work Order Management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Asset Performance</span>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                  Access Assets
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Management</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Product Costing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Activity-Based Costing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Variance Analysis</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Cost Rollup</span>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
                  Access Costing
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'production' && (
          <>
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Production Lines Status</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {productionLines.map((line) => (
                    <div key={line.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">{line.name}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          line.status === 'Running' ? 'bg-green-100 text-green-800' :
                          line.status === 'Idle' ? 'bg-yellow-100 text-yellow-800' :
                          line.status === 'Maintenance' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {line.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Efficiency</span>
                          <span className="text-sm font-medium">{line.efficiency}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Capacity</span>
                          <span className="text-sm font-medium">{line.capacity}/day</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Current Job</span>
                          <span className="text-sm font-medium">{line.currentJob || 'None'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Work Orders</h2>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Create Work Order
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${order.progress}%` }}></div>
                            </div>
                            <span className="text-sm text-gray-900">{order.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.dueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Released' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'On Hold' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'planning' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Master Production Schedule</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-medium text-gray-900">Week 1: Security Cameras</div>
                  <div className="text-sm text-gray-500">Planned: 150 units</div>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-medium text-gray-900">Week 2: Motion Sensors</div>
                  <div className="text-sm text-gray-500">Planned: 300 units</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-medium text-gray-900">Week 3: Control Panels</div>
                  <div className="text-sm text-gray-500">Planned: 75 units</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity Utilization</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Week</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Week</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Month Average</span>
                  <span className="font-semibold text-green-600">82%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">First Pass Yield</span>
                  <span className="font-semibold text-green-600">96.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Defect Rate</span>
                  <span className="font-semibold">0.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Returns</span>
                  <span className="font-semibold">0.2%</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active NCRs</h3>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">3</div>
                <p className="text-gray-600">Non-conformance reports</p>
                <button className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Review NCRs
                </button>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inspections</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Incoming</span>
                  <span className="text-green-600 font-semibold">12 Passed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">In-Process</span>
                  <span className="text-green-600 font-semibold">8 Passed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Final</span>
                  <span className="text-green-600 font-semibold">15 Passed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Schedule</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="font-medium text-gray-900">Camera Line - PM Service</div>
                  <div className="text-sm text-gray-500">Due: Jan 25, 2024</div>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="font-medium text-gray-900">Sensor Line - Calibration</div>
                  <div className="text-sm text-gray-500">Overdue: Jan 20, 2024</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-medium text-gray-900">Control Panel Line - Inspection</div>
                  <div className="text-sm text-gray-500">Completed: Jan 18, 2024</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Overall Equipment Effectiveness</span>
                  <span className="font-semibold">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mean Time Between Failures</span>
                  <span className="font-semibold">245 hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mean Time To Repair</span>
                  <span className="font-semibold">2.3 hrs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Analytics</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart: Production Output</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manufacturing KPIs</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">On-Time Delivery</span>
                  <span className="font-semibold text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Throughput</span>
                  <span className="font-semibold">1,247 units/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scrap Rate</span>
                  <span className="font-semibold">1.2%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}