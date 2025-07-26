import request from 'supertest';
import app from '../../test-app-setup';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Electronics Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/electronics', () => {
    it('should return electronics products', async () => {
      const response = await request(app)
        .get('/api/products/category/electronics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter electronics by subcategory', async () => {
      const response = await request(app)
        .get('/api/products/category/electronics?subcategory=smartphones')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.category).toBe('electronics');
      });
    });

    it('should support price range filtering', async () => {
      const response = await request(app)
        .get('/api/products/category/electronics?minPrice=100&maxPrice=500')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.price).toBeGreaterThanOrEqual(100);
        expect(product.price).toBeLessThanOrEqual(500);
      });
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/products/category/electronics?page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.data.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Electronics Dropshipping Integration', () => {
    it('should create electronics dropship order', async () => {
      const orderData = {
        items: [
          {
            productId: 'electronics-test-123',
            quantity: 1,
            price: 299.99,
            variantId: 'variant-color-black'
          }
        ],
        shippingAddress: {
          firstName: 'Tech',
          lastName: 'Buyer',
          address1: '123 Electronics St',
          city: 'Silicon Valley',
          state: 'CA',
          postalCode: '94301',
          country: 'US'
        },
        customerEmail: 'tech@example.com'
      };

      // Mock provider for electronics
      const mockElectronicsProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'elec-order-123',
          trackingNumber: 'ELEC-TRACK-456'
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('electronics-supplier', mockElectronicsProvider);

      const result = await dropshippingService.createOrder(orderData, 'electronics-supplier');
      expect(result.success).toBe(true);
      expect(result.orderId).toBe('elec-order-123');
    });

    it('should get electronics supplier products', async () => {
      const mockProducts = [
        {
          id: 'smartphone-001',
          name: 'Premium Smartphone',
          price: 699.99,
          category: 'electronics',
          subcategory: 'smartphones'
        },
        {
          id: 'laptop-001',
          name: 'Gaming Laptop',
          price: 1299.99,
          category: 'electronics',
          subcategory: 'computers'
        }
      ];

      const mockProvider = {
        isEnabled: true,
        createOrder: jest.fn(),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn().mockResolvedValue(mockProducts),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('electronics-provider', mockProvider);
      
      const products = await dropshippingService.getProductsFromProvider(
        'electronics-provider', 
        { category: 'electronics' }
      );

      expect(products).toHaveLength(2);
      expect(products[0].category).toBe('electronics');
    });
  });

  describe('Electronics Search and Filtering', () => {
    it('should search electronics products by keyword', async () => {
      const response = await request(app)
        .get('/api/products/search?q=smartphone&category=electronics')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(
          product.name.toLowerCase().includes('smartphone') ||
          product.description.toLowerCase().includes('smartphone')
        ).toBe(true);
      });
    });

    it('should filter by brand', async () => {
      const response = await request(app)
        .get('/api/products/category/electronics?brand=Apple')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.brand).toBe('Apple');
      });
    });
  });
});
