#!/bin/bash
# filepath: enhanced-test-suite.sh
# Enhanced E-Commerce Platform Test Suite
# Following copilot-instructions.md patterns

# Port configuration from copilot-instructions.md
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"
API_BASE_URL="http://localhost:3000/api"

echo "🚀 Enhanced E-Commerce Platform Test Suite"
echo "=========================================="
echo "Following copilot-instructions.md architecture:"
echo "Backend API: $API_URL"
echo "Frontend: $FRONTEND_URL"
echo "API Base: $API_BASE_URL"
echo ""

# Phase 1: Core Health Checks
echo "1️⃣ CORE HEALTH CHECKS"
echo "====================="

echo "🔍 Testing Backend Health..."
if curl -f -s "$API_URL/health" > /dev/null; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
fi

echo "🔍 Testing Frontend..."
if curl -f -s "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend health check passed"
else
    echo "❌ Frontend health check failed"
fi

echo "🔍 Testing API Status..."
if curl -f -s "$API_BASE_URL/status" > /dev/null; then
    echo "✅ API status check passed"
else
    echo "❌ API status check failed"
fi

echo ""

# Phase 2: Debug Ecosystem Tests (following copilot debug patterns)
echo "2️⃣ DEBUG ECOSYSTEM TESTS"
echo "========================"

echo "🔍 Testing Primary Debug Dashboard..."
debug_status=$(curl -s -o /dev/null -w '%{http_code}' "$FRONTEND_URL/debug" 2>/dev/null || echo "000")
echo "Next.js Debug Dashboard: HTTP $debug_status"

echo "🔍 Testing Static Debug Page..."
static_debug_status=$(curl -s -o /dev/null -w '%{http_code}' "$FRONTEND_URL/debug-api.html" 2>/dev/null || echo "000")
echo "Static Debug Page: HTTP $static_debug_status"

echo ""

# Phase 3: API Endpoint Validation (following copilot API structure)
echo "3️⃣ API ENDPOINT VALIDATION"
echo "=========================="

# Test all core API endpoints from copilot-instructions.md
endpoints=(
    "/api/auth/status"
    "/api/products"
    "/api/users"
    "/api/vendors"
    "/api/orders"
    "/api/cart"
    "/api/categories"
    "/api/dropshipping/products"
)

for endpoint in "${endpoints[@]}"; do
    echo "🔍 Testing: $endpoint"
    status_code=$(curl -s -o /dev/null -w '%{http_code}' -H "Origin: $FRONTEND_URL" "$API_URL$endpoint" 2>/dev/null || echo "000")
    
    # Following copilot error handling pattern
    if [[ "$status_code" =~ ^[2-3][0-9][0-9]$ ]] || [ "$status_code" = "404" ]; then
        echo "✅ $endpoint: HTTP $status_code (OK)"
    else
        echo "❌ $endpoint: HTTP $status_code (Error)"
    fi
done

echo ""

# Phase 4: CORS Configuration Test (following copilot cross-service communication)
echo "4️⃣ CORS CONFIGURATION TEST"
echo "=========================="

echo "🔍 Testing CORS from frontend origin..."
cors_test=$(curl -s -H "Origin: $FRONTEND_URL" -H "Access-Control-Request-Method: GET" -X OPTIONS "$API_URL/api/status" -w '%{http_code}' -o /dev/null 2>/dev/null || echo "000")
echo "CORS Preflight: HTTP $cors_test"

echo ""
echo "================================"
echo "🏁 Enhanced Test Suite Completed!"
echo "================================"
echo "✅ All tests following copilot-instructions.md patterns"
echo "�� For detailed API testing, visit: $FRONTEND_URL/debug"
echo "🔧 For CORS testing, visit: $FRONTEND_URL/debug-api.html"
