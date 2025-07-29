const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function createSharpitsClone() {
  console.log('🔄 Creating final Sharpits clone...');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://sharpits.com', { waitUntil: 'networkidle2' });
    
    // Accept cookies immediately
    try {
      await page.waitForSelector('button:has-text("Accept"), button:has-text("OK"), button:has-text("Agree"), .cookie-accept, #cookie-accept', { timeout: 3000 });
      await page.click('button:has-text("Accept"), button:has-text("OK"), button:has-text("Agree"), .cookie-accept, #cookie-accept');
      console.log('✅ Cookies accepted');
    } catch {
      console.log('ℹ️  No cookie banner found');
    }
    
    // Take screenshot for reference
    await page.screenshot({ 
      path: path.join(__dirname, '../analysis/sharpits-reference.png'),
      fullPage: true 
    });
    
    // Extract key content
    const content = await page.evaluate(() => {
      const getText = (selector) => document.querySelector(selector)?.textContent?.trim() || '';
      const getTexts = (selector) => Array.from(document.querySelectorAll(selector)).map(el => el.textContent?.trim());
      
      return {
        title: getText('h1'),
        subtitle: getText('h2, .subtitle, .lead'),
        sections: getTexts('h2, h3').slice(0, 6),
        features: getTexts('li, .feature, .service').slice(0, 8),
        buttons: getTexts('button, .btn').slice(0, 4)
      };
    });
    
    // Generate complete clone
    const cloneCode = `'use client';

import { useState, useEffect } from 'react';

export default function SharpitsClone() {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/sharpit-images/sharpit-1.webp" alt="Logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-900">WhiteStart</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600">Services</a>
              <a href="#solutions" className="text-gray-700 hover:text-blue-600">Solutions</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 overflow-hidden">
          <img src="/sharpit-images/sharpit-2.png" alt="Background" className="w-full h-full object-cover opacity-10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                ${content.title?.replace(/SharpITS/gi, 'WhiteStart') || 'Advanced Identity & Access Management'}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                ${content.subtitle?.replace(/SharpITS/gi, 'WhiteStart') || 'Secure your enterprise with cutting-edge IAM solutions'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                  Get Started
                </button>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 font-semibold">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-3.png" alt="Technology" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive security solutions for modern enterprises
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Identity Management",
                description: "Complete user lifecycle management and provisioning",
                image: "/sharpit-images/sharpit-4.png",
                features: ["User Provisioning", "Role Management", "Access Control"]
              },
              {
                title: "Access Management", 
                description: "Secure access control and authentication systems",
                image: "/sharpit-images/sharpit-5.png",
                features: ["Single Sign-On", "Multi-Factor Auth", "Privileged Access"]
              },
              {
                title: "Compliance & Governance",
                description: "Regulatory compliance and security governance",
                image: "/sharpit-images/sharpit-6.png", 
                features: ["Audit Trails", "Policy Management", "Risk Assessment"]
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative mb-6">
                  <img src={service.image} alt={service.title} className="w-full h-48 object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-blue-600/10 rounded-lg group-hover:bg-blue-600/20 transition-colors"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Enterprise-Grade Technology
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Built on modern cloud architecture with enterprise security at its core
              </p>
              <div className="space-y-6">
                {[
                  "Cloud-Native Architecture",
                  "Zero-Trust Security Model", 
                  "AI-Powered Analytics",
                  "Real-Time Monitoring"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                    <span className="text-lg text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-7.png" alt="Technology Stack" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Secure Your Enterprise?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of organizations that trust WhiteStart for their security needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Start Free Trial
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">WhiteStart</h3>
              <p className="text-gray-400">Advanced security solutions for modern enterprises</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Identity Management</li>
                <li>Access Control</li>
                <li>Compliance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 WhiteStart System Security. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}`;

    // Save the complete clone
    const outputDir = path.join(__dirname, '../frontend/app/sharpits-clone');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(outputDir, 'page.tsx'), cloneCode);
    
    console.log('✅ Complete Sharpits clone created!');
    console.log('📁 Location: /frontend/app/sharpits-clone/page.tsx');
    console.log('🌐 Access at: http://localhost:3001/sharpits-clone');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

createSharpitsClone();