
import { IDropshippingProvider, DropshipOrderData, DropshipOrderResult, OrderStatus, DropshipProduct, ProductSearchQuery } from './types';
// Import concrete provider implementations (assuming they exist in a 'providers' subdirectory)
import PrintfulProvider from './providers/PrintfulProvider';
import { SpocketProvider } from './providers/SpocketProvider';

/**
 * Dropshipping service following copilot service architecture patterns
 * Manages multiple providers with unified interface
 */
export class DropshippingService {
  private providers: Map<string, IDropshippingProvider> = new Map();
  private defaultProvider: string | null = null;

  constructor() {
    // Initialize providers based on environment configuration
    // Following copilot environment-based initialization pattern
    this.initializeProviders();
  }

  /**
   * Initialize providers based on available API keys in environment variables.
   */
  private initializeProviders(): void {
    // This follows the copilot pattern of environment-based service initialization.
    // It dynamically registers providers if their API keys are present in .env
    
    if (process.env.PRINTFUL_API_KEY) {
      const provider = new PrintfulProvider(process.env.PRINTFUL_API_KEY);
      this.registerProvider('printful', provider);
      console.log('✅ Dropshipping Service: Printful provider registered.');
    }

    if (process.env.SPOCKET_API_KEY) {
      const provider = new SpocketProvider(process.env.SPOCKET_API_KEY);
      this.registerProvider('spocket', provider);
      console.log('✅ Dropshipping Service: Spocket provider registered.');
    }

    if (this.providers.size === 0) {
      console.warn('⚠️ Dropshipping Service: No providers enabled. Check environment variables (e.g., PRINTFUL_API_KEY).');
    }
  }


 // Method expected by controller
  getEnabledProviders(): string[] {
    const enabledProviders: string[] = [];
    for (const [name, provider] of this.providers.entries()) {
      if (provider.isEnabled) {
        enabledProviders.push(name);
      }
    }
    return enabledProviders;
  }

  // Alternative method the controller might be looking for
  getProviders(): Array<{ name: string; enabled: boolean; status: string }> {
    const providers: Array<{ name: string; enabled: boolean; status: string }> = [];
    for (const [name, provider] of this.providers.entries()) {
      providers.push({
        name,
        enabled: provider.isEnabled,
        status: provider.isEnabled ? 'active' : 'disabled'
      });
    }
    return providers;
  }

  // Health check method expected by controller
  async healthCheck(): Promise<Array<{ provider: string; status: string; enabled: boolean }>> {
    const health: Array<{ provider: string; status: string; enabled: boolean }> = [];
    
    for (const [name, provider] of this.providers.entries()) {
      health.push({
        provider: name,
        status: provider.isEnabled ? 'healthy' : 'disabled',
        enabled: provider.isEnabled
      });
    }
    
    return health;
  }



  /**
   * Register a dropshipping provider
   */
  registerProvider(name: string, provider: IDropshippingProvider): void {
    this.providers.set(name, provider);
    
    // Set as default if it's the first enabled provider
    if (!this.defaultProvider && provider.isEnabled) {
      this.defaultProvider = name;
    }
  }

  /**
   * Get provider by name or default
   */
  private getProvider(providerName?: string): IDropshippingProvider {
    const name = providerName || this.defaultProvider;
    if (!name) {
      throw new Error('No dropshipping provider configured or enabled.');
    }

    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Dropshipping provider '${name}' not found.`);
    }

    if (!provider.isEnabled) {
      throw new Error(`Dropshipping provider '${name}' is configured but disabled.`);
    }

    return provider;
  }

  /**
   * Create dropship order using specified or default provider
   */
  async createOrder(orderData: DropshipOrderData, providerName?: string): Promise<DropshipOrderResult> {
    const provider = this.getProvider(providerName);
    return await provider.createOrder(orderData);
  }

  /**
   * Get order status from specified provider
   */
  async getOrderStatus(orderId: string, providerName: string): Promise<OrderStatus> {
    const provider = this.getProvider(providerName);
    return await provider.getOrderStatus(orderId);
  }

  /**
   * Cancel order with specified provider
   */
  async cancelOrder(orderId: string, providerName: string): Promise<boolean> {
    const provider = this.getProvider(providerName);
    return await provider.cancelOrder(orderId);
  }

  /**
   * Get available products from all or specific provider
   */
  async getAvailableProducts(query?: ProductSearchQuery, providerName?: string): Promise<DropshipProduct[]> {
    if (providerName) {
      const provider = this.getProvider(providerName);
      return await provider.getProducts(query);
    }

    // Get products from all enabled providers
    const allProducts: DropshipProduct[] = [];
    for (const [name, provider] of this.providers.entries()) {
      if (provider.isEnabled) {
        try {
          const products = await provider.getProducts(query);
          allProducts.push(...products.map(p => ({ ...p, provider: name }))); // Tag product with provider
        } catch (error) {
          console.warn(`Failed to get products from ${name}:`, error);
        }
      }
    }

    return allProducts;
  }

  /**
   * Get single product from specified provider
   */
  async getProduct(productId: string, providerName: string): Promise<DropshipProduct> {
    const provider = this.getProvider(providerName);
    return await provider.getProduct(productId);
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys()).filter(name => {
      const provider = this.providers.get(name);
      return provider?.isEnabled || false;
    });
  }

  /**
   * Check if a specific provider is available
   */
  isProviderAvailable(providerName: string): boolean {
    const provider = this.providers.get(providerName);
    return provider?.isEnabled || false;
  }
}

// Export singleton instance following copilot service pattern
export const dropshippingService = new DropshippingService();