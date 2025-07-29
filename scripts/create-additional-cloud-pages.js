const fs = require('fs');
const path = require('path');

const additionalClouds = [
  {
    slug: 'oci-architecture',
    name: 'OCI',
    fullName: 'Oracle Cloud Infrastructure',
    color: 'red',
    services: {
      compute: ['Compute Instances', 'Container Engine (OKE)', 'Functions', 'Container Instances', 'Bare Metal'],
      security: ['Identity & Access Management', 'Vault', 'Key Management', 'Cloud Guard', 'Security Zones'],
      networking: ['Virtual Cloud Network', 'API Gateway', 'Load Balancer', 'DNS', 'Web Application Firewall'],
      devops: ['DevOps Service', 'Build Service', 'Deployment Service', 'Resource Manager', 'Terraform'],
      monitoring: ['Monitoring', 'Logging', 'Application Performance', 'Notifications', 'Events']
    },
    standards: [
      'Oracle Cloud Security Framework',
      'Oracle Security Best Practices',
      'ISO 27001/27017/27018',
      'SOC 1/2/3 Compliance',
      'FedRAMP Moderate Authorization',
      'GDPR Compliance Ready'
    ],
    tools: [
      'Oracle Cloud Guard',
      'Oracle Security Zones',
      'Oracle Vulnerability Scanning',
      'Oracle Bastion Service',
      'Oracle Certificate Service',
      'Oracle Identity Domains'
    ]
  },
  {
    slug: 'openstack-architecture',
    name: 'OpenStack',
    fullName: 'OpenStack Private Cloud',
    color: 'purple',
    services: {
      compute: ['Nova (Compute)', 'Ironic (Bare Metal)', 'Zun (Containers)', 'Magnum (Container Orchestration)', 'Heat (Orchestration)'],
      security: ['Keystone (Identity)', 'Barbican (Key Management)', 'Octavia (Load Balancing)', 'Designate (DNS)', 'Mistral (Workflow)'],
      networking: ['Neutron (Networking)', 'Kuryr (Container Networking)', 'Tacker (NFV)', 'Congress (Policy)', 'Vitrage (Root Cause Analysis)'],
      devops: ['Zuul (CI/CD)', 'Ansible Integration', 'Kolla (Containerized Deployment)', 'TripleO (Deployment)', 'OpenStack-Helm'],
      monitoring: ['Telemetry (Ceilometer)', 'Panko (Events)', 'Aodh (Alarming)', 'Gnocchi (Metrics)', 'Monasca (Monitoring)']
    },
    standards: [
      'OpenStack Security Guide',
      'NIST Cybersecurity Framework',
      'ISO 27001/27002 Compliance',
      'Common Criteria Evaluation',
      'FIPS 140-2 Cryptographic Standards',
      'OpenStack Interoperability Guidelines'
    ],
    tools: [
      'OpenStack Security Scanner',
      'Anchor (Certificate Authority)',
      'Bandit (Security Linter)',
      'OpenStack Policy Engine',
      'Keystone Federation',
      'Horizon Security Dashboard'
    ]
  },
  {
    slug: 'openshift-architecture',
    name: 'OpenShift',
    fullName: 'Red Hat OpenShift Container Platform',
    color: 'red',
    services: {
      compute: ['Container Runtime (CRI-O)', 'Kubernetes Engine', 'Serverless (Knative)', 'Virtual Machines (CNV)', 'Build Configs'],
      security: ['OAuth Server', 'RBAC', 'Security Context Constraints', 'Network Policies', 'Pod Security Standards'],
      networking: ['SDN (OVN-Kubernetes)', 'Service Mesh (Istio)', 'Ingress Controllers', 'Network Policies', 'Multi-cluster Networking'],
      devops: ['Tekton Pipelines', 'GitOps (ArgoCD)', 'Source-to-Image (S2I)', 'Helm Charts', 'Operators Framework'],
      monitoring: ['Prometheus', 'Grafana', 'Alertmanager', 'Jaeger Tracing', 'Elasticsearch/Fluentd/Kibana']
    },
    standards: [
      'Red Hat Security Guide',
      'Kubernetes Security Best Practices',
      'NIST Container Security',
      'CIS Kubernetes Benchmark',
      'FIPS 140-2 Compliance',
      'Common Criteria Certification'
    ],
    tools: [
      'Red Hat Advanced Cluster Security',
      'Quay Container Registry',
      'OpenShift Compliance Operator',
      'Falco Runtime Security',
      'Twistlock/Prisma Cloud',
      'StackRox (now ACS)'
    ]
  }
];

function generateAdditionalCloudPage(cloud) {
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
                ${cloud.fullName} DevSecOps
              </h1>
              <p className="text-xl text-${cloud.color}-800 mb-6">
                Enterprise Security-First Container Platform Operations
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Comprehensive DevSecOps implementation on ${cloud.fullName} with enterprise-grade security, compliance frameworks, and cloud-native best practices for scalable operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/company/contact" className="px-8 py-4 bg-${cloud.color}-600 text-white rounded-lg hover:bg-${cloud.color}-700 transition-colors font-semibold text-center">
                  Get ${cloud.name} Consultation
                </Link>
                <button className="px-8 py-4 border-2 border-${cloud.color}-600 text-${cloud.color}-600 rounded-lg hover:bg-${cloud.color}-600 hover:text-white transition-colors font-semibold">
                  Download ${cloud.name} Guide
                </button>
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-8.png" alt="${cloud.name} Architecture" className="w-full h-auto rounded-2xl shadow-2xl" />
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
              ${cloud.fullName} services optimized for security, compliance, and operational excellence
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
                ${cloud.name} Security & Compliance
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                ${cloud.fullName} maintains enterprise security standards enabling secure DevSecOps implementations with comprehensive compliance coverage.
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6">${cloud.name} Platform Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-${cloud.color}-600 mb-2">99.9%</div>
                  <p className="text-gray-600">Platform Availability</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-${cloud.color}-600 mb-2">24/7</div>
                  <p className="text-gray-600">Security Monitoring</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-${cloud.color}-600 mb-2">100+</div>
                  <p className="text-gray-600">Security Controls</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-${cloud.color}-600 mb-2">Zero</div>
                  <p className="text-gray-600">Trust Security</p>
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
              Proven methodology for secure, scalable DevSecOps on ${cloud.fullName}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-${cloud.color}-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-${cloud.color}-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Platform Assessment</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Current ${cloud.name} environment analysis</li>
                <li>• Security posture evaluation</li>
                <li>• Compliance gap assessment</li>
                <li>• Migration planning</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-${cloud.color}-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-${cloud.color}-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Security Configuration</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• ${cloud.name} security hardening</li>
                <li>• Network security policies</li>
                <li>• Identity and access controls</li>
                <li>• Monitoring setup</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-${cloud.color}-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-${cloud.color}-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">DevSecOps Pipeline</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• CI/CD pipeline integration</li>
                <li>• Security testing automation</li>
                <li>• Compliance validation</li>
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

// Create additional cloud pages
additionalClouds.forEach(cloud => {
  const cloudDir = path.join(__dirname, `../frontend/app/company/${cloud.slug}`);
  if (!fs.existsSync(cloudDir)) {
    fs.mkdirSync(cloudDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(cloudDir, 'page.tsx'), generateAdditionalCloudPage(cloud));
  console.log(`✅ Created: /company/${cloud.slug}`);
});

console.log('🎉 Additional cloud architecture pages created!');