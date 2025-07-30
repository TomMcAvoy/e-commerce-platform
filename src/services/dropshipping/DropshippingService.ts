// src/services/dropshipping/DropshippingService.ts
import AppError from '../../utils/AppError';
import { IDropshippingProvider, ProductSearchParams, OrderCreationResult, DropshipOrderData } from './types';
import { PrintfulProvider } from './PrintfulProvider';
import { SpocketProvider } from './SpocketProvider';
import { DSersProvider } from './DSersProvider';

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
    if (process.env.DSERS_API_KEY) {
      this.registerProvider('dsers', new DSersProvider({ apiKey: process.env.DSERS_API_KEY }));
    }
  }

  public registerProvider(name: string, provider: IDropshippingProvider) {
    this.providers.set(name, provider);
    console.log(`✅ Registered dropshipping provider: ${name}`);
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

  public getEnabledProviders() {
    return Array.from(this.providers.values());
  }

  public async getHealth() {
    const healthStatus: { [key: string]: any } = {};
    for (const [name, provider] of this.providers.entries()) {
      healthStatus[name] = await provider.checkHealth();
    }
    return healthStatus;
  }

  public async getOrderStatus(providerName: string, externalOrderId: string) {
    const provider = this.providers.get(providerName);
    if (!provider) throw new AppError(`Provider ${providerName} not found`, 404);
    return { status: 'processing', orderId: externalOrderId };
  }

  public async getProductsFromProvider(providerName: string, query: any) {
    const provider = this.providers.get(providerName);
    if (!provider) throw new AppError(`Provider ${providerName} not found`, 404);
    return provider.fetchProducts(query);
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