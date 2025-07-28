#!/bin/bash
echo "🔍 CATEGORY LINK DIAGNOSIS - Preserving Existing Code"
echo "==================================================="

echo "1️⃣ Testing your existing API endpoints..."
curl -s "http://localhost:3000/api/categories" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success, .total'

echo ""
echo "2️⃣ Testing category by slug endpoint..."
curl -s "http://localhost:3000/api/categories/slug/electronics-technology" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success, (.data.name // "Not found")'

echo ""
echo "3️⃣ Checking if route is registered..."
curl -s "http://localhost:3000/api/status" | jq '.routes // "No route info"'
#!/bin/bash
echo "🔍 CATEGORY SLUG ENDPOINT DIAGNOSIS"
echo "=================================="

echo "1️⃣ Testing slug endpoint raw response..."
curl -v "http://localhost:3000/api/categories/slug/electronics-technology" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" 2>&1 | head -20

echo ""
echo "2️⃣ Testing if slug route exists..."
curl -s "http://localhost:3000/api/categories/featured" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success'
