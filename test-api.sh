#!/bin/bash

# API Testing Script with Health Checks and CORS Validation
API_URL="http://localhost:3010"
FRONTEND_URL="http://localhost:3011"

echo "🚀 Starting API Debug Tests..."
echo "API URL: $API_URL"
echo "Frontend URL: $FRONTEND_URL"
echo "================================"

# Pre-flight checks
echo "🔍 Pre-flight Connectivity Checks..."
echo "================================="

# Check if backend is running
echo "🔧 Checking if backend server is accessible..."
if curl -s --connect-timeout 5 "$API_URL" > /dev/null 2>&1; then
    echo "✅ Backend server is responding"
else
    echo "❌ Backend server is not accessible at $API_URL"
    echo "💡 Start backend with: npm run dev:server"
    echo ""
fi

# Check if frontend is running  
echo "🔧 Checking if frontend server is accessible..."
if curl -s --connect-timeout 5 "$FRONTEND_URL" > /dev/null 2>&1; then
    echo "✅ Frontend server is responding"
else
    echo "❌ Frontend server is not accessible at $FRONTEND_URL"
    echo "💡 Start frontend with: npm run dev:frontend"
    echo ""
fi

echo "================================"

# Test 1: Health Check
echo "1️⃣ Testing Health Endpoint..."
echo "Command: curl -s $API_URL/health"
HEALTH_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" $API_URL/health)
echo "Response: $HEALTH_RESPONSE"
echo ""

# Test 2: CORS Preflight Check
echo "2️⃣ Testing CORS Preflight..."
echo "Command: curl -I -H \"Origin: $FRONTEND_URL\" $API_URL/api/auth/register"
curl -I -H "Origin: $FRONTEND_URL" "$API_URL/api/auth/register" 2>/dev/null | grep -E "(HTTP|Access-Control|Content-Type)"
echo ""

# Test 3: Registration Test
echo "3️⃣ Testing Registration Endpoint..."
TIMESTAMP=$(date +%s)
TEST_EMAIL="test-$TIMESTAMP@example.com"
REGISTER_DATA='{
  "email": "'$TEST_EMAIL'",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "role": "customer"
}'

echo "Command: curl -X POST $API_URL/api/auth/register -H \"Content-Type: application/json\" -H \"Origin: $FRONTEND_URL\" -d '$REGISTER_DATA'"
REGISTER_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -H "Origin: $FRONTEND_URL" \
  -d "$REGISTER_DATA")
echo "Response: $REGISTER_RESPONSE"
echo ""

# Extract token from registration response for further tests
TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$TOKEN" ]; then
  echo "✅ Registration successful! Token extracted: ${TOKEN:0:20}..."
  
  # Test 4: Login Test
  echo "4️⃣ Testing Login Endpoint..."
  LOGIN_DATA='{
    "email": "'$TEST_EMAIL'",
    "password": "password123"
  }'
  
  echo "Command: curl -X POST $API_URL/api/auth/login -H \"Content-Type: application/json\" -H \"Origin: $FRONTEND_URL\" -d '$LOGIN_DATA'"
  LOGIN_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -H "Origin: $FRONTEND_URL" \
    -d "$LOGIN_DATA")
  echo "Response: $LOGIN_RESPONSE"
  echo ""
  
  # Test 5: Protected Endpoint Test (Get User Profile)
  echo "5️⃣ Testing Protected Endpoint (Get User Profile)..."
  echo "Command: curl -H \"Authorization: Bearer $TOKEN\" -H \"Origin: $FRONTEND_URL\" $API_URL/api/auth/me"
  PROFILE_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -H "Authorization: Bearer $TOKEN" \
    -H "Origin: $FRONTEND_URL" \
    "$API_URL/api/auth/me")
  echo "Response: $PROFILE_RESPONSE"
  echo ""
  
  # Test 6: Logout Test
  echo "6️⃣ Testing Logout Endpoint..."
  echo "Command: curl -X POST $API_URL/api/auth/logout -H \"Authorization: Bearer $TOKEN\" -H \"Origin: $FRONTEND_URL\""
  LOGOUT_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL/api/auth/logout" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Origin: $FRONTEND_URL")
  echo "Response: $LOGOUT_RESPONSE"
  echo ""
else
  echo "❌ Registration failed - cannot proceed with authenticated tests"
fi

# Test 7: Products Endpoint
echo "7️⃣ Testing Products Endpoint..."
echo "Command: curl -H \"Origin: $FRONTEND_URL\" $API_URL/api/products"
PRODUCTS_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -H "Origin: $FRONTEND_URL" "$API_URL/api/products")
echo "Response: $PRODUCTS_RESPONSE"
echo ""

# Test 8: Categories Endpoint
echo "8️⃣ Testing Categories Endpoint..."
echo "Command: curl -H \"Origin: $FRONTEND_URL\" $API_URL/api/categories"
CATEGORIES_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -H "Origin: $FRONTEND_URL" "$API_URL/api/categories")
echo "Response: $CATEGORIES_RESPONSE"
echo ""

# Test 9: Dropshipping Endpoints
echo "9️⃣ Testing Dropshipping Search Endpoint..."
echo "Command: curl -H \"Origin: $FRONTEND_URL\" \"$API_URL/api/dropshipping/products/search?q=t-shirt&provider=printful&limit=3\""
DROPSHIP_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -H "Origin: $FRONTEND_URL" \
  "$API_URL/api/dropshipping/products/search?q=t-shirt&provider=printful&limit=3")
echo "Response: $DROPSHIP_RESPONSE"
echo ""

echo "🔍 Testing Debug Pages..."
echo "================================"

# Test 10: Frontend Server Availability
echo "🔟 Testing Frontend Server..."
echo "Command: curl -s $FRONTEND_URL"
FRONTEND_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$FRONTEND_URL" 2>/dev/null)
echo "Response: $FRONTEND_RESPONSE"
echo ""

# Test 11: Debug Page Accessibility
echo "1️⃣1️⃣ Testing Debug Page (Next.js Route)..."
echo "Command: curl -s $FRONTEND_URL/debug"
DEBUG_PAGE_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$FRONTEND_URL/debug" 2>/dev/null)
echo "Response: $DEBUG_PAGE_RESPONSE"
echo ""

# Test 12: Static Debug HTML Page
echo "1️⃣2️⃣ Testing Static Debug HTML Page..."
echo "Command: curl -s $FRONTEND_URL/debug-api.html"
DEBUG_HTML_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$FRONTEND_URL/debug-api.html" 2>/dev/null)
echo "Response: $DEBUG_HTML_RESPONSE"
echo ""

echo ""
echo "📋 Debug Page Test Summary:"
echo "================================"
echo "Static HTML Debug Page: $FRONTEND_URL/debug-api.html"
echo "Next.js Debug Page: $FRONTEND_URL/debug"
echo ""
echo "🛠️  Manual Testing Instructions:"
echo "1. Open $FRONTEND_URL/debug-api.html in browser"
echo "2. Open browser console (F12)"
echo "3. Click each test button and verify:"
echo "   - No JavaScript errors in console"
echo "   - Results appear on page"
echo "   - API calls succeed"
echo "4. Also try the Next.js debug page: $FRONTEND_URL/debug"
echo ""

echo ""
echo "🔧 Common 'Failed to Fetch' Solutions:"
echo "================================"
echo "1. Ensure both servers are running:"
echo "   Backend:  npm run dev:server  (port 3010)"
echo "   Frontend: npm run dev:frontend (port 3011)"
echo "   Both:     npm run dev:all"
echo ""
echo "2. Stop all servers if needed:"
echo "   Quick stop: npm run stop"
echo "   Force stop: npm run kill"
echo ""
echo "3. Check CORS configuration in .env:"
echo "   CORS_ORIGIN=http://localhost:3011,http://localhost:3010"
echo ""
echo "4. Verify network connectivity:"
echo "   curl $API_URL/health"
echo "   curl $FRONTEND_URL"
echo ""
echo "5. Clear browser cache and disable extensions"
echo "6. Check browser console for detailed error messages"
echo ""

echo "================================"
echo "🏁 Complete API & Debug Page Tests Completed!"
echo "================================"
