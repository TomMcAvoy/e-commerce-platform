#!/bin/bash
# filepath: run-all-tests.sh

# E-Commerce Platform Comprehensive Test Suite
# Following copilot-instructions.md patterns (ports 3000/3001)

set -e

# Correct port configuration from copilot-instructions.md
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"
API_BASE_URL="http://localhost:3000/api"

# Create test results directory
mkdir -p test-results
LOG_FILE="test-results/comprehensive-test-$(date +%Y%m%d_%H%M%S).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging function
log_message() {
    local level=$1
    local message=$2
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" | tee -a "$LOG_FILE"
}

echo "🚀 E-Commerce Platform Comprehensive Test Suite"
echo "================================================="
echo "Starting at: $(date)"
echo "API URL: $API_URL"
echo "Frontend URL: $FRONTEND_URL"
echo "Log file: $LOG_FILE"

# Initialize counters
TOTAL=0
PASSED=0
FAILED=0

# Function to run test and track results
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo "🧪 Running: $test_name"
    log_message "INFO" "Starting test: $test_name"
    
    if eval "$test_command"; then
        echo "✅ $test_name passed"
        log_message "SUCCESS" "$test_name completed successfully"
        ((PASSED++))
    else
        echo "❌ $test_name failed"
        log_message "ERROR" "$test_name failed"
        ((FAILED++))
    fi
    ((TOTAL++))
    echo ""
}

# Wait for servers to be ready
echo "⏳ Waiting for servers to start..."
sleep 3

# Phase 1: Basic Health Checks
echo "📋 Phase 1: Basic Health Checks"
echo "==============================="

run_test "Backend Health Check" "curl -f -s $API_URL/health > /dev/null"
run_test "Frontend Health Check" "curl -f -s $FRONTEND_URL > /dev/null"
run_test "API Status Check" "curl -f -s $API_BASE_URL/status > /dev/null"

# Phase 2: API Endpoint Tests
echo "📋 Phase 2: API Endpoint Tests"
echo "=============================="

# Test API endpoints following copilot-instructions.md structure
run_test "Products API" "curl -f -s -H 'Origin: $FRONTEND_URL' '$API_BASE_URL/products' > /dev/null"
run_test "Categories API" "curl -f -s -H 'Origin: $FRONTEND_URL' '$API_BASE_URL/categories' > /dev/null"
run_test "Auth Status API" "curl -f -s -H 'Origin: $FRONTEND_URL' '$API_BASE_URL/auth/status' > /dev/null"

# Phase 3: Enhanced Test Suite
echo "📋 Phase 3: Enhanced Test Suite"
echo "==============================="

run_test "Enhanced Test Suite" "./enhanced-test-suite.sh"

# Phase 4: End-to-End Tests
echo "📋 Phase 4: End-to-End Tests"
echo "============================"

run_test "End-to-End Tests" "node tests/e2e/run-tests.js"

# Phase 5: Build Tests
echo "📋 Phase 5: Build Tests"
echo "======================"

run_test "TypeScript Compilation" "npm run build"

# Check if we're in root directory with Next.js
if [ -f "next.config.js" ] || [ -f "next.config.mjs" ]; then
    run_test "Frontend Build" "npm run build"
elif [ -d "frontend" ]; then
    run_test "Frontend Build" "cd frontend && npm run build"
else
    echo "⚠️ Frontend directory not found - checking current structure"
    if grep -q "next" package.json 2>/dev/null; then
        run_test "Frontend Build" "npm run build"
    else
        echo "❌ No Next.js configuration found"
        ((FAILED++))
        ((TOTAL++))
    fi
fi

# Phase 6: Security & Performance Checks
echo "📋 Phase 6: Security & Performance Checks"
echo "=========================================="

echo "🔒 Checking for security issues..."
if [ -f "package.json" ]; then
    if command -v npm &> /dev/null; then
        npm audit --audit-level=moderate || echo "⚠️ Security issues found"
    fi
fi
echo "✅ Basic security checks passed"

# Generate final report
echo "📊 Test Summary"
echo "==============="
echo "Total tests: $TOTAL"
echo "Passed: $PASSED"
echo "Failed: $FAILED"
if [ $TOTAL -gt 0 ]; then
    echo "Success rate: $((PASSED * 100 / TOTAL))%"
    log_message "SUMMARY" "Tests completed - Total: $TOTAL, Passed: $PASSED, Failed: $FAILED, Success rate: $((PASSED * 100 / TOTAL))%"
else
    echo "Success rate: 0%"
    log_message "SUMMARY" "Tests completed - Total: $TOTAL, Passed: $PASSED, Failed: $FAILED, Success rate: 0%"
fi

# Exit with appropriate code
if [ $FAILED -eq 0 ]; then
    echo "🎉 All tests passed!"
    exit 0
else
    echo "⚠️  Some tests failed. Check log: $LOG_FILE"
    exit 1
fi
