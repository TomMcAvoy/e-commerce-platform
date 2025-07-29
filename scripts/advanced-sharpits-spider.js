const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class AdvancedSharpitsSpider {
  constructor() {
    this.siteData = {
      layout: {},
      content: {},
      styles: {},
      components: [],
      navigation: []
    };
  }

  async spider() {
    console.log('🕷️  Advanced Sharpits spider starting...');
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
      await page.goto('https://sharpits.com', { waitUntil: 'networkidle2' });
      
      // Extract comprehensive site data
      const siteData = await page.evaluate(() => {
        // Get hero section data
        const hero = document.querySelector('section:first-of-type, .hero, .banner');
        const heroData = hero ? {
          title: hero.querySelector('h1')?.textContent?.trim(),
          subtitle: hero.querySelector('h2, p')?.textContent?.trim(),
          backgroundImage: getComputedStyle(hero).backgroundImage,
          className: hero.className,
          buttons: Array.from(hero.querySelectorAll('button, .btn, a[class*="btn"]')).map(btn => ({
            text: btn.textContent?.trim(),
            className: btn.className,
            href: btn.href
          }))
        } : null;

        // Get all sections with detailed structure
        const sections = Array.from(document.querySelectorAll('section')).map((section, index) => {
          const headings = Array.from(section.querySelectorAll('h1, h2, h3, h4')).map(h => ({
            level: h.tagName,
            text: h.textContent?.trim(),
            className: h.className
          }));

          const paragraphs = Array.from(section.querySelectorAll('p')).map(p => ({
            text: p.textContent?.trim(),
            className: p.className
          }));

          const images = Array.from(section.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            className: img.className
          }));

          const buttons = Array.from(section.querySelectorAll('button, .btn, a[class*="btn"]')).map(btn => ({
            text: btn.textContent?.trim(),
            className: btn.className,
            href: btn.href
          }));

          return {
            index,
            className: section.className,
            id: section.id,
            headings,
            paragraphs,
            images,
            buttons,
            layout: {
              display: getComputedStyle(section).display,
              flexDirection: getComputedStyle(section).flexDirection,
              gridTemplateColumns: getComputedStyle(section).gridTemplateColumns
            }
          };
        });

        // Get navigation structure
        const nav = document.querySelector('nav, .navbar, header nav');
        const navigation = nav ? Array.from(nav.querySelectorAll('a')).map(a => ({
          text: a.textContent?.trim(),
          href: a.href,
          className: a.className
        })) : [];

        // Get color scheme and typography
        const bodyStyles = getComputedStyle(document.body);
        const rootStyles = getComputedStyle(document.documentElement);
        
        return {
          hero: heroData,
          sections,
          navigation,
          styles: {
            colors: {
              primary: rootStyles.getPropertyValue('--primary-color') || '#007bff',
              secondary: rootStyles.getPropertyValue('--secondary-color') || '#6c757d',
              background: bodyStyles.backgroundColor,
              text: bodyStyles.color
            },
            typography: {
              fontFamily: bodyStyles.fontFamily,
              fontSize: bodyStyles.fontSize,
              lineHeight: bodyStyles.lineHeight
            }
          },
          meta: {
            title: document.title,
            description: document.querySelector('meta[name="description"]')?.content
          }
        };
      });

      this.siteData = siteData;
      await this.generateAdvancedClone();
      
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      await browser.close();
    }
  }

  async generateAdvancedClone() {
    const outputDir = path.join(__dirname, '../frontend/app/sharpits-clone');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const cloneCode = this.generateReactComponent();
    
    fs.writeFileSync(
      path.join(outputDir, 'page.tsx'),
      cloneCode
    );

    // Save extracted data
    fs.writeFileSync(
      path.join(outputDir, 'site-data.json'),
      JSON.stringify(this.siteData, null, 2)
    );

    console.log('✅ Advanced clone generated at /sharpits-clone');
    console.log(`📊 Sections cloned: ${this.siteData.sections?.length || 0}`);
    console.log(`🎨 Navigation items: ${this.siteData.navigation?.length || 0}`);
  }

  generateReactComponent() {
    const { hero, sections, navigation, styles } = this.siteData;

    return `'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SharpitsClone() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Cloned */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">WhiteStart</span>
            </div>
            <div className="hidden md:flex space-x-8">
              ${navigation?.map(item => `
              <a href="${item.href}" className="text-gray-700 hover:text-blue-600 transition-colors">
                ${item.text}
              </a>`).join('') || ''}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Cloned Structure */}
      ${hero ? `
      <section className="relative pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            ${hero.title?.replace(/SharpITS/g, 'WhiteStart') || 'WhiteStart System Security'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            ${hero.subtitle?.replace(/SharpITS/g, 'WhiteStart') || 'Advanced security solutions for modern enterprises'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            ${hero.buttons?.map(btn => `
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              ${btn.text}
            </button>`).join('') || ''}
          </div>
        </div>
      </section>
      ` : ''}

      {/* Cloned Sections */}
      ${sections?.slice(1, 5).map((section, index) => `
      <section className="py-20 px-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
        <div className="max-w-7xl mx-auto">
          ${section.headings?.[0] ? `
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            ${section.headings[0].text?.replace(/SharpITS/g, 'WhiteStart')}
          </h2>
          ` : ''}
          
          <div className="grid md:grid-cols-${section.images?.length > 2 ? '3' : '2'} gap-12 items-center">
            ${section.paragraphs?.slice(0, 2).map(p => `
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                ${p.text?.replace(/SharpITS/g, 'WhiteStart')?.substring(0, 200)}...
              </p>
            </div>
            `).join('') || ''}
            
            ${section.images?.[0] ? `
            <div className="relative">
              <img 
                src="${section.images[0].src}" 
                alt="${section.images[0].alt}" 
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
            ` : ''}
          </div>
          
          ${section.buttons?.length > 0 ? `
          <div className="text-center mt-12">
            ${section.buttons.map(btn => `
            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold mr-4">
              ${btn.text}
            </button>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </section>
      `).join('') || ''}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 WhiteStart System Security. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}`;
  }
}

const spider = new AdvancedSharpitsSpider();
spider.spider();