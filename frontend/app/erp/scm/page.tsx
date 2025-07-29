'use client';

import { useState } from 'react';
import Link from 'next/link';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  unitCost: number;
  location: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface PurchaseOrder {
  id: string;
  vendor: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  status: 'Draft' | 'Approved' | 'Sent' | 'Received' | 'Cancelled';
  items: number;
}

export default function SCMModule() {
  const [activeTab, setActiveTab] = useState('overview');

  const inventory: InventoryItem[] = [
    { id: 'INV001', name: 'Security Camera HD', sku: 'CAM-HD-001', category: 'Cameras', quantity: 45, reorderPoint: 20, unitCost: 299.99, location: 'Warehouse A', status: 'In Stock' },
    { id: 'INV002', name: 'Motion Sensor', sku: 'SEN-MOT-002', category: 'Sensors', quantity: 8, reorderPoint: 15, unitCost: 89.99, location: 'Warehouse B', status: 'Low Stock' },
    { id: 'INV003', name: 'Access Control Panel', sku: 'ACP-PRO-003', category: 'Access Control', quantity: 0, reorderPoint: 5, unitCost: 599.99, location: 'Warehouse A', status: 'Out of Stock' }
  ];

  const purchaseOrders: PurchaseOrder[] = [
    { id: 'PO-2024-001', vendor: 'SecureTech Solutions', orderDate: '2024-01-15', deliveryDate: '2024-01-25', totalAmount: 15750.00, status: 'Approved', items: 25 },
    { id: 'PO-2024-002', vendor: 'SafeGuard Systems', orderDate: '2024-01-16', deliveryDate: '2024-01-28', totalAmount: 8900.50, status: 'Sent', items: 15 },
    { id: 'PO-2024-003', vendor: 'ProSecurity Inc', orderDate: '2024-01-17', deliveryDate: '2024-02-01', totalAmount: 22400.00, status: 'Draft', items: 40 }
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
              <span className="text-purple-600 font-medium">Supply Chain Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Create Order
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'inventory', 'orders', 'vendors', 'logistics', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-purple-500 text-purple-600'
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
          <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">🚚</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Supply Chain Management</h1>
            <p className="text-gray-600">End-to-end supply chain visibility and control</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📦</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total SKUs</p>
                    <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{inventory.filter(i => i.status === 'In Stock').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚠️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{inventory.filter(i => i.status === 'Low Stock').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">❌</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-gray-900">{inventory.filter(i => i.status === 'Out of Stock').length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Management</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Stock Control</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Warehouse Management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Cycle Counting</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">ABC Analysis</span>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  Access Inventory
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Management</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Sales Orders</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Purchase Orders</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Order Fulfillment</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Backorder Management</span>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  Access Orders
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Inventory Management</h2>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Add Item
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                        {item.quantity <= item.reorderPoint && (
                          <span className="ml-2 text-xs text-red-600">(Reorder)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.unitCost}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                          item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Purchase Orders</h2>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Create PO
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.vendor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.orderDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.deliveryDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          order.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                          order.status === 'Received' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
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
        )}

        {activeTab === 'vendors' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vendors</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">SecureTech Solutions</span>
                  <span className="text-green-600 font-semibold">$45K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">SafeGuard Systems</span>
                  <span className="text-green-600 font-semibold">$32K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">ProSecurity Inc</span>
                  <span className="text-green-600 font-semibold">$28K</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">On-Time Delivery</span>
                  <span className="text-green-600 font-semibold">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Quality Score</span>
                  <span className="text-green-600 font-semibold">4.6/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Response Time</span>
                  <span className="text-green-600 font-semibold">2.3 hrs</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Contracts</h3>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">12</div>
                <p className="text-gray-600">Active vendor contracts</p>
                <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Manage Contracts
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipment Tracking</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-medium text-gray-900">Shipment #SH-2024-001</div>
                  <div className="text-sm text-gray-500">In Transit - Expected: Jan 25</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-medium text-gray-900">Shipment #SH-2024-002</div>
                  <div className="text-sm text-gray-500">Delivered - Jan 20</div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="font-medium text-gray-900">Shipment #SH-2024-003</div>
                  <div className="text-sm text-gray-500">Processing - Expected: Jan 30</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Logistics KPIs</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Delivery Time</span>
                  <span className="font-semibold">5.2 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Cost Ratio</span>
                  <span className="font-semibold">3.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Damage Rate</span>
                  <span className="font-semibold text-green-600">0.2%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain Analytics</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart: Inventory Turnover</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Inventory Turnover</span>
                  <span className="font-semibold">8.2x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fill Rate</span>
                  <span className="font-semibold text-green-600">96.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Accuracy</span>
                  <span className="font-semibold">99.1%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}