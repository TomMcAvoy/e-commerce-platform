#!/bin/bash
echo "🔒 Seeding Password for Thomas McAvoy"
echo "===================================="

# Seed the password using mongosh following Database Patterns
mongosh mongodb://localhost:27017/shoppingcart --eval "
  const bcrypt = require('bcryptjs');
  const plainPassword = 'AshenP3131m!';
  const hashedPassword = bcrypt.hashSync(plainPassword, 12);
  
  const result = db.users.updateOne(
    { 
      email: 'thomas.mcavoy@whitestartups.com',
      tenantId: ObjectId('6884bf4702e02fe6eb401303')
    },
    { 
      \$set: { 
        password: hashedPassword,
        name: 'Thomas McAvoy',
        role: 'admin',
        isActive: true,
        updatedAt: new Date()
      }
    }
  );
  
  print('Password seeding result:');
  printjson(result);
  
  if (result.modifiedCount > 0) {
    print('✅ Password successfully seeded');
    print('🔑 Password: AshenP3131m!');
    print('�� User: thomas.mcavoy@whitestartups.com');
  } else {
    print('❌ No user updated - check if user exists in correct tenant');
  }
" --quiet

echo ""
echo "🧪 Testing authentication with seeded password..."
sleep 2

# Test authentication following Authentication Flow patterns
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{
    "email": "thomas.mcavoy@whitestartups.com",
    "password": "AshenP3131m!"
  }' | jq '.' || echo "Backend not responding - start servers first"

echo ""
echo "🔗 Access Points:"
echo "   Primary Debug Dashboard: http://localhost:3001/debug"
echo "   Static Debug Page: http://localhost:3001/debug-api.html"
echo ""
echo "📋 Test Credentials:"
echo "   Email: thomas.mcavoy@whitestartups.com"
echo "   Password: AshenP3131m!"
echo "   Tenant ID: 6884bf4702e02fe6eb401303"
