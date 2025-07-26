import { DropshippingOrder, DropshippingResult } from '../../../services/dropshipping/DropshippingService';

const mockProvider = {
  name: 'Mock Provider',
  isEnabled: true,
  createOrder: jest.fn().mockResolvedValue({
    orderId: 'mock-order-123',
    shippingCost: 9.99
  }),
  getProducts: jest.fn().mockResolvedValue([]),
  getProduct: jest.fn(),
  getOrderStatus: jest.fn(),
  cancelOrder: jest.fn(),
  getAvailableProducts: jest.fn()
};

export class DropshippingService {
  private static instance: DropshippingService;
  private providers: Map<string, any> = new Map();

  private constructor() {
    this.providers.set('mock-provider', mockProvider);
  }

  public static getInstance(): DropshippingService {
    if (!DropshippingService.instance) {
      DropshippingService.instance = new DropshippingService();
    }
    return DropshippingService.instance;
  }

  public registerProvider = jest.fn();
  
  public getEnabledProviders = jest.fn().mockReturnValue([mockProvider]);
  
  public isProviderEnabled = jest.fn().mockReturnValue(true);
  
  public getDefaultProvider = jest.fn().mockReturnValue(mockProvider);
  
  public getProviderStatus = jest.fn().mockReturnValue({
    enabled: 1,
    disabled: 0,
    total: 1
  });

  public createOrder = jest.fn().mockResolvedValue({
    success: true,
    orderId: 'mock-order-123',
    provider: 'mock-provider'
  });

  public getProductsFromProvider = jest.fn().mockResolvedValue([]);
  
  public getAllProducts = jest.fn().mockResolvedValue([]);
  
  public getProviderHealth = jest.fn().mockResolvedValue([]);
}