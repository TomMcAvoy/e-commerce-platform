#!/bin/bash

# API Debug Test Script
# This script tests all the API endpoints that our debug page would test

API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3002"

echo "🚀 Starting API Debug Tests..."
echo "API URL: $API_URL"
echo "Frontend URL: $FRONTEND_URL"
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

# Test 13: Test if Node.js and required tools are available for browser automation
echo "1️⃣3️⃣ Checking Browser Automation Capabilities..."
if command -v node >/dev/null 2>&1; then
  echo "✅ Node.js is available"
  
  # Check if we can install puppeteer for browser testing
  echo "📦 Checking if we can test JavaScript execution in debug pages..."
  
  # Create a temporary test script to check if the debug pages actually work
  cat > /tmp/debug-page-test.js << 'EOF'
const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    console.log('🚀 Starting browser automation test...');
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Test static debug page
    console.log('📄 Testing static debug-api.html page...');
    await page.goto('http://localhost:3002/debug-api.html', { waitUntil: 'networkidle0' });
    
    // Check if page loaded
    const title = await page.title();
    console.log(`✅ Page title: ${title}`);
    
    // Test if health check button exists and can be clicked
    const healthButton = await page.$('button[onclick="testHealthEndpoint()"]');
    if (healthButton) {
      console.log('✅ Health check button found');
      
      // Listen for console logs from the page
      page.on('console', msg => console.log('🌐 Page console:', msg.text()));
      
      // Click the health check button
      await healthButton.click();
      
      // Wait a bit for the API call to complete
      await page.waitForTimeout(2000);
      
      // Check if results were added
      const results = await page.$('#results');
      if (results) {
        const resultsText = await page.evaluate(el => el.textContent, results);
        console.log('✅ Results found:', resultsText.substring(0, 100) + '...');
      }
    }
    
    // Test Next.js debug page
    console.log('📄 Testing Next.js debug page...');
    await page.goto('http://localhost:3002/debug', { waitUntil: 'networkidle0' });
    
    const debugTitle = await page.evaluate(() => document.querySelector('h1')?.textContent);
    console.log(`✅ Debug page title: ${debugTitle}`);
    
    // Test API button if it exists
    const apiButton = await page.$('button');
    if (apiButton) {
      console.log('✅ API test button found on debug page');
    }
    
    console.log('🎉 Browser automation test completed successfully!');
    
  } catch (error) {
    console.log('❌ Browser automation test failed:', error.message);
    console.log('💡 This might be because:');
    console.log('   - Frontend server is not running on localhost:3002');
    console.log('   - Puppeteer is not installed');
    console.log('   - Debug pages have JavaScript errors');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
EOF

  # Try to run the browser test if puppeteer is available
  if npm list puppeteer >/dev/null 2>&1 || npm list -g puppeteer >/dev/null 2>&1; then
    echo "✅ Puppeteer is available, running browser automation test..."
    
    # Create a more robust test script with proper path resolution
    cat > /tmp/debug-page-test.js << 'EOF'
const path = require('path');
const puppeteer = require(path.join(process.cwd(), 'node_modules', 'puppeteer'));

(async () => {
  let browser;
  try {
    console.log('🚀 Starting browser automation test...');
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    
    // Set a longer timeout
    page.setDefaultTimeout(10000);
    
    // Test static debug page
    console.log('📄 Testing static debug-api.html page...');
    
    try {
      await page.goto('http://localhost:3002/debug-api.html', { 
        waitUntil: 'networkidle0',
        timeout: 8000
      });
      
      // Check if page loaded
      const title = await page.title();
      console.log(`✅ Page title: ${title}`);
      
      // Test if health check button exists and can be clicked
      const healthButton = await page.$('button[onclick="testHealthEndpoint()"]');
      if (healthButton) {
        console.log('✅ Health check button found');
        
        // Listen for console logs from the page
        page.on('console', msg => {
          if (msg.type() === 'log' || msg.type() === 'error') {
            console.log(`🌐 Page ${msg.type()}:`, msg.text());
          }
        });
        
        // Click the health check button
        await healthButton.click();
        console.log('🔧 Clicked health check button');
        
        // Wait a bit for the API call to complete
        await page.waitForTimeout(3000);
        
        // Check if results were added
        const results = await page.$('#results');
        if (results) {
          const resultsText = await page.evaluate(el => el.textContent, results);
          if (resultsText.trim()) {
            console.log('✅ Results found:', resultsText.substring(0, 100) + '...');
          } else {
            console.log('⚠️  Results div is empty');
          }
        } else {
          console.log('❌ Results div not found');
        }
        
        // Test register button too
        const registerButton = await page.$('button[onclick="testRegisterEndpoint()"]');
        if (registerButton) {
          console.log('🔧 Testing register button...');
          await registerButton.click();
          await page.waitForTimeout(3000);
          
          const newResults = await page.evaluate(() => document.querySelector('#results').textContent);
          console.log('✅ Register test completed, results updated');
        }
        
      } else {
        console.log('❌ Health check button not found');
      }
    } catch (pageError) {
      console.log('❌ Error testing static debug page:', pageError.message);
    }
    
    // Test Next.js debug page
    console.log('📄 Testing Next.js debug page...');
    try {
      await page.goto('http://localhost:3002/debug', { 
        waitUntil: 'networkidle0',
        timeout: 8000
      });
      
      const debugTitle = await page.evaluate(() => document.querySelector('h1')?.textContent);
      console.log(`✅ Debug page title: ${debugTitle}`);
      
      // Test API button if it exists
      const apiButton = await page.$('button');
      if (apiButton) {
        console.log('✅ API test button found on debug page');
        await apiButton.click();
        console.log('🔧 Clicked API test button');
        await page.waitForTimeout(2000);
      } else {
        console.log('⚠️  No buttons found on debug page');
      }
    } catch (pageError) {
      console.log('❌ Error testing Next.js debug page:', pageError.message);
    }
    
    console.log('🎉 Browser automation test completed successfully!');
    
  } catch (error) {
    console.log('❌ Browser automation test failed:', error.message);
    console.log('💡 This might be because:');
    console.log('   - Frontend server is not running on localhost:3002');
    console.log('   - Backend server is not running on localhost:3000');
    console.log('   - Debug pages have JavaScript errors');
    console.log('   - CORS issues preventing API calls');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
EOF

    # Run the browser test with the current working directory
    cd /Users/thomasmcavoy/GitHub/shoppingcart && node /tmp/debug-page-test.js
  else
    echo "⚠️  Puppeteer not found. To test JavaScript execution in debug pages, install it:"
    echo "   npm install puppeteer"
    echo ""
    echo "🔧 Alternative manual test instructions:"
    echo "   1. Open browser to: $FRONTEND_URL/debug-api.html"
    echo "   2. Click 'Test Health Endpoint' button"
    echo "   3. Click 'Test Register Endpoint' button"
    echo "   4. Check console for errors and results"
    echo ""
    echo "   Or visit: $FRONTEND_URL/debug"
    echo "   And click 'Test API Connection' button"
  fi
  
  # Cleanup
  rm -f /tmp/debug-page-test.js
  
else
  echo "❌ Node.js not available for browser automation testing"
fi

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
echo ""

echo "================================"
echo "🏁 Complete API & Debug Page Tests Completed!"
echo "================================"
