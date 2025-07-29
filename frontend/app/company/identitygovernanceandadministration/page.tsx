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
            Identity Governance and Administration
          </h1>
          
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Automate provisioning processes, simplify security controls, build modernized IGA in cloud, achieve Zero Trust across Multi-cloud ecosystems.
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              WhiteStart can help you address all these challenges and transform your IGA posture to a future state that  is in line with industry leading practices while meeting your business objectives.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              1. Establish centralized Identity Governance (IGA) platform and integrate with authoritative source
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How Can WhiteStart Help Your IGA  Implementation
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              2. Automated lifecycle management for all user types (Joiner and Leaver)
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              3. Automation and streamlining of birthright access provisioning
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Talk to An Identity Advisor
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              4. Kick start application onboarding for crown-jewel applications into IGA platform
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              5. Enforce appropriate access rights by configuring automated access reviews and Segregation of duty (SOD) policies as part of application onboarding
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Services
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              6. Integrate IGA Platform with Privileged Access Management platform for overall governance and management of safes
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              7. Streamline application onboarding and transform into factory model for expedited and extended coverage including Role Based Access Control (RBAC)
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Solutions
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              8. Automate mover and rehire lifecycle events for identities
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              9. Integrate IGA Platform with SIEM for real-time monitoring of anomalies, alerting and automated remediation
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Company
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              WhiteStart Identity Governance and Administration Best Practices in 2023
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              In 2023, the digital landscape continues to evolve rapidly, transforming businesses and industries alike. As technology permeates every aspect of our lives, the importance of IGA cannot be overstated.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resources
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Top 10 Identity and Access Management Trends in 2023 and Beyond
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Enterprises have long struggled with identity and data security. Due to changing technologies and work environments, data, identity, and access management are increasingly important.
            </p>
            
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