const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function analyzeSharpit() {
  console.log('🔍 Analyzing sharpit.com structure...');
  
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://sharpit.com', { waitUntil: 'networkidle2' });
    
    // Extract page structure
    const pageData = await page.evaluate(() => {
      const sections = [];
      
      // Get all main sections
      document.querySelectorAll('section, .section, main > div').forEach((section, index) => {
        const sectionData = {
          index,
          tagName: section.tagName,
          classes: Array.from(section.classList),
          id: section.id,
          textContent: section.textContent?.substring(0, 200) + '...',
          hasImages: section.querySelectorAll('img').length,
          hasButtons: section.querySelectorAll('button, .btn, a[class*="btn"]').length,
          hasAnimations: section.style.animation || section.classList.toString().includes('animate'),
          children: section.children.length
        };
        sections.push(sectionData);
      });
      
      // Get color scheme
      const styles = getComputedStyle(document.body);
      const colorScheme = {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: styles.fontFamily
      };
      
      // Get navigation structure
      const nav = document.querySelector('nav, .nav, header nav');
      const navItems = nav ? Array.from(nav.querySelectorAll('a')).map(a => ({
        text: a.textContent?.trim(),
        href: a.href
      })) : [];
      
      return {
        title: document.title,
        sections,
        colorScheme,
        navItems,
        totalImages: document.querySelectorAll('img').length,
        totalButtons: document.querySelectorAll('button, .btn').length
      };
    });
    
    console.log('📊 Analysis Results:');
    console.log(`Title: ${pageData.title}`);
    console.log(`Sections found: ${pageData.sections.length}`);
    console.log(`Images: ${pageData.totalImages}`);
    console.log(`Buttons: ${pageData.totalButtons}`);
    console.log(`Navigation items: ${pageData.navItems.length}`);
    
    // Save analysis
    fs.writeFileSync(
      path.join(__dirname, '../analysis/sharpit-analysis.json'),
      JSON.stringify(pageData, null, 2)
    );
    
    // Take screenshot
    await page.screenshot({ 
      path: path.join(__dirname, '../analysis/sharpit-screenshot.png'),
      fullPage: true 
    });
    
    console.log('✅ Analysis saved to analysis/sharpit-analysis.json');
    
  } catch (error) {
    console.error('❌ Error analyzing sharpit.com:', error.message);
  } finally {
    await browser.close();
  }
}

// Create analysis directory
const analysisDir = path.join(__dirname, '../analysis');
if (!fs.existsSync(analysisDir)) {
  fs.mkdirSync(analysisDir, { recursive: true });
}

analyzeSharpit();