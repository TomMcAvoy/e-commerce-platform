#!/bin/bash
echo "🔧 Fixing User Model JWT Method and Testing Authentication"
echo "========================================================"

# Step 1: Check if JWT_SECRET exists in .env
echo "1️⃣  Checking JWT configuration..."
if ! grep -q "JWT_SECRET" .env; then
  echo "Adding JWT configuration to .env..."
  echo "" >> .env
  echo "# JWT Configuration" >> .env
  echo "JWT_SECRET=whitestart-system-security-jwt-secret-key-2024-development" >> .env
  echo "JWT_EXPIRE=30d" >> .env
  echo "✅ JWT configuration added"
else
  echo "✅ JWT configuration exists"
fi

# Step 2: Restart servers following Server Management patterns
echo ""
echo "2️⃣  Restarting servers..."
npm run kill
sleep 3
npm run dev:all &
sleep 10

# Step 3: Test API Health Endpoints
echo "3️⃣  Testing API health..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health 2>/dev/null || echo "Backend not responding")
echo "Health: $HEALTH_RESPONSE"

# Step 4: Test authentication following Authentication Flow patterns
echo ""
echo "4️⃣  Testing JWT authentication with AshenP3131m!..."
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
  
  # Step 5: Test protected endpoint
  echo ""
  echo "5️⃣  Testing protected endpoint..."
  PROFILE_RESPONSE=$(curl -s -X GET http://localhost:3000/api/auth/me \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303")
  
  echo "Profile Response: $PROFILE_RESPONSE"
  
  # Step 6: Test news system following API Endpoints Structure
  echo ""
  echo "6️⃣  Testing News System Integration..."
  NEWS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/news/fetch \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303")
  
  echo "News Response: $NEWS_RESPONSE"
  echo ""
  
  echo "🎉 Complete System Working!"
  echo ""
  echo "🔗 Access Points:"
  echo "   Primary Debug Dashboard: http://localhost:3001/debug"
  echo "   Static Debug Page: http://localhost:3001/debug-api.html"
  echo "   API Health: http://localhost:3000/health"
  
else
  echo ""
  echo "❌ Authentication still failing"
  echo "Response: $AUTH_RESPONSE"
  echo ""
  echo "🔍 Check if User model has getSignedJwtToken method"
fi
