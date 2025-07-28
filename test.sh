#!/bin/bash
echo "🔍 HOMEPAGE LAYOUT DIAGNOSIS"
echo "==========================="

echo "1️⃣ Test categories API response structure..."
curl -s "http://localhost:3000/api/categories?limit=6" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '{
    success: .success,
    total: .total,
    structure: .structure,
    dataCount: (.data | length)
  }'

echo ""
echo "2️⃣ Test featured categories specifically..."
curl -s "http://localhost:3000/api/categories/featured?limit=6" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '{
    success: .success,
    total: .total,
    featuredCount: (.data | length)
  }'#!/bin/bash
echo "🔍 HOMEPAGE LAYOUT DIAGNOSIS"
echo "==========================="

echo "1️⃣ Test categories API response structure..."
curl -s "http://localhost:3000/api/categories?limit=6" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '{
    success: .success,
    total: .total,
    structure: .structure,
    dataCount: (.data | length)
  }'

echo ""
echo "2️⃣ Test featured categories specifically..."
curl -s "http://localhost:3000/api/categories/featured?limit=6" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '{
    success: .success,
    total: .total,
    featuredCount: (.data | length)
  }'
#!/bin/bash
echo "🔍 HOMEPAGE COMPONENT DIAGNOSIS"
echo "=============================="

echo "1️⃣ Check homepage component structure..."
find frontend/app -name "page.tsx" -path "*/page.tsx" | head -3

echo ""
echo "2️⃣ Test homepage load directly..."
curl -I "http://localhost:3001/" 2>/dev/null | grep "HTTP"

echo ""
echo "3️⃣ Access Primary Debug Dashboard..."
echo "Visit: http://localhost:3001/debug"
#!/bin/bash
echo "🔍 AUTHENTICATION & API DIAGNOSIS"
echo "================================="

echo "1️⃣ Test login API endpoint..."
curl -s "http://localhost:3000/api/auth/login" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" \
  -d '{"email":"admin@whitestart.com","password":"admin123"}' | jq '.success // "Login failed"'

echo ""
echo "2️⃣ Test if auth routes are registered..."
curl -s "http://localhost:3000/api/status" | jq '.routes // "No route info"'

echo ""
echo "3️⃣ Check if backend auth controller exists..."
curl -I "http://localhost:3000/api/auth/login" 2>/dev/null | grep "HTTP"

echo ""
echo "4️⃣ Test categories without auth (should work)..."
curl -s "http://localhost:3000/api/categories/featured?limit=6" \
  -H "X-Tenant-ID: 6884bf4702e02fe6eb401303" | jq '.success, .total'
 #!/bin/bash
echo "🔧 SETTING UP MISSING AUTHENTICATION SYSTEM"
echo "==========================================="

echo "1️⃣ Check if auth controller exists..."
ls -la src/controllers/ | grep -i auth

echo "2️⃣ Check if auth routes are registered..."
grep -r "auth" src/routes/ || echo "No auth routes found"

echo "3️⃣ Check main server file for auth routes..."
grep -r "/auth" src/index.ts || echo "Auth routes not registered in server"
#!/bin/bash
echo "🧪 VALIDATING DEBUG DASHBOARD AND API"
echo "======================================"

# Following Server Management instructions
echo "1️⃣ Restarting servers for a clean state..."
npm run kill
sleep 2
npm run dev:all &
sleep 8 # Wait for servers to be ready

# Following Debugging & Testing Ecosystem instructions
echo ""
echo "2️⃣ Checking API health endpoint..."
curl -s "http://localhost:3000/health" | jq

echo ""
echo "3️⃣ Checking Primary Debug Dashboard page..."
curl -I "http://localhost:3001/debug" 2>/dev/null | grep "HTTP/1.1 200 OK"

if [ $? -eq 0 ]; then
    echo "✅ Debug Dashboard is accessible at http://localhost:3001/debug"
else
    echo "❌ Debug Dashboard is NOT accessible."
fi

echo ""
echo "4️⃣ Stopping servers..."
npm run kill
echo
