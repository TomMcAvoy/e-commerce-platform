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
if (safeRequire('./newsRoutes', '/news')) loadedRoutesCount++;
if (safeRequire('./countryFeaturesRoutes', '/countries')) loadedRoutesCount++;
if (safeRequire('./dsers', '/dsers')) loadedRoutesCount++;
if (safeRequire('./shopify', '/shopify')) loadedRoutesCount++;
if (safeRequire('./socialRoutes', '/social')) loadedRoutesCount++;

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
      'GET /api/dropshipping/status',
      'GET /api/news',
      'GET /api/news/feed',
      'GET /api/news/countries',
      'GET /api/countries/countries',
      'GET /api/countries/:country/products',
      'GET /api/countries/:country/vacation',
      'GET /api/social/posts',
      'POST /api/social/posts',
      'POST /api/social/posts/:id/like',
      'POST /api/social/posts/:id/report',
      'GET /api/social/notifications'
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
