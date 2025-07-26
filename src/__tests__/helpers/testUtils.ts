import request from 'supertest';
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
      headers: { Authorization: `Bearer ${token}` }
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

