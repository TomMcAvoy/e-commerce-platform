# Create a quick script to check actual tenants
cat > check-tenants.js << 'EOF'
const { MongoClient } = require('mongodb');

async function checkTenants() {
  const client = new MongoClient('mongodb://localhost:27017/shoppingcart');
  
  try {
    await client.connect();
    const db = client.db('shoppingcart');
    
    // Check tenants collection
    console.log('🏢 Checking tenants collection:');
    const tenants = await db.collection('tenants').find({}).toArray();
    
    if (tenants.length === 0) {
      console.log('❌ No tenants found in tenants collection');
    } else {
      tenants.forEach((tenant, index) => {
        console.log(`${index + 1}. ID: ${tenant._id}`);
        console.log(`   Name: ${tenant.name || 'N/A'}`);
        console.log(`   Status: ${tenant.status || 'N/A'}\n`);
      });
    }
    
    // Check user tenant references
    console.log('👥 Checking user tenant references:');
    const userTenants = await db.collection('users').distinct('tenantId');
    console.log('User tenant IDs:', userTenants);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkTenants();
EOF

node check-tenants.js
