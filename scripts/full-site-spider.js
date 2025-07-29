const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const url = require('url');

class FullSiteSpider {
  constructor() {
    this.baseUrl = 'https://sharpits.com';
    this.visitedUrls = new Set();
    this.siteMap = {
      navigation: [],
      pages: {},
      structure: {},
      content: {}
    };
    this.maxPages = 15;
  }

  async spider() {
    console.log('🕷️  Full site spider starting...');
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
      await this.crawlSite(page, this.baseUrl);
      await this.generateFullSite();
      
    } catch (error) {
      console.error('❌ Spider error:', error);
    } finally {
      await browser.close();
    }
  }

  async crawlSite(page, startUrl) {
    const urlsToVisit = [startUrl];
    
    while (urlsToVisit.length > 0 && this.visitedUrls.size < this.maxPages) {
      const currentUrl = urlsToVisit.shift();
      
      if (this.visitedUrls.has(currentUrl)) continue;
      
      console.log(`📄 Crawling: ${currentUrl}`);
      this.visitedUrls.add(currentUrl);
      
      try {
        await page.goto(currentUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Accept cookies
        try {
          await page.waitForSelector('button:has-text("Accept"), button:has-text("OK"), .cookie-accept', { timeout: 2000 });
          await page.click('button:has-text("Accept"), button:has-text("OK"), .cookie-accept');
        } catch {}
        
        const pageData = await page.evaluate(() => {
          // Extract navigation
          const navLinks = Array.from(document.querySelectorAll('nav a, .nav a, header a, .navbar a')).map(a => ({
            text: a.textContent?.trim(),
            href: a.href,
            className: a.className
          })).filter(link => link.text && link.href);

          // Extract page content
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
            level: h.tagName,
            text: h.textContent?.trim(),
            className: h.className
          }));

          const paragraphs = Array.from(document.querySelectorAll('p')).map(p => ({
            text: p.textContent?.trim(),
            className: p.className
          })).filter(p => p.text && p.text.length > 20);

          const buttons = Array.from(document.querySelectorAll('button, .btn, a[class*="btn"]')).map(btn => ({
            text: btn.textContent?.trim(),
            href: btn.href,
            className: btn.className
          })).filter(btn => btn.text);

          const images = Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            className: img.className
          })).filter(img => img.src && !img.src.includes('data:'));

          // Extract sections
          const sections = Array.from(document.querySelectorAll('section, .section, main > div')).map((section, index) => {
            const sectionHeadings = Array.from(section.querySelectorAll('h1, h2, h3')).map(h => h.textContent?.trim());
            const sectionText = Array.from(section.querySelectorAll('p')).map(p => p.textContent?.trim()).filter(t => t && t.length > 20);
            
            return {
              index,
              className: section.className,
              headings: sectionHeadings,
              content: sectionText.slice(0, 3),
              hasImages: section.querySelectorAll('img').length > 0
            };
          });

          return {
            url: window.location.href,
            title: document.title,
            navLinks,
            headings,
            paragraphs: paragraphs.slice(0, 10),
            buttons: buttons.slice(0, 8),
            images: images.slice(0, 10),
            sections,
            meta: {
              description: document.querySelector('meta[name="description"]')?.content,
              keywords: document.querySelector('meta[name="keywords"]')?.content
            }
          };
        });

        // Store page data
        const urlPath = new URL(currentUrl).pathname;
        this.siteMap.pages[urlPath] = pageData;
        
        // Extract internal links for further crawling
        const internalLinks = pageData.navLinks
          .filter(link => link.href && link.href.includes('sharpits.com'))
          .map(link => link.href)
          .filter(href => !this.visitedUrls.has(href));

        urlsToVisit.push(...internalLinks.slice(0, 3));
        
      } catch (error) {
        console.log(`❌ Failed to crawl ${currentUrl}:`, error.message);
      }
    }
  }

  async generateFullSite() {
    const outputDir = path.join(__dirname, '../frontend/app/company');
    
    // Generate main navigation from all pages
    const allNavLinks = [];
    Object.values(this.siteMap.pages).forEach(page => {
      page.navLinks.forEach(link => {
        if (!allNavLinks.find(existing => existing.href === link.href)) {
          allNavLinks.push(link);
        }
      });
    });

    // Generate main company page
    const mainPage = Object.values(this.siteMap.pages)[0];
    const companyPageCode = this.generateCompanyPage(mainPage, allNavLinks);
    
    fs.writeFileSync(path.join(outputDir, 'page.tsx'), companyPageCode);

    // Generate subpages
    const subPages = Object.entries(this.siteMap.pages).slice(1, 6);
    for (const [urlPath, pageData] of subPages) {
      const subPageCode = this.generateSubPage(pageData, allNavLinks);
      const pageName = urlPath.split('/').pop() || 'about';
      const subDir = path.join(outputDir, pageName);
      
      if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(subDir, 'page.tsx'), subPageCode);
    }

    // Save site map
    fs.writeFileSync(
      path.join(__dirname, '../analysis/full-site-map.json'),
      JSON.stringify(this.siteMap, null, 2)
    );

    console.log(`✅ Full site generated!`);
    console.log(`📊 Pages crawled: ${Object.keys(this.siteMap.pages).length}`);
    console.log(`🔗 Navigation links: ${allNavLinks.length}`);
    console.log(`📁 Files created in: frontend/app/company/`);
  }

  generateCompanyPage(mainPage, navLinks) {
    const heroHeading = mainPage.headings.find(h => h.level === 'H1')?.text || 'WhiteStart System Security';
    const heroSubtext = mainPage.paragraphs[0]?.text || 'Advanced security solutions for modern enterprises';
    
    return `'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CompanyPage() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/sharpit-images/sharpit-1.webp" alt="Logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-900">WhiteStart</span>
            </div>
            <div className="hidden md:flex space-x-8">
              ${navLinks.slice(0, 6).map(link => {
                const linkText = link.text?.replace(/SharpITS/gi, 'WhiteStart') || 'Services';
                const linkPath = this.convertToLocalPath(link.href);
                return `<Link href="/company${linkPath}" className="text-gray-700 hover:text-blue-600">${linkText}</Link>`;
              }).join('\n              ')}
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
                ${heroHeading.replace(/SharpITS/gi, 'WhiteStart')}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                ${heroSubtext.replace(/SharpITS/gi, 'WhiteStart').substring(0, 200)}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                ${mainPage.buttons.slice(0, 2).map(btn => `
                <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  ${btn.text}
                </button>`).join('')}
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-3.png" alt="Technology" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ${mainPage.headings.find(h => h.level === 'H2')?.text?.replace(/SharpITS/gi, 'WhiteStart') || 'Our Services'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ${mainPage.paragraphs[1]?.text?.replace(/SharpITS/gi, 'WhiteStart').substring(0, 150) || 'Comprehensive security solutions'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            ${mainPage.sections.slice(1, 4).map((section, index) => `
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative mb-6">
                <img src="/sharpit-images/sharpit-${index + 4}.png" alt="Service" className="w-full h-48 object-cover rounded-lg" />
                <div className="absolute inset-0 bg-blue-600/10 rounded-lg group-hover:bg-blue-600/20 transition-colors"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ${section.headings[0]?.replace(/SharpITS/gi, 'WhiteStart') || `Service ${index + 1}`}
              </h3>
              <p className="text-gray-600">
                ${section.content[0]?.replace(/SharpITS/gi, 'WhiteStart').substring(0, 120) || 'Professional security service'}
              </p>
            </div>
            `).join('')}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                ${mainPage.headings.find(h => h.level === 'H3')?.text?.replace(/SharpITS/gi, 'WhiteStart') || 'Enterprise Technology'}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                ${mainPage.paragraphs[2]?.text?.replace(/SharpITS/gi, 'WhiteStart').substring(0, 200) || 'Advanced technology solutions'}
              </p>
              <div className="space-y-6">
                ${mainPage.paragraphs.slice(3, 7).map(p => `
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                  <span className="text-lg text-gray-700">${p.text.replace(/SharpITS/gi, 'WhiteStart').substring(0, 50)}</span>
                </div>
                `).join('')}
              </div>
            </div>
            <div className="relative">
              <img src="/sharpit-images/sharpit-7.png" alt="Technology" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2024 WhiteStart System Security. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}`;
  }

  generateSubPage(pageData, navLinks) {
    const pageTitle = pageData.title?.replace(/SharpITS/gi, 'WhiteStart') || 'WhiteStart';
    const mainHeading = pageData.headings.find(h => h.level === 'H1')?.text?.replace(/SharpITS/gi, 'WhiteStart') || pageTitle;
    
    return `'use client';

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
              ${navLinks.slice(0, 4).map(link => {
                const linkText = link.text?.replace(/SharpITS/gi, 'WhiteStart') || 'Services';
                return `<Link href="/company" className="text-gray-700 hover:text-blue-600">${linkText}</Link>`;
              }).join('\n              ')}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            ${mainHeading}
          </h1>
          
          ${pageData.sections.map((section, index) => `
          <div className="mb-12">
            ${section.headings.map(heading => `
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ${heading.replace(/SharpITS/gi, 'WhiteStart')}
            </h2>
            `).join('')}
            
            ${section.content.map(content => `
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              ${content.replace(/SharpITS/gi, 'WhiteStart')}
            </p>
            `).join('')}
          </div>
          `).join('')}
        </div>
      </section>
    </div>
  );
}`;
  }

  convertToLocalPath(href) {
    if (!href) return '';
    try {
      const urlObj = new URL(href);
      return urlObj.pathname === '/' ? '' : urlObj.pathname;
    } catch {
      return '';
    }
  }
}

const spider = new FullSiteSpider();
spider.spider();