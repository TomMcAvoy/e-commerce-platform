// src/services/dropshipping/DropshippingService.ts
import { AppError } from '../../middleware/errorHandler';
import { IDropshippingProvider } from './providers/IDropshippingProvider';
import { PrintfulProvider } from './providers/PrintfulProvider';
import { SpocketProvider } from './providers/SpocketProvider';

/**
 * DropshippingService following Service Architecture pattern from Copilot Instructions
 * Implements provider pattern with lazy loading and singleton pattern
 */
export class DropshippingService {
  private static instance: DropshippingService;
  private providers: Map<string, IDropshippingProvider> = new Map();

  private constructor() {
    this.initializeProviders();
  }

  public static getInstance(): DropshippingService {
    if (!DropshippingService.instance) {
      DropshippingService.instance = new DropshippingService();
    }
    return DropshippingService.instance;
  }

  private initializeProviders(): void {
    // Environment-based provider initialization following Environment & Configuration
    if (process.env.PRINTFUL_API_KEY) {
      this.providers.set('printful', new PrintfulProvider());
    }
    if (process.env.SPOCKET_API_KEY) {
      this.providers.set('spocket', new SpocketProvider());
    }
  }

  public async createOrder(orderData: any, provider: string): Promise<any> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      return { success: false, error: `Provider ${provider} not found` };
    }

    try {
      const result = await providerInstance.createOrder(orderData);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  public async getProductsFromProvider(provider: string, query: any): Promise<any> {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not found`);
    }

    return await providerInstance.getProducts(query);
  }

  public async getProviderHealth(): Promise<any> {
    const healthStatus: any = {};
    
    for (const [name, provider] of this.providers) {
      try {
        healthStatus[name] = await provider.checkHealth();
      } catch (error) {
        healthStatus[name] = { status: 'error', error: (error as Error).message };
      }
    }

    return healthStatus;
  }

  public getEnabledProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  public getProviderStatus(): any {
    const status: any = {};
    
    for (const [name, provider] of this.providers) {
      status[name] = {
        enabled: true,
        configured: true,
        lastCheck: new Date().toISOString()
      };
    }

    return status;
  }
}

// Export singleton instance following your service pattern
export const dropshippingService = DropshippingService.getInstance();
export default DropshippingService;