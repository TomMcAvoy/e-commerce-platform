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
              <span className="ml-2 text-xl font-bold"><span className="text-blue-600">Whitestart</span> Security Systems Inc</span>
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
            Customer Identity and Access Management
          </h1>
          
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Convert your digital channels into competitive advantage by implementing modern and secure digital solutions
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Customer Identity and Access Management (CIAM) Best Practices 2023 and Beyond
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              In the digital age, businesses across industries are increasingly reliant on online platforms to interact with their customers, deliver services, and conduct transactions.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Talk to An Identity Advisor
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              How ForgeRock Solves Complex CIAM Challenges
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              ForgeRock has been helping some of the world’s largest companies modernize with CIAM to serve many millions of customers today while providing a path to the future.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Services
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Leverage Azure Front Door for an Azure AD B2C Implementation
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Solving limitation of long URLs length (Azure AD B2C default login) using the Azure Front door to match an Interact requirement of URL length (200 chars).
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Solutions
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Modernize your customer digit
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Hi there! Myself IAMate. Your virtual advisor.
            </p>
            
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
              
              <li>Unified Customer Profile Give prospective customers simplified registration options, including identity, device and social registrations (such as LinkedIn, Facebook, Instagram, Apple).</li>
              
              <li>Identity Management WhiteStart implements secure identity lifecycle management, from registration to login, user admin and more. This ensures smooth onboarding and access..</li>
              
              <li>Consent Management We configure advanced consent capture, tracking and withdrawal capabilities. This supports compliance with data privacy regulations.</li>
              
              <li>Customer Segmentation Leveraging CIAM segmentation tools, we group customers based on attributes, behaviors and more to drive tailored experiences</li>
              
              <li>Single Sign-On WhiteStart integrates SSO capabilities across devices and apps for seamless customer access. This reduces friction.</li>
              
              <li>Multi-factor Authentication We secure access with adaptive and risk-based authentication options, preventing fraud while minimizing disruption.</li>
              
              <li>Analytics and Reporting WhiteStart implements robust CIAM analytics to provide customer insights and enable data-driven decisions.</li>
              
              <li>APIs and Integration  We excel at integrating CIAM with surrounding systems like CRM, ecommerce and marketing.</li>
              
            </ul>
            
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