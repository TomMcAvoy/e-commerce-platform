'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TimeEntry {
  id: string;
  employee: string;
  project: string;
  date: string;
  hoursWorked: number;
  overtime: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  description: string;
}

interface Timesheet {
  id: string;
  employee: string;
  weekEnding: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  status: 'Open' | 'Submitted' | 'Approved' | 'Paid';
}

export default function TimeTrackingModule() {
  const [activeTab, setActiveTab] = useState('overview');

  const timeEntries: TimeEntry[] = [
    { id: 'TE001', employee: 'John Smith', project: 'Security System Upgrade', date: '2024-01-15', hoursWorked: 8, overtime: 0, status: 'Approved', description: 'Installation and configuration' },
    { id: 'TE002', employee: 'Sarah Johnson', project: 'Network Monitoring', date: '2024-01-15', hoursWorked: 7.5, overtime: 0, status: 'Submitted', description: 'System monitoring setup' },
    { id: 'TE003', employee: 'Mike Davis', project: 'Access Control', date: '2024-01-15', hoursWorked: 9, overtime: 1, status: 'Draft', description: 'Card reader installation' }
  ];

  const timesheets: Timesheet[] = [
    { id: 'TS001', employee: 'John Smith', weekEnding: '2024-01-19', totalHours: 40, regularHours: 40, overtimeHours: 0, status: 'Approved' },
    { id: 'TS002', employee: 'Sarah Johnson', weekEnding: '2024-01-19', totalHours: 37.5, regularHours: 37.5, overtimeHours: 0, status: 'Submitted' },
    { id: 'TS003', employee: 'Mike Davis', weekEnding: '2024-01-19', totalHours: 44, regularHours: 40, overtimeHours: 4, status: 'Open' }
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
              <span className="text-indigo-600 font-medium">Time Tracking</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Clock In
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'timesheet', 'approvals', 'projects', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
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
          <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">⏰</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Time Tracking & Attendance</h1>
            <p className="text-gray-600">Comprehensive time management and workforce analytics</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Employees</p>
                    <p className="text-2xl font-bold text-gray-900">247</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⏱️</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hours This Week</p>
                    <p className="text-2xl font-bold text-gray-900">1,847</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overtime Hours</p>
                    <p className="text-2xl font-bold text-gray-900">127</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                    <p className="text-2xl font-bold text-gray-900">23</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Entry Methods</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Web-based Time Entry</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Mobile Time Tracking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Biometric Clock-in</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Project Time Allocation</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Management</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Absence Tracking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Leave Management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Shift Scheduling</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Compliance Reporting</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'timesheet' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Employee Timesheets</h2>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                New Timesheet
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week Ending</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regular Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timesheets.map((timesheet) => (
                    <tr key={timesheet.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{timesheet.employee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{timesheet.weekEnding}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{timesheet.regularHours}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{timesheet.overtimeHours}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{timesheet.totalHours}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          timesheet.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          timesheet.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                          timesheet.status === 'Paid' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {timesheet.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pending Time Approvals</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {timeEntries.filter(entry => entry.status === 'Submitted').map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{entry.employee}</h4>
                        <p className="text-sm text-gray-600">{entry.project} - {entry.date}</p>
                        <p className="text-sm text-gray-500">{entry.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{entry.hoursWorked} hours</p>
                        {entry.overtime > 0 && (
                          <p className="text-sm text-orange-600">{entry.overtime} OT</p>
                        )}
                        <div className="mt-2 space-x-2">
                          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3">
                  <div className="font-medium text-gray-900">Security System Upgrade</div>
                  <div className="text-sm text-gray-500">245 hours logged</div>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <div className="font-medium text-gray-900">Network Monitoring</div>
                  <div className="text-sm text-gray-500">156 hours logged</div>
                </div>
                <div className="border-l-4 border-purple-500 pl-3">
                  <div className="font-medium text-gray-900">Access Control</div>
                  <div className="text-sm text-gray-500">89 hours logged</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Utilization</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Billable Hours</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Non-billable</span>
                  <span className="font-semibold">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Administrative</span>
                  <span className="font-semibold">7%</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Allocation</h3>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">490</div>
                <p className="text-gray-600">Total project hours this week</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Analytics</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart: Hours by Department</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Hours/Week</span>
                  <span className="font-semibold">38.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attendance Rate</span>
                  <span className="font-semibold text-green-600">96.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overtime Rate</span>
                  <span className="font-semibold">6.8%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}