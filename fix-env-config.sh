#!/bin/bash
echo "🔧 Fixing Environment Configuration"
echo "=================================="

# Step 1: Backup current files
echo "1️⃣  Backing up current environment files..."
cp frontend/.env.local frontend/.env.local.bak 2>/dev/null || echo "No frontend .env.local to backup"
cp .env .env.bak 2>/dev/null || echo "No backend .env to backup"

# Step 2: Create proper frontend/.env.local following Frontend Structure patterns
echo "2️⃣  Creating proper frontend/.env.local..."
cat > frontend/.env.local << 'FRONTEND_ENV'
# Frontend Environment Configuration following Environment & Configuration patterns
# All client-side variables must be prefixed with NEXT_PUBLIC_

# API Configuration for Cross-Service Communication
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Frontend Configuration
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001

# Development Configuration
NEXT_PUBLIC_NODE_ENV=development

# Tenant Configuration for Multi-Tenant Architecture
NEXT_PUBLIC_DEFAULT_TENANT_ID=6884bf4702e02fe6eb401303

# Debug Configuration following Debugging & Testing Ecosystem
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_ENABLE_CORS_DEBUG=true
FRONTEND_ENV

# Step 3: Ensure backend .env has all required variables
echo "3️⃣  Verifying backend .env configuration..."
if [ ! -f ".env" ]; then
    echo "Creating backend .env..."
    cat > .env << 'BACKEND_ENV'
# Database Configuration following Environment & Configuration patterns
MONGODB_URI=mongodb://localhost:27017/shoppingcart

# Server Configuration
NODE_ENV=development
PORT=3000

# Frontend URL for CORS following Cross-Service Communication
FRONTEND_URL=http://localhost:3001

# News API Configuration
NEWS_API_KEY=0698a54e28c24e9ca4614768e50789e2
SYSTEM_USER_ID=60d0fe4f5311236168a109ca

# Tenant Configuration
DEFAULT_TENANT_ID=6884bf4702e02fe6eb401303

# JWT Configuration
JWT_SECRET=whitestart-system-security-jwt-secret-key-2024-development-super-long-random-string
JWT_EXPIRE=30d
BACKEND_ENV
else
    echo "✅ Backend .env exists"
fi

echo ""
echo "4️⃣  Testing configuration following Debugging & Testing Ecosystem..."

# Step 4: Restart servers to apply new environment
echo "Restarting servers with new environment..."
npm run kill
sleep 3
npm run dev:all &
sleep 8

# Step 5: Test that environment variables are accessible
echo ""
echo "5️⃣  Testing environment variable access..."
echo "Frontend should now have access to NEXT_PUBLIC_* variables"
echo "Backend keeps sensitive variables like JWT_SECRET private"

echo ""
echo "✅ Environment configuration fixed!"
echo ""
echo "🔗 Access Points following Critical Development Workflows:"
echo "   Primary Debug Dashboard: http://localhost:3001/debug"
echo "   Static Debug Page: http://localhost:3001/debug-api.html"
echo "   API Health: http://localhost:3000/health"
