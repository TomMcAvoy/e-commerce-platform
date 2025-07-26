import request from 'supertest';
import app from '../../test-app-setup';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Home & Garden Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/home-garden', () => {
    it('should return home and garden products', async () => {
      const response = await request(app)
        .get('/api/products/category/home-garden')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by room type', async () => {
      const response = await request(app)
        .get('/api/products/category/home-garden?room=kitchen')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(['kitchen', 'all-rooms']).toContain(product.room);
      });
    });

    it('should filter by material', async () => {
      const response = await request(app)
        .get('/api/products/category/home-garden?material=wood')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.materials.map((m: string) => m.toLowerCase())).toContain('wood');
      });
    });
  });

  describe('Home & Garden Dropshipping', () => {
    it('should handle large furniture dropshipping orders', async () => {
      const orderData = {
        items: [
          {
            productId: 'furniture-sofa-123',
            quantity: 1,
            price: 899.99,
            variantId: 'color-beige-size-large'
          }
        ],
        shippingAddress: {
          firstName: 'Home',
          lastName: 'Owner',
          address1: '789 Comfort Lane',
          city: 'Furniture City',
          state: 'TX',
          postalCode: '75001',
          country: 'US'
        },
        customerEmail: 'homeowner@example.com',
        orderNotes: 'Please schedule delivery for weekend'
      };

      const mockHomeProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'home-order-789',
          trackingNumber: 'HOME-TRACK-123',
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('home-supplier', mockHomeProvider);

      const result = await dropshippingService.createOrder(orderData, 'home-supplier');
      expect(result.success).toBe(true);
      expect(result.estimatedDelivery).toBeDefined();
    });

    it('should calculate shipping costs for heavy items', async () => {
      const response = await request(app)
        .post('/api/shipping/calculate')
        .send({
          items: [
            { id: 'furniture-001', weight: 50, dimensions: { l: 80, w: 40, h: 35 } }
          ],
          destination: { postalCode: '90210', country: 'US' }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.shippingCost).toBeGreaterThan(0);
      expect(response.body.deliveryOptions).toBeDefined();
    });
  });

  describe('Home & Garden Seasonal Products', () => {
    it('should get seasonal gardening products', async () => {
      const response = await request(app)
        .get('/api/products/category/home-garden/seasonal?category=gardening&season=spring')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.subcategory).toBe('gardening');
        expect(product.seasonalAvailability).toContain('spring');
      });
    });
  });
});
