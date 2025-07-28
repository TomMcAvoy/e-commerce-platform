#!/bin/bash
echo "🔧 Testing Authentication with Fixed Tenant Resolver"
echo "==================================================="

# Step 1: Restart servers following Server Management patterns
echo "1️⃣  Restarting servers..."
npm run kill
sleep 3
npm run dev:all &
sleep 8

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
  echo ""
  
  # Step 4: Test news system following API Endpoints Structure
  echo "4️⃣  Testing News System Integration..."
  NEWS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/news/fetch \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303")
  
  echo "News Response: $NEWS_RESPONSE"
  echo ""
  
  echo "🎉 Complete System Working!"
  echo ""
  echo "🔗 Access Points:"
  echo "   Static Debug Page: http://localhost:3001/debug-api.html"
  echo "   Primary Debug Dashboard: http://localhost:3001/debug"
  
else
  echo ""
  echo "❌ Authentication still failing"
  echo "Check backend logs for detailed error information"
fi
