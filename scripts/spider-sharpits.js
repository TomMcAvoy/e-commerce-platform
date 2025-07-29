const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const url = require('url');

class SharpitsSpider {
  constructor() {
    this.visitedUrls = new Set();
    this.siteData = {
      pages: [],
      navigation: [],
      images: [],
      styles: {},
      content: {}
    };
    this.baseUrl = 'https://sharpits.com';
  }

  async spider() {
    console.log('🕷️  Starting Sharpits.com spider...');
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
      await this.crawlPage(page, this.baseUrl);
      await this.saveResults();
    } catch (error) {
      console.error('❌ Spider error:', error);
    } finally {
      await browser.close();
    }
  }

  async crawlPage(page, pageUrl) {
    if (this.visitedUrls.has(pageUrl) || this.visitedUrls.size >= 10) return;
    
    console.log(`📄 Crawling: ${pageUrl}`);
    this.visitedUrls.add(pageUrl);
    
    try {
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const pageData = await page.evaluate(() => {
        // Extract page structure
        const getElementData = (element) => ({
          tagName: element.tagName,
          className: element.className,
          id: element.id,
          textContent: element.textContent?.trim().substring(0, 200),
          innerHTML: element.innerHTML?.substring(0, 500)
        });

        // Get navigation links
        const navLinks = Array.from(document.querySelectorAll('nav a, .nav a, header a')).map(a => ({
          text: a.textContent?.trim(),
          href: a.href,
          className: a.className
        }));

        // Get all sections
        const sections = Array.from(document.querySelectorAll('section, .section, main > div')).map(getElementData);

        // Get hero content
        const hero = document.querySelector('.hero, .banner, .jumbotron, section:first-child');
        const heroData = hero ? {
          title: hero.querySelector('h1, .title')?.textContent?.trim(),
          subtitle: hero.querySelector('h2, .subtitle, p')?.textContent?.trim(),
          buttons: Array.from(hero.querySelectorAll('button, .btn, a[class*="btn"]')).map(btn => ({
            text: btn.textContent?.trim(),
            className: btn.className
          }))
        } : null;

        // Get all images
        const images = Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt,
          className: img.className,
          width: img.width,
          height: img.height
        }));

        // Get computed styles
        const bodyStyles = getComputedStyle(document.body);
        const styles = {
          backgroundColor: bodyStyles.backgroundColor,
          color: bodyStyles.color,
          fontFamily: bodyStyles.fontFamily,
          fontSize: bodyStyles.fontSize
        };

        return {
          url: window.location.href,
          title: document.title,
          navLinks,
          sections,
          hero: heroData,
          images,
          styles,
          content: {
            headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
              level: h.tagName,
              text: h.textContent?.trim(),
              className: h.className
            })),
            paragraphs: Array.from(document.querySelectorAll('p')).slice(0, 10).map(p => p.textContent?.trim())
          }
        };
      });

      this.siteData.pages.push(pageData);
      console.log(`✅ Extracted data from: ${pageData.title}`);

      // Find internal links to crawl
      const internalLinks = pageData.navLinks
        .filter(link => link.href && link.href.includes('sharpits.com'))
        .map(link => link.href)
        .slice(0, 5); // Limit to 5 additional pages

      // Crawl internal links
      for (const link of internalLinks) {
        await this.crawlPage(page, link);
      }

    } catch (error) {
      console.log(`❌ Failed to crawl ${pageUrl}:`, error.message);
    }
  }

  async saveResults() {
    const outputDir = path.join(__dirname, '../analysis/sharpits-spider');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save complete site data
    fs.writeFileSync(
      path.join(outputDir, 'site-data.json'),
      JSON.stringify(this.siteData, null, 2)
    );

    // Generate clone template
    await this.generateCloneTemplate();

    console.log(`\n🎉 Spider completed!`);
    console.log(`📊 Pages crawled: ${this.siteData.pages.length}`);
    console.log(`🖼️  Images found: ${this.siteData.pages.reduce((acc, page) => acc + page.images.length, 0)}`);
    console.log(`📁 Results saved to: analysis/sharpits-spider/`);
  }

  async generateCloneTemplate() {
    const mainPage = this.siteData.pages[0];
    if (!mainPage) return;

    const template = `'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SharpitsClonePage() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '${mainPage.styles.backgroundColor}' }}>
      {/* Hero Section - Cloned from Sharpits */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        ${mainPage.hero ? `
        <div className="text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-bold mb-6 text-white">
            ${mainPage.hero.title || 'WhiteStart System Security'}
          </h1>
          <p className="text-xl mb-12 text-gray-300">
            ${mainPage.hero.subtitle || 'Advanced security solutions'}
          </p>
          ${mainPage.hero.buttons.map(btn => `
          <button className="px-8 py-4 bg-blue-600 text-white rounded-lg mr-4 hover:bg-blue-700 transition-colors">
            ${btn.text}
          </button>
          `).join('')}
        </div>
        ` : ''}
      </section>

      {/* Sections - Cloned Structure */}
      ${mainPage.sections.slice(1, 4).map((section, index) => `
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            ${mainPage.content.headings[index + 1]?.text || `Section ${index + 1}`}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Content based on original structure */}
          </div>
        </div>
      </section>
      `).join('')}
    </div>
  );
}`;

    fs.writeFileSync(
      path.join(__dirname, '../analysis/sharpits-spider/clone-template.tsx'),
      template
    );

    console.log('📝 Clone template generated');
  }
}

// Run spider
const spider = new SharpitsSpider();
spider.spider();