#!/bin/bash
echo "🧪 TESTING SLUG ENDPOINT FIX"
echo "============================"

echo "1️⃣ Restart servers following Server Management..."
npm run kill
sleep 2
npm run dev:all &
sleep 5

echo ""
echo "2️⃣ Test slug endpoint..."
curl -s "http://localhost:3000/api/categories/slug/electronics-technology" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success, (.data.name // "Not found")'

echo ""
echo "3️⃣ Test another category..."
curl -s "http://localhost:3000/api/categories/slug/fashion-apparel" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success, (.data.name // "Not found")'

echo ""
echo "4️⃣ Verify all endpoints work..."
curl -s "http://localhost:3000/api/categories/featured" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success, .total'
