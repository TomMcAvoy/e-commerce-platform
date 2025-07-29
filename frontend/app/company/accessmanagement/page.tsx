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
            Enterprise Access Management
          </h1>
          
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Secure your enterprise and protect your workforce users with the industry's leading and easy to use access management solution.
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              WhiteStart has established itself as a  leading provider of Enterprise Access Management (EAM) solutions, with many successful implementations for our valued enterprise customers. Our skilled team makes it easy and secure for your workforce to access the apps and data they need to be productive.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              At WhiteStart, we are focused on keeping your enterprise access simple yet secure.  Our solutions provide capabilities to easily keep track of user logins and enable self-service options to maximize efficiency.  We take care to ensure that users are granted access rights tailored precisely to their roles and responsibilities - no more and no less.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Talk to An Identity Advisor
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              A key differentiator for WhiteStart is our team of highly skilled and certified consultants across all major IAM vendor technologies. We offer the full spectrum of access management services to help you achieve your core EAM goals and ensure your enterprise is securely aligned to your strategic business objectives.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              From assessment and advisory to implementation, modernization, and all the way to fully managed EAM services, WhiteStart has the expertise to deliver the ideal solution for your unique needs.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Services
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Enterprise Access Management Best Practices 2023 and Beyond
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              In the age of digital transformation, enterprises are rapidly adopting new technologies to boost productivity and streamline operations.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Solutions
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              What's new in Azure Active Directory?
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Azure Active Directory (Azure AD) is a leading cloud-based identity and access management service offered by Microsoft. It provides organizations with the tools they need to manage user access, improve security, and create seamless experiences.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Company
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Creating IAM Strategy and Roadmap for Educational Institution
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              WhiteStart held numerous sessions and workshops with all the stakeholders (IT and Business) and reviewed the existing documentation to understand the current state of the IAM system compared to industry best practices.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resources
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Create a Frictionless AM Exper
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Hi there! Myself IAMate. Your virtual advisor.
            </p>
            
          </div>
          

          
          <div className="mb-8">
            
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              
              <li>Improved security - Gain granular control over access and reduce risk of data breaches.</li>
              
              <li>Increased productivity - Allow workforce to seamlessly access resources needed to do their jobs.</li>
              
              <li>Reduced costs - Automate manual processes to lower overhead for managing access.</li>
              
              <li>Enhanced compliance - Maintain consistent enforcement of security policies and regulations.</li>
              
              <li>Better visibility - Get actionable insights into access patterns and behaviors</li>
              
              <li>Future-proofed access - Adapt and scale EAM capabilities to match evolving business needs.</li>
              
            </ul>
            
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              
              <li>Speed up  modernization, transformation and integration with legacy systems.</li>
              
              <li>Consolidate disjointed identity systems into a unified, centralized EAM solution; Support any deployment model at scale - on-prem, cloud, hybrid.</li>
              
              <li>Adopt leading EAM solutions while optimizing legacy system investments</li>
              
            </ul>
            
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              
              <li>Implement single sign-on for simplified access to all authorized enterprise resources.</li>
              
              <li>Enable intelligent self-service capabilities for improved user experience and operational efficiency.</li>
              
              <li>Adopt contextual adaptive authentication and granular access policies aligned to Zero Trust principles.</li>
              
            </ul>
            
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              
              <li>Reduce legacy system complexity to streamline IT.</li>
              
              <li>Allow quick contextualized strong authentication and single sign-on (SSO) across the company.</li>
              
              <li>Passwordless authentication with mobile device biometrics or alternative  light touch technologies.</li>
              
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