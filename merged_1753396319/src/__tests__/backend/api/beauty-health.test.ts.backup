import request from 'supertest';
import app from '../../../index';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Beauty & Health Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/beauty-health', () => {
    it('should return beauty and health products', async () => {
      const response = await request(app)
        .get('/api/products/category/beauty-health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by skin type', async () => {
      const response = await request(app)
        .get('/api/products/category/beauty-health?skinType=sensitive')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(['sensitive', 'all-skin-types']).toContain(product.skinType);
      });
    });

    it('should filter by product type', async () => {
      const response = await request(app)
        .get('/api/products/category/beauty-health?type=skincare')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.productType).toBe('skincare');
      });
    });

    it('should check for FDA compliance', async () => {
      const response = await request(app)
        .get('/api/products/category/beauty-health?fdaCompliant=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.fdaCompliant).toBe(true);
      });
    });
  });

  describe('Beauty & Health Dropshipping', () => {
    it('should handle temperature-sensitive beauty products', async () => {
      const orderData = {
        items: [
          {
            productId: 'skincare-serum-123',
            quantity: 3,
            price: 49.99,
            variantId: 'size-30ml'
          }
        ],
        shippingAddress: {
          firstName: 'Beauty',
          lastName: 'Enthusiast',
          address1: '321 Glow Street',
          city: 'Miami',
          state: 'FL',
          postalCode: '33101',
          country: 'US'
        },
        customerEmail: 'beauty@example.com',
        orderNotes: 'Temperature sensitive - please use cold storage'
      };

      const mockBeautyProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'beauty-order-321',
          trackingNumber: 'BEAUTY-TRACK-456',
          specialHandling: 'temperature-controlled'
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('beauty-supplier', mockBeautyProvider);

      const result = await dropshippingService.createOrder(orderData, 'beauty-supplier');
      expect(result.success).toBe(true);
      expect(mockBeautyProvider.createOrder).toHaveBeenCalledWith(orderData);
    });

    it('should validate product ingredients', async () => {
      const response = await request(app)
        .get('/api/products/beauty-health-001/ingredients')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.ingredients).toBeDefined();
      expect(response.body.allergens).toBeDefined();
    });
  });

  describe('Beauty & Health Recommendations', () => {
    it('should get personalized beauty recommendations', async () => {
      const response = await request(app)
        .post('/api/products/category/beauty-health/recommendations')
        .send({
          skinType: 'oily',
          concerns: ['acne', 'large-pores'],
          ageRange: '25-30'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.recommendations).toBeDefined();
    });
  });
});
