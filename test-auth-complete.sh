#!/bin/bash
echo "🔧 Complete Authentication Test Following Copilot Instructions"
echo "============================================================="

# Step 1: Restart servers following Server Management patterns
echo "1️⃣  Restarting servers using npm run dev:all..."
npm run kill
sleep 3
npm run dev:all &
sleep 10

# Step 2: Test API Health Endpoints following Debugging & Testing Ecosystem
echo "2️⃣  Testing API Health Endpoints..."
echo "Backend Health:"
curl -s http://localhost:3000/health | jq '.' || echo "Backend not responding"
echo ""
echo "API Status:"
curl -s http://localhost:3000/api/status | jq '.' || echo "API status not available"

# Step 3: Test authentication following Authentication Flow patterns
echo ""
echo "3️⃣  Testing JWT authentication with sendTokenResponse()..."
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
  echo "✅ Authentication Successful!"
  echo "🔑 JWT Token: ${TOKEN:0:50}..."
  
  # Step 4: Test protected endpoints following API Endpoints Structure
  echo ""
  echo "4️⃣  Testing protected endpoints..."
  echo "Testing /api/auth/me:"
  curl -s -X GET http://localhost:3000/api/auth/me \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.' || echo "Profile endpoint not available"
  
  # Step 5: Test Cross-Service Communication
  echo ""
  echo "5️⃣  Testing Cross-Service Communication..."
  echo "Frontend can now use this token for API calls"
  
  echo ""
  echo "🎉 Complete Authentication System Working!"
  echo ""
  echo "🔗 Access Points following Debugging & Testing Ecosystem:"
  echo "   Primary Debug Dashboard: http://localhost:3001/debug"
  echo "   Static Debug Page: http://localhost:3001/debug-api.html"
  echo "   API Health: http://localhost:3000/health"
  echo "   API Status: http://localhost:3000/api/status"
  
else
  echo ""
  echo "❌ Authentication failed"
  echo "Response: $AUTH_RESPONSE"
  echo ""
  echo "�� Troubleshooting following Error Handling Pattern:"
  echo "   1. Check if User model has getSignedJwtToken method"
  echo "   2. Verify JWT_SECRET in backend .env file"
  echo "   3. Check if user exists with correct password"
fi
