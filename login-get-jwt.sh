#!/bin/bash

echo "🔑 Getting JWT token for thomas.mcavoy@whitestartups.com..."

# Login with your actual credentials following Authentication Flow patterns
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{
    "email": "thomas.mcavoy@whitestartups.com",
    "password": "AshenP3131m!"
  }')

echo "Response: $RESPONSE"

# Extract token following sendTokenResponse() pattern
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo ""
  echo "✅ JWT Token: $TOKEN"
  echo ""
  echo "🔗 Use for authenticated requests:"
  echo "Authorization: Bearer $TOKEN"
  echo ""
  echo "🗞️  Test news fetch:"
  echo "curl -X POST http://localhost:3000/api/news/fetch \\"
  echo "  -H \"Authorization: Bearer $TOKEN\" \\"
  echo "  -H \"X-Tenant-ID: 6884bf4702e02fe6eb401303\""
else
  echo "❌ Failed to get token"
  echo "Full response: $RESPONSE"
fi
