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
