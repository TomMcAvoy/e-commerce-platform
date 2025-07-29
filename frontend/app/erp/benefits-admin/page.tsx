'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BenefitPlan {
  id: string;
  name: string;
  type: 'Health' | 'Dental' | 'Vision' | 'Life' | 'Disability' | 'Retirement';
  provider: string;
  enrolledEmployees: number;
  totalEmployees: number;
  monthlyCost: number;
  status: 'Active' | 'Inactive' | 'Pending';
}

interface Enrollment {
  id: string;
  employee: string;
  plan: string;
  enrollmentDate: string;
  effectiveDate: string;
  status: 'Active' | 'Pending' | 'Terminated';
  dependents: number;
}

export default function BenefitsAdminModule() {
  const [activeTab, setActiveTab] = useState('overview');

  const benefitPlans: BenefitPlan[] = [
    { id: 'BP001', name: 'Premium Health Plan', type: 'Health', provider: 'Blue Cross Blue Shield', enrolledEmployees: 156, totalEmployees: 200, monthlyCost: 450, status: 'Active' },
    { id: 'BP002', name: 'Basic Dental Coverage', type: 'Dental', provider: 'Delta Dental', enrolledEmployees: 134, totalEmployees: 200, monthlyCost: 85, status: 'Active' },
    { id: 'BP003', name: 'Vision Care Plan', type: 'Vision', provider: 'VSP', enrolledEmployees: 98, totalEmployees: 200, monthlyCost: 25, status: 'Active' },
    { id: 'BP004', name: '401(k) Retirement Plan', type: 'Retirement', provider: 'Fidelity', enrolledEmployees: 178, totalEmployees: 200, monthlyCost: 0, status: 'Active' }
  ];

  const enrollments: Enrollment[] = [
    { id: 'EN001', employee: 'John Smith', plan: 'Premium Health Plan', enrollmentDate: '2024-01-01', effectiveDate: '2024-01-01', status: 'Active', dependents: 2 },
    { id: 'EN002', employee: 'Sarah Johnson', plan: 'Basic Dental Coverage', enrollmentDate: '2024-01-15', effectiveDate: '2024-02-01', status: 'Pending', dependents: 1 },
    { id: 'EN003', employee: 'Mike Davis', plan: 'Vision Care Plan', enrollmentDate: '2023-12-15', effectiveDate: '2024-01-01', status: 'Active', dependents: 0 }
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
              <span className="text-teal-600 font-medium">Benefits Administration</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Open Enrollment
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['overview', 'plans', 'enrollment', 'claims', 'compliance', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-teal-500 text-teal-600'
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
          <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-3xl">🏥</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Benefits Administration</h1>
            <p className="text-gray-600">Comprehensive employee benefits management and enrollment</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Plans</p>
                    <p className="text-2xl font-bold text-gray-900">{benefitPlans.filter(p => p.status === 'Active').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Enrolled Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round((benefitPlans.reduce((sum, plan) => sum + plan.enrolledEmployees, 0) / benefitPlans.reduce((sum, plan) => sum + plan.totalEmployees, 0)) * 100)}%</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                    <p className="text-2xl font-bold text-gray-900">${benefitPlans.reduce((sum, plan) => sum + (plan.monthlyCost * plan.enrolledEmployees), 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                    <p className="text-2xl font-bold text-gray-900">87%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Enrollment Summary</h3>
                <div className="space-y-4">
                  {benefitPlans.map((plan) => (
                    <div key={plan.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.type} - {plan.provider}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{plan.enrolledEmployees}/{plan.totalEmployees}</div>
                        <div className="text-sm text-gray-500">{Math.round((plan.enrolledEmployees / plan.totalEmployees) * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits Administration Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Employee Self-Service Portal</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Automated Enrollment Processing</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">COBRA Administration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Compliance Reporting</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Claims Management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Carrier Integration</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'plans' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Benefit Plans</h2>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Add Plan
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {benefitPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                        <div className="text-sm text-gray-500">{plan.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          plan.type === 'Health' ? 'bg-red-100 text-red-800' :
                          plan.type === 'Dental' ? 'bg-blue-100 text-blue-800' :
                          plan.type === 'Vision' ? 'bg-green-100 text-green-800' :
                          plan.type === 'Retirement' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {plan.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.provider}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.enrolledEmployees}/{plan.totalEmployees} ({Math.round((plan.enrolledEmployees / plan.totalEmployees) * 100)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.monthlyCost > 0 ? `$${plan.monthlyCost}` : 'Employer Paid'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          plan.status === 'Active' ? 'bg-green-100 text-green-800' :
                          plan.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
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

        {activeTab === 'enrollment' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Employee Enrollments</h2>
              <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                Process Enrollment
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dependents</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enrollment.employee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enrollment.plan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.enrollmentDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enrollment.effectiveDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{enrollment.dependents}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          enrollment.status === 'Active' ? 'bg-green-100 text-green-800' :
                          enrollment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {enrollment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Claims</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processed</span>
                  <span className="font-semibold text-green-600">1,156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-yellow-600">67</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Denied</span>
                  <span className="font-semibold text-red-600">24</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims by Type</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Medical</span>
                  <span className="font-semibold">$145,670</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Dental</span>
                  <span className="font-semibold">$23,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Vision</span>
                  <span className="font-semibold">$8,920</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Prescription</span>
                  <span className="font-semibold">$34,560</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Time</h3>
              <div className="text-center py-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">2.3</div>
                <p className="text-gray-600">Average days to process</p>
                <p className="text-sm text-gray-500 mt-2">95% within 5 days</p>
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
                  <span className="text-gray-700">ACA Reporting</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Compliant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">COBRA Administration</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Compliant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">HIPAA Privacy</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Compliant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">ERISA Fiduciary</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Review Needed</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="font-medium text-gray-900">Form 1095-C Filing</div>
                  <div className="text-sm text-gray-500">Due: March 31, 2024</div>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="font-medium text-gray-900">Summary Plan Description Update</div>
                  <div className="text-sm text-gray-500">Due: April 15, 2024</div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="font-medium text-gray-900">Annual Enrollment Period</div>
                  <div className="text-sm text-gray-500">Starts: October 1, 2024</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits Analytics</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Chart: Enrollment Trends</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Employee Satisfaction</span>
                  <span className="font-semibold text-green-600">4.2/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost Per Employee</span>
                  <span className="font-semibold">$1,247/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan Utilization</span>
                  <span className="font-semibold">87%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}