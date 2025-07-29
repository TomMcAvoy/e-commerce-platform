const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function extractSharpitImages() {
  console.log('🖼️  Extracting images from sharpit.com...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://sharpits.com', { waitUntil: 'networkidle2' });
    
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        alt: img.alt || '',
        width: img.width,
        height: img.height,
        className: img.className
      })).filter(img => img.src && !img.src.includes('data:'));
    });
    
    console.log(`Found ${images.length} images`);
    
    // Create images directory
    const imagesDir = path.join(__dirname, '../frontend/public/sharpit-images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Download images
    for (let i = 0; i < Math.min(images.length, 10); i++) {
      const img = images[i];
      try {
        const filename = `sharpit-${i + 1}.${img.src.split('.').pop().split('?')[0]}`;
        const filepath = path.join(imagesDir, filename);
        
        console.log(`Downloading: ${img.src}`);
        await downloadImage(img.src, filepath);
        console.log(`✅ Saved: ${filename}`);
        
        images[i].localPath = `/sharpit-images/${filename}`;
      } catch (error) {
        console.log(`❌ Failed to download: ${img.src}`);
      }
    }
    
    // Save image metadata
    fs.writeFileSync(
      path.join(__dirname, '../frontend/public/sharpit-images/images.json'),
      JSON.stringify(images, null, 2)
    );
    
    console.log('✅ Images extracted and saved');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

extractSharpitImages();