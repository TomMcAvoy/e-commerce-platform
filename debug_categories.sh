#!/bin/bash
echo "🔍 DEBUGGING CATEGORY API ISSUE"
echo "==============================="

echo "1️⃣ Check if backend is running..."
curl -s http://localhost:3000/health | jq '.status // "Server not running"'

echo ""
echo "2️⃣ Check database connection..."
mongosh --quiet shoppingcart --eval "
const tenantId = ObjectId('6884bf4702e02fe6eb401303');
const count = db.categories.countDocuments({ tenantId });
console.log('Categories in database:', count);

if (count > 0) {
  console.log('Sample category:');
  const sample = db.categories.findOne({ tenantId });
  console.log('  Name:', sample.name);
  console.log('  TenantId:', sample.tenantId);
  console.log('  Level:', sample.level);
  console.log('  IsActive:', sample.isActive);
}
"

echo ""
echo "3️⃣ Test categories API with detailed headers..."
curl -v -s "http://localhost:3000/api/categories?limit=3" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -H "Content-Type: application/json" 2>&1

echo ""
echo "4️⃣ Check if tenant middleware is working..."
curl -s "http://localhost:3000/api/categories?limit=1" \
  -H "Content-Type: application/json" | jq '.error // "No error field"'

echo ""
echo "5️⃣ Test with tree structure..."
curl -s "http://localhost:3000/api/categories?tree=true&limit=2" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success, (.data | length)'

echo ""
echo "🔧 If still failing, check:"
echo "  - Tenant middleware in index.ts"
echo "  - Category routes registration"
echo "  - MongoDB connection"
echo "  - Category controller import path"
