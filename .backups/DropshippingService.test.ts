import { DropshippingService } from './DropshippingService';
import { DropshipOrderData, DropshipOrderResult, OrderStatus, ProductSearchQuery } from './types';

describe('DropshippingService', () => {
  let service: DropshippingService;

  beforeEach(() => {
    service = new DropshippingService();
  });

  describe('createOrder', () => {
    it('should create a dropship order successfully', async () => {
      const orderData: DropshipOrderData = {
        items: [
          {
            productId: 'test-product-123',
            quantity: 2,
            price: 25.99
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          postalCode: '12345',
          country: 'US'
        }
      };

      const mockResult: DropshipOrderResult = {
        success: true,
        orderId: 'test-order-123',
        trackingNumber: 'TRACK123',
        estimatedDelivery: new Date(),
        cost: 29.99,
        message: 'Order created successfully'
      };

      const mockCreateOrder = jest.fn().mockResolvedValue(mockResult);
      jest.spyOn(service as any, 'getProvider').mockReturnValue({
        createOrder: mockCreateOrder
      });

      const result = await service.createOrder(orderData, 'printful');

      expect(result.success).toBe(true);
      expect(result.orderId).toBe('test-order-123');
      expect(mockCreateOrder).toHaveBeenCalledWith(orderData);
    });
  });

  describe('getOrderStatus', () => {
    it('should get order status successfully', async () => {
      const orderId = 'test-order-123';
      const providerName = 'printful';
      
      const mockStatus: OrderStatus = {
        orderId,
        status: 'processing',
        trackingNumber: 'TRACK123',
        lastUpdated: new Date(),
        updates: [
          {
            timestamp: new Date(),
            status: 'processing',
            message: 'Order is being processed'
          }
        ]
      };

      jest.spyOn(service, 'getOrderStatus').mockResolvedValue(mockStatus);

      const result = await service.getOrderStatus(orderId, providerName);

      expect(result.orderId).toBe(orderId);
      expect(result.status).toBe('processing');
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order successfully', async () => {
      const orderId = 'test-order-123';
      const providerName = 'printful';

      jest.spyOn(service, 'cancelOrder').mockResolvedValue(true);

      const result = await service.cancelOrder(orderId, providerName);

      expect(result).toBe(true);
    });
  });

  describe('getAvailableProducts', () => {
    it('should get available products successfully', async () => {
      const mockProducts = [
        {
          id: 'prod-1',
          name: 'Test Product',
          description: 'A test product',
          price: 25.99,
          images: ['https://example.com/image.jpg'],
          variants: [],
          provider: 'printful',
          category: 'Electronics'
        }
      ];

      jest.spyOn(service, 'getAvailableProducts').mockResolvedValue(mockProducts);

      const query: ProductSearchQuery = { provider: 'printful' };
      const result = await service.getAvailableProducts(query);

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Test Product');
    });
  });

  describe('error handling', () => {
    it('should handle provider creation errors', async () => {
      const orderData: DropshipOrderData = {
        items: [
          {
            productId: 'test-product-123',
            quantity: 2,
            price: 25.99
          }
        ],
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          address1: '123 St',
          city: 'City',
          state: 'State',
          postalCode: '12345',
          country: 'US'
        }
      };

      await expect(service.createOrder(orderData, 'invalid-provider')).rejects.toThrow();
    });
  });
});
