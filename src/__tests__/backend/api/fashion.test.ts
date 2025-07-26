import request from 'supertest';
import app from '../../test-app-setup';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Fashion Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/fashion', () => {
    it('should return fashion products', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by gender', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion?gender=womens')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(['womens', 'unisex']).toContain(product.gender);
      });
    });

    it('should filter by size', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion?size=M')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.sizes).toContain('M');
      });
    });

    it('should filter by color', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion?color=black')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.colors.map((c: string) => c.toLowerCase())).toContain('black');
      });
    });
  });

  describe('Fashion Dropshipping Integration', () => {
    it('should create fashion dropship order with size variant', async () => {
      const orderData = {
        items: [
          {
            productId: 'fashion-dress-123',
            quantity: 2,
            price: 89.99,
            variantId: 'size-M-color-black'
          }
        ],
        shippingAddress: {
          firstName: 'Fashion',
          lastName: 'Lover',
          address1: '456 Style Avenue',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        },
        customerEmail: 'fashion@example.com'
      };

      const mockFashionProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'fashion-order-456',
          trackingNumber: 'FASHION-TRACK-789'
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('fashion-supplier', mockFashionProvider);

      const result = await dropshippingService.createOrder(orderData, 'fashion-supplier');
      expect(result.success).toBe(true);
      expect(result.orderId).toBe('fashion-order-456');
    });

    it('should handle size and color variants correctly', async () => {
      const mockProduct = {
        id: 'dress-001',
        name: 'Summer Dress',
        price: 79.99,
        category: 'fashion',
        variants: [
          { id: 'var-1', size: 'S', color: 'red', inStock: true },
          { id: 'var-2', size: 'M', color: 'blue', inStock: true },
          { id: 'var-3', size: 'L', color: 'black', inStock: false }
        ]
      };

      const mockProvider = {
        isEnabled: true,
        createOrder: jest.fn(),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn().mockResolvedValue(mockProduct)
      };

      dropshippingService.registerProvider('fashion-provider', mockProvider);
      
      const product = await dropshippingService.getProductFromProvider('fashion-provider', 'dress-001');
      expect(product.variants).toHaveLength(3);
      expect(product.variants.filter(v => v.inStock)).toHaveLength(2);
    });
  });

  describe('Fashion Trend Analysis', () => {
    it('should get trending fashion items', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion/trending')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should get seasonal fashion recommendations', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion/seasonal?season=summer')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.seasonalTags).toContain('summer');
      });
    });
  });
});
