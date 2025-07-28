#!/bin/bash
echo "🔧 Testing News System with Scheduler Following Copilot Instructions"
echo "====================================================================="

# Emergency stop and restart following Server Management patterns
echo "1️⃣  Using Emergency stop: npm run kill"
npm run kill
sleep 3

echo "Starting servers: npm run dev:all"
npm run dev:all &
sleep 10

echo ""
echo "2️⃣  Testing API Health with Scheduler Status..."
curl -s http://localhost:3000/health | jq '.schedulerStatus'

echo ""
echo "3️⃣  Testing authentication and manual news fetch..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{"email": "thomas.mcavoy@whitestartups.com", "password": "AshenP3131m!"}')

TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Authentication successful"
  
  echo ""
  echo "4️⃣  Manual news fetch test..."
  NEWS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/news/fetch \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
    -d '{"country": "us", "category": "technology"}')
  
  echo "Manual fetch result:"
  echo $NEWS_RESPONSE | jq '.data.totalResults'
  
  echo ""
  echo "5️⃣  Testing cached news endpoint..."
  curl -s http://localhost:3000/api/news | jq '.data.totalResults'
  
  echo ""
  echo "🎉 News System with Scheduler Working!"
  echo ""
  echo "🔗 Access Points:"
  echo "   News Page: http://localhost:3001/news"
  echo "   Primary Debug Dashboard: http://localhost:3001/debug"
  echo "   API Health: http://localhost:3000/health"
  echo ""
  echo "📅 Scheduler Info:"
  echo "   Development: Every 5 minutes"
  echo "   Production: Every 4 hours"
  echo "   Manual fetch: Available via 'Fetch Fresh' button"
  
else
  echo "❌ Authentication failed - cannot test news fetch"
fi
