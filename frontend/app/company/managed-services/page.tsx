'use client';

import Link from 'next/link';

export default function managedservicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/company" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/whitestart-logo.svg" alt="WhiteStart Logo" className="h-8 w-auto" />
            </Link>
            <Link href="/company" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Services
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Managed Services
              </h1>
              <p className="text-xl text-blue-800 mb-6">
                24/7 IAM Infrastructure Management & Support
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Focus on your core business while our experts manage your identity infrastructure. Comprehensive managed services ensuring optimal performance, security, and compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/company/contact" className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center">
                  Contact Us Today
                </Link>
                <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold">
                  Download Brochure
                </button>
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-3.png" alt="Managed Services" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technologies & Platforms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work with industry-leading identity and access management platforms
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Okta Admin Console</h3>
              <p className="text-gray-600">Expert implementation and optimization services for okta admin console.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ping Directory</h3>
              <p className="text-gray-600">Expert implementation and optimization services for ping directory.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Microsoft Identity Manager</h3>
              <p className="text-gray-600">Expert implementation and optimization services for microsoft identity manager.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Oracle Identity Governance</h3>
              <p className="text-gray-600">Expert implementation and optimization services for oracle identity governance.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SailPoint Compliance Manager</h3>
              <p className="text-gray-600">Expert implementation and optimization services for sailpoint compliance manager.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CyberArk PVWA</h3>
              <p className="text-gray-600">Expert implementation and optimization services for cyberark pvwa.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Proven Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach ensuring successful managed services delivery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="relative p-6 bg-white rounded-xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Infrastructure Health Monitoring</h3>
              <p className="text-gray-600">Professional infrastructure health monitoring ensuring optimal results and stakeholder satisfaction.</p>
            </div>
            
            <div className="relative p-6 bg-white rounded-xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Proactive Maintenance & Updates</h3>
              <p className="text-gray-600">Professional proactive maintenance & updates ensuring optimal results and stakeholder satisfaction.</p>
            </div>
            
            <div className="relative p-6 bg-white rounded-xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Security Patch Management</h3>
              <p className="text-gray-600">Professional security patch management ensuring optimal results and stakeholder satisfaction.</p>
            </div>
            
            <div className="relative p-6 bg-white rounded-xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Performance Optimization</h3>
              <p className="text-gray-600">Professional performance optimization ensuring optimal results and stakeholder satisfaction.</p>
            </div>
            
            <div className="relative p-6 bg-white rounded-xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Incident Response & Resolution</h3>
              <p className="text-gray-600">Professional incident response & resolution ensuring optimal results and stakeholder satisfaction.</p>
            </div>
            
            <div className="relative p-6 bg-white rounded-xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Compliance Reporting & Auditing</h3>
              <p className="text-gray-600">Professional compliance reporting & auditing ensuring optimal results and stakeholder satisfaction.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Key Benefits & Outcomes
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Since founded in 2015, <span className="text-blue-600">Whitestart</span> Security Systems Inc has delivered measurable results for enterprises worldwide. Our managed services provide tangible business value.
              </p>
              <div className="space-y-4">
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">99.9% uptime guarantee</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">Reduced operational overhead</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">Proactive issue resolution</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">Expert 24/7 monitoring</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">Predictable monthly costs</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">Enhanced security posture</span>
                </div>
                
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-7.png" alt="Benefits" className="w-full h-auto rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Success Story</h2>
              <p className="text-gray-600">How we helped a Fortune 500 company transform their identity infrastructure</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">75%</div>
                <p className="text-gray-600">Reduction in security incidents</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">50%</div>
                <p className="text-gray-600">Faster user provisioning</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">90%</div>
                <p className="text-gray-600">User satisfaction improvement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your IAM Infrastructure?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact our certified experts to discuss your managed services requirements and get a personalized consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/contact" className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Contact Us Today
            </Link>
            <Link href="/company" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold">
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}