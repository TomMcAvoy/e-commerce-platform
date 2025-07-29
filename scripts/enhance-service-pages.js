const fs = require('fs');
const path = require('path');

const services = [
  {
    slug: 'iam-modernization',
    title: 'IAM Modernization Services',
    subtitle: 'Transform Legacy Identity Systems with Modern Architecture',
    description: 'Modernize your identity and access management infrastructure with comprehensive cloud-native solutions. Our proven methodology transforms legacy systems into scalable, secure, and future-ready IAM platforms.',
    technologies: ['Okta Identity Cloud', 'Ping Identity', 'Microsoft Azure AD', 'Oracle Identity Management', 'SailPoint IdentityIQ', 'CyberArk Privileged Access'],
    process: [
      'Current State Assessment & Gap Analysis',
      'Future State Architecture Design',
      'Migration Strategy & Risk Assessment', 
      'Phased Implementation & Testing',
      'User Training & Change Management',
      'Go-Live Support & Optimization'
    ],
    benefits: [
      'Reduced security vulnerabilities by 75%',
      'Improved user productivity with SSO',
      'Lower operational costs through automation',
      'Enhanced compliance with regulations',
      'Scalable cloud-native architecture',
      'Future-ready identity platform'
    ]
  },
  {
    slug: 'professional-services',
    title: 'Professional Services',
    subtitle: 'Expert IAM Implementation & Strategic Consulting',
    description: 'Accelerate your IAM initiatives with our certified professionals. Over a decade of experience implementing enterprise identity solutions across Fortune 500 companies.',
    technologies: ['Okta Workforce Identity', 'Ping Federate', 'Microsoft ADFS', 'Oracle Access Manager', 'SailPoint IdentityNow', 'ForgeRock Identity Platform'],
    process: [
      'Requirements Gathering & Analysis',
      'Solution Architecture & Design',
      'Custom Development & Integration',
      'Testing & Quality Assurance',
      'Deployment & Configuration',
      'Knowledge Transfer & Documentation'
    ],
    benefits: [
      'Faster time-to-value with expert guidance',
      'Reduced implementation risks',
      'Best practice methodologies',
      'Custom solutions for unique requirements',
      'Comprehensive documentation',
      'Ongoing support and maintenance'
    ]
  },
  {
    slug: 'managed-services',
    title: 'Managed Services',
    subtitle: '24/7 IAM Infrastructure Management & Support',
    description: 'Focus on your core business while our experts manage your identity infrastructure. Comprehensive managed services ensuring optimal performance, security, and compliance.',
    technologies: ['Okta Admin Console', 'Ping Directory', 'Microsoft Identity Manager', 'Oracle Identity Governance', 'SailPoint Compliance Manager', 'CyberArk PVWA'],
    process: [
      'Infrastructure Health Monitoring',
      'Proactive Maintenance & Updates',
      'Security Patch Management',
      'Performance Optimization',
      'Incident Response & Resolution',
      'Compliance Reporting & Auditing'
    ],
    benefits: [
      '99.9% uptime guarantee',
      'Reduced operational overhead',
      'Proactive issue resolution',
      'Expert 24/7 monitoring',
      'Predictable monthly costs',
      'Enhanced security posture'
    ]
  },
  {
    slug: 'virtual-ciso',
    title: 'Virtual CISO Services',
    subtitle: 'Executive Security Leadership & Strategic Guidance',
    description: 'Get C-level security expertise without full-time costs. Our Virtual CISO services provide strategic security leadership, risk management, and executive communication.',
    technologies: ['Okta ThreatInsight', 'Ping Intelligence', 'Microsoft Sentinel', 'Oracle CASB', 'SailPoint Predictive Identity', 'CyberArk Conjur'],
    process: [
      'Security Posture Assessment',
      'Risk Management Strategy',
      'Compliance Framework Development',
      'Security Policy Creation',
      'Incident Response Planning',
      'Board & Executive Reporting'
    ],
    benefits: [
      'Cost-effective C-level expertise',
      'Strategic security vision',
      'Regulatory compliance assurance',
      'Risk mitigation strategies',
      'Executive stakeholder communication',
      'Incident response leadership'
    ]
  },
  {
    slug: 'staff-augmentation',
    title: 'Staff Augmentation',
    subtitle: 'Expert IAM Talent & Specialized Resources',
    description: 'Scale your team with certified IAM professionals. Access specialized skills and expertise on-demand to accelerate your identity initiatives.',
    technologies: ['Okta Certified Professionals', 'Ping Identity Experts', 'Microsoft MVP Consultants', 'Oracle Certified Masters', 'SailPoint Engineers', 'CyberArk Defenders'],
    process: [
      'Skill Requirements Assessment',
      'Resource Matching & Selection',
      'Onboarding & Integration',
      'Project Execution & Delivery',
      'Knowledge Transfer',
      'Transition & Handover'
    ],
    benefits: [
      'Access to top-tier talent',
      'Flexible engagement models',
      'Rapid team scaling',
      'Specialized expertise',
      'Reduced hiring costs',
      'Immediate availability'
    ]
  },
  {
    slug: 'advisory-assessment',
    title: 'Advisory & Assessment Services',
    subtitle: 'Strategic IAM Planning & Current State Analysis',
    description: 'Make informed decisions with comprehensive IAM assessments. Our advisory services provide strategic roadmaps and actionable recommendations.',
    technologies: ['Okta Identity Engine', 'Ping Davinci', 'Microsoft Entra', 'Oracle Identity Cloud', 'SailPoint Atlas', 'CyberArk Identity Security Platform'],
    process: [
      'Current State Discovery & Analysis',
      'Gap Assessment & Risk Evaluation',
      'Future State Vision & Strategy',
      'Technology Recommendations',
      'Implementation Roadmap',
      'Business Case Development'
    ],
    benefits: [
      'Clear strategic direction',
      'Informed technology decisions',
      'Risk identification & mitigation',
      'Optimized investment planning',
      'Accelerated project timelines',
      'Expert recommendations'
    ]
  }
];

function generateEnhancedServicePage(service) {
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
                ${service.title}
              </h1>
              <p className="text-xl text-blue-800 mb-6">
                ${service.subtitle}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                ${service.description}
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
              <img src="/sharpit-images/sharpit-3.png" alt="${service.title}" className="w-full h-auto rounded-2xl shadow-2xl" />
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
            ${service.technologies.map(tech => `
            <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">${tech}</h3>
              <p className="text-gray-600">Expert implementation and optimization services for ${tech.toLowerCase()}.</p>
            </div>
            `).join('')}
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
              A systematic approach ensuring successful ${service.title.toLowerCase()} delivery
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${service.process.map((step, index) => `
            <div className="relative p-6 bg-white rounded-xl shadow-lg">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                ${index + 1}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">${step}</h3>
              <p className="text-gray-600">Professional ${step.toLowerCase()} ensuring optimal results and stakeholder satisfaction.</p>
            </div>
            `).join('')}
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
                Since founded in 2015, WhiteStart has delivered measurable results for enterprises worldwide. Our ${service.title.toLowerCase()} provide tangible business value.
              </p>
              <div className="space-y-4">
                ${service.benefits.map(benefit => `
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
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
            Contact our certified experts to discuss your ${service.title.toLowerCase()} requirements and get a personalized consultation.
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
}`;
}

// Update all service pages with enhanced content
services.forEach(service => {
  const serviceDir = path.join(__dirname, `../frontend/app/company/${service.slug}`);
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(serviceDir, 'page.tsx'), generateEnhancedServicePage(service));
  console.log(`✅ Enhanced: /company/${service.slug}`);
});

console.log('🎉 All service pages enhanced with comprehensive content!');