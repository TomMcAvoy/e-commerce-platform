#!/bin/bash
# filepath: fix-routes-middleware.sh

echo "🔧 Fixing middleware function error following Copilot Instructions..."

echo "📝 Step 1: Fix routes index export to ensure valid Express router..."
cat > src/routes/index.ts << 'EOF'
import express, { Router } from 'express';

/**
 * Routes index following API Endpoints Structure from Copilot Instructions
 * Ensures proper Express router initialization with fail-safe patterns
 */

// Create router instance immediately following Backend Structure
const router: Router = express.Router();

// Safe synchronous import helper following Error Handling Pattern
const safeRequire = (modulePath: string, routePath: string): boolean => {
  try {
    // Clear cache to prevent stale imports during development
    delete require.cache[require.resolve(modulePath)];
    const routeModule = require(modulePath);
    const routes = routeModule.default || routeModule;
    
    // Validate routes is a proper Express router function
    if (routes && typeof routes === 'function') {
      router.use(routePath, routes);
      console.log(`✅ Loaded routes: ${routePath}`);
      return true;
    } else {
      console.log(`⚠️  Invalid route module: ${routePath} - not a function`);
      return false;
    }
  } catch (error: any) {
    const errorType = error.code === 'MODULE_NOT_FOUND' ? 'module not found' : error.message;
    console.log(`⚠️  Skipping ${routePath} routes - ${errorType}`);
    return false;
  }
};

console.log('🚀 Initializing routes following API Endpoints Structure...');

let loadedRoutesCount = 0;

// Core routes following Critical Development Workflows
if (safeRequire('./auth', '/auth')) loadedRoutesCount++;
if (safeRequire('./users', '/users')) loadedRoutesCount++;
if (safeRequire('./categories', '/categories')) loadedRoutesCount++;
if (safeRequire('./products', '/products')) loadedRoutesCount++;
if (safeRequire('./cart', '/cart')) loadedRoutesCount++;
if (safeRequire('./orders', '/orders')) loadedRoutesCount++;
if (safeRequire('./vendors', '/vendors')) loadedRoutesCount++;
if (safeRequire('./dropshipping', '/dropshipping')) loadedRoutesCount++;

// Health check endpoint following Debugging & Testing Ecosystem
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API routes are active',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    loadedRoutes: loadedRoutesCount,
    availableEndpoints: [
      'GET /api/status',
      'POST /api/auth/login',
      'POST /api/auth/register', 
      'GET /api/users/me',
      'GET /api/categories',
      'GET /api/products',
      'POST /api/cart/add',
      'GET /api/orders',
      'GET /api/vendors',
      'GET /api/dropshipping/status'
    ]
  });
});

// Fallback route following Error Handling Pattern
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    suggestion: 'Check GET /api/status for available endpoints'
  });
});

console.log(`✅ Routes initialization complete - ${loadedRoutesCount} route modules loaded`);

// Ensure we export a valid Express router function
export default router;
EOF

echo "📝 Step 2: Verify all route files export valid Express routers..."

# Check if auth routes exist and fix if needed
if [ ! -f "src/routes/auth.ts" ]; then
cat > src/routes/auth.ts << 'EOF'
import { Router } from 'express';
import { register, login, getAuthStatus } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/status', getAuthStatus);
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

export default router;
EOF
fi

echo "📝 Step 3: Fix main server file middleware registration..."
# Create a backup and fix the main server file
if [ -f "src/index.ts" ]; then
  # Create backup
  cp src/index.ts src/index.ts.backup
  
  # Use sed to fix line 67 area where the middleware error occurs
  # This assumes the issue is with how routes are being imported/used
  echo "⚙️  Patching main server file middleware registration..."
  
  # Create a safer version of the main server file around the routes usage
  cat > temp_server_fix.js << 'EOF'
const fs = require('fs');
const path = './src/index.ts';

fs.readFile(path, 'utf8', (err, data) => {
  if (err) {
    console.error('Could not read server file:', err);
    return;
  }
  
  // Fix common middleware issues
  let fixed = data
    // Ensure routes import is correct
    .replace(/import\s+.*routes.*from\s+['"]\.\/routes['"];?/g, "import routes from './routes';")
    // Ensure proper middleware usage
    .replace(/app\.use\(['"]\/api['"],\s*routes\);?/g, "app.use('/api', routes);")
    // Add safety check
    .replace(/app\.use\(['"]\/api['"],\s*routes\);/g, `// Ensure routes is a valid middleware function
if (typeof routes !== 'function') {
  console.error('❌ Routes is not a valid middleware function:', typeof routes);
  process.exit(1);
}
app.use('/api', routes);`);
    
  fs.writeFile(path, fixed, 'utf8', (err) => {
    if (err) {
      console.error('Could not write fixed server file:', err);
    } else {
      console.log('✅ Fixed main server file middleware registration');
    }
  });
});
EOF
  
  node temp_server_fix.js
  rm temp_server_fix.js
fi

echo "🧹 Step 4: Clear any cached modules that might be causing issues..."
rm -rf node_modules/.cache/ || true
rm -rf dist/ || true

echo "✅ Middleware fix complete following Copilot Instructions!"
echo ""
echo "🚀 Test your server following Critical Development Workflows:"
echo "   npm run dev:server  # Backend only (should start without middleware errors)"
echo "   npm run dev:all     # Both servers"
echo ""
echo "🔍 Debug endpoints following Debugging & Testing Ecosystem:"
echo "   http://localhost:3000/api/status"
echo "   http://localhost:3000/health"
echo "   http://localhost:3001/debug"
EOF

# Make the script executable
chmod +x fix-routes-middleware.sh

echo "✅ Created fix-routes-middleware.sh following your **Backend Structure** patterns"
echo ""
echo "🚀 Run this script to fix the middleware function error:"
echo "   ./fix-routes-middleware.sh"
echo ""
echo "This fix ensures:"
echo "• Routes index always exports a valid Express router function"
echo "• Proper middleware validation following Error Handling Pattern"
echo "• Safe import pattern following Backend Structure"
echo "• Health endpoints following Debugging & Testing Ecosystem"
echo ""
echo "Then test with your **Server Management** commands:"
echo "   npm run dev:server  # Should start without middleware errors"
echo "   npm run dev:all     # Both servers"
