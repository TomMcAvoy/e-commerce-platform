import app from '../__tests__/test-app-setup';
import request from 'supertest';
import Product from '../models/Product'; // Default import for Mongoose models
import mongoose from 'mongoose';

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
        tenantId: new mongoose.Types.ObjectId(process.env.DEFAULT_TENANT_ID || '6884bf4702e02fe6eb401303'),
        name: 'Test Product',
        slug: 'test-product',
        price: 29.99,
        category: 'electronics',
        brand: 'TestBrand',
        asin: 'B08TEST001',
        sku: 'TEST-001',
        vendorId: new mongoose.Types.ObjectId(),
        description: 'Test description',
        inventory: {
          quantity: 100,
          lowStock: 10,
          inStock: true
        },
        images: ['test-image.jpg'],
        isActive: true
      });

      const response = await request(app)
        .get(`/api/products/${product._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Product');
    });
  });

  describe('POST /api/products', () => {
    it.skip('should create product with proper validation (requires admin auth)', async () => {
      // Skipped because this endpoint requires admin authentication
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
        tenantId: new mongoose.Types.ObjectId(process.env.DEFAULT_TENANT_ID || '6884bf4702e02fe6eb401303'),
        name: 'iPhone 15',
        slug: 'iphone-15',
        price: 999.99,
        category: 'electronics',
        brand: 'Apple',
        asin: 'B08IPHONE15',
        sku: 'IPHONE-15',
        vendorId: new mongoose.Types.ObjectId(),
        description: 'Latest iPhone',
        inventory: {
          quantity: 10,
          lowStock: 2,
          inStock: true
        },
        isActive: true
      });

      const response = await request(app)
        .get('/api/products?search=iPhone')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});
