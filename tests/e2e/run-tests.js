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
