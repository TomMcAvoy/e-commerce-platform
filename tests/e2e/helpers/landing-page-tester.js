const TestEnvironmentSetup = require('./test-setup.js');

class LandingPageTester extends TestEnvironmentSetup {
  constructor() {
    super();
    this.storeConfigs = [
      { name: 'Women\'s Fashion', path: '/', expectedElements: ['products', 'categories', 'hero'] },
      { name: 'Men\'s Tech', path: '/men', expectedElements: ['products', 'tech-categories'] },
      { name: 'Sports', path: '/sports', expectedElements: ['products', 'sports-gear'] },
      { name: 'Hardware', path: '/hardware', expectedElements: ['products', 'tools'] }
    ];
  }

  async testAllLandingPages() {
    console.log('�� Testing all store landing pages...');
    const results = [];
    
    for (const store of this.storeConfigs) {
      try {
        const result = await this.testStoreLandingPage(store);
        results.push(result);
        console.log(`✅ ${store.name} page tested`);
      } catch (error) {
        console.error(`❌ ${store.name} failed: ${error.message}`);
        results.push({ store: store.name, success: false, error: error.message });
      }
    }
    
    return {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        passed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      },
      results
    };
  }

  async testStoreLandingPage(store) {
    await this.navigateSafe(`${this.config.baseUrl}${store.path}`);
    
    const result = {
      store: store.name,
      success: true,
      loadTime: 0,
      elementsFound: 0,
      errors: []
    };
    
    const startTime = Date.now();
    
    // Test page load and basic elements
    try {
      await this.page.waitForSelector('body', { timeout: 10000 });
      result.loadTime = Date.now() - startTime;
      
      // Check for common e-commerce elements
      const selectors = [
        '[data-testid="product-card"], .product-card, .featured-products .group',
        'nav, .navbar, .navigation',
        'h1, .hero, .banner',
        'footer, .footer'
      ];
      
      for (const selector of selectors) {
        try {
          const element = await this.page.$(selector);
          if (element) result.elementsFound++;
        } catch (error) {
          // Element not found, continue
        }
      }
      
    } catch (error) {
      result.success = false;
      result.errors.push(error.message);
    }
    
    return result;
  }
}

module.exports = LandingPageTester;
