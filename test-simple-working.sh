#!/bin/bash
echo "🔧 Testing Simple Working State"
echo "=============================="

# Emergency stop
npm run kill
sleep 2

# Start servers
npm run dev:all &
sleep 8

echo "Testing API endpoints..."
echo ""

echo "Categories:"
curl -s "http://localhost:3000/api/categories?limit=3" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success'

echo ""
echo "Products:"
curl -s "http://localhost:3000/api/products?limit=2&featured=true" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success'

echo ""
echo "Vendors:"
curl -s "http://localhost:3000/api/vendors?limit=2&featured=true" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success'

echo ""
echo "Testing Homepage..."
curl -s -o /dev/null -w "Homepage Status: %{http_code}\n" http://localhost:3001/

echo ""
echo "✅ Simple test complete!"
echo "🔗 Access: http://localhost:3001/"
