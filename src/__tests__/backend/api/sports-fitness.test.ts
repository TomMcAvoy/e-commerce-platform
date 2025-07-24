import request from 'supertest';
import app from '../../../index';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Sports & Fitness Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/sports-fitness', () => {
    it('should return sports and fitness products', async () => {
      const response = await request(app)
        .get('/api/products/category/sports-fitness')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by sport type', async () => {
      const response = await request(app)
        .get('/api/products/category/sports-fitness?sport=basketball')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(['basketball', 'general-fitness']).toContain(product.sport);
      });
    });

    it('should filter by fitness level', async () => {
      const response = await request(app)
        .get('/api/products/category/sports-fitness?level=beginner')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(['beginner', 'all-levels']).toContain(product.fitnessLevel);
      });
    });
  });

  describe('Sports Equipment Dropshipping', () => {
    it('should handle sports equipment orders', async () => {
      const orderData = {
        items: [
          {
            productId: 'basketball-shoes-123',
            quantity: 1,
            price: 129.99,
            variantId: 'size-10-color-black'
          }
        ],
        shippingAddress: {
          firstName: 'Sports',
          lastName: 'Player',
          address1: '555 Athletic Drive',
          city: 'Portland',
          state: 'OR',
          postalCode: '97201',
          country: 'US'
        },
        customerEmail: 'athlete@example.com'
      };

      const mockSportsProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'sports-order-555',
          trackingNumber: 'SPORTS-TRACK-789'
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('sports-supplier', mockSportsProvider);

      const result = await dropshippingService.createOrder(orderData, 'sports-supplier');
      expect(result.success).toBe(true);
      expect(result.orderId).toBe('sports-order-555');
    });
  });
});
