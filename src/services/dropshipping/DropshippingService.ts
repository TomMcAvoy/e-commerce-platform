// src/services/dropshipping/DropshippingService.ts
import { AppError } from '../../middleware/errorHandler';

export interface IDropshippingProvider {
    isEnabled: boolean;
    name: string;
    createOrder(orderData: any): Promise<{ orderId: string; success: boolean }>;
    getOrderStatus(orderId: string): Promise<any>;
    getProducts(query?: any): Promise<any[]>;
    getProduct(productId: string): Promise<any>;
    getAvailableProducts(): Promise<any[]>;
    cancelOrder(orderId: string): Promise<boolean>;
}

export interface DropshipOrderData {
    items: Array<{ productId: string; quantity: number; price: number }>;
    shippingAddress: {
        firstName: string;
        lastName: string;
        address1: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
}

export interface ProductSearchQuery {
    provider?: string;
    category?: string;
    query?: string;
    minPrice?: number;
    maxPrice?: number;
}

export class DropshippingService {
    private static instance: DropshippingService;
    private providers: Map<string, IDropshippingProvider> = new Map();
    private defaultProvider: string | null = null;

    private constructor() {
        // Initialize with default test provider following your service pattern
        this.initializeDefaultProvider();
    }

    private initializeDefaultProvider(): void {
        const defaultProvider: IDropshippingProvider = {
            name: 'Default Test Provider',
            isEnabled: true,
            async createOrder(orderData: any) {
                const orderId = `default_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const totalAmount = orderData.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;
                
                return {
                    success: true,
                    orderId,
                    status: 'pending',
                    totalAmount,
                    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    trackingNumber: `TRK${Date.now()}`,
                    provider: 'Default Test Provider'
                };
            },
            async getOrderStatus(orderId: string) {
                return {
                    orderId,
                    status: 'processing',
                    trackingNumber: `TRK${Date.now()}`,
                    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
                };
            },
            async getProducts(query?: any) {
                return [
                    { id: 'default-1', name: 'Default Product 1', price: 29.99, provider: 'default' },
                    { id: 'default-2', name: 'Default Product 2', price: 39.99, provider: 'default' }
                ];
            },
            async getProduct(productId: string) {
                return { id: productId, name: `Product ${productId}`, price: 29.99, provider: 'default' };
            },
            async getAvailableProducts() {
                return await this.getProducts();
            },
            async cancelOrder(orderId: string) {
                return true;
            }
        };

        this.registerProvider('default', defaultProvider);
    }

    public static getInstance(): DropshippingService {
        if (!DropshippingService.instance) {
            DropshippingService.instance = new DropshippingService();
        }
        return DropshippingService.instance;
    }

    public registerProvider(name: string, provider: IDropshippingProvider): void {
        this.providers.set(name, provider);
        if (provider.isEnabled && !this.defaultProvider) {
            this.defaultProvider = name;
        }
    }

    public getProvider(name: string): IDropshippingProvider | undefined {
        return this.providers.get(name);
    }

    public getEnabledProviders(): IDropshippingProvider[] {
        return Array.from(this.providers.values()).filter(p => p.isEnabled);
    }

    public getDefaultProvider(): IDropshippingProvider | undefined {
        return this.defaultProvider ? this.providers.get(this.defaultProvider) : undefined;
    }

    public isProviderEnabled(name: string): boolean {
        const provider = this.providers.get(name);
        return provider?.isEnabled || false;
    }

    public getProviderStatus(): { enabled: number; disabled: number; total: number } {
        const providers = Array.from(this.providers.values());
        const enabled = providers.filter(p => p.isEnabled).length;
        const disabled = providers.filter(p => !p.isEnabled).length;
        return { enabled, disabled, total: providers.length };
    }

    public async createOrder(orderData: DropshipOrderData, providerName?: string): Promise<any> {
        let provider: IDropshippingProvider | undefined;
        
        if (providerName) {
            provider = this.providers.get(providerName);
            if (!provider) {
                throw new AppError(`Provider ${providerName} not found`, 404);
            }
            if (!provider.isEnabled) {
                throw new AppError(`Provider ${providerName} is not enabled`, 400);
            }
        } else {
            provider = this.getDefaultProvider();
            if (!provider) {
                throw new AppError('No dropshipping provider available', 500);
            }
        }

        const result = await provider.createOrder(orderData);
        return {
            ...result,
            provider: providerName || this.defaultProvider || 'unknown'
        };
    }

    public async getOrderStatus(orderId: string, providerName?: string): Promise<any> {
        const provider = providerName 
            ? this.providers.get(providerName)
            : this.getDefaultProvider();
        
        if (!provider) {
            throw new AppError('No provider available for order status', 404);
        }

        return provider.getOrderStatus(orderId);
    }

    public async cancelOrder(orderId: string, providerName?: string): Promise<boolean> {
        const provider = providerName 
            ? this.providers.get(providerName)
            : this.getDefaultProvider();
        
        if (!provider) {
            throw new AppError('No provider available for order cancellation', 404);
        }

        return provider.cancelOrder(orderId);
    }

    public async getAvailableProducts(query: ProductSearchQuery): Promise<any[]> {
        if (query.provider) {
            const provider = this.providers.get(query.provider);
            if (provider && provider.isEnabled) {
                return provider.getAvailableProducts();
            }
            return [];
        }

        const allProducts: any[] = [];
        for (const [name, provider] of this.providers.entries()) {
            if (provider.isEnabled) {
                try {
                    const products = await provider.getAvailableProducts();
                    allProducts.push(...products.map(p => ({ ...p, provider: name })));
                } catch (error) {
                    console.error(`Error fetching products from ${name}:`, error);
                }
            }
        }

        return allProducts;
    }

    public async getProductsFromProvider(providerName: string, query?: any): Promise<any[]> {
        const provider = this.providers.get(providerName);
        if (!provider || !provider.isEnabled) {
            return [];
        }
        
        try {
            return await provider.getProducts(query);
        } catch (error) {
            console.error(`Error fetching products from ${providerName}:`, error);
            return [];
        }
    }

    public async getAllProducts(): Promise<any[]> {
        const allProducts: any[] = [];

        for (const [name, provider] of this.providers.entries()) {
            if (provider.isEnabled) {
                try {
                    const products = await provider.getProducts();
                    allProducts.push(...products.map(p => ({ ...p, provider: name })));
                } catch (error) {
                    console.error(`Error fetching products from ${name}:`, error);
                }
            }
        }

        return allProducts;
    }

    public async getProviderHealth(): Promise<any[]> {
        const healthResults: any[] = [];
        
        for (const [name, provider] of this.providers.entries()) {
            const startTime = Date.now();
            let status = 'healthy';
            
            if (!provider.isEnabled) {
                status = 'disabled';
            } else {
                try {
                    await provider.getProducts();
                } catch (error) {
                    status = 'unhealthy';
                }
            }
            
            const responseTime = Date.now() - startTime;
            healthResults.push({ name, status, responseTime });
        }
        
        return healthResults;
    }

    // Additional methods for comprehensive testing
    public async searchProducts(query: string): Promise<any[]> {
        const allProducts = await this.getAllProducts();
        return allProducts.filter(product => 
            product.name?.toLowerCase().includes(query.toLowerCase()) ||
            product.description?.toLowerCase().includes(query.toLowerCase())
        );
    }

    public async syncProduct(productId: string, providerName?: string): Promise<any> {
        const provider = providerName 
            ? this.providers.get(providerName)
            : this.getDefaultProvider();
        
        if (!provider) {
            throw new AppError('No provider available for product sync', 404);
        }

        return provider.getProduct(productId);
    }

    public async getProductFromProvider(providerName: string, productId: string): Promise<any> {
        const provider = this.providers.get(providerName);
        if (!provider || !provider.isEnabled) {
            throw new AppError(`Provider ${providerName} not available`, 404);
        }

        return provider.getProduct(productId);
    }
}

// Export singleton instance following your service pattern
export const dropshippingService = DropshippingService.getInstance();
export default DropshippingService;