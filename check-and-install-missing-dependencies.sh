#!/bin/bash
# filepath: check-and-install-missing-dependencies.sh
# Check and install missing dependencies - Following copilot-instructions.md patterns

set -e

echo "🔧 Checking Missing Dependencies - Multi-Vendor E-Commerce Platform"
echo "=================================================================="
echo "Following copilot-instructions.md architecture:"
echo "Backend API: http://localhost:3000"
echo "Frontend: http://localhost:3001"
echo "Debug Dashboard: http://localhost:3001/debug"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
  echo "❌ package.json not found!"
  exit 1
fi

echo "📋 Current dependencies status:"
echo "==============================="

# Check for essential backend dependencies
MISSING_DEPS=""

# Core backend dependencies
echo "🔍 Checking core backend dependencies..."
npm list express > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS express"
npm list mongoose > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS mongoose" 
npm list jsonwebtoken > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS jsonwebtoken"
npm list bcryptjs > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS bcryptjs"
npm list dotenv > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS dotenv"
npm list cors > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS cors"
npm list helmet > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS helmet"
npm list express-rate-limit > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS express-rate-limit"
npm list cookie-parser > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS cookie-parser"
npm list multer > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS multer"

# TypeScript and dev dependencies
echo "🔍 Checking TypeScript dependencies..."
npm list typescript > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS typescript"
npm list @types/node > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS @types/node"
npm list @types/express > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS @types/express"
npm list @types/jsonwebtoken > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS @types/jsonwebtoken"
npm list @types/bcryptjs > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS @types/bcryptjs"
npm list @types/cors > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS @types/cors"
npm list @types/cookie-parser > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS @types/cookie-parser"
npm list @types/multer > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS @types/multer"
npm list ts-node > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS ts-node"
npm list nodemon > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS nodemon"

# Testing dependencies following copilot test patterns
echo "🔍 Checking testing dependencies..."
npm list jest > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS jest"
npm list @types/jest > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS @types/jest"
npm list ts-jest > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS ts-jest"
npm list supertest > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS supertest"
npm list @types/supertest > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS @types/supertest"

# Multi-server management following copilot patterns
echo "🔍 Checking multi-server dependencies..."
npm list concurrently > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS concurrently"

# Dropshipping service dependencies
echo "🔍 Checking dropshipping integration dependencies..."
npm list axios > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS axios"
npm list @types/axios > /dev/null 2>&1 || MISSING_DEPS="$MISSING_DEPS @types/axios"

if [ -z "$MISSING_DEPS" ]; then
  echo "✅ All dependencies are installed!"
  echo ""
  echo "🔍 Checking if controllers can be loaded..."
  
  # Test if controllers can be imported
  node -e "
    try {
      require('./src/controllers/authController');
      console.log('✅ Auth controller loads successfully');
    } catch (e) {
      console.log('❌ Auth controller failed:', e.message);
    }
    
    try {
      require('./src/controllers/productController');
      console.log('✅ Product controller loads successfully');
    } catch (e) {
      console.log('❌ Product controller failed:', e.message);
    }
    
    try {
      require('./src/middleware/auth');
      console.log('✅ Auth middleware loads successfully');
    } catch (e) {
      console.log('❌ Auth middleware failed:', e.message);
    }
  " 2>/dev/null || echo "⚠️  Node.js module loading test failed - files may have syntax errors"

else
  echo ""
  echo "❌ Missing Dependencies Found:"
  echo "============================="
  for dep in $MISSING_DEPS; do
    echo "  • $dep"
  done
  echo ""
  echo "🔧 Installing missing dependencies..."
  echo "===================================="
  
  # Install production dependencies
  PROD_DEPS=""
  DEV_DEPS=""
  
  for dep in $MISSING_DEPS; do
    case $dep in
      "@types/"* | "typescript" | "ts-node" | "ts-jest" | "nodemon" | "jest" | "@types/jest" | "supertest" | "@types/supertest" | "concurrently")
        DEV_DEPS="$DEV_DEPS $dep"
        ;;
      *)
        PROD_DEPS="$PROD_DEPS $dep"
        ;;
    esac
  done
  
  # Install production dependencies
  if [ ! -z "$PROD_DEPS" ]; then
    echo "📦 Installing production dependencies..."
    npm install $PROD_DEPS
  fi
  
  # Install dev dependencies  
  if [ ! -z "$DEV_DEPS" ]; then
    echo "🛠️  Installing development dependencies..."
    npm install --save-dev $DEV_DEPS
  fi
  
  echo ""
  echo "✅ Dependencies installed successfully!"
fi

echo ""
echo "🔧 Checking TypeScript Configuration..."
echo "======================================"

# Check if tsconfig.json exists and is properly configured
if [ ! -f "tsconfig.json" ]; then
  echo "⚠️  tsconfig.json missing - creating following copilot patterns..."
  cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": false,
    "esModuleInterop": true,
    "module": "CommonJS",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "src/**/*",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "frontend"
  ],
  "ts-node": {
    "esm": false,
    "compilerOptions": {
      "module": "CommonJS"
    }
  }
}
EOF
else
  echo "✅ tsconfig.json exists"
fi

# Check Jest configuration
echo ""
echo "🧪 Checking Jest Configuration..."
echo "================================="

if [ ! -f "jest.config.js" ]; then
  echo "⚠️  jest.config.js missing - creating following copilot test patterns..."
  cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000
};
EOF
else
  echo "✅ jest.config.js exists"
fi

# Check Jest setup file
if [ ! -f "jest.setup.js" ]; then
  echo "⚠️  jest.setup.js missing - creating following copilot patterns..."
  cat > jest.setup.js << 'EOF'
// Jest setup file for e-commerce platform following copilot patterns

// Suppress console warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes('route handlers') && process.env.NODE_ENV === 'test') {
    return; // Suppress route file warnings during tests
  }
  originalWarn(...args);
};

// Global test timeout
jest.setTimeout(10000);
EOF
else
  echo "✅ jest.setup.js exists"
fi

echo ""
echo "📝 Checking Package.json Scripts..."
echo "=================================="

# Verify essential scripts exist
REQUIRED_SCRIPTS="setup dev:all dev:server dev:frontend test test:api stop kill"

echo "Required scripts following copilot-instructions.md:"
for script in $REQUIRED_SCRIPTS; do
  if npm run | grep -q "^  $script$"; then
    echo "  ✅ $script"
  else
    echo "  ❌ $script (missing)"
  fi
done

echo ""
echo "🔧 Summary & Next Steps"
echo "======================"
echo ""
echo "🚀 Following Copilot Instructions Architecture:"
echo "  ✓ Multi-vendor e-commerce platform with TypeScript"
echo "  ✓ Backend API server (Express.js on port 3000)"  
echo "  ✓ Frontend Next.js server (port 3001)"
echo "  ✓ JWT authentication with sendTokenResponse() pattern"
echo "  ✓ Dropshipping service integration"
echo "  ✓ Comprehensive testing infrastructure"
echo ""
echo "🧪 Debug Ecosystem Available:"
echo "  http://localhost:3001/debug          # Primary debug dashboard"
echo "  http://localhost:3001/debug-api.html # Static debug page"
echo "  http://localhost:3000/health         # API health check" 
echo "  http://localhost:3000/api/status     # API endpoints mapping"
echo ""
echo "▶️  Essential Commands (from copilot-instructions.md):"
echo "    npm run setup            # One-time setup: deps, .env, builds"
echo "    npm run dev:all          # Start both servers (backend:3000, frontend:3001)"
echo "    npm test                 # Comprehensive test suite"
echo "    npm run test:api         # Quick API validation"
echo "    npm run stop             # Graceful shutdown"
echo "    npm run kill             # Force kill processes on ports 3000-3001"
echo ""

if [ ! -z "$MISSING_DEPS" ]; then
  echo "✅ Dependencies have been installed! Run 'npm test' to verify fixes."
else
  echo "✅ All dependencies are present. The issue may be in controller loading logic."
fi
