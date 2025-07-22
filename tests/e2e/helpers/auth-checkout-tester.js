const TestEnvironmentSetup = require('./test-setup.js');

class AuthCheckoutTester extends TestEnvironmentSetup {
  constructor() {
    super();
    this.testUser = {
      email: 'test.user@example.com',
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User'
    };
  }

  async testAllAuthCheckoutWorkflows() {
    console.log('🔐 Starting authentication & checkout tests...');
    const results = [];
    
    const scenarios = [
      { store: 'Women\'s Fashion', path: '/', flow: 'guest' },
      { store: 'Men\'s Tech', path: '/men', flow: 'registered' }
    ];
    
    for (const scenario of scenarios) {
      try {
        const result = await this.testStoreAuthCheckout(scenario);
        results.push(result);
        console.log(`✅ ${scenario.store} auth/checkout completed`);
      } catch (error) {
        console.error(`❌ ${scenario.store} auth/checkout failed: ${error.message}`);
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
      authAnalysis: this.analyzeAuthAPICalls()
    };
  }

  async testStoreAuthCheckout(scenario) {
    await this.navigateSafe(`${this.config.baseUrl}${scenario.path}`);
    
    const result = {
      store: scenario.store,
      success: true,
      tests: {}
    };
    
    // Add item to cart first
    await this.addItemToCart();
    
    // Test auth flow
    if (scenario.flow === 'registered') {
      result.tests.login = await this.testLogin();
    }
    
    // Test checkout
    result.tests.checkout = await this.testCheckout();
    
    return result;
  }

  async addItemToCart() {
    const productCard = await this.page.$('.product-card, [data-testid="product-card"]');
    if (productCard) {
      await productCard.hover();
      const cartButton = await this.page.$('button:has-text("Add to Cart")');
      if (cartButton) {
        await cartButton.click();
        await this.page.waitForTimeout(2000);
      }
    }
  }

  async testLogin() {
    const loginSelectors = [
      '[data-testid="login"]',
      'button:has-text("Sign In")',
      'a:has-text("Login")'
    ];
    
    for (const selector of loginSelectors) {
      try {
        const loginButton = await this.page.$(selector);
        if (loginButton) {
          await loginButton.click();
          await this.page.waitForTimeout(2000);
          return { loginFormFound: true };
        }
      } catch (error) {
        // Continue
      }
    }
    
    return { loginFormFound: false };
  }

  async testCheckout() {
    // Navigate to cart first
    const cartLink = await this.page.$('[href*="cart"], .cart-link');
    if (cartLink) {
      await cartLink.click();
      await this.page.waitForTimeout(2000);
    }
    
    // Look for checkout button
    const checkoutButton = await this.page.$('button:has-text("Checkout"), [data-testid="checkout"]');
    if (checkoutButton) {
      await checkoutButton.click();
      await this.page.waitForTimeout(3000);
      return { checkoutAccessible: true };
    }
    
    return { checkoutAccessible: false };
  }

  analyzeAuthAPICalls() {
    const authCalls = this.apiCalls.filter(call => 
      call.url.includes('/api/auth') || 
      call.url.includes('/api/orders')
    );
    
    return {
      totalCalls: authCalls.length,
      authCalls: authCalls.filter(c => c.url.includes('/api/auth')).length,
      orderCalls: authCalls.filter(c => c.url.includes('/api/orders')).length
    };
  }
}

module.exports = AuthCheckoutTester;
