'use client';

import Link from 'next/link';

export default function OpenStackArchitecturePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/company" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/whitestart-logo.svg" alt="WhiteStart Logo" className="h-8 w-auto" />
            </Link>
            <Link href="/company/devsecops" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to DevSecOps
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-purple-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                OpenStack Private Cloud DevSecOps
              </h1>
              <p className="text-xl text-purple-800 mb-6">
                Enterprise Security-First Container Platform Operations
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Comprehensive DevSecOps implementation on OpenStack Private Cloud with enterprise-grade security, compliance frameworks, and cloud-native best practices for scalable operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/company/contact" className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-center">
                  Get OpenStack Consultation
                </Link>
                <button className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors font-semibold">
                  Download OpenStack Guide
                </button>
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-8.png" alt="OpenStack Architecture" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              OpenStack DevSecOps Service Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              OpenStack Private Cloud services optimized for security, compliance, and operational excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-purple-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compute & Containers</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Nova (Compute)</li>
                <li>• Ironic (Bare Metal)</li>
                <li>• Zun (Containers)</li>
                <li>• Magnum (Container Orchestration)</li>
                <li>• Heat (Orchestration)</li>
              </ul>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Services</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Keystone (Identity)</li>
                <li>• Barbican (Key Management)</li>
                <li>• Octavia (Load Balancing)</li>
                <li>• Designate (DNS)</li>
                <li>• Mistral (Workflow)</li>
              </ul>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Networking</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Neutron (Networking)</li>
                <li>• Kuryr (Container Networking)</li>
                <li>• Tacker (NFV)</li>
                <li>• Congress (Policy)</li>
                <li>• Vitrage (Root Cause Analysis)</li>
              </ul>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DevOps Tools</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Zuul (CI/CD)</li>
                <li>• Ansible Integration</li>
                <li>• Kolla (Containerized Deployment)</li>
                <li>• TripleO (Deployment)</li>
                <li>• OpenStack-Helm</li>
              </ul>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring & Observability</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Telemetry (Ceilometer)</li>
                <li>• Panko (Events)</li>
                <li>• Aodh (Alarming)</li>
                <li>• Gnocchi (Metrics)</li>
                <li>• Monasca (Monitoring)</li>
              </ul>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tools</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• OpenStack Security Scanner</li>
                <li>• Anchor (Certificate Authority)</li>
                <li>• Bandit (Security Linter)</li>
                <li>• OpenStack Policy Engine</li>
                <li>• Keystone Federation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Standards & Compliance */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                OpenStack Security & Compliance
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                OpenStack Private Cloud maintains enterprise security standards enabling secure DevSecOps implementations with comprehensive compliance coverage.
              </p>
              <div className="space-y-4">
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">OpenStack Security Guide</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">NIST Cybersecurity Framework</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">ISO 27001/27002 Compliance</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">Common Criteria Evaluation</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">FIPS 140-2 Cryptographic Standards</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">OpenStack Interoperability Guidelines</span>
                </div>
                
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">OpenStack Platform Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                  <p className="text-gray-600">Platform Availability</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                  <p className="text-gray-600">Security Monitoring</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
                  <p className="text-gray-600">Security Controls</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">Zero</div>
                  <p className="text-gray-600">Trust Security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              OpenStack DevSecOps Implementation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven methodology for secure, scalable DevSecOps on OpenStack Private Cloud
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-purple-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Platform Assessment</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Current OpenStack environment analysis</li>
                <li>• Security posture evaluation</li>
                <li>• Compliance gap assessment</li>
                <li>• Migration planning</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-purple-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Security Configuration</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• OpenStack security hardening</li>
                <li>• Network security policies</li>
                <li>• Identity and access controls</li>
                <li>• Monitoring setup</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-purple-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">DevSecOps Pipeline</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• CI/CD pipeline integration</li>
                <li>• Security testing automation</li>
                <li>• Compliance validation</li>
                <li>• Deployment automation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Implement OpenStack DevSecOps?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Get expert guidance on OpenStack Private Cloud DevSecOps architecture and implementation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/contact" className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Schedule OpenStack Consultation
            </Link>
            <Link href="/company/devsecops" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-purple-600 transition-colors font-semibold">
              View DevSecOps Overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}