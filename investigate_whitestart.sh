#!/bin/bash
echo "🔍 INVESTIGATING WHITESTART SYSTEM SECURITY INC TENANT"
echo "======================================================"

echo "1️⃣ Searching for Whitestart tenant in database..."
mongosh --quiet shoppingcart --eval "
console.log('🔍 Searching for Whitestart tenant...');

// Search by name (case insensitive)
const tenantByName = db.tenants.findOne({ 
  name: { \$regex: /whitestart/i } 
});

if (tenantByName) {
  console.log('✅ Found tenant by name:');
  console.log('  ID:', tenantByName._id);
  console.log('  Name:', tenantByName.name);
  console.log('  Domain:', tenantByName.domain);
  console.log('  Slug:', tenantByName.slug);
  console.log('  Status:', tenantByName.status);
  console.log('  IsActive:', tenantByName.isActive);
  console.log('  Plan:', tenantByName.plan);
  console.log('  Features:', tenantByName.settings?.features || []);
  console.log('  Created:', tenantByName.createdAt);
} else {
  console.log('❌ No tenant found with \"Whitestart\" in name');
}

console.log('');
console.log('📋 All tenants in database:');
const allTenants = db.tenants.find({}).toArray();
allTenants.forEach(function(tenant) {
  console.log('  -', tenant.name, '(' + tenant._id + ')', 
              'Status:', tenant.status, 
              'Active:', tenant.isActive);
});

if (allTenants.length === 0) {
  console.log('  ❌ No tenants found in database');
}
"

echo ""
echo "2️⃣ Checking categories for any existing tenants..."
mongosh --quiet shoppingcart --eval "
console.log('📂 Categories by tenant:');
const categoryTenants = db.categories.distinct('tenantId');
categoryTenants.forEach(function(tenantId) {
  const count = db.categories.countDocuments({ tenantId });
  console.log('  Tenant', tenantId, '- Categories:', count);
});
"

echo ""
echo "3️⃣ Creating Whitestart tenant if not exists..."
mongosh --quiet shoppingcart --eval "
const whitestart = db.tenants.findOne({ 
  name: { \$regex: /whitestart/i } 
});

if (!whitestart) {
  console.log('🔄 Creating Whitestart System Security Inc tenant...');
  
  const newTenant = {
    _id: ObjectId('6884bf4702e02fe6eb401303'),
    name: 'Whitestart System Security Inc',
    slug: 'whitestart-system-security',
    domain: 'localhost:3001',
    plan: 'enterprise',
    status: 'active',
    settings: {
      currency: 'USD',
      timezone: 'UTC',
      features: ['ecommerce', 'dropshipping', 'analytics', 'payments']
    },
    limits: {
      users: 50000,
      products: 1000000,
      storage: 107374182400 // 100GB for enterprise
    },
    isActive: true
  };
  
  const result = db.tenants.insertOne(newTenant);
  console.log('✅ Whitestart tenant created:', result.insertedId);
  
  // Verify creation
  const created = db.tenants.findOne({ _id: ObjectId('6884bf4702e02fe6eb401303') });
  console.log('✅ Verification - Name:', created.name);
  console.log('✅ Verification - Active:', created.isActive);
} else {
  console.log('✅ Whitestart tenant already exists:', whitestart.name);
  
  // Update to ensure it's active
  if (!whitestart.isActive || whitestart.status !== 'active') {
    console.log('🔄 Activating Whitestart tenant...');
    db.tenants.updateOne(
      { _id: whitestart._id },
      { 
        \$set: { 
          isActive: true, 
          status: 'active',
          plan: 'enterprise'
        }
      }
    );
    console.log('✅ Whitestart tenant activated');
  }
}
"

echo ""
echo "4️⃣ Testing Whitestart tenant API access..."
curl -s "http://localhost:3000/health" | jq '.status // "Server not running"'

echo ""
echo "5️⃣ Testing categories with Whitestart tenant..."
curl -s "http://localhost:3000/api/categories?limit=3" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -H "Content-Type: application/json" | jq '{
    success: .success,
    error: .error // "No error",
    dataCount: (.data | length // 0),
    firstCategory: .data[0].name // "No data"
  }'

echo ""
echo "6️⃣ Testing featured categories..."
curl -s "http://localhost:3000/api/categories/featured?limit=5" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '{
    success: .success,
    error: .error // "No error", 
    featuredCount: (.data | length // 0)
  }'

echo ""
echo "🎯 WHITESTART TENANT STATUS SUMMARY"
echo "=================================="
mongosh --quiet shoppingcart --eval "
const tenant = db.tenants.findOne({ _id: ObjectId('6884bf4702e02fe6eb401303') });
if (tenant) {
  console.log('✅ Tenant Name:', tenant.name);
  console.log('✅ Status:', tenant.status);
  console.log('✅ Active:', tenant.isActive);
  console.log('✅ Plan:', tenant.plan);
  console.log('✅ Domain:', tenant.domain);
  
  const categoryCount = db.categories.countDocuments({ tenantId: tenant._id });
  console.log('✅ Categories:', categoryCount);
  
  const productCount = db.products.countDocuments({ tenantId: tenant._id });
  console.log('✅ Products:', productCount);
} else {
  console.log('❌ Whitestart tenant not found');
}
"

echo ""
echo "🔗 QUICK ACCESS LINKS"
echo "===================="
echo "Primary Debug Dashboard: http://localhost:3001/debug"
echo "API Health Check: http://localhost:3000/health"
echo "Categories API: http://localhost:3000/api/categories"
echo ""
echo "🧪 TEST COMMANDS"
echo "================"
echo 'curl -s "http://localhost:3000/api/categories" -H "X-Tenant-ID: 6884bf4702e02fe6eb401303"'
echo 'curl -s "http://localhost:3000/api/categories/featured" -H "X-Tenant-ID: 6884bf4702e02fe6eb401303"'
