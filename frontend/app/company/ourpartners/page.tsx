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
            Partners
          </h1>
          
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Learn more about our model for technology and strategic partnerships and explore our partners.
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              With extensive expertise in Saviynt’s Identity Cloud, WhiteStart delivers modern cloud governance, application access control, and third-party risk management. Leveraging Saviynt’s AI-driven analytics, we automate access certifications for SaaS platforms like Salesforce and Workday, ensuring least privilege enforcement. Clients achieve continuous compliance with GDPR and SOX while securing hybrid cloud migrations.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              With deep knowledge of Microsoft’s cloud-based Entra ID platform, WhiteStart helps companies maximize the value of Entra ID for workforce and external identity and access management. Our successful track record delivering Entra ID projects provides clients with optimized single sign-on, multifactor authentication, identity protection, and ability to integrate hybrid environments. WhiteStart is a go-to Entra ID partner.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Talk to An Identity Advisor
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              As an early Okta go-to partner in Canada since 2016, WhiteStart has been instrumental in delivering Okta's leading Identity Cloud, including innovations like FastPass passwordless authentication and expanded IGA capabilities, to major enterprises across Canada. Leveraging our extensive integration expertise, we have implemented Okta's workforce and CIAM solutions to provide cutting-edge identity tailored to each client's needs.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              With extensive Ping Identity expertise, WhiteStart enables solutions like CIAM with PingOne, secure identity federation using PingFederate, and workforce SSO with PingAccess tailored for diverse industries and seamless digital experiences. Our expertise in their broad IAM portfolio provides integrated identity capabilities.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Featured Partners
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              With extensive experience across Oracle's IAM portfolio, including OUD, OIG, OAM, OHS, Weblogic, Oracle DB and Oracle Cloud IAM, WhiteStart has been a go-to Oracle partner for many years on complex IAM projects. We have successfully delivered many large scale Oracle Identity and Access Management implementations leveraging our veteran team of OIAM experts for end to end of IAM solutions. Our skills also extend to workforce, customers and citizens use cases with OAM integrations.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              As a trusted BeyondTrust partner, WhiteStart implements privileged access management (PAM) solutions like BeyondInsight and Password Safe to secure elevated accounts across IT, DevOps, and cloud environments. Our certified team reduces attack surfaces with just-in-time access and session monitoring, helping clients thwart ransomware and insider threats.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Extensive Expertise Partner: Saviynt
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              As a trusted and preferred One Identity partner since 2020, WhiteStart delivers successful Active Roles, IGA and SafeGuard PAM solutions aligned to their long-term identity-centric approach. Working together, we enable comprehensive IAM and PAM programs integrated through our expertise. With both companies committed to long-term IAM success, our partnership provides robust solutions that evolve alongside emerging threats.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              As a preferred Pathlock partner, WhiteStart automates application access governance for SAP, Oracle EBS, and custom platforms. Using Pathlock’s controls, we enforce segregation of duties (SoD) and streamline audit workflows, reducing financial fraud risks and ensuring SOX compliance.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Extensive Expertise Partner: Microsoft Entra ID
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              WhiteStart partners with FrontEgg to enhance the security of customer-facing applications by providing embedded authentication and no-code identity workflows. Our seamless CIAM (Customer Identity and Access Management) integrations cater to both B2B and B2C use cases, ensuring frictionless user experiences without compromising security. By leveraging FrontEgg’s developer-first SDKs, we enable rapid deployment of authentication and authorization solutions, while our deep expertise in threat detection, access control, and regulatory compliance helps businesses safeguard sensitive data and maintain industry standards.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              As a trusted Zilla Security partner, WhiteStart specializes in delivering comprehensive Identity Governance and Access Management (IAM) solutions that simplify compliance and mitigate access risks. Utilizing Zilla’s advanced platform for automated access reviews and real-time risk assessments, we enable organizations to strengthen their security posture across hybrid environments. Our experts integrate Zilla’s innovative tools to ensure continuous monitoring, enforce least-privilege access, and streamline compliance with regulatory frameworks such as SOX, GDPR, and CCPA.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Preferred and Trusted Partner: Okta
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              As a highly experienced CyberArk partner, WhiteStart helps organizations securely manage and monitor privileged access to protect against threats, with a large team of CyberArk CDE and Guardian certified experts. Leveraging our expertise implementing CyberArk’s complete PAM platform, including Password Vault and Privileged Access Manager, we strengthen privileged access security across hybrid environments
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              With deep expertise in SailPoint’s IdentityIQ and IdentityNow platform, WhiteStart has been a trusted partner since SailPoint’s early days, successfully delivering advanced identity governance programs both on-premises and in the cloud. Our clients benefit from SailPoint’s comprehensive identity lifecycle management combined with our skills integrating end-to-end identity processes, preventive/detective controls, and optimized end-user experiences.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Extensive Expertise Partner: Ping Identity
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              With specialized expertise in CIAM, WhiteStart helped deliver innovative Auth0 identity solutions focused on superior developer experience and B2B/B2C use cases prior to their Okta acquisition. We now integrate Auth0’s continued private cloud deployment, ITDR capabilities, and blockchain integrations combined with our expertise into broader identity programs.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              With deep expertise in ForgeRock's Identity Cloud and on-prem AM/IDM/DS/IG Platform, WhiteStart delivers innovative identity and access management, seamless workforce SSO capabilities and frictionless customer journeys. Our success integrating the complex and full scope of enterprise access management, identity governance solutions and customer authentication and authorization journeys on ForgeRock Identity Cloud makes us a leading ForgeRock partner for enabling modern digital ecosystems.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Leading Partner: Oracle
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              With deep expertise in IBM Security Verify, WhiteStart enables adaptive authentication and seamless single sign-on (SSO) for global enterprises. Leveraging IBM’s AI-driven risk analytics, we secure workforce and customer identities across cloud and on-premises systems. Our implementations reduce credential-stuffing risks and streamline compliance for industries like healthcare and finance.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              As a trusted partner, WhiteStart helps maximize cybersecurity protections using Delinea’s Privilege Manager, Secret Server, and DevOps Secrets Vault solutions. Drawing on our integration skills, we implement privileged access controls and security both on-prem and SaaS to prevent breaches across hybrid IT.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted Partner: BeyondTrust
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              As Beyond Identity's first Canadian partner, WhiteStart is helping shape passwordless authentication's future through expertise implementing their innovative platform that enables just-in-time, dynamic access control. We combine Beyond Identity’s strengths with our integration skills for robust, dynamic access control.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              A trusted RSA partner, WhiteStart deploys RSA SecurID for phishing-resistant multi-factor authentication (MFA) and identity governance. Our solutions enforce risk-based access policies for privileged users, simplifying compliance with NIST 800-63B while securing remote access to legacy and cloud systems.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Preferred and Trusted Partner: One Identity
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              As a strategic Axiomatics partner, WhiteStart enables organizations to implement dynamic authorization and attribute-based access control (ABAC) for granular, real-time access decisions. Leveraging Axiomatics’ Policy Server and Policy Editor, we design context-aware policies that align with Zero Trust frameworks, securing access to sensitive data in hybrid cloud, APIs, and custom applications. Our expertise integrates Axiomatics with leading IGA platforms (e.g., Saviynt, SailPoint) to enforce least privilege, automate compliance, and simplify audits for GDPR, HIPAA, and NIST standards.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              As a strategic Gardiyan partner, WhiteStart delivers advanced IGA solutions to automate access governance, enforce least privilege, and eliminate compliance gaps. Leveraging Gardiyan’s AI-driven role engineering and access certification workflows, we streamline identity lifecycle management across SAP, AWS, and hybrid IT environments. Our certified experts integrate Gardiyan’s SoD policies and audit-ready reporting to reduce insider threats and ensure compliance with SOX, GDPR, and CCPA.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Preferred and Trusted Partner: Pathlock
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Discover why WhiteStart is recognized as a leader in IAM
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Discover why WhiteStart is your choice for your IAM projects and Services.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Preferred and Trusted Partner: FrontEgg
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Learn about WhiteStart’s capabilities in IAM technologies.
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              If you are passionate in IAM and love making an impact, WhiteStart is the place for you!
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Strategic Partner: Zilla Security
            </h2>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Partner with the best identit
            </p>
            
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Hi there! Myself IAMate. Your virtual advisor.
            </p>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Highly Experienced Partner: CyberArk
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted Partner: SailPoint
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Specialized CIAM Expertise Partner: Auth0
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Leading Partner: ForgeRock
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Leading Partner: IBM Security Verify
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Preferred and Trusted Partner: Delinea
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Early Partner: Beyond Identity
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted Partner: RSA SecureID
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Strategic Partner: Axiomatics
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Strategic Partner: Gardiyan
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Some of our featured  strategic partners
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Learn More about WhiteStart
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About Us
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why WhiteStart
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Capabilities
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Careers
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Talk to An Identity Advisor
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Services
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Solutions
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Company
            </h2>
            
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Resources
            </h2>
            
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