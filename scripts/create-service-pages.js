const fs = require('fs');
const path = require('path');

const services = [
  {
    slug: 'iam-modernization',
    title: 'IAM Modernization Services',
    subtitle: 'Transform Your Legacy Identity Systems',
    description: 'Modernize your identity and access management infrastructure with our comprehensive transformation services.',
    icon: 'M10 2L3 7v11h4v-6h6v6h4V7l-7-5z',
    color: 'blue',
    features: [
      'Legacy System Assessment',
      'Modern IAM Architecture Design', 
      'Migration Planning & Execution',
      'Cloud-Native Implementation',
      'Zero-Trust Integration',
      'Performance Optimization'
    ],
    benefits: [
      'Reduced Security Risks',
      'Improved User Experience',
      'Lower Operational Costs',
      'Enhanced Scalability',
      'Regulatory Compliance',
      'Future-Ready Architecture'
    ]
  },
  {
    slug: 'professional-services',
    title: 'Professional Services',
    subtitle: 'Expert IAM Implementation & Consulting',
    description: 'Accelerate your IAM implementation with industry experts. Over a decade of experience in identity and access management.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'green',
    features: [
      'IAM Strategy & Planning',
      'Implementation Services',
      'Integration Consulting',
      'Custom Development',
      'Training & Knowledge Transfer',
      'Ongoing Support'
    ],
    benefits: [
      'Faster Time to Value',
      'Reduced Implementation Risk',
      'Best Practice Implementation',
      'Expert Guidance',
      'Cost-Effective Solutions',
      'Proven Methodologies'
    ]
  },
  {
    slug: 'managed-services',
    title: 'Managed Services',
    subtitle: 'Complete IAM Infrastructure Management',
    description: 'Let our experts manage your IAM infrastructure while you focus on core business operations.',
    icon: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
    color: 'purple',
    features: [
      '24/7 Monitoring & Support',
      'Proactive Maintenance',
      'Security Updates & Patches',
      'Performance Optimization',
      'Incident Response',
      'Compliance Management'
    ],
    benefits: [
      'Reduced Operational Burden',
      'Improved System Uptime',
      'Enhanced Security Posture',
      'Predictable Costs',
      'Expert Management',
      'Focus on Core Business'
    ]
  },
  {
    slug: 'virtual-ciso',
    title: 'Virtual CISO Services',
    subtitle: 'Executive-Level Security Leadership',
    description: 'Executive-level cybersecurity leadership without the full-time cost. Strategic security guidance for evolving threats.',
    icon: 'M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z',
    color: 'red',
    features: [
      'Security Strategy Development',
      'Risk Assessment & Management',
      'Compliance Oversight',
      'Incident Response Planning',
      'Security Awareness Training',
      'Board & Executive Reporting'
    ],
    benefits: [
      'Cost-Effective Leadership',
      'Immediate Expertise',
      'Strategic Security Vision',
      'Regulatory Compliance',
      'Risk Mitigation',
      'Executive Communication'
    ]
  },
  {
    slug: 'staff-augmentation',
    title: 'Staff Augmentation',
    subtitle: 'Expert IAM Talent On-Demand',
    description: 'Exclusive access to industry\'s best identity and access management talent through our staff augmentation services.',
    icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z',
    color: 'yellow',
    features: [
      'Certified IAM Professionals',
      'Flexible Engagement Models',
      'Rapid Team Scaling',
      'Specialized Skill Sets',
      'Project-Based Resources',
      'Knowledge Transfer'
    ],
    benefits: [
      'Access to Top Talent',
      'Reduced Hiring Costs',
      'Flexible Resource Scaling',
      'Immediate Availability',
      'Specialized Expertise',
      'Risk-Free Engagement'
    ]
  },
  {
    slug: 'advisory-assessment',
    title: 'Advisory & Assessment',
    subtitle: 'Strategic IAM Guidance & Evaluation',
    description: 'Begin your digital transformation journey with expert IAM advisory and assessment services for actionable recommendations.',
    icon: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z',
    color: 'indigo',
    features: [
      'Current State Assessment',
      'Gap Analysis',
      'Strategic Roadmap Development',
      'Technology Recommendations',
      'Risk & Compliance Review',
      'Implementation Planning'
    ],
    benefits: [
      'Clear Strategic Direction',
      'Informed Decision Making',
      'Risk Identification',
      'Optimized Investments',
      'Accelerated Planning',
      'Expert Recommendations'
    ]
  }
];

function generateServicePage(service) {
  return `'use client';

import Link from 'next/link';

export default function ${service.slug.replace(/-/g, '')}Page() {
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
              ← Back to Company
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-${service.color}-50 to-${service.color}-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-20 h-20 bg-${service.color}-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-${service.color}-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="${service.icon}"/>
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                ${service.title}
              </h1>
              <p className="text-xl text-${service.color}-800 mb-6">
                ${service.subtitle}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                ${service.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-${service.color}-600 text-white rounded-lg hover:bg-${service.color}-700 transition-colors font-semibold">
                  Get Started
                </button>
                <Link href="/company/contact" className="px-8 py-4 border-2 border-${service.color}-600 text-${service.color}-600 rounded-lg hover:bg-${service.color}-600 hover:text-white transition-colors font-semibold text-center">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-3.png" alt="${service.title}" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive ${service.title.toLowerCase()} designed to meet your enterprise needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${service.features.map(feature => `
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-${service.color}-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-${service.color}-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">${feature}</h3>
              <p className="text-gray-600">Professional ${feature.toLowerCase()} services tailored to your requirements.</p>
            </div>
            `).join('')}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our ${service.title}?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Since founded in 2015, WhiteStart has rapidly become a trusted leader in Identity and Access Management (IAM) solutions that secure access and identities for enterprises.
              </p>
              <div className="space-y-4">
                ${service.benefits.map(benefit => `
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-${service.color}-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">${benefit}</span>
                </div>
                `).join('')}
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-7.png" alt="Benefits" className="w-full h-auto rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-${service.color}-600 to-${service.color}-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your IAM Infrastructure?
          </h2>
          <p className="text-xl text-${service.color}-100 mb-8">
            Contact our experts to discuss your ${service.title.toLowerCase()} requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/contact" className="px-8 py-4 bg-white text-${service.color}-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Contact Us Today
            </Link>
            <Link href="/company" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-${service.color}-600 transition-colors font-semibold">
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}`;
}

// Create service pages
services.forEach(service => {
  const serviceDir = path.join(__dirname, `../frontend/app/company/${service.slug}`);
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(serviceDir, 'page.tsx'), generateServicePage(service));
  console.log(`✅ Created: /company/${service.slug}`);
});

console.log('🎉 All service pages created!');