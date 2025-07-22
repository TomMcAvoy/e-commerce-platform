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
