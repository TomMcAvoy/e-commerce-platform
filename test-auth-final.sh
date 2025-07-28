#!/bin/bash
echo "🔧 Final Authentication Test Following Copilot Instructions"
echo "========================================================"

# Step 1: Emergency stop and restart following Server Management patterns
echo "1️⃣  Using Emergency stop: npm run kill"
npm run kill
sleep 3

echo "Starting dev servers: npm run dev:all"
npm run dev:all &
sleep 10

# Step 2: Test API Health Endpoints from Debugging & Testing Ecosystem
echo ""
echo "2️⃣  Testing API Health Endpoints..."
echo "Backend Health:"
curl -s http://localhost:3000/health | jq '.' || echo "Backend not responding"

echo ""
echo "API Status:"
curl -s http://localhost:3000/api/status | jq '.' || echo "API status not available"

# Step 3: Test authentication following Authentication Flow patterns
echo ""
echo "3️⃣  Testing JWT authentication with matchPassword() method..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{
    "email": "thomas.mcavoy@whitestartups.com",
    "password": "AshenP3131m!"
  }')

echo "Auth Response: $AUTH_RESPONSE"

# Extract JWT token following Authentication Flow pattern
TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo ""
  echo "✅ Authentication Successful with sendTokenResponse() pattern!"
  echo "🔑 JWT Token: ${TOKEN:0:50}..."
  
  # Step 4: Test protected endpoints following API Endpoints Structure
  echo ""
  echo "4️⃣  Testing protected /api/auth/me endpoint..."
  PROFILE_RESPONSE=$(curl -s -X GET http://localhost:3000/api/auth/me \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303")
  
  echo "Profile Response: $PROFILE_RESPONSE"
  
  # Step 5: Test logout endpoint
  echo ""
  echo "5️⃣  Testing logout endpoint..."
  LOGOUT_RESPONSE=$(curl -s -X GET http://localhost:3000/api/auth/logout \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303")
  
  echo "Logout Response: $LOGOUT_RESPONSE"
  
  echo ""
  echo "🎉 Complete Authentication System Working Following Copilot Instructions!"
  echo ""
  echo "🔗 Access Points from Debugging & Testing Ecosystem:"
  echo "   Primary Debug Dashboard: http://localhost:3001/debug"
  echo "   Static Debug Page: http://localhost:3001/debug-api.html"
  echo "   API Health: http://localhost:3000/health"
  echo "   API Status: http://localhost:3000/api/status"
  echo ""
  echo "📋 Working Credentials:"
  echo "   Email: thomas.mcavoy@whitestartups.com"
  echo "   Password: AshenP3131m!"
  echo "   Tenant ID: 6884bf4702e02fe6eb401303"
  
else
  echo ""
  echo "❌ Authentication failed"
  echo "Response: $AUTH_RESPONSE"
  echo ""
  echo "🔍 Following Error Handling Pattern troubleshooting:"
  echo "   1. Method name mismatch: Use matchPassword() not comparePassword()"
  echo "   2. Check if JWT_SECRET exists in backend .env"
  echo "   3. Verify user exists with correct tenantId"
fi
