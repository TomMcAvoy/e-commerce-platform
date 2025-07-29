const fs = require('fs');
const path = require('path');

const cloudProviders = [
  {
    slug: 'aws-architecture',
    name: 'AWS',
    fullName: 'Amazon Web Services',
    color: 'orange',
    services: {
      compute: ['EC2', 'ECS', 'EKS', 'Lambda', 'Fargate'],
      security: ['IAM', 'Secrets Manager', 'KMS', 'GuardDuty', 'Security Hub'],
      networking: ['VPC', 'API Gateway', 'CloudFront', 'Route 53', 'ALB/NLB'],
      devops: ['CodePipeline', 'CodeBuild', 'CodeDeploy', 'CloudFormation', 'CDK'],
      monitoring: ['CloudWatch', 'X-Ray', 'CloudTrail', 'Config', 'Systems Manager']
    },
    standards: [
      'AWS Well-Architected Framework',
      'AWS Security Best Practices',
      'FedRAMP High Authorization',
      'SOC 1/2/3 Compliance',
      'ISO 27001/27017/27018',
      'PCI DSS Level 1'
    ],
    tools: [
      'AWS Security Hub',
      'Amazon Inspector',
      'AWS Config Rules',
      'CloudFormation Guard',
      'AWS CDK Security',
      'Prowler Security Tool'
    ]
  },
  {
    slug: 'azure-architecture',
    name: 'Azure',
    fullName: 'Microsoft Azure',
    color: 'blue',
    services: {
      compute: ['Virtual Machines', 'AKS', 'Container Instances', 'Functions', 'App Service'],
      security: ['Azure AD', 'Key Vault', 'Security Center', 'Sentinel', 'Defender'],
      networking: ['Virtual Network', 'API Management', 'Front Door', 'DNS', 'Load Balancer'],
      devops: ['Azure DevOps', 'Pipelines', 'Repos', 'Artifacts', 'ARM Templates'],
      monitoring: ['Monitor', 'Application Insights', 'Log Analytics', 'Advisor', 'Service Health']
    },
    standards: [
      'Microsoft Cloud Adoption Framework',
      'Azure Security Benchmark',
      'Azure Well-Architected Framework',
      'ISO 27001/27018 Certified',
      'SOC 1/2 Type II',
      'FedRAMP Moderate/High'
    ],
    tools: [
      'Azure Security Center',
      'Azure Policy',
      'Azure Blueprints',
      'Microsoft Defender',
      'Azure Sentinel SIEM',
      'Secure DevOps Kit'
    ]
  },
  {
    slug: 'gcp-architecture',
    name: 'GCP',
    fullName: 'Google Cloud Platform',
    color: 'green',
    services: {
      compute: ['Compute Engine', 'GKE', 'Cloud Run', 'Functions', 'App Engine'],
      security: ['IAM', 'Secret Manager', 'KMS', 'Security Command Center', 'Cloud Armor'],
      networking: ['VPC', 'API Gateway', 'Cloud CDN', 'DNS', 'Load Balancing'],
      devops: ['Cloud Build', 'Deploy', 'Source Repos', 'Deployment Manager', 'Skaffold'],
      monitoring: ['Operations Suite', 'Trace', 'Audit Logs', 'Error Reporting', 'Profiler']
    },
    standards: [
      'Google Cloud Architecture Framework',
      'Google Security Best Practices',
      'ISO 27001/27017/27018',
      'SOC 1/2/3 Reports',
      'FedRAMP Moderate Authorization',
      'CSA STAR Level 1'
    ],
    tools: [
      'Security Command Center',
      'Forseti Security',
      'Binary Authorization',
      'Container Analysis',
      'Cloud Security Scanner',
      'Istio Service Mesh'
    ]
  }
];

function generateCloudArchitecturePage(cloud) {
  return `'use client';

import Link from 'next/link';

export default function ${cloud.name}ArchitecturePage() {
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
      <section className="bg-gradient-to-br from-${cloud.color}-50 to-${cloud.color}-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                ${cloud.fullName} DevSecOps Architecture
              </h1>
              <p className="text-xl text-${cloud.color}-800 mb-6">
                Enterprise-Grade Security-First Development Operations on ${cloud.name}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Comprehensive DevSecOps implementation leveraging ${cloud.fullName} native services, security best practices, and industry-standard compliance frameworks for scalable, secure cloud operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/company/contact" className="px-8 py-4 bg-${cloud.color}-600 text-white rounded-lg hover:bg-${cloud.color}-700 transition-colors font-semibold text-center">
                  Get ${cloud.name} Assessment
                </Link>
                <button className="px-8 py-4 border-2 border-${cloud.color}-600 text-${cloud.color}-600 rounded-lg hover:bg-${cloud.color}-600 hover:text-white transition-colors font-semibold">
                  Download ${cloud.name} Guide
                </button>
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-7.png" alt="${cloud.name} Architecture" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ${cloud.name} DevSecOps Service Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Native ${cloud.fullName} services optimized for security, compliance, and operational excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-${cloud.color}-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compute & Containers</h3>
              <ul className="text-gray-600 space-y-2">
                ${cloud.services.compute.map(service => `<li>• ${service}</li>`).join('\n                ')}
              </ul>
            </div>

            <div className="p-6 bg-${cloud.color}-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Services</h3>
              <ul className="text-gray-600 space-y-2">
                ${cloud.services.security.map(service => `<li>• ${service}</li>`).join('\n                ')}
              </ul>
            </div>

            <div className="p-6 bg-${cloud.color}-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Networking</h3>
              <ul className="text-gray-600 space-y-2">
                ${cloud.services.networking.map(service => `<li>• ${service}</li>`).join('\n                ')}
              </ul>
            </div>

            <div className="p-6 bg-${cloud.color}-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DevOps Tools</h3>
              <ul className="text-gray-600 space-y-2">
                ${cloud.services.devops.map(service => `<li>• ${service}</li>`).join('\n                ')}
              </ul>
            </div>

            <div className="p-6 bg-${cloud.color}-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring & Observability</h3>
              <ul className="text-gray-600 space-y-2">
                ${cloud.services.monitoring.map(service => `<li>• ${service}</li>`).join('\n                ')}
              </ul>
            </div>

            <div className="p-6 bg-${cloud.color}-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tools</h3>
              <ul className="text-gray-600 space-y-2">
                ${cloud.tools.slice(0, 5).map(tool => `<li>• ${tool}</li>`).join('\n                ')}
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
                ${cloud.name} Compliance & Standards
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                ${cloud.fullName} maintains the highest security and compliance standards, enabling enterprise-grade DevSecOps implementations.
              </p>
              <div className="space-y-4">
                ${cloud.standards.map(standard => `
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-${cloud.color}-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">${standard}</span>
                </div>
                `).join('')}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">${cloud.name} Security Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-${cloud.color}-600 mb-2">99.9%</div>
                  <p className="text-gray-600">Service Uptime SLA</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-${cloud.color}-600 mb-2">24/7</div>
                  <p className="text-gray-600">Security Monitoring</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-${cloud.color}-600 mb-2">100+</div>
                  <p className="text-gray-600">Compliance Controls</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-${cloud.color}-600 mb-2">Zero</div>
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
              ${cloud.name} DevSecOps Implementation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven methodology for implementing secure, scalable DevSecOps on ${cloud.fullName}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-${cloud.color}-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-${cloud.color}-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Assessment & Planning</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Current state ${cloud.name} environment analysis</li>
                <li>• Security posture assessment</li>
                <li>• Compliance gap identification</li>
                <li>• Migration strategy development</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-${cloud.color}-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-${cloud.color}-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Infrastructure Setup</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• ${cloud.name} landing zone configuration</li>
                <li>• Network security implementation</li>
                <li>• Identity and access management</li>
                <li>• Monitoring and logging setup</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-${cloud.color}-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-${cloud.color}-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
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
      <section className="py-20 bg-gradient-to-r from-${cloud.color}-600 to-${cloud.color}-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Implement ${cloud.name} DevSecOps?
          </h2>
          <p className="text-xl text-${cloud.color}-100 mb-8">
            Get expert guidance on ${cloud.fullName} DevSecOps architecture and implementation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/contact" className="px-8 py-4 bg-white text-${cloud.color}-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Schedule ${cloud.name} Consultation
            </Link>
            <Link href="/company/devsecops" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-${cloud.color}-600 transition-colors font-semibold">
              View DevSecOps Overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}`;
}

// Create cloud architecture pages
cloudProviders.forEach(cloud => {
  const cloudDir = path.join(__dirname, `../frontend/app/company/${cloud.slug}`);
  if (!fs.existsSync(cloudDir)) {
    fs.mkdirSync(cloudDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(cloudDir, 'page.tsx'), generateCloudArchitecturePage(cloud));
  console.log(`✅ Created: /company/${cloud.slug}`);
});

console.log('🎉 All cloud architecture pages created!');