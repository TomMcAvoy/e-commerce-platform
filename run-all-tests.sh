#!/bin/bash

# Comprehensive E-commerce Platform Test Runner
# This script runs all tests in the correct order and provides detailed reporting

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"
LOG_FILE="test-results/comprehensive-test-$(date +%Y%m%d_%H%M%S).log"

# Create log directory
mkdir -p test-results

echo -e "${BLUE}🚀 E-Commerce Platform Comprehensive Test Suite${NC}"
echo -e "${BLUE}=================================================${NC}"
echo "Starting at: $(date)"
echo "API URL: $API_URL"
echo "Frontend URL: $FRONTEND_URL"
echo "Log file: $LOG_FILE"
echo ""

# Function to log messages
log_message() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# Function to check if service is running
check_service() {
    local url=$1
    local name=$2
    
    echo -e "${YELLOW}Checking $name...${NC}"
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name is running${NC}"
        log_message "INFO" "$name is running at $url"
        return 0
    else
        echo -e "${RED}❌ $name is not running${NC}"
        log_message "ERROR" "$name is not accessible at $url"
        return 1
    fi
}

# Function to run a test with error handling
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -e "${BLUE}🧪 Running: $test_name${NC}"
    log_message "INFO" "Starting test: $test_name"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ $test_name passed${NC}"
        log_message "SUCCESS" "$test_name completed successfully"
        return 0
    else
        echo -e "${RED}❌ $test_name failed${NC}"
        log_message "ERROR" "$test_name failed"
        return 1
    fi
}

# Initialize counters
total_tests=0
passed_tests=0
failed_tests=0

echo -e "${BLUE}📋 Phase 1: Service Health Checks${NC}"
echo "=================================="

# Check backend service
total_tests=$((total_tests + 1))
if check_service "$API_URL/health" "Backend API"; then
    passed_tests=$((passed_tests + 1))
else
    failed_tests=$((failed_tests + 1))
    echo -e "${YELLOW}💡 To start backend: npm run dev:server${NC}"
fi

# Check frontend service
total_tests=$((total_tests + 1))
if check_service "$FRONTEND_URL" "Frontend"; then
    passed_tests=$((passed_tests + 1))
else
    failed_tests=$((failed_tests + 1))
    echo -e "${YELLOW}💡 To start frontend: npm run dev:frontend${NC}"
fi

echo ""
echo -e "${BLUE}📋 Phase 2: API Endpoint Tests${NC}"
echo "==============================="

# Run API tests
total_tests=$((total_tests + 1))
if run_test "API Endpoint Tests" "./test-api.sh"; then
    passed_tests=$((passed_tests + 1))
else
    failed_tests=$((failed_tests + 1))
fi

echo ""
echo -e "${BLUE}📋 Phase 3: Enhanced Test Suite${NC}"
echo "================================"

# Run enhanced tests if available
if [ -f "enhanced-test-suite.sh" ]; then
    total_tests=$((total_tests + 1))
    if run_test "Enhanced Test Suite" "./enhanced-test-suite.sh"; then
        passed_tests=$((passed_tests + 1))
    else
        failed_tests=$((failed_tests + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Enhanced test suite not found, skipping${NC}"
fi

echo ""
echo -e "${BLUE}📋 Phase 4: End-to-End Tests${NC}"
echo "============================"

# Run E2E tests if available
if [ -d "tests/e2e" ] && [ -f "tests/e2e/run-all-tests.sh" ]; then
    total_tests=$((total_tests + 1))
    if run_test "End-to-End Tests" "cd tests/e2e && ./run-all-tests.sh"; then
        passed_tests=$((passed_tests + 1))
    else
        failed_tests=$((failed_tests + 1))
    fi
else
    echo -e "${YELLOW}⚠️  E2E tests not found, skipping${NC}"
fi

echo ""
echo -e "${BLUE}📋 Phase 5: Build Tests${NC}"
echo "======================"

# Test TypeScript compilation
total_tests=$((total_tests + 1))
if run_test "TypeScript Compilation" "npm run build"; then
    passed_tests=$((passed_tests + 1))
else
    failed_tests=$((failed_tests + 1))
fi

# Test frontend build
total_tests=$((total_tests + 1))
if run_test "Frontend Build" "cd frontend && npm run build"; then
    passed_tests=$((passed_tests + 1))
else
    failed_tests=$((failed_tests + 1))
fi

echo ""
echo -e "${BLUE}📋 Phase 6: Security & Performance Checks${NC}"
echo "=========================================="

# Check for common security issues
total_tests=$((total_tests + 1))
echo -e "${YELLOW}🔒 Checking for security issues...${NC}"
security_issues=0

# Check for hardcoded secrets (basic check)
if grep -r "password.*=" src/ --include="*.ts" --include="*.js" | grep -v "password:" | grep -v "Password" > /dev/null 2>&1; then
    echo -e "${RED}⚠️  Potential hardcoded passwords found${NC}"
    security_issues=$((security_issues + 1))
fi

# Check for console.log statements in production code
if grep -r "console\.log" src/ --include="*.ts" | grep -v "console.error" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  console.log statements found in source code${NC}"
fi

# Check for TODO/FIXME comments
todo_count=$(grep -r "TODO\|FIXME" src/ --include="*.ts" --include="*.js" | wc -l)
if [ "$todo_count" -gt 0 ]; then
    echo -e "${YELLOW}📝 Found $todo_count TODO/FIXME comments${NC}"
fi

if [ $security_issues -eq 0 ]; then
    echo -e "${GREEN}✅ Basic security checks passed${NC}"
    passed_tests=$((passed_tests + 1))
else
    echo -e "${RED}❌ Security issues found${NC}"
    failed_tests=$((failed_tests + 1))
fi

echo ""
echo -e "${BLUE}📊 Test Summary${NC}"
echo "==============="
echo "Total tests: $total_tests"
echo -e "Passed: ${GREEN}$passed_tests${NC}"
echo -e "Failed: ${RED}$failed_tests${NC}"

success_rate=$((passed_tests * 100 / total_tests))
echo "Success rate: $success_rate%"

log_message "SUMMARY" "Tests completed - Total: $total_tests, Passed: $passed_tests, Failed: $failed_tests, Success rate: $success_rate%"

echo ""
echo -e "${BLUE}🔗 Quick Links${NC}"
echo "=============="
echo "• Backend Health: $API_URL/health"
echo "• API Status: $API_URL/api/status"
echo "• Frontend: $FRONTEND_URL"
echo "• Static Debug: $FRONTEND_URL/debug-api.html"
echo "• Next.js Debug: $FRONTEND_URL/debug"
echo "• Test Log: $LOG_FILE"

echo ""
echo -e "${BLUE}📝 Next Steps${NC}"
echo "============="

if [ $failed_tests -gt 0 ]; then
    echo -e "${RED}❌ Some tests failed. Check the log file for details.${NC}"
    echo "• Review failed tests in: $LOG_FILE"
    echo "• Ensure all services are running"
    echo "• Check network connectivity"
    exit 1
else
    echo -e "${GREEN}🎉 All tests passed! Your e-commerce platform is ready.${NC}"
    echo "• Start development: npm run dev:all"
    echo "• Run individual test: npm run test:api"
    echo "• View debug pages for real-time testing"
fi

echo ""
echo "Test completed at: $(date)"
