'use client';

import Link from 'next/link';

export default function GCPArchitecturePage() {
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
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Google Cloud Platform DevSecOps Architecture
              </h1>
              <p className="text-xl text-green-800 mb-6">
                Enterprise-Grade Security-First Development Operations on GCP
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Comprehensive DevSecOps implementation leveraging Google Cloud Platform native services, security best practices, and industry-standard compliance frameworks for scalable, secure cloud operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/company/contact" className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-center">
                  Get GCP Assessment
                </Link>
                <button className="px-8 py-4 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors font-semibold">
                  Download GCP Guide
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                {/* GCP Logo */}
                <svg className="w-64 h-32" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* GCP Text */}
                  <text x="50" y="50" className="text-4xl font-bold fill-green-600">GCP</text>
                  {/* Cloud shape */}
                  <path d="M80 80 C60 70, 40 80, 40 100 C40 120, 60 130, 80 130 L220 130 C240 130, 260 120, 260 100 C260 80, 240 70, 220 80 C210 70, 190 70, 190 80 Z" 
                        fill="#4285F4" opacity="0.2"/>
                  {/* Architecture elements */}
                  <circle cx="80" cy="100" r="10" fill="#34A853"/>
                  <circle cx="120" cy="100" r="10" fill="#FBBC05"/>
                  <circle cx="160" cy="100" r="10" fill="#EA4335"/>
                  <circle cx="200" cy="100" r="10" fill="#4285F4"/>
                  <circle cx="240" cy="100" r="10" fill="#34A853"/>
                  {/* Connection lines */}
                  <line x1="90" y1="100" x2="110" y2="100" stroke="#4285F4" strokeWidth="2"/>
                  <line x1="130" y1="100" x2="150" y2="100" stroke="#4285F4" strokeWidth="2"/>
                  <line x1="170" y1="100" x2="190" y2="100" stroke="#4285F4" strokeWidth="2"/>
                  <line x1="210" y1="100" x2="230" y2="100" stroke="#4285F4" strokeWidth="2"/>
                  {/* Service labels */}
                  <text x="75" y="125" className="text-xs fill-green-600">GCE</text>
                  <text x="113" y="125" className="text-xs fill-green-600">GKE</text>
                  <text x="145" y="125" className="text-xs fill-green-600">SQL</text>
                  <text x="185" y="125" className="text-xs fill-green-600">GCS</text>
                  <text x="225" y="125" className="text-xs fill-green-600">IAM</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              GCP DevSecOps Service Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Native Google Cloud Platform services optimized for security, compliance, and operational excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compute & Containers</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Compute Engine</li>
                <li>• GKE</li>
                <li>• Cloud Run</li>
                <li>• Functions</li>
                <li>• App Engine</li>
              </ul>
            </div>

            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Services</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• IAM</li>
                <li>• Secret Manager</li>
                <li>• KMS</li>
                <li>• Security Command Center</li>
                <li>• Cloud Armor</li>
              </ul>
            </div>

            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Networking</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• VPC</li>
                <li>• API Gateway</li>
                <li>• Cloud CDN</li>
                <li>• DNS</li>
                <li>• Load Balancing</li>
              </ul>
            </div>

            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DevOps Tools</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Cloud Build</li>
                <li>• Deploy</li>
                <li>• Source Repos</li>
                <li>• Deployment Manager</li>
                <li>• Skaffold</li>
              </ul>
            </div>

            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring & Observability</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Operations Suite</li>
                <li>• Trace</li>
                <li>• Audit Logs</li>
                <li>• Error Reporting</li>
                <li>• Profiler</li>
              </ul>
            </div>

            <div className="p-6 bg-green-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tools</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Security Command Center</li>
                <li>• Forseti Security</li>
                <li>• Binary Authorization</li>
                <li>• Container Analysis</li>
                <li>• Cloud Security Scanner</li>
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
                GCP Compliance & Standards
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Google Cloud Platform maintains the highest security and compliance standards, enabling enterprise-grade DevSecOps implementations.
              </p>
              <div className="space-y-4">
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">Google Cloud Architecture Framework</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">Google Security Best Practices</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">ISO 27001/27017/27018</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">SOC 1/2/3 Reports</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">FedRAMP Moderate Authorization</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">CSA STAR Level 1</span>
                </div>
                
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">GCP Security Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                  <p className="text-gray-600">Service Uptime SLA</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                  <p className="text-gray-600">Security Monitoring</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">100+</div>
                  <p className="text-gray-600">Compliance Controls</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">Zero</div>
                  <p className="text-gray-600">Trust Architecture</p>
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
              GCP DevSecOps Implementation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven methodology for implementing secure, scalable DevSecOps on Google Cloud Platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-green-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Assessment & Planning</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Current state GCP environment analysis</li>
                <li>• Security posture assessment</li>
                <li>• Compliance gap identification</li>
                <li>• Migration strategy development</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-green-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Infrastructure Setup</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• GCP landing zone configuration</li>
                <li>• Network security implementation</li>
                <li>• Identity and access management</li>
                <li>• Monitoring and logging setup</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-green-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Pipeline Implementation</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• CI/CD pipeline configuration</li>
                <li>• Security testing integration</li>
                <li>• Automated compliance checks</li>
                <li>• Deployment automation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Implement GCP DevSecOps?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Get expert guidance on Google Cloud Platform DevSecOps architecture and implementation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/contact" className="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Schedule GCP Consultation
            </Link>
            <Link href="/company/devsecops" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-green-600 transition-colors font-semibold">
              View DevSecOps Overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}