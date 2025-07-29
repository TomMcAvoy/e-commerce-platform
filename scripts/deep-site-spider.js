const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const url = require('url');

class DeepSiteSpider {
  constructor() {
    this.baseUrl = 'https://sharpits.com';
    this.visitedUrls = new Set();
    this.urlQueue = [];
    this.siteData = {
      pages: {},
      navigation: {},
      sitemap: []
    };
    this.maxDepth = 3;
    this.maxPages = 25;
  }

  async spider() {
    console.log('🕷️  Deep site spider starting...');
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
      this.urlQueue.push({ url: this.baseUrl, depth: 0 });
      
      while (this.urlQueue.length > 0 && this.visitedUrls.size < this.maxPages) {
        const { url: currentUrl, depth } = this.urlQueue.shift();
        
        if (this.visitedUrls.has(currentUrl) || depth > this.maxDepth) continue;
        
        await this.crawlPage(page, currentUrl, depth);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      }
      
      await this.generateDeepSite();
      
    } catch (error) {
      console.error('❌ Deep spider error:', error);
    } finally {
      await browser.close();
    }
  }

  async crawlPage(page, pageUrl, depth) {
    console.log(`📄 [Depth ${depth}] Crawling: ${pageUrl}`);
    this.visitedUrls.add(pageUrl);
    
    try {
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Accept cookies
      try {
        await page.waitForSelector('button:has-text("Accept"), button:has-text("OK"), .cookie-accept', { timeout: 2000 });
        await page.click('button:has-text("Accept"), button:has-text("OK"), .cookie-accept');
      } catch {}
      
      const pageData = await page.evaluate(() => {
        // Extract all links
        const allLinks = Array.from(document.querySelectorAll('a[href]')).map(a => ({
          text: a.textContent?.trim(),
          href: a.href,
          className: a.className,
          isInternal: a.href.includes('sharpits.com') || a.href.startsWith('/')
        })).filter(link => link.text && link.href);

        // Extract comprehensive content
        const content = {
          title: document.title,
          headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
            level: h.tagName,
            text: h.textContent?.trim(),
            id: h.id,
            className: h.className
          })),
          paragraphs: Array.from(document.querySelectorAll('p')).map(p => ({
            text: p.textContent?.trim(),
            className: p.className
          })).filter(p => p.text && p.text.length > 15),
          lists: Array.from(document.querySelectorAll('ul, ol')).map(list => ({
            type: list.tagName,
            items: Array.from(list.querySelectorAll('li')).map(li => li.textContent?.trim())
          })),
          buttons: Array.from(document.querySelectorAll('button, .btn, input[type="submit"]')).map(btn => ({
            text: btn.textContent?.trim() || btn.value,
            type: btn.type,
            className: btn.className
          })),
          images: Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            className: img.className
          })).filter(img => img.src && !img.src.includes('data:')),
          forms: Array.from(document.querySelectorAll('form')).map(form => ({
            action: form.action,
            method: form.method,
            inputs: Array.from(form.querySelectorAll('input, textarea, select')).map(input => ({
              name: input.name,
              type: input.type,
              placeholder: input.placeholder
            }))
          }))
        };

        return { ...content, allLinks };
      });

      // Store page data
      const urlPath = new URL(pageUrl).pathname;
      this.siteData.pages[urlPath] = pageData;
      this.siteData.sitemap.push({ url: pageUrl, path: urlPath, depth });
      
      // Add internal links to queue
      if (depth < this.maxDepth) {
        const internalLinks = pageData.allLinks
          .filter(link => link.isInternal && !this.visitedUrls.has(link.href))
          .slice(0, 5); // Limit links per page
        
        internalLinks.forEach(link => {
          this.urlQueue.push({ url: link.href, depth: depth + 1 });
        });
      }
      
      console.log(`✅ Extracted: ${pageData.headings.length} headings, ${pageData.paragraphs.length} paragraphs, ${pageData.allLinks.length} links`);
      
    } catch (error) {
      console.log(`❌ Failed to crawl ${pageUrl}:`, error.message);
    }
  }

  async generateDeepSite() {
    const outputDir = path.join(__dirname, '../frontend/app/company');
    
    // Generate main page with comprehensive content
    const mainPageCode = this.generateMainPage();
    fs.writeFileSync(path.join(outputDir, 'page.tsx'), mainPageCode);
    
    // Generate subpages for each crawled page
    const subPages = Object.entries(this.siteData.pages).slice(1);
    for (const [urlPath, pageData] of subPages) {
      const subPageCode = this.generateSubPage(pageData);
      const pageName = this.sanitizePageName(urlPath);
      const subDir = path.join(outputDir, pageName);
      
      if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(subDir, 'page.tsx'), subPageCode);
    }

    // Save complete site data
    fs.writeFileSync(
      path.join(__dirname, '../analysis/deep-site-data.json'),
      JSON.stringify(this.siteData, null, 2)
    );

    console.log(`\n🎉 Deep site generation complete!`);
    console.log(`📊 Total pages crawled: ${Object.keys(this.siteData.pages).length}`);
    console.log(`🔗 Total links found: ${Object.values(this.siteData.pages).reduce((acc, page) => acc + page.allLinks.length, 0)}`);
    console.log(`📁 Subpages created: ${subPages.length}`);
  }

  generateMainPage() {
    const mainPage = Object.values(this.siteData.pages)[0];
    const allPages = Object.entries(this.siteData.pages);
    
    return `'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CompanyPage() {
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
              ${allPages.slice(1, 6).map(([path, page]) => {
                const pageName = this.sanitizePageName(path);
                const linkText = page.title?.replace(/SharpITS/gi, 'WhiteStart').split('|')[0]?.trim() || 'Services';
                return `<Link href="/company/${pageName}" className="text-gray-700 hover:text-blue-600">${linkText}</Link>`;
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
                ${mainPage.headings.find(h => h.level === 'H1')?.text?.replace(/SharpITS/gi, 'WhiteStart') || 'WhiteStart System Security'}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                ${mainPage.paragraphs[0]?.text?.replace(/SharpITS/gi, 'WhiteStart').substring(0, 200) || 'Advanced security solutions'}
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

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Our Solutions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${allPages.slice(1, 7).map(([path, page], index) => {
              const pageName = this.sanitizePageName(path);
              const title = page.headings.find(h => h.level === 'H1')?.text?.replace(/SharpITS/gi, 'WhiteStart') || 'Service';
              const description = page.paragraphs[0]?.text?.replace(/SharpITS/gi, 'WhiteStart').substring(0, 120) || 'Professional service';
              
              return `
            <Link href="/company/${pageName}" className="block">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <img src="/sharpit-images/sharpit-${index + 4}.png" alt="${title}" className="w-full h-40 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">${title}</h3>
                <p className="text-gray-600">${description}</p>
              </div>
            </Link>`;
            }).join('')}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      ${mainPage.headings.slice(1, 4).map((heading, index) => `
      <section className="py-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            ${heading.text?.replace(/SharpITS/gi, 'WhiteStart')}
          </h2>
          ${mainPage.paragraphs.slice(index * 2, (index * 2) + 2).map(p => `
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            ${p.text?.replace(/SharpITS/gi, 'WhiteStart')}
          </p>
          `).join('')}
        </div>
      </section>
      `).join('')}

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

  generateSubPage(pageData) {
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
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            ${pageData.headings.find(h => h.level === 'H1')?.text?.replace(/SharpITS/gi, 'WhiteStart') || pageData.title?.replace(/SharpITS/gi, 'WhiteStart')}
          </h1>
          
          ${pageData.headings.slice(1).map((heading, index) => `
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ${heading.text?.replace(/SharpITS/gi, 'WhiteStart')}
            </h2>
            ${pageData.paragraphs.slice(index * 2, (index * 2) + 2).map(p => `
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              ${p.text?.replace(/SharpITS/gi, 'WhiteStart')}
            </p>
            `).join('')}
          </div>
          `).join('')}

          ${pageData.lists.length > 0 ? `
          <div className="mb-8">
            ${pageData.lists.map(list => `
            <${list.type.toLowerCase()} className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              ${list.items.map(item => `
              <li>${item?.replace(/SharpITS/gi, 'WhiteStart')}</li>
              `).join('')}
            </${list.type.toLowerCase()}>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </section>
    </div>
  );
}`;
  }

  sanitizePageName(path) {
    return path.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'page';
  }
}

const spider = new DeepSiteSpider();
spider.spider();