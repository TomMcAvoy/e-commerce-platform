import { IDropshippingProvider } from './IDropshippingProvider';
import { PrintfulProvider } from './providers/PrintfulProvider';
import { SpocketProvider } from './providers/SpocketProvider';

export class DropshippingService {
  private providers: Map<string, IDropshippingProvider> = new Map();
  private defaultProvider: IDropshippingProvider | null = null;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize Printful with proper constructor
    if (process.env.PRINTFUL_API_KEY) {
      const provider = new PrintfulProvider(process.env.PRINTFUL_API_KEY);
      this.registerProvider('printful', provider);
    }

    // Initialize Spocket with optional API key
    const provider = new SpocketProvider(process.env.SPOCKET_API_KEY);
    this.registerProvider('spocket', provider);
  }

  registerProvider(name: string, provider: IDropshippingProvider): void {
    this.providers.set(name, provider);
    
    // Set first enabled provider as default
    if (!this.defaultProvider && provider.isEnabled) {
      this.defaultProvider = provider;
    }
  }

  getProvider(name: string): IDropshippingProvider | undefined {
    return this.providers.get(name);
  }

  getEnabledProviders(): Array<{ name: string; provider: IDropshippingProvider }> {
    const enabled: Array<{ name: string; provider: IDropshippingProvider }> = [];
    
    for (const [name, provider] of this.providers) {
      if (provider.isEnabled) {
        enabled.push({ name, provider });
      }
    }
    
    return enabled;
  }

  getProviderStatus(): Array<{ name: string; enabled: boolean; status: string }> {
    const status: Array<{ name: string; enabled: boolean; status: string }> = [];
    
    for (const [name, provider] of this.providers) {
      status.push({
        name,
        enabled: provider.isEnabled,
        status: provider.isEnabled ? 'active' : 'disabled'
      });
    }
    
    return status;
  }

  async getProviderHealth(): Promise<Array<{ name: string; status: string; enabled: boolean }>> {
    const health: Array<{ name: string; status: string; enabled: boolean }> = [];
    
    for (const [name, provider] of this.providers) {
      health.push({
        name,
        status: provider.isEnabled ? 'healthy' : 'disabled',
        enabled: provider.isEnabled
      });
    }
    
    return health;
  }

  async createOrder(orderData: any, providerName?: string): Promise<any> {
    const provider = providerName ? this.getProvider(providerName) : this.defaultProvider;
    
    if (!provider) {
      throw new Error('No dropshipping provider available');
    }
    
    if (!provider.isEnabled) {
      throw new Error(`Provider ${providerName || 'default'} is not enabled`);
    }
    
    return await provider.createOrder(orderData);
  }

  async getOrderStatus(orderId: string, providerName?: string): Promise<any> {
    const provider = providerName ? this.getProvider(providerName) : this.defaultProvider;
    
    if (!provider) {
      throw new Error('No dropshipping provider available');
    }
    
    return await provider.getOrderStatus(orderId);
  }

  async cancelOrder(orderId: string, providerName?: string): Promise<any> {
    const provider = providerName ? this.getProvider(providerName) : this.defaultProvider;
    
    if (!provider) {
      throw new Error('No dropshipping provider available');
    }
    
    return await provider.cancelOrder(orderId);
  }

  async getProductsFromProvider(providerName: string, query?: any): Promise<any[]> {
    const provider = this.getProvider(providerName);
    
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }
    
    return await provider.getProducts(query);
  }

  async getAllProducts(query?: any): Promise<any[]> {
    const allProducts: any[] = [];
    
    for (const [name, provider] of this.providers) {
      if (provider.isEnabled) {
        try {
          const products = await provider.getProducts(query);
          allProducts.push(...products.map((p: any) => ({ ...p, provider: name })));
        } catch (error) {
          console.error(`Error fetching products from ${name}:`, error);
        }
      }
    }
    
    return allProducts;
  }

  async getProductFromProvider(providerName: string, productId: string): Promise<any> {
    const provider = this.getProvider(providerName);
    
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }
    
    return await provider.getProduct(productId);
  }

  isProviderEnabled(providerName: string): boolean {
    const provider = this.getProvider(providerName);
    return provider?.isEnabled || false;
  }

  getDefaultProvider(): IDropshippingProvider | null {
    return this.defaultProvider;
  }

  isAnyProviderEnabled(): boolean {
    const provider = this.defaultProvider;
    return provider?.isEnabled || false;
  }
}

export default new DropshippingService();
