'use client';

import Link from 'next/link';

export default function SubPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/company" className="flex items-center">
              <img src="/sharpit-images/sharpit-1.webp" alt="Logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-900">WhiteStart</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/company" className="text-gray-700 hover:text-blue-600">Home</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            WhiteStart Can Help You With Any Major IAM Technologies
          </h1>
          
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Okta
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Okta Identity Cloud is a leading SaaS-delivered converged IAM platform broadly used across both workforce and CIAM use cases. Newly acquired Auth0 Platform is a SaaS product commercialized for CIAM and developer use cases.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Auth0 is known for its developer-focused products. Auth0 has a strong focus and specialization in customer identity and access management (CIAM), for both B2C and B2B scenarios.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Learn More →
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Build Your NextGen Digital
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Hi there! Myself IAMate. Your virtual advisor.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Auth0
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Learn More →
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              More Services
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              IAM Modernization Services
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Professional Services
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Managed Services
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Staffing Augmentation
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Talk to An Identity Advisor
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Services
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Solutions
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Company
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resources
            </h2>
            
          </div>
          

          
          <div className="mb-8">
            
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              
              <li>IAM Modernization Services</li>
              
              <li>Professional Services</li>
              
              <li>Managed Services</li>
              
              <li>Advisory and Assessment</li>
              
              <li>Staff Augmentation</li>
              
              <li>vCISO</li>
              
            </ul>
            
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              
              <li>Identity Governance and Administration</li>
              
              <li>Enterprise Access Management</li>
              
              <li>Privileged Access Management</li>
              
              <li>Customer Identity and Acccess Management</li>
              
            </ul>
            
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              
              <li>About us</li>
              
              <li>Why WhiteStart</li>
              
              <li>Partners</li>
              
              <li>Careers</li>
              
              <li>Contact us</li>
              
              <li>Privacy</li>
              
            </ul>
            
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              
              <li>Whitepapers</li>
              
              <li>Case Studies</li>
              
              <li>Blogs</li>
              
              <li>Brochures</li>
              
            </ul>
            
          </div>
          
        </div>
      </section>
    </div>
  );
}