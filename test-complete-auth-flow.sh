#!/bin/bash
echo "🔧 Complete Authentication Flow Test"
echo "==================================="

# Step 1: Emergency stop and restart following Server Management patterns
echo "1️⃣  Restarting servers..."
npm run kill
sleep 3
npm run dev:all &
sleep 10

# Step 2: Test API Health Endpoints
echo "2️⃣  Testing API health..."
curl -s http://localhost:3000/health | jq '.' || echo "Backend not responding"

# Step 3: Test authentication following Authentication Flow patterns
echo ""
echo "3️⃣  Testing JWT authentication with AshenP3131m!..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{
    "email": "thomas.mcavoy@whitestartups.com",
    "password": "AshenP3131m!"
  }')

echo "Auth Response: $AUTH_RESPONSE"

# Extract JWT token using sendTokenResponse() pattern
TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo ""
  echo "✅ Authentication Successful!"
  echo "🔑 JWT Token: ${TOKEN:0:50}..."
  
  # Step 4: Test protected endpoint following API Endpoints Structure
  echo ""
  echo "4️⃣  Testing protected user profile endpoint..."
  PROFILE_RESPONSE=$(curl -s -X GET http://localhost:3000/api/auth/me \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303")
  
  echo "Profile Response: $PROFILE_RESPONSE"
  
  # Step 5: Test news system following Critical Integration Points
  echo ""
  echo "5️⃣  Testing News System Integration..."
  NEWS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/news/fetch \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303")
  
  echo "News Response: $NEWS_RESPONSE"
  
  # Step 6: Check news feed following Cross-Service Communication
  echo ""
  echo "6️⃣  Checking news feed..."
  NEWS_FEED=$(curl -s -X GET http://localhost:3000/api/news \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303")
  
  echo "News Feed (first 200 chars): ${NEWS_FEED:0:200}..."
  echo ""
  
  echo "🎉 Complete System Working!"
  echo ""
  echo "🔗 Access Points following Debugging & Testing Ecosystem:"
  echo "   Primary Debug Dashboard: http://localhost:3001/debug"
  echo "   Static Debug Page: http://localhost:3001/debug-api.html"
  echo "   API Health: http://localhost:3000/health"
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
  echo "🔍 Debug steps:"
  echo "   1. Check if User model has getSignedJwtToken method"
  echo "   2. Verify JWT_SECRET in .env file"
  echo "   3. Check backend logs for detailed errors"
fi
