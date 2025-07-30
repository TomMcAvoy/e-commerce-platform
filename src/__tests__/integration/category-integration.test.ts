import request from 'supertest';
import app from '../test-app-setup';
import { dropshippingService } from '../../services/dropshipping/DropshippingService';

describe('Cross-Category Integration Tests', () => {
  beforeAll(() => {
    // dropshippingService is already a singleton instance
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
      // Register multiple providers with complete interface implementation
      const electronicsProvider = {
        isEnabled: true,
        getProviderName: jest.fn().mockReturnValue('electronics-supplier'),
        checkHealth: jest.fn().mockResolvedValue({ status: 'healthy', details: {} }),
        fetchProducts: jest.fn().mockResolvedValue([]),
        createOrder: jest.fn().mockResolvedValue({ 
          orderId: 'internal-elec-001', 
          externalOrderId: 'elec-001', 
          status: 'pending' 
        }),
        updateInventory: jest.fn().mockResolvedValue(undefined),
        calculateShipping: jest.fn().mockResolvedValue({ cost: 10, estimatedDelivery: '3-5 days' }),
        getOrderStatus: jest.fn().mockResolvedValue({ status: 'processing' }),
        // Legacy methods for backward compatibility
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      const fashionProvider = {
        isEnabled: true,
        getProviderName: jest.fn().mockReturnValue('fashion-supplier'),
        checkHealth: jest.fn().mockResolvedValue({ status: 'healthy', details: {} }),
        fetchProducts: jest.fn().mockResolvedValue([]),
        createOrder: jest.fn().mockResolvedValue({ 
          orderId: 'internal-fashion-001', 
          externalOrderId: 'fashion-001', 
          status: 'pending' 
        }),
        updateInventory: jest.fn().mockResolvedValue(undefined),
        calculateShipping: jest.fn().mockResolvedValue({ cost: 5, estimatedDelivery: '2-4 days' }),
        getOrderStatus: jest.fn().mockResolvedValue({ status: 'processing' }),
        // Legacy methods for backward compatibility
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('electronics-supplier', electronicsProvider);
      dropshippingService.registerProvider('fashion-supplier', fashionProvider);

      const orderData1 = {
        orderId: 'test-order-1',
        items: [{ externalVariantId: 'phone-001-variant', quantity: 1 }],
        shippingAddress: {
          firstName: 'Multi', lastName: 'Buyer',
          address1: '123 Test St', city: 'Test', state: 'CA',
          postalCode: '90210', country: 'US'
        },
        customerInfo: { name: 'Multi Buyer', email: 'multi@test.com' }
      };

      const orderData2 = {
        orderId: 'test-order-2',
        items: [{ externalVariantId: 'shirt-001-variant', quantity: 2 }],
        shippingAddress: {
          firstName: 'Multi', lastName: 'Buyer',
          address1: '123 Test St', city: 'Test', state: 'CA',
          postalCode: '90210', country: 'US'
        },
        customerInfo: { name: 'Multi Buyer', email: 'multi@test.com' }
      };

      // Create orders using the service
      const result1 = await dropshippingService.createOrder('electronics-supplier', orderData1);
      const result2 = await dropshippingService.createOrder('fashion-supplier', orderData2);

      expect(result1.orderId).toBe('internal-elec-001');
      expect(result1.externalOrderId).toBe('elec-001');
      expect(result1.status).toBe('pending');
      expect(result2.orderId).toBe('internal-fashion-001');
      expect(result2.externalOrderId).toBe('fashion-001');
      expect(result2.status).toBe('pending');
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
        getProviderName: jest.fn().mockReturnValue('electronics-provider'),
        checkHealth: jest.fn().mockResolvedValue({ status: 'healthy', details: {} }),
        fetchProducts: jest.fn().mockResolvedValue(electronicsProducts),
        createOrder: jest.fn().mockResolvedValue({ orderId: 'test', externalOrderId: 'ext', status: 'pending' }),
        updateInventory: jest.fn().mockResolvedValue(undefined),
        calculateShipping: jest.fn().mockResolvedValue({ cost: 10, estimatedDelivery: '3-5 days' }),
        getOrderStatus: jest.fn().mockResolvedValue({ status: 'processing' }),
        // Legacy methods
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn().mockResolvedValue(electronicsProducts),
        getProduct: jest.fn()
      };

      const mockFashionProvider = {
        isEnabled: true,
        getProviderName: jest.fn().mockReturnValue('fashion-provider'),
        checkHealth: jest.fn().mockResolvedValue({ status: 'healthy', details: {} }),
        fetchProducts: jest.fn().mockResolvedValue(fashionProducts),
        createOrder: jest.fn().mockResolvedValue({ orderId: 'test', externalOrderId: 'ext', status: 'pending' }),
        updateInventory: jest.fn().mockResolvedValue(undefined),
        calculateShipping: jest.fn().mockResolvedValue({ cost: 5, estimatedDelivery: '2-4 days' }),
        getOrderStatus: jest.fn().mockResolvedValue({ status: 'processing' }),
        // Legacy methods
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn().mockResolvedValue(fashionProducts),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('electronics-provider', mockElectronicsProvider);
      dropshippingService.registerProvider('fashion-provider', mockFashionProvider);

      // Get products from both providers
      const electronicsProds = await dropshippingService.getProducts('electronics-provider', {});
      const fashionProds = await dropshippingService.getProducts('fashion-provider', {});
      const allProducts = [...electronicsProds, ...fashionProds];

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
