#!/bin/bash

# E2E Test Suite Generator
# Creates all 5 components of the comprehensive E2E testing framework

set -e

echo "🚀 Generating E2E Test Suite Components..."
echo "=========================================="

# Create directory structure
mkdir -p tests/e2e/helpers
mkdir -p test-results/{screenshots,html,errors,reports,cart-debug,auth-checkout-debug}

# Component 1: Test Environment Setup
cat > tests/e2e/helpers/test-setup.js << 'EOF'
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
EOF

# Component 2: Landing Page Tester
cat > tests/e2e/helpers/landing-page-tester.js << 'EOF'
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
EOF

# Component 3: Cart API Tester
cat > tests/e2e/helpers/cart-api-tester.js << 'EOF'
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
EOF

# Component 4: Auth Checkout Tester
cat > tests/e2e/helpers/auth-checkout-tester.js << 'EOF'
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
EOF

# Component 5: Master Test Runner
cat > tests/e2e/helpers/master-test-runner.js << 'EOF'
const TestEnvironmentSetup = require('./test-setup.js');
const LandingPageTester = require('./landing-page-tester.js');
const CartAPITester = require('./cart-api-tester.js');
const AuthCheckoutTester = require('./auth-checkout-tester.js');
const fs = require('fs');
const path = require('path');

class MasterTestRunner extends TestEnvironmentSetup {
  constructor() {
    super();
    this.testSuites = [
      { name: 'landing-pages', tester: LandingPageTester, method: 'testAllLandingPages' },
      { name: 'cart-api', tester: CartAPITester, method: 'testAllCartWorkflows' },
      { name: 'auth-checkout', tester: AuthCheckoutTester, method: 'testAllAuthCheckoutWorkflows' }
    ];
    this.results = this.initializeResults();
  }

  async runAllTests() {
    console.log('🚀 Starting Master E2E Test Suite...');
    const startTime = Date.now();
    
    try {
      await this.initializeBrowser();
      
      for (const suite of this.testSuites) {
        await this.runTestSuite(suite);
      }
      
      this.results.summary.totalDuration = Date.now() - startTime;
      await this.generateReports();
      
      console.log('🎉 Master test suite completed!');
      this.printSummary();
      
    } catch (error) {
      console.error('❌ Master test suite failed:', error.message);
    } finally {
      await this.cleanup();
    }
    
    return this.results;
  }

  async runTestSuite(suite) {
    console.log(`\n🧪 Running: ${suite.name}`);
    
    try {
      const tester = new suite.tester();
      tester.browser = this.browser;
      tester.page = this.page;
      
      const result = await tester[suite.method]();
      
      this.results.suiteResults[suite.name] = {
        success: true,
        result
      };
      
      this.results.summary.passedSuites++;
      console.log(`✅ ${suite.name} completed successfully`);
      
      if (tester.apiCalls) {
        this.apiCalls.push(...tester.apiCalls);
      }
      
    } catch (error) {
      this.results.suiteResults[suite.name] = {
        success: false,
        error: error.message
      };
      
      this.results.summary.failedSuites++;
      console.error(`❌ ${suite.name} failed: ${error.message}`);
    }
  }

  async generateReports() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportDir = path.join(__dirname, '../../../test-results/reports');
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    // Generate JSON report
    const jsonReport = path.join(reportDir, `master-test-report-${timestamp}.json`);
    fs.writeFileSync(jsonReport, JSON.stringify(this.results, null, 2));
    
    // Generate HTML report
    const htmlReport = path.join(reportDir, `master-test-report-${timestamp}.html`);
    const htmlContent = this.generateHTMLReport();
    fs.writeFileSync(htmlReport, htmlContent);
    
    console.log(`📄 Reports generated: ${path.basename(jsonReport)}, ${path.basename(htmlReport)}`);
  }

  generateHTMLReport() {
    const successRate = Math.round((this.results.summary.passedSuites / this.testSuites.length) * 100);
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>E2E Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
        .suite { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 E2E Test Report</h1>
        <p>Generated: ${new Date(this.results.timestamp).toLocaleString()}</p>
    </div>
    
    <div class="summary">
        <h2>📊 Summary</h2>
        <p><strong>Success Rate:</strong> ${successRate}%</p>
        <p><strong>Total Suites:</strong> ${this.testSuites.length}</p>
        <p><strong>Passed:</strong> <span class="success">${this.results.summary.passedSuites}</span></p>
        <p><strong>Failed:</strong> <span class="error">${this.results.summary.failedSuites}</span></p>
        <p><strong>Duration:</strong> ${Math.round(this.results.summary.totalDuration / 1000)}s</p>
    </div>
    
    <h2>📋 Test Suite Results</h2>
    ${Object.entries(this.results.suiteResults).map(([name, result]) => `
    <div class="suite">
        <h3>${name.replace(/-/g, ' ').toUpperCase()}</h3>
        <p><strong>Status:</strong> ${result.success ? '<span class="success">✅ Passed</span>' : '<span class="error">❌ Failed</span>'}</p>
        ${result.error ? `<p><strong>Error:</strong> ${result.error}</p>` : ''}
    </div>
    `).join('')}
</body>
</html>`;
  }

  printSummary() {
    const successRate = Math.round((this.results.summary.passedSuites / this.testSuites.length) * 100);
    
    console.log('\n🎯 TEST SUMMARY');
    console.log('===============');
    console.log(`Success Rate: ${successRate}%`);
    console.log(`Duration: ${Math.round(this.results.summary.totalDuration / 1000)}s`);
    console.log(`API Calls: ${this.apiCalls.length}`);
  }

  initializeResults() {
    return {
      timestamp: new Date().toISOString(),
      summary: {
        passedSuites: 0,
        failedSuites: 0,
        totalDuration: 0
      },
      suiteResults: {}
    };
  }
}

module.exports = MasterTestRunner;
EOF

# Main test runner script
cat > tests/e2e/run-all-tests.sh << 'EOF'
#!/bin/bash

set -e

echo "🚀 Running E2E Test Suite..."

# Check prerequisites
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules/puppeteer" ]; then
    echo "📦 Installing Puppeteer..."
    npm install puppeteer
fi

# Set environment variables
export HEADLESS=${HEADLESS:-true}
export SLOW_MO=${SLOW_MO:-100}

# Create test runner
cat > run-tests.js << 'TESTEOF'
const { MasterTestRunner } = require('./helpers/master-test-runner.js');

async function runTests() {
    const runner = new MasterTestRunner();
    
    try {
        const results = await runner.runAllTests();
        
        if (results.summary.failedSuites > 0) {
            console.log('\n⚠️ Some tests failed');
            process.exit(1);
        } else {
            console.log('\n✅ All tests passed!');
        }
        
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

runTests();
TESTEOF

# Run the tests
node run-tests.js

# Cleanup
rm run-tests.js

echo "✅ E2E Test Suite completed!"
EOF

# Make scripts executable
chmod +x tests/e2e/run-all-tests.sh

echo "✅ E2E Test Suite Generated Successfully!"
echo ""
echo "📁 Files Created:"
echo "  ├── tests/e2e/helpers/test-setup.js"
echo "  ├── tests/e2e/helpers/landing-page-tester.js" 
echo "  ├── tests/e2e/helpers/cart-api-tester.js"
echo "  ├── tests/e2e/helpers/auth-checkout-tester.js"
echo "  ├── tests/e2e/helpers/master-test-runner.js"
echo "  └── tests/e2e/run-all-tests.sh"
echo ""
echo "🚀 Usage:"
echo "  npm run test:e2e                    # Run all tests"
echo "  npm run test:e2e:debug             # Run with visible browser"
echo "  ./tests/e2e/run-all-tests.sh       # Direct execution"
echo ""
echo "📊 Reports will be generated in test-results/reports/"
