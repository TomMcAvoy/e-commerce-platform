
const { MasterTestRunner } = require('./helpers/master-test-runner.js');

async function runTests() {
    console.log('🚀 Starting E2E Tests');
    console.log('Backend: http://localhost:3000');
    console.log('Frontend: http://localhost:3001');
    
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
