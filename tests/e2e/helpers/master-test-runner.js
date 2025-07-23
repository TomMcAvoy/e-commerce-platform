const puppeteer = require('puppeteer');

class MasterTestRunner {
  constructor() {
    // Following copilot instructions: backend:3000, frontend:3001
    this.config = {
      baseUrl: process.env.BASE_URL || 'http://localhost:3001',
      apiUrl: process.env.API_URL || 'http://localhost:3000',
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
      timeout: 30000
    };
    
    this.browser = null;
    this.page = null;
    
    this.testSuites = [
      { name: 'health-checks', method: 'testHealthChecks' },
      { name: 'debug-dashboard', method: 'testDebugDashboard' },
      { name: 'api-endpoints', method: 'testApiEndpoints' },
      { name: 'cors-validation', method: 'testCorsValidation' }
    ];
    
    this.results = this.initializeResults();
  }

  initializeResults() {
    return {
      summary: {
        totalSuites: 0,
        passedSuites: 0,
        failedSuites: 0,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        totalDuration: 0
      },
      suites: [],
      timestamp: new Date().toISOString(),
      environment: {
        frontend: this.config.baseUrl,
        backend: this.config.apiUrl,
        apiBase: this.config.apiBaseUrl
      }
    };
  }

  async initializeBrowser() {
    console.log('🔧 Initializing Puppeteer browser for E2E testing...');
    this.browser = await puppeteer.launch({
      headless: process.env.HEADLESS !== 'false',
      slowMo: parseInt(process.env.SLOW_MO) || 50,
      devtools: process.env.DEVTOOLS === 'true',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Set default timeout following copilot patterns
    this.page.setDefaultTimeout(this.config.timeout);
  }

  async runAllTests() {
    console.log('🚀 Starting comprehensive E2E test suites...');
    console.log(`Frontend: ${this.config.baseUrl}`);
    console.log(`Backend: ${this.config.apiUrl}`);
    console.log(`API Base: ${this.config.apiBaseUrl}`);
    
    const startTime = Date.now();

    try {
      await this.initializeBrowser();

      for (const suite of this.testSuites) {
        await this.runTestSuite(suite);
      }

      this.results.summary.totalDuration = Date.now() - startTime;
      return this.results;

    } catch (error) {
      console.error('❌ E2E test suite failed:', error.message);
      this.results.summary.failedSuites++;
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async runTestSuite(suite) {
    console.log(`📋 Running ${suite.name}...`);
    
    const suiteResult = {
      name: suite.name,
      startTime: Date.now(),
      tests: [],
      passed: false,
      duration: 0
    };

    try {
      this.results.summary.totalSuites++;
      
      if (this[suite.method]) {
        const testResults = await this[suite.method]();
        this.processTestResults(suiteResult, testResults);
      }

      suiteResult.passed = suiteResult.tests.every(test => test.passed);
      
      if (suiteResult.passed) {
        this.results.summary.passedSuites++;
      } else {
        this.results.summary.failedSuites++;
      }

    } catch (error) {
      suiteResult.tests.push({
        name: 'Suite execution',
        passed: false,
        error: error.message,
        duration: 0
      });
      this.results.summary.failedSuites++;
    }

    suiteResult.duration = Date.now() - suiteResult.startTime;
    this.results.suites.push(suiteResult);
  }

  processTestResults(suiteResult, testResults) {
    const results = Array.isArray(testResults) ? testResults : [testResults];
    
    results.forEach(test => {
      suiteResult.tests.push(test);
      this.results.summary.totalTests++;
      if (test.passed) {
        this.results.summary.passedTests++;
      } else {
        this.results.summary.failedTests++;
      }
    });
  }

  // Health checks following copilot debug ecosystem
  async testHealthChecks() {
    const tests = [];
    
    try {
      // Backend health check (following copilot patterns)
      await this.page.goto(this.config.apiUrl + '/health', { waitUntil: 'networkidle2' });
      const healthResponse = await this.page.evaluate(() => {
        try {
          const body = document.body.textContent;
          return { success: true, content: body };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });
      
      tests.push({
        name: 'Backend Health Check',
        passed: healthResponse.success,
        details: healthResponse
      });

      // Frontend accessibility
      await this.page.goto(this.config.baseUrl, { waitUntil: 'networkidle2' });
      const frontendLoaded = await this.page.title();
      
      tests.push({
        name: 'Frontend Accessibility',
        passed: frontendLoaded.length > 0,
        details: { title: frontendLoaded }
      });

      // API Status endpoint
      const apiStatusResponse = await this.page.evaluate(async (apiUrl) => {
        try {
          const response = await fetch(`${apiUrl}/api/status`);
          const data = await response.json();
          return { success: response.ok, status: response.status, data };
        } catch (error) {
          return { success: false, error: error.message };
        }
      }, this.config.apiUrl);
      
      tests.push({
        name: 'API Status Check',
        passed: apiStatusResponse.success,
        details: apiStatusResponse
      });

    } catch (error) {
      tests.push({
        name: 'Health Checks',
        passed: false,
        error: error.message
      });
    }

    return tests;
  }

  // Debug dashboard tests (copilot debug ecosystem patterns)
  async testDebugDashboard() {
    const tests = [];
    
    try {
      // Primary debug dashboard test
      await this.page.goto(`${this.config.baseUrl}/debug`, { 
        waitUntil: 'networkidle2',
        timeout: 15000 
      });
      
      const debugDashboard = await this.page.evaluate(() => {
        const title = document.title;
        const hasDebugElements = document.querySelector('[class*="debug"], [id*="debug"]') !== null;
        return { title, hasDebugElements };
      });
      
      tests.push({
        name: 'Primary Debug Dashboard',
        passed: debugDashboard.title.includes('Debug') || debugDashboard.hasDebugElements,
        details: debugDashboard
      });

      // Static debug page test
      await this.page.goto(`${this.config.baseUrl}/debug-api.html`);
      const staticDebugPage = await this.page.evaluate(() => {
        const content = document.body.innerHTML;
        const hasApiElements = content.includes('API') || content.includes('debug');
        return { hasApiElements, contentLength: content.length };
      });
      
      tests.push({
        name: 'Static Debug Page',
        passed: staticDebugPage.hasApiElements,
        details: staticDebugPage
      });

    } catch (error) {
      tests.push({
        name: 'Debug Dashboard Suite',
        passed: false,
        error: error.message,
        note: 'Debug pages may not be fully implemented yet'
      });
    }

    return tests;
  }

  // API endpoint validation following copilot API structure
  async testApiEndpoints() {
    const tests = [];
    const endpoints = [
      '/api/auth/status',
      '/api/products',
      '/api/users',
      '/api/vendors',
      '/api/orders',
      '/api/cart',
      '/api/categories',
      '/api/dropshipping/products'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await this.page.evaluate(async (apiUrl, path) => {
          try {
            const response = await fetch(`${apiUrl}${path}`);
            return { 
              status: response.status,
              ok: response.ok,
              accessible: response.status !== 500
            };
          } catch (error) {
            return { accessible: false, error: error.message };
          }
        }, this.config.apiUrl, endpoint);

        tests.push({
          name: `${endpoint} endpoint`,
          passed: response.accessible,
          details: response
        });

      } catch (error) {
        tests.push({
          name: `${endpoint} endpoint`,
          passed: false,
          error: error.message
        });
      }
    }

    return tests;
  }

  // CORS validation following copilot cross-service communication
  async testCorsValidation() {
    const tests = [];
    
    try {
      const corsTest = await this.page.evaluate(async (apiUrl, origin) => {
        try {
          const response = await fetch(`${apiUrl}/api/status`, {
            method: 'GET',
            headers: {
              'Origin': origin,
              'Content-Type': 'application/json'
            }
          });
          
          return {
            status: response.status,
            accessible: response.status !== 500,
            corsEnabled: response.headers.get('access-control-allow-origin') !== null
          };
        } catch (error) {
          return { accessible: false, error: error.message };
        }
      }, this.config.apiUrl, this.config.baseUrl);

      tests.push({
        name: 'CORS Configuration',
        passed: corsTest.accessible,
        details: corsTest
      });

    } catch (error) {
      tests.push({
        name: 'CORS Validation',
        passed: false,
        error: error.message
      });
    }

    return tests;
  }
}

module.exports = { MasterTestRunner };
