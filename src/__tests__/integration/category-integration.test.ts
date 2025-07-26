import request from 'supertest';
import app from '../test-app-setup';
import { DropshippingService } from '../../services/dropshipping/DropshippingService';

describe('Cross-Category Integration Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('Multi-Category Shopping Cart', () => {
    it('should handle products from multiple categories in cart', async () => {
      const cartItems = [
        { categoryId: 'electronics', productId: 'smartphone-001', quantity: 1 },
        { categoryId: 'fashion', productId: 'dress-001', quantity: 2 },
        { categoryId: 'home-garden', productId: 'lamp-001', quantity: 1 }
      ];

      for (const item of cartItems) {
        const response = await request(app)
          .post('/api/cart/add')
          .send(item)
          .expect(200);

        expect(response.body.success).toBe(true);
      }

      const cartResponse = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(cartResponse.body.data.items).toHaveLength(3);
      expect(cartResponse.body.data.categorySummary).toBeDefined();
    });

    it('should calculate shipping costs for mixed categories', async () => {
      const response = await request(app)
        .post('/api/shipping/calculate-mixed')
        .send({
          items: [
            { categoryId: 'electronics', weight: 0.5, dimensions: { l: 15, w: 8, h: 2 } },
            { categoryId: 'home-garden', weight: 25, dimensions: { l: 60, w: 40, h: 30 } }
          ],
          destination: { postalCode: '10001', country: 'US' }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.shippingOptions).toBeDefined();
      expect(response.body.totalCost).toBeGreaterThan(0);
    });
  });

  describe('Cross-Category Search', () => {
    it('should search across all categories', async () => {
      const response = await request(app)
        .get('/api/products/search?q=wireless&categories=electronics,automotive,sports')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.categoryCounts).toBeDefined();
    });

    it('should provide category-specific faceted search', async () => {
      const response = await request(app)
        .get('/api/products/search/facets?q=bluetooth')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.facets.categories).toBeDefined();
      expect(response.body.facets.priceRanges).toBeDefined();
      expect(response.body.facets.brands).toBeDefined();
    });
  });

  describe('Multi-Provider Dropshipping', () => {
    it('should handle orders from multiple suppliers', async () => {
      // Register multiple providers
      const electronicsProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({ success: true, orderId: 'elec-001' }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      const fashionProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({ success: true, orderId: 'fashion-001' }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('electronics-supplier', electronicsProvider);
      dropshippingService.registerProvider('fashion-supplier', fashionProvider);

      const orderData1 = {
        items: [{ productId: 'phone-001', quantity: 1, price: 699 }],
        shippingAddress: {
          firstName: 'Multi', lastName: 'Buyer',
          address1: '123 Test St', city: 'Test', state: 'CA',
          postalCode: '90210', country: 'US'
        }
      };

      const orderData2 = {
        items: [{ productId: 'shirt-001', quantity: 2, price: 29.99 }],
        shippingAddress: {
          firstName: 'Multi', lastName: 'Buyer',
          address1: '123 Test St', city: 'Test', state: 'CA',
          postalCode: '90210', country: 'US'
        }
      };

      const result1 = await dropshippingService.createOrder(orderData1, 'electronics-supplier');
      const result2 = await dropshippingService.createOrder(orderData2, 'fashion-supplier');

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.orderId).toBe('elec-001');
      expect(result2.orderId).toBe('fashion-001');
    });

    it('should get unified product catalog from all providers', async () => {
      const electronicsProducts = [
        { id: 'elec-1', name: 'Phone', category: 'electronics', price: 599 }
      ];
      const fashionProducts = [
        { id: 'fashion-1', name: 'Shirt', category: 'fashion', price: 39.99 }
      ];

      const mockElectronicsProvider = {
        isEnabled: true,
        createOrder: jest.fn(),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn().mockResolvedValue(electronicsProducts),
        getProduct: jest.fn()
      };

      const mockFashionProvider = {
        isEnabled: true,
        createOrder: jest.fn(),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn().mockResolvedValue(fashionProducts),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('electronics-provider', mockElectronicsProvider);
      dropshippingService.registerProvider('fashion-provider', mockFashionProvider);

      const allProducts = await dropshippingService.getAllProducts();

      expect(allProducts).toHaveLength(2);
      expect(allProducts[0].provider).toBe('electronics-provider');
      expect(allProducts[1].provider).toBe('fashion-provider');
    });
  });

  describe('Category Analytics', () => {
    it('should provide cross-category analytics', async () => {
      const response = await request(app)
        .get('/api/analytics/categories/performance')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.categoryMetrics).toBeDefined();
      expect(response.body.data.crossCategoryTrends).toBeDefined();
    });

    it('should track conversion rates by category', async () => {
      const response = await request(app)
        .get('/api/analytics/categories/conversion-rates')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((categoryData: any) => {
        expect(categoryData.category).toBeDefined();
        expect(categoryData.conversionRate).toBeGreaterThanOrEqual(0);
        expect(categoryData.conversionRate).toBeLessThanOrEqual(100);
      });
    });
  });
});
