const puppeteer = require('puppeteer');

class TestEnvironmentSetup {
  constructor() {
    this.browser = null;
    this.page = null;
    this.config = {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      apiUrl: process.env.API_URL || 'http://localhost:3001',
      timeout: 30000
    };
    this.apiCalls = [];
  }

  async initializeBrowser() {
    this.browser = await puppeteer.launch({
      headless: process.env.HEADLESS !== 'false',
      slowMo: parseInt(process.env.SLOW_MO) || 100,
      devtools: process.env.DEVTOOLS === 'true',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    await this.setupAPIMonitoring();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async setupAPIMonitoring() {
    await this.page.setRequestInterception(true);
    
    this.page.on('request', request => {
      this.apiCalls.push({
        url: request.url(),
        method: request.method(),
        timestamp: new Date().toISOString()
      });
      request.continue();
    });
    
    this.page.on('response', response => {
      const call = this.apiCalls.find(c => c.url === response.url());
      if (call) {
        call.response = {
          status: response.status(),
          statusText: response.statusText(),
          responseTime: Date.now() - new Date(call.timestamp).getTime()
        };
      }
    });
  }

  async checkServices() {
    const services = [
      { name: 'Frontend', url: this.config.baseUrl },
      { name: 'Backend API', url: `${this.config.apiUrl}/health` }
    ];
    
    for (const service of services) {
      try {
        const response = await fetch(service.url);
        console.log(`✅ ${service.name}: ${response.status}`);
      } catch (error) {
        console.log(`❌ ${service.name}: ${error.message}`);
      }
    }
  }

  async navigateSafe(url) {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: this.config.timeout });
    } catch (error) {
      console.warn(`Navigation warning for ${url}: ${error.message}`);
    }
  }

  async takeScreenshot(name) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}.png`;
    await this.page.screenshot({ 
      path: `test-results/screenshots/${filename}`,
      fullPage: true 
    });
    return filename;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

module.exports = TestEnvironmentSetup;
