const TestEnvironmentSetup = require('./test-setup.js');

class CartAPITester extends TestEnvironmentSetup {
  constructor() {
    super();
    this.cartScenarios = [
      { store: 'Women\'s Fashion', path: '/' },
      { store: 'Men\'s Tech', path: '/men' },
      { store: 'Sports', path: '/sports' },
      { store: 'Hardware', path: '/hardware' }
    ];
  }

  async testAllCartWorkflows() {
    console.log('🛒 Starting cart workflow tests...');
    const results = [];
    
    for (const scenario of this.cartScenarios) {
      try {
        const result = await this.testStoreCartWorkflow(scenario);
        results.push(result);
        console.log(`✅ ${scenario.store} cart workflow completed`);
      } catch (error) {
        console.error(`❌ ${scenario.store} cart workflow failed: ${error.message}`);
        results.push({
          store: scenario.store,
          success: false,
          error: error.message
        });
      }
    }
    
    return {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        passed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      },
      results,
      apiAnalysis: this.analyzeCartAPICalls()
    };
  }

  async testStoreCartWorkflow(scenario) {
    await this.navigateSafe(`${this.config.baseUrl}${scenario.path}`);
    
    const result = {
      store: scenario.store,
      success: true,
      tests: {}
    };
    
    // Test add to cart functionality
    result.tests.addToCart = await this.testAddToCart();
    result.tests.cartUI = await this.testCartUI();
    
    return result;
  }

  async testAddToCart() {
    const productSelectors = [
      '[data-testid="product-card"]',
      '.product-card',
      '.featured-products .group'
    ];
    
    for (const selector of productSelectors) {
      try {
        const products = await this.page.$$(selector);
        if (products.length > 0) {
          await products[0].hover();
          await this.page.waitForTimeout(1000);
          
          const cartButton = await this.page.$('[data-testid="add-to-cart"], button:has-text("Add to Cart")');
          if (cartButton) {
            await cartButton.click();
            await this.page.waitForTimeout(2000);
            return { success: true, productsFound: products.length };
          }
        }
      } catch (error) {
        // Continue trying other selectors
      }
    }
    
    return { success: false, productsFound: 0 };
  }

  async testCartUI() {
    const cartCounterSelectors = [
      '[data-testid="cart-count"]',
      '.cart-count',
      '.cart-badge'
    ];
    
    for (const selector of cartCounterSelectors) {
      try {
        const counter = await this.page.$(selector);
        if (counter) {
          const countText = await counter.evaluate(el => el.textContent);
          return { cartCounterVisible: true, count: parseInt(countText) || 0 };
        }
      } catch (error) {
        // Continue
      }
    }
    
    return { cartCounterVisible: false, count: 0 };
  }

  analyzeCartAPICalls() {
    const cartCalls = this.apiCalls.filter(call => 
      call.url.includes('/api/cart') || call.url.includes('/cart')
    );
    
    return {
      totalCalls: cartCalls.length,
      successfulCalls: cartCalls.filter(c => c.response && c.response.status < 400).length,
      endpoints: [...new Set(cartCalls.map(c => c.url))]
    };
  }
}

module.exports = CartAPITester;
