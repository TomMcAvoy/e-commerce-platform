#!/bin/bash
# filepath: enhanced-test-suite.sh

# Enhanced E-Commerce Platform Test Suite
# Following copilot-instructions.md patterns

# Correct port configuration (3000/3001)
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3001"
API_BASE_URL="http://localhost:3000/api"

echo "🚀 Enhanced E-Commerce Platform Test Suite"
echo "=========================================="
echo "API URL: $API_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Phase 1: Basic Health Checks
echo "1️⃣ BASIC HEALTH CHECKS"
echo "======================="

echo "🔍 Testing API Health..."
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

# Phase 2: Debug Page Tests
echo "2️⃣ DEBUG PAGE TESTS"
echo "==================="

echo "🔍 Testing Next.js Debug Page..."
echo "Command: curl -s $FRONTEND_URL/debug"
debug_status=$(curl -s -o /dev/null -w '%{http_code}' "$FRONTEND_URL/debug" 2>/dev/null || echo "000")
echo "HTTP_CODE:$debug_status"

echo ""
echo "🔍 Testing Static Debug HTML Page..."
echo "Command: curl -s $FRONTEND_URL/debug-api.html"
static_debug_status=$(curl -s -o /dev/null -w '%{http_code}' "$FRONTEND_URL/debug-api.html" 2>/dev/null || echo "000")
echo "HTTP_CODE:$static_debug_status"

echo ""

# Rest of the enhanced test suite continues...
echo "================================"
echo "🏁 Enhanced Test Suite Completed!"
echo "================================"
