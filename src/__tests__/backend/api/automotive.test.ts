import request from 'supertest';
import app from '../../../index';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Automotive Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/automotive', () => {
    it('should return automotive products', async () => {
      const response = await request(app)
        .get('/api/products/category/automotive')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by vehicle make and model', async () => {
      const response = await request(app)
        .get('/api/products/category/automotive?make=Toyota&model=Camry&year=2020')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.compatibility).toContainEqual({
          make: 'Toyota',
          model: 'Camry',
          year: 2020
        });
      });
    });
  });

  describe('Automotive Parts Dropshipping', () => {
    it('should handle automotive parts orders with VIN verification', async () => {
      const orderData = {
        items: [
          {
            productId: 'brake-pads-123',
            quantity: 1,
            price: 89.99,
            variantId: 'front-ceramic'
          }
        ],
        shippingAddress: {
          firstName: 'Car',
          lastName: 'Owner',
          address1: '777 Motor Lane',
          city: 'Detroit',
          state: 'MI',
          postalCode: '48201',
          country: 'US'
        },
        customerEmail: 'carowner@example.com',
        orderNotes: 'VIN: 1HGBH41JXMN109186'
      };

      const mockAutoProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'auto-order-777',
          trackingNumber: 'AUTO-TRACK-123',
          vinVerified: true
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('auto-supplier', mockAutoProvider);

      const result = await dropshippingService.createOrder(orderData, 'auto-supplier');
      expect(result.success).toBe(true);
    });
  });
});
