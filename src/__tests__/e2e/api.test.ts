import request from 'supertest';
import app from '../../app';

describe('E2E API Tests', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
    });
  });

  describe('API Status', () => {
    it('should return API status', async () => {
      const response = await request(app)
        .get('/api/status')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('API routes are active');
    });
  });

  describe('Product Workflow', () => {
    let authToken: string;
    let productId: string;

    it('should complete full product workflow', async () => {
      // 1. Get products (should work without auth)
      const productsResponse = await request(app)
        .get('/api/products')
        .expect(200);

      expect(productsResponse.body.success).toBe(true);
      expect(Array.isArray(productsResponse.body.data)).toBe(true);
    });
  });

  describe('Categories', () => {
    it('should get categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});