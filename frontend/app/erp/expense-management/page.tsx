'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ExpenseReport {
  id: string;
  employee: string;
  title: string;
  totalAmount: number;
  submittedDate: string;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Paid';
  expenseCount: number;
}

interface Expense {
  id: string;
  category: string;
  merchant: string;
  amount: number;
  date: string;
  description: string;
  receiptStatus: 'Required' | 'Attached' | 'Missing';
}

export default function ExpenseManagementModule() {
  const [activeTab, setActiveTab] = useState('overview');

  const expenseReports: ExpenseReport[] = [
    { id: 'ER001', employee: 'John Smith', title: 'Business Trip - Chicago', totalAmount: 1247.50, submittedDate: '2024-01-15', status: 'Approved', expenseCount: 8 },
    { id: 'ER002', employee: 'Sarah Johnson', title: 'Client Meeting Expenses', totalAmount: 456.75, submittedDate: '2024-01-16', status: 'Submitted', expenseCount: 4 },
    { id: 'ER003', employee: 'Mike Davis', title: 'Training Conference', totalAmount: 892.30, submittedDate: '2024-01-17', status: 'Draft', expenseCount: 6 }
  ];

  const expenses: Expense[] = [
    { id: 'EXP001', category: 'Travel', merchant: 'United Airlines', amount: 450.00, date: '2024-01-10', description: 'Flight to Chicago', receiptStatus: 'Attached' },
    { id: 'EXP002', category: 'Meals', merchant: 'Restaurant ABC', amount: 67.50, date: '2024-01-11', description: 'Client dinner', receiptStatus: 'Attached' },
    { id: 'EXP003', category: 'Lodging', merchant: 'Hilton Hotel', amount: 189.00, date: '2024-01-11', description: 'Hotel accommodation', receiptStatus: 'Missing' }
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
              <span className="text-emerald-600 font-medium">Expense Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                New Expense
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'reports', 'expenses', 'approvals', 'reimbursements', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-600'
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
          <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">💳</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
            <p className="text-gray-600">Streamlined expense reporting and reimbursement processing</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">${expenseReports.reduce((sum, report) => sum + report.totalAmount, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{expenseReports.filter(r => r.status === 'Submitted').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
                    <p className="text-2xl font-bold text-gray-900">3.2 days</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Reimbursed</p>
                    <p className="text-2xl font-bold text-gray-900">$12,450</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Categories</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Travel & Transportation</span>
                    <span className="font-semibold">$8,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Meals & Entertainment</span>
                    <span className="font-semibold">$3,200</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Office Supplies</span>
                    <span className="font-semibold">$1,890</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Training & Development</span>
                    <span className="font-semibold">$2,340</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Management Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Mobile Receipt Capture</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Automated Expense Categorization</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Policy Compliance Checking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Multi-level Approval Workflow</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Integration with Accounting</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Expense Reports</h2>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Create Report
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenseReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        <div className="text-sm text-gray-500">{report.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.employee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${report.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.expenseCount} items</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.submittedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          report.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                          report.status === 'Paid' ? 'bg-purple-100 text-purple-800' :
                          report.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Individual Expenses</h2>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Add Expense
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.merchant}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${expense.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expense.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          expense.receiptStatus === 'Attached' ? 'bg-green-100 text-green-800' :
                          expense.receiptStatus === 'Required' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {expense.receiptStatus}
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
              <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {expenseReports.filter(report => report.status === 'Submitted').map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{report.title}</h4>
                        <p className="text-sm text-gray-600">{report.employee} - {report.expenseCount} expenses</p>
                        <p className="text-sm text-gray-500">Submitted: {report.submittedDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${report.totalAmount.toFixed(2)}</p>
                        <div className="mt-2 space-x-2">
                          <button className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                            Approve
                          </button>
                          <button className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
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

        {activeTab === 'reimbursements' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reimbursement Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved for Payment</span>
                  <span className="font-semibold">$8,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing</span>
                  <span className="font-semibold">$2,340</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid</span>
                  <span className="font-semibold text-green-600">$12,450</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Direct Deposit</span>
                  <span className="text-green-600 font-semibold">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Check</span>
                  <span className="text-blue-600 font-semibold">12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Corporate Card</span>
                  <span className="text-purple-600 font-semibold">3%</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Payment Run</h3>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-gray-900 mb-2">Jan 25</div>
                <p className="text-gray-600">Next scheduled payment</p>
                <p className="text-sm text-gray-500 mt-2">$5,670 to be processed</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Trends</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart: Monthly Expense Trends</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Report Value</span>
                  <span className="font-semibold">$865</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Policy Violations</span>
                  <span className="font-semibold text-red-600">2.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Receipt Compliance</span>
                  <span className="font-semibold text-green-600">94.5%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}