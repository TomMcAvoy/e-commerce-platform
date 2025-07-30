import { OrderCreationResult, DropshipProduct, IDropshippingProvider } from '../../../services/dropshipping/types';
import { DropshippingResult } from '../../../services/dropshipping/DropshippingService';

/**
 * Mock implementation of a dropshipping provider following the IDropshippingProvider interface.
 */
const mockProvider: IDropshippingProvider = {
  getProviderName: () => 'Mock Provider',
  createOrder: jest.fn().mockResolvedValue({
    orderId: 'mock-order-123',
    externalOrderId: 'mock-order-123',
    status: 'pending'
  } as OrderCreationResult),
  fetchProducts: jest.fn().mockResolvedValue([] as DropshipProduct[]),


  checkHealth: jest.fn().mockResolvedValue({ status: 'ok', details: 'Mock provider is healthy' }),
  updateInventory: jest.fn().mockResolvedValue({ success: true }),
  calculateShipping: jest.fn().mockResolvedValue({ cost: 9.99 }),
};

/**
 * Mock DropshippingService following the singleton and provider patterns
 * from the copilot instructions.
 */
export class DropshippingService {
  private static instance: DropshippingService;
  private providers: Map<string, IDropshippingProvider> = new Map();

  private constructor() {
    this.providers.set('mock-provider', mockProvider);
  }

  public static getInstance(): DropshippingService {
    if (!DropshippingService.instance) {
      DropshippingService.instance = new DropshippingService();
    }
    return DropshippingService.instance;
  }

  public registerProvider = jest.fn((provider: IDropshippingProvider) => {
    this.providers.set(provider.getProviderName().toLowerCase().replace(' ', '-'), provider);
  });

  public getEnabledProviders = jest.fn().mockReturnValue([mockProvider]);

  public isProviderEnabled = jest.fn((providerName: string) => {
    const provider = this.providers.get(providerName);
    return !!provider;
  });

  public getDefaultProvider = jest.fn().mockReturnValue(mockProvider);

  public getProviderStatus = jest.fn().mockReturnValue({
    enabled: 1,
    disabled: 0,
    total: 1,
    providers: [{ name: 'Mock Provider', enabled: true }]
  });

  public createOrder = jest.fn().mockResolvedValue({
    success: true,
    orderId: 'mock-order-123',
    provider: 'mock-provider',
    status: 'pending'
  } as DropshippingResult);

  public getProductsFromProvider = jest.fn().mockResolvedValue([] as DropshipProduct[]);

  public getAllProducts = jest.fn().mockResolvedValue([] as DropshipProduct[]);

  public getProviderHealth = jest.fn().mockResolvedValue([{
    provider: 'mock-provider',
    status: 'ok',
    message: 'Mock provider is healthy'
  }]);

  public getOrderStatus = jest.fn().mockResolvedValue({ status: 'shipped' });

  public getHealth = jest.fn().mockResolvedValue([{
    provider: 'mock-provider',
    status: 'ok',
    message: 'Mock provider is healthy'
  }]);
}

/**
 * Export a singleton instance for simplified mocking in tests,
 * consistent with service usage in the application.
 */
export const dropshippingService = DropshippingService.getInstance();

