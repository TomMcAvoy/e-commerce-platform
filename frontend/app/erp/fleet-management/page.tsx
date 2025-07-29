'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Vehicle {
  id: string;
  vehicleNumber: string;
  type: 'Truck' | 'Van' | 'Car' | 'Bus';
  make: string;
  model: string;
  year: number;
  mileage: number;
  status: 'Active' | 'Maintenance' | 'Out of Service' | 'Available';
  driver: string;
  location: string;
}

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'Preventive' | 'Corrective' | 'Emergency';
  description: string;
  cost: number;
  date: string;
  nextService: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

interface Route {
  id: string;
  routeName: string;
  driver: string;
  vehicle: string;
  startTime: string;
  estimatedDuration: string;
  stops: number;
  distance: number;
  status: 'Planned' | 'In Transit' | 'Completed' | 'Delayed';
}

export default function FleetManagementModule() {
  const [activeTab, setActiveTab] = useState('overview');

  const vehicles: Vehicle[] = [
    { id: 'VEH001', vehicleNumber: 'TRK-001', type: 'Truck', make: 'Freightliner', model: 'Cascadia', year: 2022, mileage: 45000, status: 'Active', driver: 'John Smith', location: 'Route 401' },
    { id: 'VEH002', vehicleNumber: 'VAN-002', type: 'Van', make: 'Ford', model: 'Transit', year: 2021, mileage: 32000, status: 'Maintenance', driver: 'Sarah Johnson', location: 'Service Bay 2' },
    { id: 'VEH003', vehicleNumber: 'CAR-003', type: 'Car', make: 'Toyota', model: 'Camry', year: 2023, mileage: 18000, status: 'Available', driver: 'Unassigned', location: 'Depot' }
  ];

  const maintenanceRecords: MaintenanceRecord[] = [
    { id: 'MNT001', vehicleId: 'VEH001', type: 'Preventive', description: 'Oil change and filter replacement', cost: 150.00, date: '2024-01-10', nextService: '2024-04-10', status: 'Completed' },
    { id: 'MNT002', vehicleId: 'VEH002', type: 'Corrective', description: 'Brake pad replacement', cost: 450.00, date: '2024-01-15', nextService: '2024-07-15', status: 'In Progress' },
    { id: 'MNT003', vehicleId: 'VEH003', type: 'Preventive', description: 'Tire rotation and inspection', cost: 80.00, date: '2024-01-20', nextService: '2024-04-20', status: 'Scheduled' }
  ];

  const routes: Route[] = [
    { id: 'RT001', routeName: 'Downtown Delivery', driver: 'John Smith', vehicle: 'TRK-001', startTime: '08:00', estimatedDuration: '6 hours', stops: 12, distance: 145, status: 'In Transit' },
    { id: 'RT002', routeName: 'Suburban Route', driver: 'Mike Davis', vehicle: 'VAN-004', startTime: '09:00', estimatedDuration: '4 hours', stops: 8, distance: 89, status: 'Planned' },
    { id: 'RT003', routeName: 'Express Service', driver: 'Lisa Wilson', vehicle: 'CAR-003', startTime: '10:30', estimatedDuration: '3 hours', stops: 5, distance: 67, status: 'Delayed' }
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
              <span className="text-amber-600 font-medium">Fleet Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Dispatch Vehicle
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'vehicles', 'maintenance', 'routes', 'drivers', 'fuel', 'compliance', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-amber-500 text-amber-600'
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
          <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">🚛</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fleet Management System</h1>
            <p className="text-gray-600">Comprehensive vehicle and transportation management</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🚗</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                    <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
                    <p className="text-2xl font-bold text-gray-900">{vehicles.filter(v => v.status === 'Active').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🛣️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Routes</p>
                    <p className="text-2xl font-bold text-gray-900">{routes.filter(r => r.status === 'In Transit').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚙️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Maintenance</p>
                    <p className="text-2xl font-bold text-gray-900">{vehicles.filter(v => v.status === 'Maintenance').length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Management Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Real-time GPS Tracking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Preventive Maintenance Scheduling</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Fuel Management & Optimization</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Driver Performance Monitoring</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Route Optimization</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Compliance Management</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fleet Utilization</span>
                    <span className="font-semibold">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average MPG</span>
                    <span className="font-semibold">8.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">On-Time Delivery</span>
                    <span className="font-semibold text-green-600">94.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maintenance Cost/Mile</span>
                    <span className="font-semibold">$0.18</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Vehicle Fleet</h2>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Add Vehicle
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make/Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{vehicle.vehicleNumber}</div>
                        <div className="text-sm text-gray-500">{vehicle.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          vehicle.type === 'Truck' ? 'bg-blue-100 text-blue-800' :
                          vehicle.type === 'Van' ? 'bg-green-100 text-green-800' :
                          vehicle.type === 'Car' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {vehicle.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.make} {vehicle.model}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.mileage.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.driver}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          vehicle.status === 'Active' ? 'bg-green-100 text-green-800' :
                          vehicle.status === 'Available' ? 'bg-blue-100 text-blue-800' :
                          vehicle.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Maintenance Records</h2>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Schedule Maintenance
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {maintenanceRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.vehicleId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.type === 'Preventive' ? 'bg-green-100 text-green-800' :
                          record.type === 'Corrective' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {record.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.cost.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.nextService}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          record.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'routes' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Route Management</h2>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                Plan Route
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stops</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {routes.map((route) => (
                    <tr key={route.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{route.routeName}</div>
                        <div className="text-sm text-gray-500">{route.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.driver}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.vehicle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.startTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{route.estimatedDuration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.stops}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{route.distance} km</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          route.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          route.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          route.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {route.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Safety Score</span>
                  <span className="font-semibold text-green-600">94.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Efficiency</span>
                  <span className="font-semibold">8.4 MPG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">On-Time Rate</span>
                  <span className="font-semibold">96.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hours of Service</span>
                  <span className="font-semibold">42.5/70</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">License Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">CDL Class A</span>
                  <span className="text-green-600 font-semibold">Valid</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Medical Certificate</span>
                  <span className="text-green-600 font-semibold">Valid</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">HazMat Endorsement</span>
                  <span className="text-yellow-600 font-semibold">Expires Soon</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Drug Test</span>
                  <span className="text-green-600 font-semibold">Current</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Status</h3>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900 mb-2">85%</div>
                <p className="text-gray-600">Training Complete</p>
                <p className="text-sm text-gray-500 mt-2">Next: Defensive Driving</p>
                <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                  Schedule Training
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fuel' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel Consumption</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Daily Consumption</span>
                  <span className="font-semibold">1,247 gallons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Cost/Gallon</span>
                  <span className="font-semibold">$3.45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fleet Average MPG</span>
                  <span className="font-semibold">8.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Fuel Cost</span>
                  <span className="font-semibold">$128,450</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel Card Management</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-3">
                  <div className="font-medium text-gray-900">Active Cards</div>
                  <div className="text-sm text-gray-500">247 cards issued</div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3">
                  <div className="font-medium text-gray-900">Pending Transactions</div>
                  <div className="text-sm text-gray-500">12 awaiting approval</div>
                </div>
                <div className="border-l-4 border-red-500 pl-3">
                  <div className="font-medium text-gray-900">Suspicious Activity</div>
                  <div className="text-sm text-gray-500">2 flagged transactions</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DOT Compliance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Hours of Service</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Compliant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Vehicle Inspections</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Current</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Driver Qualifications</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Review Needed</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Drug & Alcohol Testing</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Compliant</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Safety Score</span>
                  <span className="font-semibold text-green-600">94.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accidents (YTD)</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Violations (YTD)</span>
                  <span className="font-semibold">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CSA Score</span>
                  <span className="font-semibold text-green-600">Satisfactory</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Analytics</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart: Fleet Utilization Trends</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost per Mile</span>
                  <span className="font-semibold">$1.85</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue per Mile</span>
                  <span className="font-semibold text-green-600">$2.45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle Downtime</span>
                  <span className="font-semibold">4.2%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}