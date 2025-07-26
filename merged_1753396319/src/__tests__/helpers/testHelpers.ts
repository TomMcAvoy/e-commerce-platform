import mongoose from 'mongoose';

/**
 * Test helper functions following e-commerce platform patterns
 */

export const createTestUser = (overrides = {}) => ({
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User',
  ...overrides
});

export const createTestVendor = (overrides = {}) => ({
  name: 'Test Vendor',
  email: 'vendor@example.com',
  description: 'Test vendor description',
  verified: true,
  ...overrides
});

export const createTestProduct = (overrides = {}) => ({
  name: 'Test Product',
  description: 'Test product description',
  price: 19.99,
  category: 'electronics',
  vendor: 'test-vendor-id',
  stock: 100,
  images: ['test-image.jpg'],
  ...overrides
});

export const cleanupDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(collections.map(collection => collection.deleteMany({})));
  }
};

export const waitForDatabase = async (timeout = 10000) => {
  const start = Date.now();
  while (mongoose.connection.readyState !== 1) {
    if (Date.now() - start > timeout) {
      throw new Error('Database connection timeout');
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};
