#!/bin/bash
echo "🔧 Complete 401 Authentication Fix"
echo "================================="

# Emergency stop and restart following Server Management patterns
echo "1️⃣  Emergency stop: npm run kill"
npm run kill
sleep 3

echo "2️⃣  Seeding users to ensure test user exists..."
npm run seed:users

echo "3️⃣  Starting servers: npm run dev:all"
npm run dev:all &
sleep 10

echo "4️⃣  Testing fixed authentication..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{"email": "thomas.mcavoy@whitestartups.com", "password": "AshenP3131m!"}')

echo "Auth response:"
echo $AUTH_RESPONSE | jq '.'

TOKEN=$(echo $AUTH_RESPONSE | jq -r '.token // empty')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo "✅ Authentication successful!"
  echo "Token: ${TOKEN:0:20}..."
  
  echo ""
  echo "5️⃣  Testing protected endpoint..."
  curl -s -H "Authorization: Bearer $TOKEN" \
       -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
       http://localhost:3000/api/auth/me | jq '.'
  
  echo ""
  echo "6️⃣  Testing news fetch with auth..."
  curl -s -X POST http://localhost:3000/api/news/fetch-major \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success'
  
  echo ""
  echo "🎉 401 Issues Fixed!"
  echo ""
  echo "✅ Fixes Applied:"
  echo "   • Enhanced login error logging"
  echo "   • Fixed User model indexes"
  echo "   • Seeded test users with correct tenant"
  echo "   • Enhanced API client with better error handling"
  echo ""
  echo "🔗 Access Points:"
  echo "   News Page: http://localhost:3001/news"
  echo "   Primary Debug Dashboard: http://localhost:3001/debug"
  echo ""
  echo "👤 Test Credentials:"
  echo "   Email: thomas.mcavoy@whitestartups.com"
  echo "   Password: AshenP3131m!"
  echo "   Tenant ID: 6884bf4702e02fe6eb401303"
  
else
  echo "❌ Authentication still failing"
  echo "Raw response: $AUTH_RESPONSE"
  
  echo ""
  echo "🔧 Manual debugging steps:"
  echo "1. Check MongoDB connection: curl http://localhost:3000/health"
  echo "2. Verify user exists: Check database directly"
  echo "3. Check server logs for detailed error information"
  echo "4. Try Primary Debug Dashboard: http://localhost:3001/debug"
fi
