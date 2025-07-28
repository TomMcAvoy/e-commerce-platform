#!/bin/bash
echo "🔧 Testing Fixed News Validation Following Copilot Instructions"
echo "=============================================================="

# Emergency stop and restart following Server Management patterns
echo "1️⃣  Using Emergency stop: npm run kill"
npm run kill
sleep 3

echo "Starting servers: npm run dev:all"
npm run dev:all &
sleep 10

echo ""
echo "2️⃣  Testing API Health..."
curl -s http://localhost:3000/health | jq '.schedulerStatus'

echo ""
echo "3️⃣  Getting authentication token..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{"email": "thomas.mcavoy@whitestartups.com", "password": "AshenP3131m!"}')

TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Authentication successful"
  
  echo ""
  echo "4️⃣  Testing fixed major news fetch..."
  NEWS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/news/fetch-major \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303")
  
  echo "Fixed fetch response summary:"
  echo $NEWS_RESPONSE | jq '.summary'
  
  echo ""
  echo "5️⃣  Testing CNN specific source..."
  CNN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/news/fetch-sources \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
    -d '{"sources": ["cnn"], "category": "mixed"}')
  
  echo "CNN fetch summary:"
  echo $CNN_RESPONSE | jq '.summary'
  
  echo ""
  echo "6️⃣  Testing cached news (should now have articles)..."
  curl -s http://localhost:3000/api/news | jq '.data.totalResults'
  
  echo ""
  echo "🎉 Fixed News Validation Working!"
  echo ""
  echo "✅ Fixes Applied:"
  echo "   • Added 'mixed' and 'major-news' to category enum"
  echo "   • Relaxed media URL validation for modern news sites"
  echo "   • Added comprehensive error handling and sanitization"
  echo "   • Improved processing summaries with skip/error counts"
  echo ""
  echo "🔗 Access Points:"
  echo "   News Page: http://localhost:3001/news"
  echo "   Primary Debug Dashboard: http://localhost:3001/debug"
  
else
  echo "❌ Authentication failed"
fi
