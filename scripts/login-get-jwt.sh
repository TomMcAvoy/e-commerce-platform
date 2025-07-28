
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{
    "email": "thomas.mcavoy@whitestartups.com",
    "password": "AshenP3131m!"
  }' \
  -c cookies.txt
