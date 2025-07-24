#!/bin/bash
# filepath: fix-test-database.sh
# Fix Jest MongoDB Connection Issues - Following copilot-instructions.md patterns

set -e

echo "🧪 Fixing Jest Database Connection Issues"
echo "========================================"
echo "Following copilot-instructions.md architecture:"
echo "Backend API: http://localhost:3000"
echo "Frontend: http://localhost:3001"
echo "Testing Infrastructure: MongoDB + Redis"
echo ""

# Fix 1: Update test setup to handle existing connections properly
echo "🔧 Fixing test-setup.ts to handle MongoDB + Redis connections..."

touch src/test-setup.ts
cat > src/test-setup.ts << 'EOF'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer

// Setup in-memory MongoDB for testing following copilot database patterns
beforeAll(async () => {
  // Close any existing connection first to prevent conflicts
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }

  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  
  // Connect to test database
  await mongoose.connect(mongoUri)
}, 30000)

afterAll(async () => {
  // Clean shutdown
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
  
  if (mongoServer) {
    await mongoServer.stop()
  }
}, 30000)

// Clear database between tests following copilot test patterns
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      try {
        await collections[key].deleteMany({})
      } catch (error) {
        // Ignore collection drop errors during testing
      }
    }
  }
})

// Test environment configuration following copilot environment patterns
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-for-copilot-testing'
process.env.MONGODB_URI = 'memory://test'
// Skip Redis in tests unless specifically needed
delete process.env.REDIS_URL
EOF

# Fix 2: Update index.ts to conditionally connect to databases in test mode
echo "🔧 Updating index.ts database connection logic..."

touch src/index.ts
cat > src/index.ts << 'EOF'
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { config } from './utils/config';

// Load environment variables following copilot patterns
dotenv.config();

const app = express();

// Security middleware following copilot security patterns
app.use(helmet());

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration for frontend communication
const corsOptions = {
  origin: config.corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting following copilot security patterns
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Database connections following copilot database patterns
// Only connect if not in test environment (tests manage their own connections)
if (process.env.NODE_ENV !== 'test') {
  // MongoDB connection
  mongoose.connect(config.mongoUri)
    .then(() => console.log('💾 MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

  // Redis connection (if configured)
  if (config.redisUrl) {
    console.log('🔴 Redis configuration detected');
    // Redis client initialization would go here
  }
}

// Health check endpoint following copilot debug patterns
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'E-Commerce Platform API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API status endpoint following copilot debug ecosystem
app.get('/api/status', (req, res) => {
  res.status(200).json({
    success: true,
    authenticated: false,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      users: '/api/users',
      vendors: '/api/vendors',
      orders: '/api/orders',
      cart: '/api/cart',
      categories: '/api/categories',
      dropshipping: '/api/dropshipping',
      networking: '/api/networking'
    }
  });
});

// Routes following copilot API structure
try {
  const authRoutes = require('./routes/auth');
  const productRoutes = require('./routes/products');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
} catch (error) {
  if (process.env.NODE_ENV !== 'test') {
    console.warn('⚠️  Some route files may not exist yet. This is normal during development.');
  }
}

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler following AppError pattern
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log errors only in development (not test environment)
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨', err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
});

const PORT = config.port || 3000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔍 API status: http://localhost:${PORT}/api/status`);
    console.log(`🌐 Frontend: http://localhost:3001`);
    console.log(`🔧 Debug Dashboard: http://localhost:3001/debug`);
  });
}

export default app;
EOF

echo "✅ Database connection fixes applied!"
echo ""
echo "🧪 Test Infrastructure Fixed:"
echo "  ✓ MongoDB in-memory server for isolated testing"
echo "  ✓ Proper connection cleanup between tests"
echo "  ✓ Environment-based database initialization"
echo "  ✓ Redis skipped in test environment"
echo ""
echo "▶️  Run 'npm test' to verify fixes!"
echo ""
echo "🚀 Following Copilot Architecture:"
echo "  ✓ MongoDB + Redis dual database setup"
echo "  ✓ Test environment isolation"
echo "  ✓ Health endpoints for debug ecosystem"
echo "  ✓ Proper error handling with AppError pattern"
