#!/bin/bash
# Test execution helper for e-commerce platform

set -e

echo "🧪 E-Commerce Platform Test Runner"

# Function to run tests with proper cleanup
run_tests() {
    local test_type="$1"
    local test_pattern="$2"
    
    echo "🏃 Running $test_type tests..."
    
    # Set test environment
    export NODE_ENV=test
    export SKIP_SERVER_START=true
    
    # Clear Jest cache
    npx jest --clearCache
    
    # Run tests based on pattern
    if [ -n "$test_pattern" ]; then
        npx jest $test_pattern --detectOpenHandles --forceExit --verbose
    else
        npx jest --detectOpenHandles --forceExit --verbose
    fi
}

# Parse command line arguments
case "$1" in
    "api")
        run_tests "API" "--testPathPattern=api"
        ;;
    "unit")
        run_tests "Unit" "--testPathPattern=unit"
        ;;
    "integration")
        run_tests "Integration" "--testPathPattern=integration"
        ;;
    "coverage")
        echo "📊 Running tests with coverage..."
        export NODE_ENV=test
        export SKIP_SERVER_START=true
        npx jest --coverage --detectOpenHandles --forceExit
        ;;
    "watch")
        echo "👀 Running tests in watch mode..."
        export NODE_ENV=test
        export SKIP_SERVER_START=true
        npx jest --watch --detectOpenHandles
        ;;
    "debug")
        echo "🐛 Running tests in debug mode..."
        export NODE_ENV=test
        export SKIP_SERVER_START=true
        node --inspect-brk node_modules/.bin/jest --runInBand --detectOpenHandles
        ;;
    "clean")
        echo "🧹 Cleaning test artifacts..."
        rm -rf coverage/
        rm -rf node_modules/.cache/jest/
        npx jest --clearCache
        echo "✅ Test artifacts cleaned"
        ;;
    *)
        echo "Usage: $0 {api|unit|integration|coverage|watch|debug|clean}"
        echo ""
        echo "Examples:"
        echo "  $0 api        # Run API tests only"
        echo "  $0 unit       # Run unit tests only"
        echo "  $0 coverage   # Run all tests with coverage"
        echo "  $0 watch      # Run tests in watch mode"
        echo "  $0 debug      # Run tests in debug mode"
        echo "  $0 clean      # Clean test artifacts"
        exit 1
        ;;
esac

echo "✅ Test execution completed!"

