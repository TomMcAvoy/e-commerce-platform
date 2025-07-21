import {
  IDropshippingProvider,
  ProductSearchParams,
  DropshipProduct,
  ImportResult,
  InventoryUpdate,
  DropshipOrderData,
  DropshipOrderResult,
  OrderStatus,
  ShippingInfo,
  DropshippingError
} from './types';
import { PrintfulProvider } from './PrintfulProvider';
import { SpocketProvider } from './SpocketProvider';

export class DropshippingService {
  private providers: Map<string, IDropshippingProvider> = new Map();
  private defaultProvider: string | null = null;

  constructor() {
    // Initialize with default providers if environment variables are available
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize Printful if API key is available
    if (process.env.PRINTFUL_API_KEY) {
      const printfulProvider = new PrintfulProvider({
        apiKey: process.env.PRINTFUL_API_KEY,
        storeId: process.env.PRINTFUL_STORE_ID,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      });
      this.addProvider('printful', printfulProvider);
      
      if (!this.defaultProvider) {
        this.defaultProvider = 'printful';
      }
    }

    // Initialize Spocket if API key is available
    if (process.env.SPOCKET_API_KEY) {
      const spocketProvider = new SpocketProvider({
        apiKey: process.env.SPOCKET_API_KEY,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
      });
      this.addProvider('spocket', spocketProvider);
      
      if (!this.defaultProvider) {
        this.defaultProvider = 'spocket';
      }
    }
  }

  /**
   * Add a dropshipping provider
   */
  addProvider(name: string, provider: IDropshippingProvider): void {
    this.providers.set(name, provider);
    console.log(`✅ Added dropshipping provider: ${name}`);
  }

  /**
   * Remove a dropshipping provider
   */
  removeProvider(name: string): boolean {
    return this.providers.delete(name);
  }

  /**
   * Get all available providers
   */
  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Get a specific provider
   */
  getProvider(name: string): IDropshippingProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Set the default provider
   */
  setDefaultProvider(name: string): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider ${name} not found`);
    }
    this.defaultProvider = name;
  }

  /**
   * Initialize all providers
   */
  async initializeAll(): Promise<void> {
    const initPromises = Array.from(this.providers.entries()).map(async ([name, provider]) => {
      try {
        await provider.initialize();
        console.log(`✅ Initialized ${name} provider`);
      } catch (error) {
        console.error(`❌ Failed to initialize ${name} provider:`, error);
      }
    });

    await Promise.allSettled(initPromises);
  }

  /**
   * Search products across all providers or a specific provider
   */
  async searchProducts(
    query: ProductSearchParams, 
    providerName?: string
  ): Promise<{ provider: string; products: DropshipProduct[] }[]> {
    const results: { provider: string; products: DropshipProduct[] }[] = [];

    if (providerName) {
      const provider = this.providers.get(providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }

      try {
        const products = await provider.searchProducts(query);
        results.push({ provider: providerName, products });
      } catch (error) {
        console.error(`Error searching ${providerName}:`, error);
        results.push({ provider: providerName, products: [] });
      }
    } else {
      // Search all providers
      const searchPromises = Array.from(this.providers.entries()).map(async ([name, provider]) => {
        try {
          const products = await provider.searchProducts(query);
          return { provider: name, products };
        } catch (error) {
          console.error(`Error searching ${name}:`, error);
          return { provider: name, products: [] };
        }
      });

      const searchResults = await Promise.allSettled(searchPromises);
      
      for (const result of searchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        }
      }
    }

    return results;
  }

  /**
   * Get product from a specific provider
   */
  async getProduct(productId: string, providerName: string): Promise<DropshipProduct> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    return provider.getProduct(productId);
  }

  /**
   * Import product from a specific provider
   */
  async importProduct(productId: string, providerName: string): Promise<ImportResult> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    return provider.importProduct(productId);
  }

  /**
   * Sync inventory for products across providers
   */
  async syncInventory(
    productMappings: { productId: string; provider: string }[]
  ): Promise<InventoryUpdate[]> {
    const allUpdates: InventoryUpdate[] = [];

    // Group products by provider
    const providerGroups = new Map<string, string[]>();
    for (const mapping of productMappings) {
      if (!providerGroups.has(mapping.provider)) {
        providerGroups.set(mapping.provider, []);
      }
      providerGroups.get(mapping.provider)!.push(mapping.productId);
    }

    // Sync inventory for each provider
    const syncPromises = Array.from(providerGroups.entries()).map(async ([providerName, productIds]) => {
      const provider = this.providers.get(providerName);
      if (!provider) {
        console.error(`Provider ${providerName} not found for inventory sync`);
        return [];
      }

      try {
        return await provider.syncInventory(productIds);
      } catch (error) {
        console.error(`Error syncing inventory for ${providerName}:`, error);
        return [];
      }
    });

    const syncResults = await Promise.allSettled(syncPromises);
    
    for (const result of syncResults) {
      if (result.status === 'fulfilled') {
        allUpdates.push(...result.value);
      }
    }

    return allUpdates;
  }

  /**
   * Create order with a specific provider
   */
  async createOrder(
    orderData: DropshipOrderData, 
    providerName?: string
  ): Promise<DropshipOrderResult> {
    const provider = this.providers.get(providerName || this.defaultProvider!);
    if (!provider) {
      throw new Error(`Provider ${providerName || this.defaultProvider} not found`);
    }

    return provider.createOrder(orderData);
  }

  /**
   * Get order status from a specific provider
   */
  async getOrderStatus(orderId: string, providerName: string): Promise<OrderStatus> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    return provider.getOrderStatus(orderId);
  }

  /**
   * Get shipping info from a specific provider
   */
  async getShippingInfo(orderId: string, providerName: string): Promise<ShippingInfo> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    return provider.getShippingInfo(orderId);
  }

  /**
   * Get aggregated product recommendations from multiple providers
   */
  async getRecommendations(
    category?: string, 
    limit: number = 20
  ): Promise<DropshipProduct[]> {
    const query: ProductSearchParams = {
      category,
      limit: Math.ceil(limit / this.providers.size),
      sortBy: 'rating',
      sortOrder: 'desc'
    };

    const results = await this.searchProducts(query);
    const allProducts: DropshipProduct[] = [];

    for (const result of results) {
      allProducts.push(...result.products);
    }

    // Sort by rating and return top products
    return allProducts
      .sort((a, b) => (b.reviews?.rating || 0) - (a.reviews?.rating || 0))
      .slice(0, limit);
  }

  /**
   * Bulk import products from search results
   */
  async bulkImport(
    searchQuery: ProductSearchParams,
    providerName: string,
    maxProducts: number = 50
  ): Promise<ImportResult[]> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    // Search for products
    const products = await provider.searchProducts({
      ...searchQuery,
      limit: maxProducts
    });

    // Import each product
    const importPromises = products.map(product => 
      provider.importProduct(product.id).catch(error => ({
        success: false,
        productId: product.id,
        message: `Import failed: ${error.message}`,
        errors: [error.message]
      }))
    );

    return Promise.all(importPromises);
  }

  /**
   * Health check for all providers
   */
  async healthCheck(): Promise<{ [provider: string]: boolean }> {
    const health: { [provider: string]: boolean } = {};

    const healthPromises = Array.from(this.providers.entries()).map(async ([name, provider]) => {
      try {
        await provider.initialize();
        health[name] = true;
      } catch (error) {
        health[name] = false;
      }
    });

    await Promise.allSettled(healthPromises);
    return health;
  }
}
