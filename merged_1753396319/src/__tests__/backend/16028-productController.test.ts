import request from 'supertest';
import app from '../test-app-setup';
import Product from '../../models/Product';
import mongoose from 'mongoose';

describe('Product Controller', () => {
  // Sample product data with all required fields following copilot patterns
  const sampleProduct = {
    name: 'Test Product',
    description: 'A great test product',
    price: 29.99,
    cost: 15.99,
    sku: 'TEST-001',
    category: 'electronics',
    images: ['https://example.com/image1.jpg'],
    vendorId: new mongoose.Types.ObjectId(),
    inventory: {
      quantity: 100,
      lowStock: 10,
      inStock: true
    },
    seo: {
      title: 'Test Product - Buy Now',
      description: 'Best test product for testing purposes',
      keywords: ['test', 'product', 'electronics']
    },
    isActive: true,
    discountPercent: 0
  };

  describe('GET /api/products', () => {
    it('should return products with pagination', async () => {
      // Create test product first
      await Product.create(sampleProduct);

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toBeDefined();
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
      const product = await Product.create(sampleProduct);

      const response = await request(app)
        .get(`/api/products/${product._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(sampleProduct.name);
      expect(response.body.data.discountedPrice).toBeDefined();
    });
  });

  describe('POST /api/products', () => {
    it('should create product with proper validation', async () => {
      const productData = {
        ...sampleProduct,
        sku: 'TEST-002'  // Different SKU to avoid duplicate key error
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
      await Product.create(sampleProduct);

      const response = await request(app)
        .get('/api/products?search=Test')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
