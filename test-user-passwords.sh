#!/bin/bash
echo "🔍 Testing Default Passwords for Existing Users"
echo "=============================================="

TENANT_ID="6884bf4702e02fe6eb401303"
PASSWORDS=("password123" "Password123!" "admin123" "test123" "dev123" "password" "123456")
USERS=("thomas.mcavoy@whitestartups.com" "vendor@techsec.com" "vendor@secsys.com" "vendor@proelec.com" "john@customer.com" "sarah@business.com")

for email in "${USERS[@]}"; do
  echo ""
  echo "Testing $email..."
  
  for password in "${PASSWORDS[@]}"; do
    echo "  Trying password: $password"
    
    RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -H "X-Tenant-ID: $TENANT_ID" \
      -d "{
        \"email\": \"$email\",
        \"password\": \"$password\"
      }")
    
    if echo "$RESPONSE" | grep -q '"token"'; then
      TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
      echo "  ✅ SUCCESS! Password for $email is: $password"
      echo "  �� JWT Token: ${TOKEN:0:50}..."
      break
    elif echo "$RESPONSE" | grep -q "Invalid credentials"; then
      echo "  ❌ Wrong password"
    elif echo "$RESPONSE" | grep -q "Tenant not found"; then
      echo "  ⚠️  Tenant issue: $(echo $RESPONSE | jq -r '.error' 2>/dev/null || echo 'Tenant not found')"
      break
    else
      echo "  ⚠️  Other error: $(echo $RESPONSE | jq -r '.error' 2>/dev/null || echo 'Unknown')"
    fi
  done
done

echo ""
echo "🎯 Summary"
echo "=========="
echo "If any passwords worked, you can use them in your debug dashboard:"
echo "   Primary Debug Dashboard: http://localhost:3001/debug"
echo "   Static Debug Page: http://localhost:3001/debug-api.html"
