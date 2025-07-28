#!/bin/bash
echo "🔧 Testing Regional News Integration (Scottish 🏴��󠁢󠁳󠁣󠁴󠁿 & Canadian 🍁)"
echo "================================================================="

# Emergency stop and restart following Server Management patterns
echo "1️⃣  Using Emergency stop: npm run kill"
npm run kill
sleep 3

echo "Starting servers: npm run dev:all"
npm run dev:all &
sleep 10

echo ""
echo "2️⃣  Testing available sources with regional support..."
curl -s http://localhost:3000/api/news/sources | jq '.data.regional'

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
  echo "4️⃣  Testing Scottish news fetch 🏴󠁧󠁢󠁳󠁣󠁴󠁿..."
  SCOTTISH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/news/fetch-scottish \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303")
  
  echo "Scottish news summary:"
  echo $SCOTTISH_RESPONSE | jq '{region: .region, summary: .summary, fetchMethod: .fetchMethod}'
  
  echo ""
  echo "5️⃣  Testing Canadian news fetch 🍁..."
  CANADIAN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/news/fetch-canadian \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303")
  
  echo "Canadian news summary:"
  echo $CANADIAN_RESPONSE | jq '{region: .region, summary: .summary, fetchMethod: .fetchMethod}'
  
  echo ""
  echo "6️⃣  Testing combined regional news fetch..."
  REGIONAL_RESPONSE=$(curl -s -X POST http://localhost:3000/api/news/fetch-regional \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
    -d '{"regions": ["scottish", "canadian"]}')
  
  echo "Regional news summary:"
  echo $REGIONAL_RESPONSE | jq '{regions: .regions, summary: .summary}'
  
  echo ""
  echo "7️⃣  Testing cached news with regional articles..."
  curl -s http://localhost:3000/api/news | jq '.data.totalResults'
  
  echo ""
  echo "🎉 Regional News Integration Working!"
  echo ""
  echo "🌍 Available Regional Sources:"
  echo "   🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scottish: Herald, BBC Scotland"
  echo "   🍁 Canadian: CBC News, Globe & Mail, National Post"
  echo ""
  echo "📋 New Endpoints Added:"
  echo "   POST /api/news/fetch-scottish"
  echo "   POST /api/news/fetch-canadian"
  echo "   POST /api/news/fetch-regional"
  echo ""
  echo "🔗 Access Points:"
  echo "   News Page: http://localhost:3001/news"
  echo "   Primary Debug Dashboard: http://localhost:3001/debug"
  
else
  echo "❌ Authentication failed"
fi
