#!/bin/bash
echo "🔍 Testing Categories Endpoint"
echo "============================="

# Test categories API following Debugging & Testing Ecosystem
echo "1️⃣ Backend health check..."
curl -s http://localhost:3000/health | jq '.status'

echo ""
echo "2️⃣ Testing categories endpoint..."
curl -s "http://localhost:3000/api/categories?limit=5" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo "3️⃣ Testing without tenant header..."
curl -s "http://localhost:3000/api/categories?limit=5" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo "4️⃣ Check if Category model exists..."
if [[ -f src/models/Category.ts ]]; then
    echo "✅ Category model found"
else
    echo "❌ Category model missing"
fi

echo ""
echo "5️⃣ Check database for categories..."
mongosh --quiet shoppingcart --eval "
db.categories.find({ tenantId: ObjectId('6884bf4702e02fe6eb401303') }).limit(3).forEach(printjson)
"
