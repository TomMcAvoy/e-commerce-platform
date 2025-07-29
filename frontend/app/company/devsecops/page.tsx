'use client';

import Link from 'next/link';

export default function DevSecOpsPage() {
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
      <section className="bg-gradient-to-br from-red-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                DevSecOps Infrastructure Services
              </h1>
              <p className="text-xl text-red-800 mb-6">
                Enterprise-Grade Security-First Development Operations
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Comprehensive DevSecOps infrastructure design and implementation using best-of-breed technologies, industry standards, and proven methodologies for secure, scalable, and compliant enterprise environments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/company/contact" className="px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-center">
                  Get Architecture Consultation
                </Link>
                <button className="px-8 py-4 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-semibold">
                  Download Framework Guide
                </button>
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-3.png" alt="DevSecOps Architecture" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Reference Architecture: Red Hat Enterprise Linux on Google Cloud
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Best-of-breed DevSecOps infrastructure leveraging enterprise-grade technologies and industry-standard frameworks
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-red-50 rounded-xl">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-red-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Compute Infrastructure</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Red Hat Enterprise Linux 9</li>
                <li>• Google Compute Engine</li>
                <li>• Kubernetes (GKE)</li>
                <li>• OpenShift Container Platform</li>
              </ul>
            </div>

            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Security Stack</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• HashiCorp Vault</li>
                <li>• Aqua Security Trivy</li>
                <li>• Twistlock/Prisma Cloud</li>
                <li>• OWASP ZAP Integration</li>
              </ul>
            </div>

            <div className="p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CI/CD Pipeline</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Jenkins/GitLab CI</li>
                <li>• Tekton Pipelines</li>
                <li>• Argo CD</li>
                <li>• Spinnaker</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">TOGAF-Compliant Architecture Domains</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Business Architecture</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• DevSecOps capability model aligned with business objectives</li>
                  <li>• Risk management integration with business processes</li>
                  <li>• Compliance automation for regulatory requirements</li>
                  <li>• Cost optimization through infrastructure as code</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Technology Architecture</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Microservices architecture with service mesh</li>
                  <li>• Container orchestration with Kubernetes</li>
                  <li>• Infrastructure as Code (Terraform/Ansible)</li>
                  <li>• Multi-cloud deployment strategies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standards & Compliance */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry Standards & Compliance Frameworks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our DevSecOps implementations adhere to international standards and best practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">North American Standards</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• NIST Cybersecurity Framework</li>
                <li>• NIST SP 800-53 (Security Controls)</li>
                <li>• NIST SP 800-37 (Risk Management)</li>
                <li>• FedRAMP Compliance</li>
                <li>• SOC 2 Type II</li>
                <li>• FISMA Compliance</li>
                <li>• HIPAA (Healthcare)</li>
                <li>• PCI DSS (Payment Card)</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">European Standards</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• ISO/IEC 27001:2022</li>
                <li>• ISO/IEC 27002:2022</li>
                <li>• ISO/IEC 27017 (Cloud Security)</li>
                <li>• ISO/IEC 27018 (Cloud Privacy)</li>
                <li>• GDPR Compliance</li>
                <li>• NIS2 Directive</li>
                <li>• ENISA Guidelines</li>
                <li>• Common Criteria (CC)</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">British Standards</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• BS 10012:2017 (Data Protection)</li>
                <li>• Cyber Essentials Plus</li>
                <li>• NCSC Cloud Security Principles</li>
                <li>• UK GDPR Compliance</li>
                <li>• Government Security Classifications</li>
                <li>• CESG Guidelines</li>
                <li>• HMG Security Policy Framework</li>
                <li>• OFFICIAL/SECRET Classifications</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-3">IT Process Standards</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• ITIL 4 Service Management</li>
                <li>• COBIT 2019 Governance</li>
                <li>• TOGAF 9.2 Architecture</li>
                <li>• SABSA Security Architecture</li>
                <li>• OWASP Top 10</li>
                <li>• SANS Critical Controls</li>
                <li>• CIS Controls v8</li>
                <li>• COSO Framework</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Compliance Automation</h3>
            <p className="text-gray-600 mb-6">
              Our DevSecOps platform includes automated compliance monitoring and reporting for all major frameworks:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <p className="text-gray-600">Automated compliance checks</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <p className="text-gray-600">Continuous monitoring</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">Real-time</div>
                <p className="text-gray-600">Violation alerts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Methodology */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Implementation Methodology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven 6-phase approach following TOGAF ADM and industry best practices
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-red-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Architecture Vision & Requirements</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Stakeholder analysis and requirements gathering</li>
                <li>• Current state assessment and gap analysis</li>
                <li>• Security risk assessment and threat modeling</li>
                <li>• Compliance requirements mapping</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-blue-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Business & Data Architecture</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Business capability modeling</li>
                <li>• Data classification and governance</li>
                <li>• Information security architecture</li>
                <li>• Privacy by design implementation</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-green-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Application Architecture</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Microservices design patterns</li>
                <li>• API security and gateway configuration</li>
                <li>• Container security hardening</li>
                <li>• Application security testing integration</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-purple-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Technology Architecture</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Infrastructure as Code implementation</li>
                <li>• Network security and segmentation</li>
                <li>• Identity and access management integration</li>
                <li>• Monitoring and observability stack</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-yellow-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Opportunities & Solutions</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Implementation roadmap development</li>
                <li>• Risk mitigation strategies</li>
                <li>• Change management planning</li>
                <li>• Training and capability development</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-indigo-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">6</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Migration & Implementation</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Phased deployment strategy</li>
                <li>• Continuous integration/deployment setup</li>
                <li>• Security testing automation</li>
                <li>• Go-live support and optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best-of-Breed Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade tools and platforms for comprehensive DevSecOps implementation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Enterprise Integration</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Kong Enterprise Gateway</li>
                <li>• IBM DataPower Gateway</li>
                <li>• Oracle Service Bus</li>
                <li>• MuleSoft Anypoint</li>
                <li>• WSO2 API Manager</li>
                <li>• Apigee (Google Cloud)</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Secure Messaging</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• TLS 1.3 Encryption</li>
                <li>• OAuth 2.0/OpenID Connect</li>
                <li>• JWT Token Validation</li>
                <li>• mTLS Authentication</li>
                <li>• Message-level Encryption</li>
                <li>• Zero Trust Architecture</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cloud Architecture</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• <a href="/company/aws-architecture" className="text-blue-600 hover:underline">AWS DevSecOps</a></li>
                <li>• <a href="/company/azure-architecture" className="text-blue-600 hover:underline">Azure DevSecOps</a></li>
                <li>• <a href="/company/gcp-architecture" className="text-blue-600 hover:underline">Google Cloud DevSecOps</a></li>
                <li>• <a href="/company/oci-architecture" className="text-blue-600 hover:underline">Oracle OCI DevSecOps</a></li>
                <li>• <a href="/company/openstack-architecture" className="text-blue-600 hover:underline">OpenStack Private Cloud</a></li>
                <li>• <a href="/company/openshift-architecture" className="text-blue-600 hover:underline">Red Hat OpenShift</a></li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Infrastructure</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Google Cloud Platform</li>
                <li>• Red Hat Enterprise Linux</li>
                <li>• Kubernetes/OpenShift</li>
                <li>• Terraform/Ansible</li>
                <li>• Istio Service Mesh</li>
                <li>• Consul/Vault</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">API Gateways</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Kong Gateway (Enterprise)</li>
                <li>• IBM API Connect</li>
                <li>• Oracle API Gateway</li>
                <li>• AWS API Gateway</li>
                <li>• Azure API Management</li>
                <li>• Google Cloud Endpoints</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Message Bus Systems</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Apache Kafka/Confluent</li>
                <li>• IBM MQ/WebSphere</li>
                <li>• Oracle Advanced Queuing</li>
                <li>• RabbitMQ/Apache Pulsar</li>
                <li>• Redis Streams</li>
                <li>• NATS/Apache ActiveMQ</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Security Tools</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Aqua Security/Twistlock</li>
                <li>• Snyk/WhiteSource</li>
                <li>• OWASP ZAP/Burp Suite</li>
                <li>• Checkmarx/Veracode</li>
                <li>• Falco Runtime Security</li>
                <li>• Open Policy Agent</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">CI/CD Pipeline</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Jenkins/GitLab CI</li>
                <li>• Tekton/Argo CD</li>
                <li>• Spinnaker</li>
                <li>• Nexus/Artifactory</li>
                <li>• SonarQube</li>
                <li>• JFrog Xray</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Monitoring</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Prometheus/Grafana</li>
                <li>• ELK Stack/Splunk</li>
                <li>• Jaeger/Zipkin</li>
                <li>• New Relic/Datadog</li>
                <li>• PagerDuty/OpsGenie</li>
                <li>• Chaos Engineering</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your DevSecOps Infrastructure?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Get a comprehensive architecture assessment and implementation roadmap from our certified experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/contact" className="px-8 py-4 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Schedule Architecture Review
            </Link>
            <Link href="/company" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-red-600 transition-colors font-semibold">
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}