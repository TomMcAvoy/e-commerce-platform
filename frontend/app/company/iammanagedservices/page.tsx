'use client';

import Link from 'next/link';

export default function SubPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/company" className="flex items-center hover:opacity-80 transition-opacity">
              <img src="/whitestart-logo.svg" alt="WhiteStart Logo" className="h-8 w-auto" />
            </Link>
            <Link href="/company" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Company
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          <span className="text-blue-600">Whitestart</span> Security Systems Inc Managed Services
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Expert identity and access management solutions tailored to your enterprise needs.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h2>
          <p className="text-gray-600 mb-6">
            Since founded in 2015, WhiteStart has rapidly become a trusted leader in Identity and Access Management (IAM) solutions that secure access and identities for enterprises.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Services</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
            <li>IAM Implementation and Configuration</li>
            <li>Security Assessment and Consulting</li>
            <li>Identity Governance Solutions</li>
            <li>Access Management Integration</li>
            <li>Compliance and Risk Management</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose WhiteStart</h2>
          <p className="text-gray-600 mb-6">
            With onshore and offshore delivery capabilities, we provide flexible 24/7 global professional services and support that meets your needs. Our Zero-Defect Quality Model ensures flawless IAM delivery.
          </p>
        </div>
        
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-4">Contact our experts to discuss your IAM requirements.</p>
          <Link href="/company" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Contact Us
          </Link>
        </div>
      </main>
    </div>
  );
}