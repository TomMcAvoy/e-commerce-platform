#!/bin/bash
# filepath: setup-jest-testing.sh
# Jest Testing Setup - Following copilot-instructions.md patterns

set -e

echo "🧪 Jest Testing Framework Setup - E-Commerce Platform"
echo "====================================================="
echo "Following copilot-instructions.md architecture:"
echo "Backend API: http://localhost:3000"
echo "Frontend: http://localhost:3001 (Next.js 15 + React 19)"
echo "API Base: http://localhost:3000/api"
echo ""

# Fix 1: Install Jest dependencies compatible with React 19
echo "📦 Installing Jest dependencies compatible with React 19..."
echo ""

# Backend Jest dependencies (root level)
echo "🔧 Installing backend Jest dependencies..."
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest

# Frontend Jest dependencies (compatible with React 19)
echo "🔧 Installing frontend Jest dependencies (React 19 compatible)..."
cd frontend
npm install --save-dev jest @types/jest ts-jest next-router-mock
npm install --save-dev @testing-library/react@^16.0.0 @testing-library/jest-dom@^6.0.0
npm install --save-dev @testing-library/user-event@^14.0.0 jest-environment-jsdom
cd ..

# Fix 2: Create comprehensive Jest configuration following copilot patterns
echo "⚙️ Creating Jest configurations..."

# Root level Jest config for backend tests
cat > jest.config.js << 'EOF'
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,js}',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testTimeout: 30000,
  verbose: true
};
EOF

# Frontend Jest config
cat > frontend/jest.config.js << 'EOF'
const nextJest = require('next/jest')

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '<rootDir>/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
  testTimeout: 15000,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config)
EOF

# Frontend Jest setup file
cat > frontend/jest.setup.js << 'EOF'
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => require('next-router-mock'))

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api'

// Setup fetch mock for API calls
global.fetch = jest.fn()

beforeEach(() => {
  fetch.mockClear()
})
EOF

# Fix 3: Create backend test setup following copilot auth patterns
echo "🔧 Creating backend test setup..."
cat > src/test-setup.ts << 'EOF'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer

// Setup in-memory MongoDB for testing following copilot database patterns
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

// Clear database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

// Mock JWT secret for testing
process.env.JWT_SECRET = 'test-jwt-secret-key'
process.env.NODE_ENV = 'test'
EOF

# Fix 4: Create comprehensive test examples following copilot patterns
echo "📝 Creating test examples..."

# Backend auth controller test following copilot auth patterns
mkdir -p src/__tests__/controllers
cat > src/__tests__/controllers/auth.test.ts << 'EOF'
import request from 'supertest'
import app from '../../index'
import User from '../../models/User'

describe('Auth Controller - Following Copilot Patterns', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with sendTokenResponse pattern', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data.user).toHaveProperty('email', userData.email)
    })

    it('should throw AppError for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      // Create first user
      await User.create(userData)

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('email')
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user following copilot User model patterns
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      await user.save()
    })

    it('should login user with JWT token', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('token')
    })

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})
EOF

# Frontend component test following copilot patterns
mkdir -p frontend/__tests__/components
cat > frontend/__tests__/components/CartProvider.test.tsx << 'EOF'
import { render, screen, act } from '@testing-library/react'
import { CartProvider, useCart } from '../../app/providers/CartProvider'
import { ReactNode } from 'react'

// Test component to access cart context
const TestComponent = () => {
  const { items, addToCart, removeFromCart, total } = useCart()
  
  return (
    <div>
      <div data-testid="cart-count">{items.length}</div>
      <div data-testid="cart-total">${total}</div>
      <button 
        onClick={() => addToCart({
          id: '1',
          name: 'Test Product',
          price: 29.99,
          quantity: 1
        })}
        data-testid="add-item"
      >
        Add Item
      </button>
      <button 
        onClick={() => removeFromCart('1')}
        data-testid="remove-item"
      >
        Remove Item
      </button>
    </div>
  )
}

const renderWithCartProvider = (children: ReactNode) => {
  return render(
    <CartProvider>
      {children}
    </CartProvider>
  )
}

describe('CartProvider - Following Copilot Context Patterns', () => {
  it('should initialize with empty cart', () => {
    renderWithCartProvider(<TestComponent />)
    
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$0')
  })

  it('should add items to cart', () => {
    renderWithCartProvider(<TestComponent />)
    
    act(() => {
      screen.getByTestId('add-item').click()
    })

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$29.99')
  })

  it('should remove items from cart', () => {
    renderWithCartProvider(<TestComponent />)
    
    // Add item first
    act(() => {
      screen.getByTestId('add-item').click()
    })

    // Then remove it
    act(() => {
      screen.getByTestId('remove-item').click()
    })

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$0')
  })
})
EOF

# API integration test following copilot patterns
mkdir -p frontend/__tests__/lib
cat > frontend/__tests__/lib/api.test.ts << 'EOF'
import { api } from '../../lib/api'

// Mock fetch for API testing
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('API Integration - Following Copilot API Patterns', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('Products API', () => {
    it('should fetch products from backend API', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 29.99 },
        { id: '2', name: 'Product 2', price: 39.99 }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockProducts })
      })

      const result = await api.products.getAll()

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/products',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result).toEqual(mockProducts)
    })

    it('should handle API errors properly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ success: false, message: 'Products not found' })
      })

      await expect(api.products.getAll()).rejects.toThrow('Products not found')
    })
  })

  describe('Auth API', () => {
    it('should login user and return token', async () => {
      const mockResponse = {
        success: true,
        data: {
          token: 'jwt-token',
          user: { id: '1', email: 'test@example.com' }
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await api.auth.login('test@example.com', 'password')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password' })
        })
      )
      expect(result).toEqual(mockResponse.data)
    })
  })
})
EOF

# Fix 5: Create integration test following copilot health check patterns
mkdir -p src/__tests__/integration
cat > src/__tests__/integration/health.test.ts << 'EOF'
import request from 'supertest'
import app from '../../index'

describe('Health Endpoints - Following Copilot Debug Patterns', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        success: true,
        message: 'E-Commerce Platform API is healthy',
        timestamp: expect.any(String),
        environment: 'test',
        version: expect.any(String)
      })
    })
  })

  describe('GET /api/status', () => {
    it('should return API status with endpoint mapping', async () => {
      const response = await request(app).get('/api/status')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        success: true,
        authenticated: false,
        timestamp: expect.any(String),
        endpoints: expect.objectContaining({
          auth: '/api/auth',
          products: '/api/products',
          users: '/api/users',
          vendors: '/api/vendors',
          orders: '/api/orders',
          cart: '/api/cart',
          categories: '/api/categories',
          dropshipping: '/api/dropshipping',
          networking: '/api/networking'
        })
      })
    })
  })
})
EOF

# Fix 6: Install additional backend testing dependencies
echo "📦 Installing additional backend testing dependencies..."
npm install --save-dev mongodb-memory-server

# Fix 7: Update package.json scripts following copilot testing patterns
echo "📝 Updating package.json scripts..."
npm pkg set scripts.test="jest"
npm pkg set scripts.test:watch="jest --watch"
npm pkg set scripts.test:coverage="jest --coverage"
npm pkg set scripts.test:backend="jest --testPathPattern=src/"
npm pkg set scripts.test:frontend="cd frontend && npm test"
npm pkg set scripts.test:all="npm run test:backend && npm run test:frontend"

# Update frontend package.json
cd frontend
npm pkg set scripts.test="jest"
npm pkg set scripts.test:watch="jest --watch"
npm pkg set scripts.test:coverage="jest --coverage"
cd ..

echo ""
echo "✅ Jest Testing Framework Setup Complete!"
echo "========================================"
echo ""
echo "�� Test Commands Available:"
echo "  npm test                 # Run all backend tests"
echo "  npm run test:watch       # Watch mode for backend"
echo "  npm run test:coverage    # Backend with coverage"
echo "  npm run test:frontend    # Frontend tests only"
echo "  npm run test:all         # Both backend and frontend"
echo ""
echo "📂 Test Structure:"
echo "  src/__tests__/           # Backend unit & integration tests"
echo "  frontend/__tests__/      # Frontend component & API tests"
echo ""
echo "🔧 Features Configured:"
echo "  ✓ React 19 compatible testing libraries"
echo "  ✓ In-memory MongoDB for backend tests"
echo "  ✓ Next.js testing setup with router mocking"
echo "  ✓ API integration testing patterns"
echo "  ✓ Coverage reporting"
echo "  ✓ TypeScript support"
echo ""
echo "🚀 Following Copilot Patterns:"
echo "  ✓ sendTokenResponse() auth pattern testing"
echo "  ✓ AppError class error handling tests"
echo "  ✓ CartProvider context pattern testing"
echo "  ✓ Health endpoint testing (debug ecosystem)"
echo "  ✓ Cross-service API communication testing"
echo ""
echo "▶️  Run 'npm test' to start testing!"
