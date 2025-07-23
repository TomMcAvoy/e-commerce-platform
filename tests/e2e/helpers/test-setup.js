const puppeteer = require('puppeteer');

class TestEnvironmentSetup {
  constructor() {
    this.browser = null;
    this.page = null;
    this.config = {
      baseUrl: process.env.BASE_URL || 'http://localhost:3001',
      apiUrl: process.env.API_URL || 'http://localhost:3000',
      timeout: 30000
    };
  }

  async initializeBrowser() {
    console.log('🔧 Setting up browser environment...');
    this.browser = await puppeteer.launch({
      headless: process.env.HEADLESS !== 'false',
      slowMo: parseInt(process.env.SLOW_MO) || 50,
      devtools: process.env.DEVTOOLS === 'true',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    this.page.setDefaultTimeout(this.config.timeout);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = TestEnvironmentSetup;
