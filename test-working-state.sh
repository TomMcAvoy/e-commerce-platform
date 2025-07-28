#!/bin/bash
echo "🔧 Getting Back to Working State"
echo "==============================="

# Emergency stop and restart following Server Management patterns
echo "1️⃣  Emergency stop: npm run kill"
npm run kill
sleep 3

echo "2️⃣  Quick start: npm run dev:all"
npm run dev:all &
sleep 10

echo "3️⃣  Testing API Health..."
curl -s http://localhost:3000/health | jq '.status'

echo ""
echo "4️⃣  Testing Homepage API calls..."
echo "Categories endpoint:"
curl -s "http://localhost:3000/api/categories?limit=8" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success'

echo ""
echo "Products endpoint:"
curl -s "http://localhost:3000/api/products?limit=4&featured=true" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success'

echo ""
echo "Vendors endpoint:"
curl -s "http://localhost:3000/api/vendors?limit=6&featured=true" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success'

echo ""
echo "5️⃣  Testing HomePage load..."
curl -s -o /dev/null -w "Homepage HTTP Status: %{http_code}\n" http://localhost:3001/

echo ""
echo "✅ Back to Working State!"
echo ""
echo "🔗 Access Points:"
echo "   Homepage: http://localhost:3001/"
echo "   News Page: http://localhost:3001/news"
echo "   Debug Dashboard: http://localhost:3001/debug"
