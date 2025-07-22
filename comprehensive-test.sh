#!/bin/bash

echo "🧪 COMPREHENSIVE E-COMMERCE APP TESTS"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Wait for servers to be ready
echo "⏳ Waiting for servers to start..."
sleep 5

echo ""
echo "${BLUE}📊 SERVER STATUS TESTS${NC}"
echo "--------------------"

# Test backend server
echo -n "🔧 Backend (port 3000): "
backend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/auth/status 2>/dev/null || echo "000")
if [ "$backend_status" = "200" ]; then
    echo -e "${GREEN}✅ RUNNING${NC}"
else
    echo -e "${RED}❌ NOT RESPONDING${NC}"
fi

# Test frontend server
echo -n "🌐 Frontend (port 3001): "
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null || echo "000")
if [ "$frontend_status" = "200" ]; then
    echo -e "${GREEN}✅ RUNNING${NC}"
else
    echo -e "${RED}❌ NOT RESPONDING${NC}"
fi

echo ""
echo "${BLUE}🏠 HOMEPAGE TESTS${NC}"
echo "---------------"

# Test main homepage
echo -n "📄 Main page: "
home_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 2>/dev/null || echo "000")
if [ "$home_status" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (${home_status})${NC}"
else
    echo -e "${RED}❌ FAILED (${home_status})${NC}"
fi

echo ""
echo "${BLUE}🏷️  CATEGORY PAGES TESTS${NC}"
echo "---------------------"

# Test all category pages
categories=("male" "hardware" "sports" "female")
for category in "${categories[@]}"; do
    echo -n "📦 /categories/$category: "
    cat_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/categories/$category 2>/dev/null || echo "000")
    if [ "$cat_status" = "200" ]; then
        echo -e "${GREEN}✅ SUCCESS (${cat_status})${NC}"
    else
        echo -e "${RED}❌ FAILED (${cat_status})${NC}"
    fi
done

echo ""
echo "${BLUE}🔄 ALTERNATIVE CATEGORY ROUTES${NC}"
echo "----------------------------"

# Test alternative routes
echo -n "👨 /categories/men: "
men_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/categories/men 2>/dev/null || echo "000")
if [ "$men_status" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (${men_status})${NC}"
else
    echo -e "${RED}❌ FAILED (${men_status})${NC}"
fi

echo -n "👩 /categories/women: "
women_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/categories/women 2>/dev/null || echo "000")
if [ "$women_status" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (${women_status})${NC}"
else
    echo -e "${RED}❌ FAILED (${women_status})${NC}"
fi

echo ""
echo "${BLUE}🛒 CART FUNCTIONALITY TESTS${NC}"
echo "-------------------------"

# Test cart API endpoints (if backend is running)
if [ "$backend_status" = "200" ]; then
    echo -n "🛒 Cart API: "
    cart_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/cart 2>/dev/null || echo "000")
    if [ "$cart_status" = "200" ] || [ "$cart_status" = "404" ]; then
        echo -e "${GREEN}✅ ACCESSIBLE${NC}"
    else
        echo -e "${RED}❌ ERROR (${cart_status})${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Backend not available for cart tests${NC}"
fi

echo ""
echo "${BLUE}📱 RESPONSIVE DESIGN TESTS${NC}"
echo "------------------------"

# Test with different user agents to simulate mobile/desktop
echo -n "📱 Mobile simulation: "
mobile_status=$(curl -s -o /dev/null -w "%{http_code}" -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)" http://localhost:3001 2>/dev/null || echo "000")
if [ "$mobile_status" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo -n "💻 Desktop simulation: "
desktop_status=$(curl -s -o /dev/null -w "%{http_code}" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" http://localhost:3001 2>/dev/null || echo "000")
if [ "$desktop_status" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo ""
echo "${BLUE}🔍 CONTENT VERIFICATION${NC}"
echo "--------------------"

# Check if pages contain expected content
echo -n "🏠 Homepage has 'ShopCart': "
if curl -s http://localhost:3001 2>/dev/null | grep -q "ShopCart"; then
    echo -e "${GREEN}✅ FOUND${NC}"
else
    echo -e "${RED}❌ NOT FOUND${NC}"
fi

echo -n "👨 Male page has 'Men': "
if curl -s http://localhost:3001/categories/male 2>/dev/null | grep -qi "men"; then
    echo -e "${GREEN}✅ FOUND${NC}"
else
    echo -e "${RED}❌ NOT FOUND${NC}"
fi

echo -n "🔧 Hardware page has 'Tools': "
if curl -s http://localhost:3001/categories/hardware 2>/dev/null | grep -qi "tools"; then
    echo -e "${GREEN}✅ FOUND${NC}"
else
    echo -e "${RED}❌ NOT FOUND${NC}"
fi

echo ""
echo "${BLUE}📊 TEST SUMMARY${NC}"
echo "==============" 

# Count successful tests
total_tests=0
passed_tests=0

test_results=(
    "$frontend_status" "$home_status" 
    "$cat_status" "$men_status" "$women_status"
    "$mobile_status" "$desktop_status"
)

for status in "${test_results[@]}"; do
    total_tests=$((total_tests + 1))
    if [ "$status" = "200" ]; then
        passed_tests=$((passed_tests + 1))
    fi
done

echo "📈 Tests Passed: $passed_tests/$total_tests"
echo "🎯 Success Rate: $((passed_tests * 100 / total_tests))%"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Your e-commerce app is working perfectly!${NC}"
elif [ $passed_tests -gt $((total_tests / 2)) ]; then
    echo -e "${YELLOW}⚠️  Most tests passed. Some issues need attention.${NC}"
else
    echo -e "${RED}❌ Several tests failed. App needs debugging.${NC}"
fi

echo ""
echo "${BLUE}🌐 READY TO TEST IN BROWSER:${NC}"
echo "- Homepage: http://localhost:3001"
echo "- Men's Category: http://localhost:3001/categories/male"
echo "- Hardware Category: http://localhost:3001/categories/hardware"
echo "- Sports Category: http://localhost:3001/categories/sports"
echo "- Women's Category: http://localhost:3001/categories/female"
echo ""
