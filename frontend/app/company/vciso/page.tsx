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
            Virtual CISO
          </h1>
          
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              WhiteStart virtual CISOs provide on-demand expertise and leadership to guide you in building robust cybersecurity capabilities tailored to your organization's needs - strengthening information protection and reducing risk.
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              With cyber threats rapidly evolving, many companies recognize the need for dedicated security leadership but lack the resources for a full-time CISO. Enter the Virtual CISO (vCISO) - providing expert security guidance on a flexible, as-needed basis.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              A Virtual Chief Information Security Officer (vCISO) serves as an organization’s cybersecurity liaison and an expert on all facets of IT and the business. vCISOs are highly experienced security professionals who audit an organization’s policies, controls, and processes to mitigate risks. The vCISO model enables security guidance and modeling without requiring a full-time headcount.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Talk to An Identity Advisor
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Our vCISOs provide strategic leadership across core cybersecurity capabilities:
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Risk assessments identifying threats, vulnerabilities, business impacts and risk prioritization.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What Is A vCISO?
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Audit preparation and remediation roadmap
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Incident Response
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              WhiteStart vCISO-As-A-Service
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Incident response planning and runbook development
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Incident response testing and simulations
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              WhiteStart Methodology
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Policies and Standards
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Information security policies and standards development
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              WhiteStart vCISO Service Benifits
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Guidance on regulatory compliance requirements and frameworks such as PCI DSS, HIPAA, GDPR, and CCPA.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Security Operations
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Services
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Security monitoring, alerting, investigation and threat hunting
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Implementation of essential security tools like SIEM
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Solutions
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Cybersecurity metrics,KPIs and executive reporting.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Vendor risk assessments and management
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Company
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Cyber insurance evaluation and guidance.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Awareness and Training
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resources
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Security awareness campaigns and training
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              • Social engineering testing and red team exercises
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