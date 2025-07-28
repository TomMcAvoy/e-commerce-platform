#!/bin/bash
echo "🚚 Migrating All Users to Whitestart System Security Tenant"
echo "=========================================================="

# Step 1: Update all users to Whitestart tenant following Database Patterns
echo "1️⃣  Moving all users to Whitestart tenant..."
mongosh mongodb://localhost:27017/shoppingcart --eval "
  const whitestart_tenant = ObjectId('6884bf4702e02fe6eb401303');
  
  // Update all users to belong to Whitestart tenant
  const result = db.users.updateMany(
    {},
    { 
      \$set: { 
        tenantId: whitestart_tenant,
        updatedAt: new Date()
      }
    }
  );
  
  print('✅ Updated ' + result.modifiedCount + ' users to Whitestart tenant');
  
  // Set default passwords for testing following Security Considerations
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('password123', 12);
  
  const passwordResult = db.users.updateMany(
    {},
    { 
      \$set: { 
        password: hashedPassword,
        updatedAt: new Date()
      }
    }
  );
  
  print('✅ Set default password (password123) for ' + passwordResult.modifiedCount + ' users');
  
  // Verify migration
  print('\\n📊 Users now in Whitestart tenant:');
  db.users.find(
    { tenantId: whitestart_tenant },
    { email: 1, name: 1, role: 1 }
  ).forEach(user => {
    print('  ' + user.email + ' (' + (user.role || 'user') + ')');
  });
" --quiet

echo ""

# Step 2: Restart servers following Server Management patterns
echo "2️⃣  Restarting servers..."
npm run kill
sleep 3
npm run dev:all &
sleep 8

# Step 3: Test authentication following Authentication Flow
echo "3️⃣  Testing user authentication with default password..."
USERS=("thomas.mcavoy@whitestartups.com" "vendor@techsec.com" "john@customer.com")

for email in "${USERS[@]}"; do
  echo ""
  echo "Testing $email with password123..."
  
  RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
    -d "{
      \"email\": \"$email\",
      \"password\": \"password123\"
    }")
  
  TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  
  if [ -n "$TOKEN" ]; then
    echo "  ✅ SUCCESS! JWT Token: ${TOKEN:0:50}..."
  else
    echo "  ❌ Failed: $(echo $RESPONSE | jq -r '.error' 2>/dev/null || echo 'Unknown error')"
  fi
done

echo ""
echo "🎉 Migration Complete!"
echo ""
echo "🔗 Access Points:"
echo "   Primary Debug Dashboard: http://localhost:3001/debug"
echo "   Use any email with password: password123"
echo "   Tenant ID: 6884bf4702e02fe6eb401303"
