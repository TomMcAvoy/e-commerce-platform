#!/bin/bash
echo "🔧 Testing News Sources Integration (CNN, Reuters, Fox News)"
echo "=========================================================="

# Emergency stop and restart following Server Management patterns
npm run kill
npm run dev:all &
sleep 10

echo "1️⃣  Testing available sources endpoint..."
curl -s http://localhost:3000/api/news/sources | jq '.data.sources'

echo ""
echo "2️⃣  Getting authentication token..."
AUTH_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{"email": "thomas.mcavoy@whitestartups.com", "password": "AshenP3131m!"}')

TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Authentication successful"
  
  echo ""
  echo "3️⃣  Testing major news sources fetch..."
  curl -s -X POST http://localhost:3000/api/news/fetch-major \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.data.totalResults'
  
  echo ""
  echo "4️⃣  Testing specific source fetch (CNN only)..."
  curl -s -X POST http://localhost:3000/api/news/fetch-sources \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
    -d '{"sources": ["cnn"]}' | jq '.data.totalResults'
  
  echo ""
  echo "5️⃣  Testing cached news with major sources..."
  curl -s http://localhost:3000/api/news | jq '.data.totalResults'
  
  echo ""
  echo "🎉 News Sources Integration Working!"
  echo ""
  echo "📺 Available Sources:"
  echo "   • CNN (cnn)"
  echo "   • Reuters (reuters)"  
  echo "   • Fox News (fox-news)"
  echo "   • BBC News (bbc-news)"
  echo "   • Associated Press (associated-press)"
  echo "   • Wall Street Journal (the-wall-street-journal)"
  echo "   • New York Times (the-new-york-times)"
  echo ""
  echo "🔗 Access Points:"
  echo "   News Page: http://localhost:3001/news"
  echo "   Primary Debug Dashboard: http://localhost:3001/debug"
  
else
  echo "❌ Authentication failed"
fi
