import app from '../__tests__/test-app-setup';
import request from 'supertest';
import app from '../index'; // Default import following copilot patterns
import Product from '../models/Product'; // Default import for Mongoose models

describe('Product Controller', () => {
  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/products', () => {
    it('should return products with pagination', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should support query parameters', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=10&category=electronics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return single product with virtual fields', async () => {
      const product = await Product.create({
        name: 'Test Product',
        price: 29.99,
        category: 'electronics',
        vendor: 'test-vendor',
        description: 'Test description',
        stock: 100,
        images: ['test-image.jpg']
      });

      const response = await request(app)
        .get(`/api/products/${product._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Product');
    });
  });

  describe('POST /api/products', () => {
    it('should create product with proper validation', async () => {
      const productData = {
        name: 'New Product',
        price: 49.99,
        category: 'electronics',
        vendor: 'test-vendor',
        description: 'New product description',
        stock: 50
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(productData.name);
    });
  });

  describe('Product Search & Filter', () => {
    it('should search products by name', async () => {
      await Product.create({
        name: 'iPhone 15',
        price: 999.99,
        category: 'electronics',
        vendor: 'apple',
        description: 'Latest iPhone',
        stock: 10
      });

      const response = await request(app)
        .get('/api/products?search=iPhone')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});
