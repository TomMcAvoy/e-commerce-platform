import { DropshippingService } from '../../services/dropshipping/DropshippingService';
import { DropshipOrderData } from '../../services/dropshipping/types';

describe('DropshippingService Backend Tests', () => {
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

      // Mock the provider method
      const mockCreateOrder = jest.fn().mockResolvedValue({
        success: true,
        orderId: 'test-order-123',
        providerOrderId: 'provider-456',
        trackingNumber: 'TRACK123',
        estimatedDelivery: new Date(),
        cost: 29.99,
        message: 'Order created successfully'
      });

      jest.spyOn(service as any, 'getProvider').mockReturnValue({
        createOrder: mockCreateOrder
      });

      const result = await service.createOrder(orderData, 'printful');

      expect(result.success).toBe(true);
      expect(result.orderId).toBe('test-order-123');
      expect(mockCreateOrder).toHaveBeenCalledWith(orderData);
    });
  });
});
