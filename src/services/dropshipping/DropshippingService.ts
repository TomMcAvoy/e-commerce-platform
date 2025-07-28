// src/services/dropshipping/DropshippingService.ts
import AppError from '../../utils/AppError';
import { IDropshippingProvider, ProductSearchParams, OrderCreationResult, DropshipOrderData } from './types';
import { PrintfulProvider } from './PrintfulProvider';
import { SpocketProvider } from './SpocketProvider';

class DropshippingService {
  private static instance: DropshippingService;
  private providers: Map<string, IDropshippingProvider> = new Map();

  private constructor() {
    if (process.env.PRINTFUL_API_KEY) {
      this.registerProvider('printful', new PrintfulProvider({ apiKey: process.env.PRINTFUL_API_KEY }));
    }
    if (process.env.SPOCKET_API_KEY) {
      this.registerProvider('spocket', new SpocketProvider({ apiKey: process.env.SPOCKET_API_KEY }));
    }
  }

  public registerProvider(name: string, provider: IDropshippingProvider) {
    this.providers.set(name, provider);
  }

  public static getInstance(): DropshippingService {
    if (!DropshippingService.instance) {
      DropshippingService.instance = new DropshippingService();
    }
    return DropshippingService.instance;
  }

  public async getProducts(providerName: string, query: ProductSearchParams) {
    const provider = this.providers.get(providerName);
    if (!provider) throw new AppError(`Provider ${providerName} not found`, 404);
    return provider.fetchProducts(query);
  }

  public async getProviderHealth() {
    const healthStatus: { [key: string]: any } = {};
    for (const [name, provider] of this.providers.entries()) {
      healthStatus[name] = await provider.checkHealth();
    }
    return healthStatus;
  }

  public async createOrder(providerName: string, orderData: DropshipOrderData): Promise<OrderCreationResult> {
    const provider = this.providers.get(providerName);
    if (!provider) throw new AppError(`Provider ${providerName} not found`, 404);
    return provider.createOrder(orderData);
  }
  // ... other methods
}

export const dropshippingService = DropshippingService.getInstance();

// This result type seems to be used in mocks, let's export it for them.
export interface DropshippingResult {
    success: boolean;
    orderId: string;
    provider: string;
    status: string;
}