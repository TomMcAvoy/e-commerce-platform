'use client';

import Link from 'next/link';

export default function AWSArchitecturePage() {
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
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Amazon Web Services DevSecOps Architecture
              </h1>
              <p className="text-xl text-orange-800 mb-6">
                Enterprise-Grade Security-First Development Operations on AWS
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Comprehensive DevSecOps implementation leveraging Amazon Web Services native services, security best practices, and industry-standard compliance frameworks for scalable, secure cloud operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/company/contact" className="px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold text-center">
                  Get AWS Assessment
                </Link>
                <button className="px-8 py-4 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors font-semibold">
                  Download AWS Guide
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                {/* AWS Logo */}
                <svg className="w-64 h-32" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* AWS Text */}
                  <text x="50" y="50" className="text-4xl font-bold fill-orange-600">AWS</text>
                  {/* Cloud shape */}
                  <path d="M80 80 C60 70, 40 80, 40 100 C40 120, 60 130, 80 130 L220 130 C240 130, 260 120, 260 100 C260 80, 240 70, 220 80 C210 70, 190 70, 190 80 Z" 
                        fill="#FF9900" opacity="0.2"/>
                  {/* Architecture elements */}
                  <rect x="70" y="90" width="20" height="20" fill="#FF9900" rx="2"/>
                  <rect x="110" y="90" width="20" height="20" fill="#FF9900" rx="2"/>
                  <rect x="150" y="90" width="20" height="20" fill="#FF9900" rx="2"/>
                  <rect x="190" y="90" width="20" height="20" fill="#FF9900" rx="2"/>
                  <rect x="230" y="90" width="20" height="20" fill="#FF9900" rx="2"/>
                  {/* Connection lines */}
                  <line x1="90" y1="100" x2="110" y2="100" stroke="#FF9900" strokeWidth="2"/>
                  <line x1="130" y1="100" x2="150" y2="100" stroke="#FF9900" strokeWidth="2"/>
                  <line x1="170" y1="100" x2="190" y2="100" stroke="#FF9900" strokeWidth="2"/>
                  <line x1="210" y1="100" x2="230" y2="100" stroke="#FF9900" strokeWidth="2"/>
                  {/* Service labels */}
                  <text x="75" y="125" className="text-xs fill-orange-600">EC2</text>
                  <text x="113" y="125" className="text-xs fill-orange-600">EKS</text>
                  <text x="145" y="125" className="text-xs fill-orange-600">RDS</text>
                  <text x="185" y="125" className="text-xs fill-orange-600">S3</text>
                  <text x="225" y="125" className="text-xs fill-orange-600">IAM</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AWS DevSecOps Service Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Native Amazon Web Services services optimized for security, compliance, and operational excellence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-orange-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compute & Containers</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• EC2</li>
                <li>• ECS</li>
                <li>• EKS</li>
                <li>• Lambda</li>
                <li>• Fargate</li>
              </ul>
            </div>

            <div className="p-6 bg-orange-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Services</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• IAM</li>
                <li>• Secrets Manager</li>
                <li>• KMS</li>
                <li>• GuardDuty</li>
                <li>• Security Hub</li>
              </ul>
            </div>

            <div className="p-6 bg-orange-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Networking</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• VPC</li>
                <li>• API Gateway</li>
                <li>• CloudFront</li>
                <li>• Route 53</li>
                <li>• ALB/NLB</li>
              </ul>
            </div>

            <div className="p-6 bg-orange-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DevOps Tools</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• CodePipeline</li>
                <li>• CodeBuild</li>
                <li>• CodeDeploy</li>
                <li>• CloudFormation</li>
                <li>• CDK</li>
              </ul>
            </div>

            <div className="p-6 bg-orange-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring & Observability</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• CloudWatch</li>
                <li>• X-Ray</li>
                <li>• CloudTrail</li>
                <li>• Config</li>
                <li>• Systems Manager</li>
              </ul>
            </div>

            <div className="p-6 bg-orange-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tools</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• AWS Security Hub</li>
                <li>• Amazon Inspector</li>
                <li>• AWS Config Rules</li>
                <li>• CloudFormation Guard</li>
                <li>• AWS CDK Security</li>
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
                AWS Compliance & Standards
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Amazon Web Services maintains the highest security and compliance standards, enabling enterprise-grade DevSecOps implementations.
              </p>
              <div className="space-y-4">
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">AWS Well-Architected Framework</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">AWS Security Best Practices</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">FedRAMP High Authorization</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">SOC 1/2/3 Compliance</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">ISO 27001/27017/27018</span>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                  <span className="text-lg text-gray-700">PCI DSS Level 1</span>
                </div>
                
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">AWS Security Metrics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                  <p className="text-gray-600">Service Uptime SLA</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                  <p className="text-gray-600">Security Monitoring</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">100+</div>
                  <p className="text-gray-600">Compliance Controls</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">Zero</div>
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
              AWS DevSecOps Implementation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven methodology for implementing secure, scalable DevSecOps on Amazon Web Services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-orange-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Assessment & Planning</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Current state AWS environment analysis</li>
                <li>• Security posture assessment</li>
                <li>• Compliance gap identification</li>
                <li>• Migration strategy development</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-orange-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-2">Infrastructure Setup</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• AWS landing zone configuration</li>
                <li>• Network security implementation</li>
                <li>• Identity and access management</li>
                <li>• Monitoring and logging setup</li>
              </ul>
            </div>

            <div className="relative p-6 bg-white rounded-xl shadow-lg border-l-4 border-orange-600">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
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
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Implement AWS DevSecOps?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Get expert guidance on Amazon Web Services DevSecOps architecture and implementation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/company/contact" className="px-8 py-4 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Schedule AWS Consultation
            </Link>
            <Link href="/company/devsecops" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-semibold">
              View DevSecOps Overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}