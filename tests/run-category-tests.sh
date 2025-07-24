#!/bin/bash
# filepath: tests/run-category-tests.sh
set -e

echo "🚀 Running Comprehensive Category API Test Suite"
echo "Following Copilot Instructions Architecture Patterns"
echo "===================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

echo -e "${BLUE}📋 Test Categories:${NC}"
echo "1. Electronics & Technology"
echo "2. Fashion & Apparel"
echo "3. Home & Garden"
echo "4. Beauty & Health"
echo "5. Sports & Fitness"
echo "6. Automotive"
echo "7. Books & Media"
echo "8. Toys & Games"
echo "9. Integration Tests"
echo ""

# Function to run individual category tests
run_category_test() {
    local category=$1
    local test_file=$2
    
    echo -e "${BLUE}🧪 Testing ${category}...${NC}"
    
    if npm test -- --testPathPattern="$test_file" --verbose; then
        echo -e "${GREEN}✅ ${category} tests passed${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ ${category} tests failed${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo ""
}

# Check if backend is running
echo -e "${BLUE}🔍 Checking backend server...${NC}"
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server is running${NC}"
else
    echo -e "${RED}❌ Backend server is not running. Please start with: npm run dev:server${NC}"
    exit 1
fi

echo ""

# Run all category tests
run_category_test "Electronics" "electronics.test.ts"
run_category_test "Fashion" "fashion.test.ts"
run_category_test "Home & Garden" "home-garden.test.ts"
run_category_test "Beauty & Health" "beauty-health.test.ts"
run_category_test "Sports & Fitness" "sports-fitness.test.ts"
run_category_test "Automotive" "automotive.test.ts"
run_category_test "Books & Media" "books-media.test.ts"
run_category_test "Toys & Games" "toys-games.test.ts"
run_category_test "Integration Tests" "category-integration.test.ts"

# Generate test report
echo -e "${BLUE}📊 Test Summary Report${NC}"
echo "====================="
echo -e "Total Categories Tested: ${TOTAL_TESTS}"
echo -e "Passed: ${GREEN}${PASSED_TESTS}${NC}"
echo -e "Failed: ${RED}${FAILED_TESTS}${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All category tests passed!${NC}"
    echo ""
    echo -e "${BLUE}✅ Ready for production deployment${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please review and fix issues.${NC}"
    exit 1
fi
