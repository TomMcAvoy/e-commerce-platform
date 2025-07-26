#!/bin/bash
# filepath: scripts/fix-test-infrastructure.sh

set -e

echo "🔧 Fixing Jest Test Infrastructure for E-Commerce Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to create backup
backup_file() {
    if [ -f "$1" ]; then
        cp "$1" "$1.backup.$(date +%Y%m%d_%H%M%S)"
        echo -e "${YELLOW}📁 Backed up: $1${NC}"
    fi
}

# Function to write file with content
write_file() {
    local filepath="$1"
    local content="$2"
    
    # Create directory if it doesn't exist
    mkdir -p "$(dirname "$filepath")"
    
    # Backup existing file
    backup_file "$filepath"
    
    # Write new content
    echo "$content" > "$filepath"
    echo -e "${GREEN}✅ Created/Updated: $filepath${NC}"
}

echo "🚀 Starting test infrastructure fixes..."

# 1. Fix jest.env.setup.ts
echo "📝 Creating Jest environment setup..."
write_file "jest.env.setup.ts" "// Environment setup that runs before jest.setup.ts

// Prevent any real server startup
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Prevent port binding
process.env.SKIP_SERVER_START = 'true';

// Set test-specific MongoDB URI (will be overridden by MongoMemoryServer)
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-placeholder';

// Mock other environment variables following project patterns
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.JWT_EXPIRE = '30d';
process.env.BCRYPT_ROUNDS = '1'; // Faster for tests

// API configuration for testing
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';

console.log('🧪 Jest environment variables configured for testing');
"

# 2. Update jest.config.ts
echo "📝 Updating Jest configuration..."
write_file "jest.config.ts" "import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|js)',
    '**/*.(test|spec).+(ts|js)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/uploads/',
    '\\\\.d\\\\.ts$',
    // Ignore empty test files to prevent \"must contain at least one test\" errors
    'src/__tests__/setup.ts',
    'src/__tests__/helpers/',
    'src/types/index.test.ts'
  ],
  transform: {
    '^.+\\\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testTimeout: 30000,
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  setupFiles: ['<rootDir>/jest.env.setup.ts'],
  // ✅ FIXED: Correct Jest configuration option
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  detectOpenHandles: true,
  forceExit: true,
  silent: false,
};

export default config;
"

# 3. Update src/index.ts with proper server management
echo "📝 Updating main server file..."
write_file "src/index.ts" "import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import { Server } from 'http';

// Load environment variables
dotenv.config();

const app: Express = express();

// ✅ Prevent server startup in test environment following project patterns
if (process.env.NODE_ENV !== 'test' && process.env.SKIP_SERVER_START !== 'true') {
  connectDB();
}

// CORS configuration for development workflow
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3001', // Frontend development server
  credentials: true
}));

// Security middleware
app.use(helmet());

// Rate limiting with test-friendly settings
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 100, // Higher limit for tests
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes following project structure
app.use('/api', routes);

// Health check endpoint for debugging dashboard
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 3000
  });
});

// API status endpoint for testing
app.get('/api/status', (req: Request, res: Response) => {
  res.status(200).json({
    api: 'E-Commerce Platform API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV
  });
});

// Error handling middleware using project's AppError pattern
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// ✅ Properly typed server instance for development workflow
let server: Server | undefined;

if (process.env.NODE_ENV !== 'test' && process.env.SKIP_SERVER_START !== 'true') {
  server = app.listen(PORT, () => {
    console.log(\`🚀 Server running on port \${PORT} in \${process.env.NODE_ENV} mode\`);
    console.log(\`📊 Debug Dashboard: http://localhost:3001/debug\`);
    console.log(\`🏥 Health Check: http://localhost:\${PORT}/health\`);
  });
}

// ✅ Helper function for safe address access in tests
export const getServerAddress = () => {
  if (!server) {
    // Return mock address for test environment
    return { port: PORT, address: '127.0.0.1' };
  }
  
  const address = server.address();
  if (!address) {
    throw new Error('Server not bound to any address');
  }
  
  return typeof address === 'string' 
    ? { address, port: null }
    : address;
};

// Export for testing and external use
export { app, server };
"

# 4. Update dropshippingController.ts with lazy loading
echo "📝 Fixing DropshippingController with lazy loading..."
write_file "src/controllers/dropshippingController.ts" "import { Request, Response } from 'express';
import { DropshippingService } from '../services/dropshipping/DropshippingService';
import { AppError } from '../middleware/errorHandler';

// ✅ Use lazy loading instead of immediate instantiation to prevent test issues
const getDropshippingService = () => {
  return DropshippingService.getInstance();
};

interface AuthRequest extends Request {
  user?: any;
}

export const createDropshipOrder = async (req: AuthRequest, res: Response) => {
  try {
    const dropshippingService = getDropshippingService(); // ✅ Get instance when needed
    const { orderData, provider } = req.body;
    
    const result = await dropshippingService.createOrder(orderData, provider);
    
    if (result.success) {
      res.status(201).json({
        success: true,
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to create dropship order'
      });
    }
  } catch (error) {
    throw new AppError('Error creating dropship order', 500);
  }
};

export const getDropshipProducts = async (req: Request, res: Response) => {
  try {
    const dropshippingService = getDropshippingService();
    const { provider } = req.params;
    const query = req.query;
    
    const products = await dropshippingService.getProductsFromProvider(provider, query);
    
    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    throw new AppError('Error fetching dropship products', 500);
  }
};

export const getProviderHealth = async (req: Request, res: Response) => {
  try {
    const dropshippingService = getDropshippingService();
    const health = await dropshippingService.getProviderHealth();
    
    res.status(200).json({
      success: true,
      data: health
    });
  } catch (error) {
    throw new AppError('Error checking provider health', 500);
  }
};

export const getAllProviders = async (req: Request, res: Response) => {
  try {
    const dropshippingService = getDropshippingService();
    const providers = dropshippingService.getEnabledProviders();
    
    res.status(200).json({
      success: true,
      data: providers
    });
  } catch (error) {
    throw new AppError('Error fetching providers', 500);
  }
};

export const getProviderStatus = async (req: Request, res: Response) => {
  try {
    const dropshippingService = getDropshippingService();
    const status = dropshippingService.getProviderStatus();
    
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    throw new AppError('Error fetching provider status', 500);
  }
};
"

# 5. Create a comprehensive test helper utility
echo "📝 Creating test utilities..."
write_file "src/__tests__/helpers/testUtils.ts" "import request from 'supertest';
import { app, getServerAddress } from '../../index';
import mongoose from 'mongoose';

/**
 * Test utilities following e-commerce platform patterns
 */
export class TestUtils {
  /**
   * Get server address safely for tests
   */
  static getServerAddress() {
    return getServerAddress();
  }

  /**
   * Create authenticated request for protected endpoints
   */
  static async createAuthenticatedRequest() {
    // Mock JWT token for testing
    const token = 'mock-jwt-token';
    return {
      token,
      headers: { Authorization: \`Bearer \${token}\` }
    };
  }

  /**
   * Clear all database collections for clean tests
   */
  static async clearDatabase() {
    if (mongoose.connection.readyState === 1) {
      const collections = await mongoose.connection.db.collections();
      await Promise.all(collections.map(collection => collection.deleteMany({})));
    }
  }

  /**
   * Create test product data
   */
  static createTestProduct(overrides = {}) {
    return {
      name: 'Test Product',
      description: 'Test product description',
      price: 19.99,
      category: 'electronics',
      vendor: 'test-vendor',
      stock: 100,
      images: ['test-image.jpg'],
      ...overrides
    };
  }

  /**
   * Create test user data
   */
  static createTestUser(overrides = {}) {
    return {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      ...overrides
    };
  }

  /**
   * Create test order data
   */
  static createTestOrder(overrides = {}) {
    return {
      items: [
        {
          productId: 'test-product-id',
          quantity: 1,
          price: 19.99
        }
      ],
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Test St',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'US'
      },
      ...overrides
    };
  }

  /**
   * Make API request with proper error handling
   */
  static async makeRequest(method: string, endpoint: string, data?: any, headers?: any) {
    const req = request(app)[method.toLowerCase()](endpoint);
    
    if (headers) {
      Object.keys(headers).forEach(key => {
        req.set(key, headers[key]);
      });
    }
    
    if (data) {
      req.send(data);
    }
    
    return req;
  }

  /**
   * Wait for database connection
   */
  static async waitForDatabase(timeout = 10000) {
    const start = Date.now();
    while (mongoose.connection.readyState !== 1) {
      if (Date.now() - start > timeout) {
        throw new Error('Database connection timeout');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

/**
 * Common test assertions
 */
export const assertApiResponse = {
  success: (response: any) => {
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  },
  
  error: (response: any, expectedStatus = 400) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBeDefined();
  },
  
  authRequired: (response: any) => {
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/token|auth/i);
  }
};
"

# 6. Create example test file showing patterns
echo "📝 Creating example test file..."
write_file "src/__tests__/example-patterns.test.ts" "import request from 'supertest';
import { app } from '../index';
import { TestUtils, assertApiResponse } from './helpers/testUtils';

/**
 * Example test patterns for e-commerce platform
 * Demonstrates proper testing practices following project conventions
 */
describe('E-Commerce Platform Test Patterns', () => {
  beforeEach(async () => {
    await TestUtils.clearDatabase();
  });

  describe('API Health Checks', () => {
    it('should respond to health endpoint', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.environment).toBe('test');
    });

    it('should respond to API status endpoint', async () => {
      const response = await request(app)
        .get('/api/status')
        .expect(200);

      expect(response.body.api).toBe('E-Commerce Platform API');
      expect(response.body.status).toBe('running');
    });
  });

  describe('Authentication Patterns', () => {
    it('should handle protected routes without token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      assertApiResponse.authRequired(response);
    });

    it('should handle authentication with mock token', async () => {
      const { headers } = await TestUtils.createAuthenticatedRequest();
      
      const response = await TestUtils.makeRequest(
        'GET',
        '/api/users/profile',
        null,
        headers
      );

      // This will work with proper auth controller mocking
      expect(response.status).toBe(200);
    });
  });

  describe('Dropshipping Service Integration', () => {
    it('should get provider health status', async () => {
      const response = await request(app)
        .get('/api/dropshipping/providers/health')
        .expect(200);

      assertApiResponse.success(response);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should create dropship order with valid data', async () => {
      const orderData = TestUtils.createTestOrder();
      
      const response = await request(app)
        .post('/api/dropshipping/orders')
        .send({ orderData, provider: 'test-provider' })
        .expect(201);

      assertApiResponse.success(response);
      expect(response.body.data.orderId).toBe('test-order-123');
    });
  });

  describe('Error Handling Patterns', () => {
    it('should handle invalid API endpoints', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Content-Type', 'application/json')
        .send('invalid-json')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('CORS and Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Helmet.js security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('should handle CORS for frontend origin', async () => {
      const response = await request(app)
        .options('/api/status')
        .set('Origin', 'http://localhost:3001')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3001');
    });
  });
});
"

# 7. Update package.json scripts for testing workflow
echo "📝 Updating package.json test scripts..."

# Read current package.json and add/update test scripts
if [ -f "package.json" ]; then
    backup_file "package.json"
    
    # Use jq to update scripts if available, otherwise manual update
    if command -v jq &> /dev/null; then
        jq '.scripts += {
            "test": "jest --detectOpenHandles --forceExit",
            "test:watch": "jest --watch --detectOpenHandles",
            "test:coverage": "jest --coverage --detectOpenHandles --forceExit",
            "test:api": "jest --testPathPattern=api --detectOpenHandles --forceExit",
            "test:unit": "jest --testPathPattern=unit --detectOpenHandles --forceExit",
            "test:integration": "jest --testPathPattern=integration --detectOpenHandles --forceExit",
            "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand --detectOpenHandles",
            "test:clear": "jest --clearCache"
        }' package.json > package.json.tmp && mv package.json.tmp package.json
        
        echo -e "${GREEN}✅ Updated package.json scripts with jq${NC}"
    else
        echo -e "${YELLOW}⚠️  jq not found. Please manually add test scripts to package.json${NC}"
        echo "Add these scripts to your package.json:"
        echo '{
    "test": "jest --detectOpenHandles --forceExit",
    "test:watch": "jest --watch --detectOpenHandles",
    "test:coverage": "jest --coverage --detectOpenHandles --forceExit",
    "test:api": "jest --testPathPattern=api --detectOpenHandles --forceExit",
    "test:unit": "jest --testPathPattern=unit --detectOpenHandles --forceExit",
    "test:integration": "jest --testPathPattern=integration --detectOpenHandles --forceExit",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand --detectOpenHandles",
    "test:clear": "jest --clearCache"
}'
    fi
fi

# 8. Create .gitignore entries for test artifacts
echo "📝 Updating .gitignore for test artifacts..."
if [ -f ".gitignore" ]; then
    backup_file ".gitignore"
    
    # Add test-related entries if they don't exist
    grep -q "# Test artifacts" .gitignore || cat >> .gitignore << 'EOF'

# Test artifacts
coverage/
*.test.js
*.spec.js
junit.xml
test-results/
*.backup.*

# Jest cache
.jest/

# Test databases
test-db/
*-test.db
EOF
    echo -e "${GREEN}✅ Updated .gitignore${NC}"
fi

# 9. Install missing dependencies
echo "📦 Checking and installing test dependencies..."

# Check if package.json exists and install missing deps
if [ -f "package.json" ]; then
    # List of required test dependencies
    DEPS_TO_CHECK=(
        "@types/jest"
        "@types/supertest"
        "jest"
        "jest-environment-node"
        "mongodb-memory-server"
        "supertest"
        "ts-jest"
    )
    
    for dep in "${DEPS_TO_CHECK[@]}"; do
        if ! npm list "$dep" &> /dev/null; then
            echo "📦 Installing missing dependency: $dep"
            npm install --save-dev "$dep"
        fi
    done
    
    echo -e "${GREEN}✅ All test dependencies checked${NC}"
fi

# 10. Create test execution script
echo "📝 Creating test execution helper..."
write_file "scripts/run-tests.sh" "#!/bin/bash
# Test execution helper for e-commerce platform

set -e

echo \"🧪 E-Commerce Platform Test Runner\"

# Function to run tests with proper cleanup
run_tests() {
    local test_type=\"\$1\"
    local test_pattern=\"\$2\"
    
    echo \"🏃 Running \$test_type tests...\"
    
    # Set test environment
    export NODE_ENV=test
    export SKIP_SERVER_START=true
    
    # Clear Jest cache
    npx jest --clearCache
    
    # Run tests based on pattern
    if [ -n \"\$test_pattern\" ]; then
        npx jest \$test_pattern --detectOpenHandles --forceExit --verbose
    else
        npx jest --detectOpenHandles --forceExit --verbose
    fi
}

# Parse command line arguments
case \"\$1\" in
    \"api\")
        run_tests \"API\" \"--testPathPattern=api\"
        ;;
    \"unit\")
        run_tests \"Unit\" \"--testPathPattern=unit\"
        ;;
    \"integration\")
        run_tests \"Integration\" \"--testPathPattern=integration\"
        ;;
    \"coverage\")
        echo \"📊 Running tests with coverage...\"
        export NODE_ENV=test
        export SKIP_SERVER_START=true
        npx jest --coverage --detectOpenHandles --forceExit
        ;;
    \"watch\")
        echo \"👀 Running tests in watch mode...\"
        export NODE_ENV=test
        export SKIP_SERVER_START=true
        npx jest --watch --detectOpenHandles
        ;;
    \"debug\")
        echo \"🐛 Running tests in debug mode...\"
        export NODE_ENV=test
        export SKIP_SERVER_START=true
        node --inspect-brk node_modules/.bin/jest --runInBand --detectOpenHandles
        ;;
    \"clean\")
        echo \"🧹 Cleaning test artifacts...\"
        rm -rf coverage/
        rm -rf node_modules/.cache/jest/
        npx jest --clearCache
        echo \"✅ Test artifacts cleaned\"
        ;;
    *)
        echo \"Usage: \$0 {api|unit|integration|coverage|watch|debug|clean}\"
        echo \"\"
        echo \"Examples:\"
        echo \"  \$0 api        # Run API tests only\"
        echo \"  \$0 unit       # Run unit tests only\"
        echo \"  \$0 coverage   # Run all tests with coverage\"
        echo \"  \$0 watch      # Run tests in watch mode\"
        echo \"  \$0 debug      # Run tests in debug mode\"
        echo \"  \$0 clean      # Clean test artifacts\"
        exit 1
        ;;
esac

echo \"✅ Test execution completed!\"
"

# Make test script executable
chmod +x "scripts/run-tests.sh"

# 11. Create VS Code settings for testing
echo "📝 Creating VS Code test settings..."
mkdir -p ".vscode"
write_file ".vscode/settings.json" '{
  "jest.jestCommandLine": "npm test --",
  "jest.autoRun": "off",
  "jest.showCoverageOnLoad": false,
  "jest.debugMode": true,
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/coverage": true,
    "**/*.backup.*": true,
    "**/node_modules": true
  },
  "search.exclude": {
    "**/coverage": true,
    "**/*.backup.*": true
  }
}'

# 12. Final verification and summary
echo ""
echo "🎉 Test Infrastructure Fix Complete!"
echo ""
echo -e "${GREEN}✅ Files Created/Updated:${NC}"
echo "   📄 jest.env.setup.ts - Environment setup"
echo "   📄 jest.config.ts - Jest configuration"
echo "   📄 src/index.ts - Server with test support"
echo "   📄 src/controllers/dropshippingController.ts - Lazy loading fix"
echo "   📄 src/__tests__/helpers/testUtils.ts - Test utilities"
echo "   📄 src/__tests__/example-patterns.test.ts - Test examples"
echo "   📄 scripts/run-tests.sh - Test runner script"
echo "   📄 .vscode/settings.json - VS Code configuration"
echo "   📄 .gitignore - Test artifacts exclusion"
echo ""
echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "1. Run: npm install (to ensure all dependencies)"
echo "2. Run: npm test (to test the fixes)"
echo "3. Run: npm run test:api (for API tests only)"
echo "4. Run: ./scripts/run-tests.sh coverage (for coverage report)"
echo ""
echo -e "${GREEN}🔧 Quick Commands:${NC}"
echo "   npm test                    # Run all tests"
echo "   npm run test:watch          # Watch mode"
echo "   ./scripts/run-tests.sh api  # API tests only"
echo "   npm run dev:all             # Start both servers"
echo ""
echo -e "${YELLOW}📊 Debug Dashboard: http://localhost:3001/debug${NC}"
echo -e "${YELLOW}🏥 Health Check: http://localhost:3000/health${NC}"
echo ""
echo "All fixes follow your e-commerce platform patterns and development workflow!"
