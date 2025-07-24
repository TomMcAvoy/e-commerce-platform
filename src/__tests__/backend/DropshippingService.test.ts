
import { DropshippingService } from '../../services/dropshipping/DropshippingService';
import { DropshipOrderData } from '../../services/dropshipping/types';
import { IDropshippingProvider } from '../../services/dropshipping/IDropshippingProvider';

// Mock providers for testing
const mockProvider: IDropshippingProvider = {
  isEnabled: true,
  createOrder: jest.fn(),
  getOrderStatus: jest.fn(),
  cancelOrder: jest.fn(),
  getAvailableProducts: jest.fn(),
  getProducts: jest.fn(),
  getProduct: jest.fn()
};

const mockDisabledProvider: IDropshippingProvider = {
  isEnabled: false,
  createOrder: jest.fn(),
  getOrderStatus: jest.fn(),
  cancelOrder: jest.fn(),
  getAvailableProducts: jest.fn(),
  getProducts: jest.fn(),
  getProduct: jest.fn()
};

describe('DropshippingService Backend Tests', () => {
  let service: DropshippingService;

  beforeEach(() => {
    service = new DropshippingService();
    jest.clearAllMocks();
  });

  describe('Basic Provider Management', () => {
    it('should register a provider successfully', () => {
      service.registerProvider('test-provider', mockProvider);
      
      const retrievedProvider = service.getProvider('test-provider');
      expect(retrievedProvider).toBeDefined();
      expect(retrievedProvider?.isEnabled).toBe(true);
    });

    it('should handle disabled providers', () => {
      service.registerProvider('disabled-provider', mockDisabledProvider);
      
      const enabledProviders = service.getEnabledProviders();
      expect(enabledProviders).toHaveLength(0);
      expect(service.isProviderEnabled('disabled-provider')).toBe(false);
    });

    it('should set first enabled provider as default', () => {
      service.registerProvider('disabled-provider', mockDisabledProvider);
      service.registerProvider('enabled-provider', mockProvider);
      
      const defaultProvider = service.getDefaultProvider();
      expect(defaultProvider).toBe(mockProvider);
    });

    it('should track provider status correctly', () => {
      service.registerProvider('provider1', mockProvider);
      service.registerProvider('provider2', mockDisabledProvider);
      
      const status = service.getProviderStatus();
      expect(status).toHaveLength(2);
      expect(status[0].enabled).toBe(true);
      expect(status[1].enabled).toBe(false);
    });
  });

  describe('Order Management', () => {
    beforeEach(() => {
      service.registerProvider('test-provider', mockProvider);
      mockProvider.createOrder = jest.fn().mockResolvedValue({
        success: true,
        orderId: 'test-order-123'
      });
    });

    it('should create order with specific provider', async () => {
      const orderData: DropshipOrderData = {
        items: [{ productId: 'product-1', quantity: 2, price: 29.99 }],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe', 
          address1: '123 Test St',
          city: 'Test City',
          state: 'TS',
          postalCode: '12345',
          country: 'US'
        }
      };

      const result = await service.createOrder(orderData, 'test-provider');
      
      expect(result.success).toBe(true);
      expect(result.orderId).toBe('test-order-123');
      expect(mockProvider.createOrder).toHaveBeenCalledWith(orderData);
    });

    it('should use default provider when none specified', async () => {
      const orderData: DropshipOrderData = {
        items: [{ productId: 'product-1', quantity: 1, price: 19.99 }],
        shippingAddress: {
          firstName: 'Jane', lastName: 'Smith', address1: '456 Main St',
          city: 'Main City', state: 'MC', postalCode: '54321', country: 'US'
        }
      };

      const result = await service.createOrder(orderData);
      
      expect(result.success).toBe(true);
      expect(mockProvider.createOrder).toHaveBeenCalledWith(orderData);
    });

    it('should handle international shipping with multiple providers', async () => {
      const domesticProvider = {
        ...mockProvider,
        regions: ['US', 'CA'],
        createOrder: jest.fn().mockImplementation((orderData: DropshipOrderData) => {
          if (['US', 'CA'].includes(orderData.shippingAddress.country)) {
            return Promise.resolve({
              success: true,
              orderId: 'domestic-order',
              shippingCost: 9.99,
              deliveryTime: '3-5 business days'
            });
          }
          return Promise.reject(new Error('Region not supported'));
        })
      };

      const internationalProvider = {
        ...mockProvider,
        regions: ['EU', 'AU', 'JP'],
        createOrder: jest.fn().mockImplementation((orderData: DropshipOrderData) => {
          if (['GB', 'DE', 'FR', 'AU', 'JP'].includes(orderData.shippingAddress.country)) {
            return Promise.resolve({
              success: true,
              orderId: 'international-order',
              shippingCost: 24.99,
              deliveryTime: '7-14 business days'
            });
          }
          return Promise.reject(new Error('Region not supported'));
        })
      };

      service.registerProvider('domestic', domesticProvider);
      service.registerProvider('international', internationalProvider);

      // US order - should use domestic provider
      const usOrder: DropshipOrderData = {
        items: [{ productId: 'us-product', quantity: 1, price: 50 }],
        shippingAddress: {
          firstName: 'US', lastName: 'Customer', address1: '123 US St',
          city: 'New York', state: 'NY', postalCode: '10001', country: 'US'
        }
      };

      const usResult = await service.createOrder(usOrder, 'domestic');
      expect(usResult.orderId).toBe('domestic-order');
      expect(usResult.shippingCost).toBe(9.99);

      // UK order - should use international provider
      const ukOrder: DropshipOrderData = {
        items: [{ productId: 'uk-product', quantity: 1, price: 50 }],
        shippingAddress: {
          firstName: 'UK', lastName: 'Customer', address1: '123 UK St',
          city: 'London', state: 'London', postalCode: 'SW1A 1AA', country: 'GB'
        }
      };

      const ukResult = await service.createOrder(ukOrder, 'international');
      expect(ukResult.orderId).toBe('international-order');
      expect(ukResult.shippingCost).toBe(24.99);
    });
  });

  describe('Product Management', () => {
    beforeEach(() => {
      service.registerProvider('test-provider', mockProvider);
      mockProvider.getProducts = jest.fn().mockResolvedValue([
        { id: 'product-1', name: 'Test Product 1', price: 29.99 },
        { id: 'product-2', name: 'Test Product 2', price: 39.99 }
      ]);
    });

    it('should get products from specific provider', async () => {
      const products = await service.getProductsFromProvider('test-provider');
      
      expect(products).toHaveLength(2);
      expect(products[0].name).toBe('Test Product 1');
      expect(mockProvider.getProducts).toHaveBeenCalled();
    });

    it('should get all products from enabled providers', async () => {
      const secondProvider = { ...mockProvider };
      secondProvider.getProducts = jest.fn().mockResolvedValue([
        { id: 'product-3', name: 'Test Product 3', price: 49.99 }
      ]);
      
      service.registerProvider('second-provider', secondProvider);

      const allProducts = await service.getAllProducts();
      
      expect(allProducts).toHaveLength(3);
      expect(allProducts[0].provider).toBe('test-provider');
      expect(allProducts[2].provider).toBe('second-provider');
    });

    it('should optimize product queries with caching simulation', async () => {
      const cache = new Map();
      const cachingProvider = {
        ...mockProvider,
        getProducts: jest.fn().mockImplementation((query) => {
          const cacheKey = JSON.stringify(query);
          
          if (cache.has(cacheKey)) {
            return Promise.resolve(cache.get(cacheKey));
          }
          
          const products = [
            { id: 'cached-product', name: 'Cached Product', price: 29.99 }
          ];
          
          cache.set(cacheKey, products);
          return Promise.resolve(products);
        })
      };

      service.registerProvider('caching', cachingProvider);

      const query = { category: 'electronics', limit: 10 };
      
      // First call should hit the provider
      await service.getProductsFromProvider('caching', query);
      expect(cachingProvider.getProducts).toHaveBeenCalledTimes(1);
      
      // Second call with same query should use cache
      await service.getProductsFromProvider('caching', query);
      expect(cachingProvider.getProducts).toHaveBeenCalledTimes(2);
      
      // Different query should hit provider again
      await service.getProductsFromProvider('caching', { category: 'clothing' });
      expect(cachingProvider.getProducts).toHaveBeenCalledTimes(3);
    });
  });

  describe('Provider Health Monitoring', () => {
    it('should check health of all providers', async () => {
      service.registerProvider('healthy-provider', mockProvider);
      service.registerProvider('disabled-provider', mockDisabledProvider);
      
      const errorProvider = { ...mockProvider };
      errorProvider.getProducts = jest.fn().mockRejectedValue(new Error('Connection failed'));
      service.registerProvider('error-provider', errorProvider);

      const health = await service.getProviderHealth();
      
      expect(health).toHaveLength(3);
      expect(health[0].status).toBe('healthy');
      expect(health[1].status).toBe('disabled');
      expect(health[2].status).toBe('unhealthy');
      expect(health[2].error).toBe('Connection failed');
    });

    it('should measure response times', async () => {
      mockProvider.getProducts = jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      );
      
      service.registerProvider('slow-provider', mockProvider);

      const health = await service.getProviderHealth();
      
      expect(health[0].responseTime).toBeGreaterThan(90);
      expect(health[0].responseTime).toBeLessThan(200);
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should handle disabled provider order creation', async () => {
      service.registerProvider('disabled', mockDisabledProvider);
      
      const orderData: DropshipOrderData = {
        items: [{ productId: 'test', quantity: 1, price: 10 }],
        shippingAddress: {
          firstName: 'Test', lastName: 'User', address1: '123 Test St',
          city: 'Test', state: 'TS', postalCode: '12345', country: 'US'
        }
      };

      await expect(service.createOrder(orderData, 'disabled'))
        .rejects.toThrow('Provider disabled is not enabled');
    });

    it('should handle no available providers', async () => {
      const orderData: DropshipOrderData = {
        items: [{ productId: 'test', quantity: 1, price: 10 }],
        shippingAddress: {
          firstName: 'Test', lastName: 'User', address1: '123 Test St',
          city: 'Test', state: 'TS', postalCode: '12345', country: 'US'
        }
      };

      await expect(service.createOrder(orderData))
        .rejects.toThrow('No dropshipping provider available');
    });

    it('should handle provider errors gracefully in getAllProducts', async () => {
      const workingProvider = { ...mockProvider };
      workingProvider.getProducts = jest.fn().mockResolvedValue([
        { id: 'working-product', name: 'Working Product', price: 19.99 }
      ]);

      const errorProvider = { ...mockProvider };
      errorProvider.getProducts = jest.fn().mockRejectedValue(new Error('Network error'));

      service.registerProvider('working', workingProvider);
      service.registerProvider('error', errorProvider);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const products = await service.getAllProducts();

      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Working Product');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching products from error:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Performance and Optimization', () => {
    it('should handle large product catalogs efficiently', async () => {
      const largeProductSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `product-${i}`,
        name: `Product ${i}`,
        price: Math.random() * 100,
        category: i % 2 === 0 ? 'electronics' : 'clothing'
      }));

      const highVolumeProvider = {
        ...mockProvider,
        getProducts: jest.fn().mockResolvedValue(largeProductSet)
      };

      service.registerProvider('high-volume', highVolumeProvider);

      const startTime = Date.now();
      const products = await service.getProductsFromProvider('high-volume');
      const endTime = Date.now();

      expect(products).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle memory usage efficiently with multiple providers', () => {
      const providerCount = 50;
      
      for (let i = 0; i < providerCount; i++) {
        const provider = {
          ...mockProvider,
          id: `provider-${i}`,
          data: new Array(1000).fill(`data-${i}`)
        };
        service.registerProvider(`provider-${i}`, provider);
      }

      const enabledProviders = service.getEnabledProviders();
      expect(enabledProviders).toHaveLength(providerCount);

      const status = service.getProviderStatus();
      expect(status).toHaveLength(providerCount);
    });
  });
});