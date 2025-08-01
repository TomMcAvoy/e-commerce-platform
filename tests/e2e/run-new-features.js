#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running E2E Tests for New Functionality\n');

// New feature test files
const newFeatureTests = [
  'news-scheduler.spec.ts',
  'api-integration.spec.ts',
  'news-system.spec.ts',
  'erp-system.spec.ts',
  'social-platform.spec.ts', 
  'international-shopping.spec.ts',
  'responsive-design.spec.ts',
  'performance.spec.ts'
];

// Check if servers are running
function checkServers() {
  console.log('🔍 Checking if servers are running...');
  
  try {
    execSync('curl -f http://localhost:3000/health', { stdio: 'ignore' });
    console.log('✅ Backend server is running on port 3000');
  } catch (error) {
    console.log('❌ Backend server not running. Starting...');
    execSync('pnpm run dev:server &', { stdio: 'inherit' });
  }
  
  try {
    execSync('curl -f http://localhost:3001', { stdio: 'ignore' });
    console.log('✅ Frontend server is running on port 3001');
  } catch (error) {
    console.log('❌ Frontend server not running. Starting...');
    execSync('pnpm run dev:frontend &', { stdio: 'inherit' });
  }
}

// Run specific test suite
function runTestSuite(testFile) {
  console.log(`\n🧪 Running ${testFile}...`);
  
  try {
    execSync(`npx playwright test tests/e2e/${testFile} --reporter=line`, {
      stdio: 'inherit'
    });
    console.log(`✅ ${testFile} passed`);
    return true;
  } catch (error) {
    console.log(`❌ ${testFile} failed`);
    return false;
  }
}

// Generate test report
function generateReport(results) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(__dirname, `../../test-report-new-features-${timestamp}.json`);
  
  const report = {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => r.passed === false).length,
    results: results
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📊 Test report saved to: ${reportPath}`);
  
  return report;
}

// Main execution
async function main() {
  checkServers();
  
  // Wait for servers to be ready
  console.log('⏳ Waiting for servers to be ready...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const results = [];
  
  for (const testFile of newFeatureTests) {
    const testPath = path.join(__dirname, testFile);
    
    if (fs.existsSync(testPath)) {
      const passed = runTestSuite(testFile);
      results.push({
        testFile,
        passed,
        feature: testFile.replace('.spec.ts', '').replace(/-/g, ' ')
      });
    } else {
      console.log(`⚠️  Test file ${testFile} not found, skipping...`);
    }
  }
  
  // Generate and display report
  const report = generateReport(results);
  
  console.log('\n📈 NEW FEATURES TEST SUMMARY');
  console.log('================================');
  console.log(`Total Tests: ${report.totalTests}`);
  console.log(`Passed: ${report.passed}`);
  console.log(`Failed: ${report.failed}`);
  console.log(`Success Rate: ${((report.passed / report.totalTests) * 100).toFixed(1)}%`);
  
  if (report.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.feature}`);
    });
  }
  
  console.log('\n✅ Passed Tests:');
  results.filter(r => r.passed).forEach(r => {
    console.log(`  - ${r.feature}`);
  });
  
  process.exit(report.failed > 0 ? 1 : 0);
}

main().catch(console.error);