import request from 'supertest';
import app from '../../../index';

describe('Books & Media Category API Tests', () => {
  describe('GET /api/products/category/books-media', () => {
    it('should return books and media products', async () => {
      const response = await request(app)
        .get('/api/products/category/books-media')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by media type', async () => {
      const response = await request(app)
        .get('/api/products/category/books-media?type=ebook')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.mediaType).toBe('ebook');
      });
    });

    it('should filter by genre', async () => {
      const response = await request(app)
        .get('/api/products/category/books-media?genre=fiction')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.genre).toBe('fiction');
      });
    });
  });

  describe('Digital Content Handling', () => {
    it('should handle digital product delivery', async () => {
      const response = await request(app)
        .post('/api/orders/digital-delivery')
        .send({
          orderId: 'digital-order-123',
          productId: 'ebook-001',
          customerEmail: 'reader@example.com'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.downloadLink).toBeDefined();
      expect(response.body.expiresAt).toBeDefined();
    });
  });
});
