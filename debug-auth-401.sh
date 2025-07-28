#!/bin/bash
echo "🔧 Debugging 401 Authentication Issues"
echo "===================================="

# Emergency stop and restart following Server Management patterns
echo "1️⃣  Using Emergency stop: npm run kill"
npm run kill
sleep 3

echo "Starting servers: npm run dev:all"
npm run dev:all &
sleep 10

echo ""
echo "2️⃣  Testing API Health Endpoints..."
curl -s http://localhost:3000/health | jq '.'
curl -s http://localhost:3000/api/status | jq '.'

echo ""
echo "3️⃣  Testing auth endpoint directly (raw response)..."
AUTH_RESPONSE=$(curl -s -w "HTTP_STATUS:%{http_code}" -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{"email": "thomas.mcavoy@whitestartups.com", "password": "AshenP3131m!"}')

echo "Raw auth response: $AUTH_RESPONSE"

# Parse HTTP status
HTTP_STATUS=$(echo $AUTH_RESPONSE | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
RESPONSE_BODY=$(echo $AUTH_RESPONSE | sed 's/HTTP_STATUS:[0-9]*$//')

echo "HTTP Status: $HTTP_STATUS"
echo "Response Body: $RESPONSE_BODY"

echo ""
echo "4️⃣  Testing with different tenant ID..."
curl -s -w "HTTP_STATUS:%{http_code}" -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: test" \
  -d '{"email": "thomas.mcavoy@whitestartups.com", "password": "AshenP3131m!"}'

echo ""
echo ""
echo "5️⃣  Testing without tenant ID header..."
curl -s -w "HTTP_STATUS:%{http_code}" -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "thomas.mcavoy@whitestartups.com", "password": "AshenP3131m!"}'

echo ""
echo ""
echo "6️⃣  Checking if user exists in database..."
curl -s http://localhost:3000/api/users \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.data | length'

echo ""
echo "7️⃣  Testing Primary Debug Dashboard access..."
curl -s http://localhost:3001/debug-api.html | head -n 5

echo ""
echo "🔗 Manual Testing Links:"
echo "   Primary Debug Dashboard: http://localhost:3001/debug"
echo "   Static Debug Page: http://localhost:3001/debug-api.html"
echo "   API Health: http://localhost:3000/health"
