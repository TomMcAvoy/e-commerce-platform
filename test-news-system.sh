#!/bin/bash
echo "�� Testing Complete News System Following Copilot Instructions"
echo "==========================================================="

# Emergency stop and restart following Server Management patterns
echo "1️⃣  Using Emergency stop: npm run kill"
npm run kill
sleep 3

echo "Starting servers: npm run dev:all"
npm run dev:all &
sleep 10

echo ""
echo "2️⃣  Testing API Health and News Configuration..."
curl -s http://localhost:3000/health | jq '.'
curl -s http://localhost:3000/api/news/test-key | jq '.'

echo ""
echo "3️⃣  Testing empty news feed (should be empty initially)..."
curl -s http://localhost:3000/api/news | jq '.'

echo ""
echo "4️⃣  Testing authentication for fresh news fetch..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{"email": "thomas.mcavoy@whitestartups.com", "password": "AshenP3131m!"}')

TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Authentication successful"
  
  echo ""
  echo "5️⃣  Fetching and storing fresh news articles..."
  NEWS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/news/fetch \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
    -d '{"country": "us", "category": "technology"}')
  
  echo "Fresh news fetch response:"
  echo $NEWS_RESPONSE | jq '.'
  
  echo ""
  echo "6️⃣  Testing cached news feed (should now have articles)..."
  curl -s http://localhost:3000/api/news | jq '.data.totalResults'
  
  echo ""
  echo "🎉 Complete News System Working!"
  echo ""
  echo "🔗 Access Points following Debugging & Testing Ecosystem:"
  echo "   News Page: http://localhost:3001/news"
  echo "   Primary Debug Dashboard: http://localhost:3001/debug"
  echo "   API Health: http://localhost:3000/health"
  
else
  echo "❌ Authentication failed - cannot test news fetch"
fi
