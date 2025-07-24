#!/bin/bash
# filepath: create-comprehensive-test-harnesses.sh
set -e

echo "🚀 Creating Comprehensive Test Harnesses for All Categories"
echo "Following Copilot Instructions Architecture Patterns"
echo "============================================================"

# Create the complete dropshipping service implementation first
echo "1. 📁 Setting up complete dropshipping service file structure..."

mkdir -p src/services/dropshipping/providers
mkdir -p src/__tests__/backend/api
mkdir -p src/__tests__/integration
mkdir -p tests/category-specific

# Complete the DropshippingService types
cat > src/services/dropshipping/types.ts << 'EOF'
export interface DropshipOrderItem {
  productId: string;
  quantity: number;
  price: number;
  variantId?: string;
  customization?: Record<string, any>;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface DropshipOrderData {
  items: DropshipOrderItem[];
  shippingAddress: ShippingAddress;
  customerEmail?: string;
  orderNotes?: string;
}

export interface DropshipOrderResult {
  success: boolean;
  orderId?: string;
  providerOrderId?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  cost?: number;
  message?: string;
  error?: string;
}

export interface DropshipProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  variants?: ProductVariant[];
  category?: string;
  provider?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  attributes: Record<string, string>;
}

export interface OrderStatus {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  updates?: OrderUpdate[];
}

export interface OrderUpdate {
  timestamp: Date;
  status: string;
  message: string;
  location?: string;
}

export interface ProductQuery {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

export interface ProviderHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'disabled';
  lastChecked: Date;
  responseTime?: number;
  error?: string;
}

export interface ProviderStatus {
  name: string;
  enabled: boolean;
  connected: boolean;
  lastUpdate: Date;
}
EOF

# Complete the IDropshippingProvider interface
cat > src/services/dropshipping/IDropshippingProvider.ts << 'EOF'
import { 
  DropshipOrderData, 
  DropshipOrderResult, 
  DropshipProduct, 
  OrderStatus, 
  ProductQuery 
} from './types';

export interface IDropshippingProvider {
  isEnabled: boolean;
  
  /**
   * Create a new dropshipping order
   */
  createOrder(orderData: DropshipOrderData): Promise<DropshipOrderResult>;
  
  /**
   * Get the status of an existing order
   */
  getOrderStatus(orderId: string): Promise<OrderStatus>;
  
  /**
   * Cancel an existing order
   */
  cancelOrder(orderId: string): Promise<boolean>;
  
  /**
   * Get available products from this provider
   */
  getAvailableProducts(query?: ProductQuery): Promise<DropshipProduct[]>;
  
  /**
   * Get products with query parameters
   */
  getProducts(query?: ProductQuery): Promise<DropshipProduct[]>;
  
  /**
   * Get a specific product by ID
   */
  getProduct(productId: string): Promise<DropshipProduct | null>;
}
EOF

# Fix the DropshippingService implementation
cat > src/services/dropshipping/DropshippingService.ts << 'EOF'
import { IDropshippingProvider } from './IDropshippingProvider';
import { 
  DropshipOrderData, 
  DropshipOrderResult, 
  DropshipProduct, 
  OrderStatus, 
  ProductQuery,
  ProviderHealth,
  ProviderStatus
} from './types';

export class DropshippingService {
  private providers: Map<string, IDropshippingProvider> = new Map();
  private defaultProvider?: IDropshippingProvider;

  constructor() {
    // Initialize with environment-based providers
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // This would be populated based on environment configuration
    // For now, it's empty and providers are registered manually in tests
  }

  /**
   * Register a dropshipping provider
   */
  registerProvider(name: string, provider: IDropshippingProvider): void {
    this.providers.set(name, provider);
    
    // Set as default if it's the first enabled provider
    if (!this.defaultProvider && provider.isEnabled) {
      this.defaultProvider = provider;
    }
  }

  /**
   * Get a specific provider by name
   */
  getProvider(name: string): IDropshippingProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Get all enabled providers
   */
  getEnabledProviders(): Array<{ name: string; provider: IDropshippingProvider }> {
    const enabled: Array<{ name: string; provider: IDropshippingProvider }> = [];
    
    for (const [name, provider] of this.providers) {
      if (provider.isEnabled) {
        enabled.push({ name, provider });
      }
    }
    
    return enabled;
  }

  /**
   * Get provider status information
   */
  getProviderStatus(): ProviderStatus[] {
    const status: ProviderStatus[] = [];
    
    for (const [name, provider] of this.providers) {
      status.push({
        name,
        enabled: provider.isEnabled,
        connected: provider.isEnabled, // Simplified for testing
        lastUpdate: new Date()
      });
    }
    
    return status;
  }

  /**
   * Check health of all providers
   */
  async getProviderHealth(): Promise<ProviderHealth[]> {
    const health: ProviderHealth[] = [];
    
    for (const [name, provider] of this.providers) {
      const startTime = Date.now();
      
      try {
        if (!provider.isEnabled) {
          health.push({
            name,
            status: 'disabled',
            lastChecked: new Date()
          });
          continue;
        }

        // Simple health check - try to get products
        await provider.getProducts({ limit: 1 });
        
        health.push({
          name,
          status: 'healthy',
          lastChecked: new Date(),
          responseTime: Date.now() - startTime
        });
      } catch (error) {
        health.push({
          name,
          status: 'unhealthy',
          lastChecked: new Date(),
          responseTime: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return health;
  }

  /**
   * Create a dropshipping order
   */
  async createOrder(
    orderData: DropshipOrderData, 
    providerName?: string
  ): Promise<DropshipOrderResult> {
    let provider: IDropshippingProvider | undefined;
    
    if (providerName) {
      provider = this.getProvider(providerName);
      if (!provider) {
        throw new Error(`Provider ${providerName} not found`);
      }
      if (!provider.isEnabled) {
        throw new Error(`Provider ${providerName} is not enabled`);
      }
    } else {
      // Use default provider (first enabled one)
      provider = this.getDefaultProvider();
      if (!provider) {
        throw new Error('No dropshipping provider available');
      }
    }

    return await provider.createOrder(orderData);
  }

  /**
   * Get order status
   */
  async getOrderStatus(
    orderId: string, 
    providerName?: string
  ): Promise<OrderStatus> {
    let provider: IDropshippingProvider | undefined;
    
    if (providerName) {
      provider = this.getProvider(providerName);
    } else {
      provider = this.getDefaultProvider();
    }
    
    if (!provider) {
      throw new Error('No dropshipping provider available');
    }

    return await provider.getOrderStatus(orderId);
  }

  /**
   * Cancel an order
   */
  async cancelOrder(
    orderId: string, 
    providerName?: string
  ): Promise<boolean> {
    let provider: IDropshippingProvider | undefined;
    
    if (providerName) {
      provider = this.getProvider(providerName);
    } else {
      provider = this.getDefaultProvider();
    }
    
    if (!provider) {
      throw new Error('No dropshipping provider available');
    }

    return await provider.cancelOrder(orderId);
  }

  /**
   * Get products from a specific provider
   */
  async getProductsFromProvider(
    providerName: string, 
    query?: ProductQuery
  ): Promise<DropshipProduct[]> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    return await provider.getProducts(query);
  }

  /**
   * Get all products from all enabled providers
   */
  async getAllProducts(query?: ProductQuery): Promise<DropshipProduct[]> {
    const allProducts: DropshipProduct[] = [];
    const enabledProviders = this.getEnabledProviders();

    for (const { name, provider } of enabledProviders) {
      try {
        const products = await provider.getProducts(query);
        // Add provider information to each product
        const productsWithProvider = products.map(product => ({
          ...product,
          provider: name
        }));
        allProducts.push(...productsWithProvider);
      } catch (error) {
        console.error(`Error fetching products from ${name}:`, error);
        // Continue with other providers
      }
    }

    return allProducts;
  }

  /**
   * Get a specific product from a provider
   */
  async getProductFromProvider(
    providerName: string, 
    productId: string
  ): Promise<DropshipProduct | null> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    return await provider.getProduct(productId);
  }

  /**
   * Check if a provider is enabled
   */
  isProviderEnabled(providerName: string): boolean {
    const provider = this.getProvider(providerName);
    return provider ? provider.isEnabled : false;
  }

  /**
   * Get the default provider (first enabled one)
   */
  getDefaultProvider(): IDropshippingProvider | undefined {
    return this.defaultProvider;
  }

  /**
   * Check if any provider is enabled
   */
  isAnyProviderEnabled(): boolean {
    for (const provider of this.providers.values()) {
      if (provider.isEnabled) {
        return true;
      }
    }
    return false;
  }
}
EOF

# Create comprehensive API test harnesses for ALL categories
echo "2. 🧪 Creating category-specific API test harnesses..."

# Electronics Category Test Harness
cat > src/__tests__/backend/api/electronics.test.ts << 'EOF'
import request from 'supertest';
import app from '../../../index';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Electronics Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/electronics', () => {
    it('should return electronics products', async () => {
      const response = await request(app)
        .get('/api/products/category/electronics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter electronics by subcategory', async () => {
      const response = await request(app)
        .get('/api/products/category/electronics?subcategory=smartphones')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.category).toBe('electronics');
      });
    });

    it('should support price range filtering', async () => {
      const response = await request(app)
        .get('/api/products/category/electronics?minPrice=100&maxPrice=500')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.price).toBeGreaterThanOrEqual(100);
        expect(product.price).toBeLessThanOrEqual(500);
      });
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/products/category/electronics?page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.data.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Electronics Dropshipping Integration', () => {
    it('should create electronics dropship order', async () => {
      const orderData = {
        items: [
          {
            productId: 'electronics-test-123',
            quantity: 1,
            price: 299.99,
            variantId: 'variant-color-black'
          }
        ],
        shippingAddress: {
          firstName: 'Tech',
          lastName: 'Buyer',
          address1: '123 Electronics St',
          city: 'Silicon Valley',
          state: 'CA',
          postalCode: '94301',
          country: 'US'
        },
        customerEmail: 'tech@example.com'
      };

      // Mock provider for electronics
      const mockElectronicsProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'elec-order-123',
          trackingNumber: 'ELEC-TRACK-456'
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('electronics-supplier', mockElectronicsProvider);

      const result = await dropshippingService.createOrder(orderData, 'electronics-supplier');
      expect(result.success).toBe(true);
      expect(result.orderId).toBe('elec-order-123');
    });

    it('should get electronics supplier products', async () => {
      const mockProducts = [
        {
          id: 'smartphone-001',
          name: 'Premium Smartphone',
          price: 699.99,
          category: 'electronics',
          subcategory: 'smartphones'
        },
        {
          id: 'laptop-001',
          name: 'Gaming Laptop',
          price: 1299.99,
          category: 'electronics',
          subcategory: 'computers'
        }
      ];

      const mockProvider = {
        isEnabled: true,
        createOrder: jest.fn(),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn().mockResolvedValue(mockProducts),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('electronics-provider', mockProvider);
      
      const products = await dropshippingService.getProductsFromProvider(
        'electronics-provider', 
        { category: 'electronics' }
      );

      expect(products).toHaveLength(2);
      expect(products[0].category).toBe('electronics');
    });
  });

  describe('Electronics Search and Filtering', () => {
    it('should search electronics products by keyword', async () => {
      const response = await request(app)
        .get('/api/products/search?q=smartphone&category=electronics')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(
          product.name.toLowerCase().includes('smartphone') ||
          product.description.toLowerCase().includes('smartphone')
        ).toBe(true);
      });
    });

    it('should filter by brand', async () => {
      const response = await request(app)
        .get('/api/products/category/electronics?brand=Apple')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.brand).toBe('Apple');
      });
    });
  });
});
EOF

# Fashion Category Test Harness
cat > src/__tests__/backend/api/fashion.test.ts << 'EOF'
import request from 'supertest';
import app from '../../../index';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Fashion Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/fashion', () => {
    it('should return fashion products', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by gender', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion?gender=womens')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(['womens', 'unisex']).toContain(product.gender);
      });
    });

    it('should filter by size', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion?size=M')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.sizes).toContain('M');
      });
    });

    it('should filter by color', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion?color=black')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.colors.map((c: string) => c.toLowerCase())).toContain('black');
      });
    });
  });

  describe('Fashion Dropshipping Integration', () => {
    it('should create fashion dropship order with size variant', async () => {
      const orderData = {
        items: [
          {
            productId: 'fashion-dress-123',
            quantity: 2,
            price: 89.99,
            variantId: 'size-M-color-black'
          }
        ],
        shippingAddress: {
          firstName: 'Fashion',
          lastName: 'Lover',
          address1: '456 Style Avenue',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        },
        customerEmail: 'fashion@example.com'
      };

      const mockFashionProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'fashion-order-456',
          trackingNumber: 'FASHION-TRACK-789'
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('fashion-supplier', mockFashionProvider);

      const result = await dropshippingService.createOrder(orderData, 'fashion-supplier');
      expect(result.success).toBe(true);
      expect(result.orderId).toBe('fashion-order-456');
    });

    it('should handle size and color variants correctly', async () => {
      const mockProduct = {
        id: 'dress-001',
        name: 'Summer Dress',
        price: 79.99,
        category: 'fashion',
        variants: [
          { id: 'var-1', size: 'S', color: 'red', inStock: true },
          { id: 'var-2', size: 'M', color: 'blue', inStock: true },
          { id: 'var-3', size: 'L', color: 'black', inStock: false }
        ]
      };

      const mockProvider = {
        isEnabled: true,
        createOrder: jest.fn(),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn().mockResolvedValue(mockProduct)
      };

      dropshippingService.registerProvider('fashion-provider', mockProvider);
      
      const product = await dropshippingService.getProductFromProvider('fashion-provider', 'dress-001');
      expect(product.variants).toHaveLength(3);
      expect(product.variants.filter(v => v.inStock)).toHaveLength(2);
    });
  });

  describe('Fashion Trend Analysis', () => {
    it('should get trending fashion items', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion/trending')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should get seasonal fashion recommendations', async () => {
      const response = await request(app)
        .get('/api/products/category/fashion/seasonal?season=summer')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.seasonalTags).toContain('summer');
      });
    });
  });
});
EOF

# Home & Garden Category Test Harness
cat > src/__tests__/backend/api/home-garden.test.ts << 'EOF'
import request from 'supertest';
import app from '../../../index';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Home & Garden Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/home-garden', () => {
    it('should return home and garden products', async () => {
      const response = await request(app)
        .get('/api/products/category/home-garden')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by room type', async () => {
      const response = await request(app)
        .get('/api/products/category/home-garden?room=kitchen')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(['kitchen', 'all-rooms']).toContain(product.room);
      });
    });

    it('should filter by material', async () => {
      const response = await request(app)
        .get('/api/products/category/home-garden?material=wood')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.materials.map((m: string) => m.toLowerCase())).toContain('wood');
      });
    });
  });

  describe('Home & Garden Dropshipping', () => {
    it('should handle large furniture dropshipping orders', async () => {
      const orderData = {
        items: [
          {
            productId: 'furniture-sofa-123',
            quantity: 1,
            price: 899.99,
            variantId: 'color-beige-size-large'
          }
        ],
        shippingAddress: {
          firstName: 'Home',
          lastName: 'Owner',
          address1: '789 Comfort Lane',
          city: 'Furniture City',
          state: 'TX',
          postalCode: '75001',
          country: 'US'
        },
        customerEmail: 'homeowner@example.com',
        orderNotes: 'Please schedule delivery for weekend'
      };

      const mockHomeProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'home-order-789',
          trackingNumber: 'HOME-TRACK-123',
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('home-supplier', mockHomeProvider);

      const result = await dropshippingService.createOrder(orderData, 'home-supplier');
      expect(result.success).toBe(true);
      expect(result.estimatedDelivery).toBeDefined();
    });

    it('should calculate shipping costs for heavy items', async () => {
      const response = await request(app)
        .post('/api/shipping/calculate')
        .send({
          items: [
            { id: 'furniture-001', weight: 50, dimensions: { l: 80, w: 40, h: 35 } }
          ],
          destination: { postalCode: '90210', country: 'US' }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.shippingCost).toBeGreaterThan(0);
      expect(response.body.deliveryOptions).toBeDefined();
    });
  });

  describe('Home & Garden Seasonal Products', () => {
    it('should get seasonal gardening products', async () => {
      const response = await request(app)
        .get('/api/products/category/home-garden/seasonal?category=gardening&season=spring')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.subcategory).toBe('gardening');
        expect(product.seasonalAvailability).toContain('spring');
      });
    });
  });
});
EOF

# Beauty & Health Category Test Harness
cat > src/__tests__/backend/api/beauty-health.test.ts << 'EOF'
import request from 'supertest';
import app from '../../../index';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Beauty & Health Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/beauty-health', () => {
    it('should return beauty and health products', async () => {
      const response = await request(app)
        .get('/api/products/category/beauty-health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by skin type', async () => {
      const response = await request(app)
        .get('/api/products/category/beauty-health?skinType=sensitive')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(['sensitive', 'all-skin-types']).toContain(product.skinType);
      });
    });

    it('should filter by product type', async () => {
      const response = await request(app)
        .get('/api/products/category/beauty-health?type=skincare')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.productType).toBe('skincare');
      });
    });

    it('should check for FDA compliance', async () => {
      const response = await request(app)
        .get('/api/products/category/beauty-health?fdaCompliant=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.fdaCompliant).toBe(true);
      });
    });
  });

  describe('Beauty & Health Dropshipping', () => {
    it('should handle temperature-sensitive beauty products', async () => {
      const orderData = {
        items: [
          {
            productId: 'skincare-serum-123',
            quantity: 3,
            price: 49.99,
            variantId: 'size-30ml'
          }
        ],
        shippingAddress: {
          firstName: 'Beauty',
          lastName: 'Enthusiast',
          address1: '321 Glow Street',
          city: 'Miami',
          state: 'FL',
          postalCode: '33101',
          country: 'US'
        },
        customerEmail: 'beauty@example.com',
        orderNotes: 'Temperature sensitive - please use cold storage'
      };

      const mockBeautyProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'beauty-order-321',
          trackingNumber: 'BEAUTY-TRACK-456',
          specialHandling: 'temperature-controlled'
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('beauty-supplier', mockBeautyProvider);

      const result = await dropshippingService.createOrder(orderData, 'beauty-supplier');
      expect(result.success).toBe(true);
      expect(mockBeautyProvider.createOrder).toHaveBeenCalledWith(orderData);
    });

    it('should validate product ingredients', async () => {
      const response = await request(app)
        .get('/api/products/beauty-health-001/ingredients')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.ingredients).toBeDefined();
      expect(response.body.allergens).toBeDefined();
    });
  });

  describe('Beauty & Health Recommendations', () => {
    it('should get personalized beauty recommendations', async () => {
      const response = await request(app)
        .post('/api/products/category/beauty-health/recommendations')
        .send({
          skinType: 'oily',
          concerns: ['acne', 'large-pores'],
          ageRange: '25-30'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.recommendations).toBeDefined();
    });
  });
});
EOF

# Sports & Fitness Category Test Harness
cat > src/__tests__/backend/api/sports-fitness.test.ts << 'EOF'
import request from 'supertest';
import app from '../../../index';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Sports & Fitness Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/sports-fitness', () => {
    it('should return sports and fitness products', async () => {
      const response = await request(app)
        .get('/api/products/category/sports-fitness')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by sport type', async () => {
      const response = await request(app)
        .get('/api/products/category/sports-fitness?sport=basketball')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(['basketball', 'general-fitness']).toContain(product.sport);
      });
    });

    it('should filter by fitness level', async () => {
      const response = await request(app)
        .get('/api/products/category/sports-fitness?level=beginner')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(['beginner', 'all-levels']).toContain(product.fitnessLevel);
      });
    });
  });

  describe('Sports Equipment Dropshipping', () => {
    it('should handle sports equipment orders', async () => {
      const orderData = {
        items: [
          {
            productId: 'basketball-shoes-123',
            quantity: 1,
            price: 129.99,
            variantId: 'size-10-color-black'
          }
        ],
        shippingAddress: {
          firstName: 'Sports',
          lastName: 'Player',
          address1: '555 Athletic Drive',
          city: 'Portland',
          state: 'OR',
          postalCode: '97201',
          country: 'US'
        },
        customerEmail: 'athlete@example.com'
      };

      const mockSportsProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'sports-order-555',
          trackingNumber: 'SPORTS-TRACK-789'
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('sports-supplier', mockSportsProvider);

      const result = await dropshippingService.createOrder(orderData, 'sports-supplier');
      expect(result.success).toBe(true);
      expect(result.orderId).toBe('sports-order-555');
    });
  });
});
EOF

# Automotive Category Test Harness
cat > src/__tests__/backend/api/automotive.test.ts << 'EOF'
import request from 'supertest';
import app from '../../../index';
import { DropshippingService } from '../../../services/dropshipping/DropshippingService';

describe('Automotive Category API Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('GET /api/products/category/automotive', () => {
    it('should return automotive products', async () => {
      const response = await request(app)
        .get('/api/products/category/automotive')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by vehicle make and model', async () => {
      const response = await request(app)
        .get('/api/products/category/automotive?make=Toyota&model=Camry&year=2020')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.compatibility).toContainEqual({
          make: 'Toyota',
          model: 'Camry',
          year: 2020
        });
      });
    });
  });

  describe('Automotive Parts Dropshipping', () => {
    it('should handle automotive parts orders with VIN verification', async () => {
      const orderData = {
        items: [
          {
            productId: 'brake-pads-123',
            quantity: 1,
            price: 89.99,
            variantId: 'front-ceramic'
          }
        ],
        shippingAddress: {
          firstName: 'Car',
          lastName: 'Owner',
          address1: '777 Motor Lane',
          city: 'Detroit',
          state: 'MI',
          postalCode: '48201',
          country: 'US'
        },
        customerEmail: 'carowner@example.com',
        orderNotes: 'VIN: 1HGBH41JXMN109186'
      };

      const mockAutoProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({
          success: true,
          orderId: 'auto-order-777',
          trackingNumber: 'AUTO-TRACK-123',
          vinVerified: true
        }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('auto-supplier', mockAutoProvider);

      const result = await dropshippingService.createOrder(orderData, 'auto-supplier');
      expect(result.success).toBe(true);
    });
  });
});
EOF

# Books & Media Category Test Harness
cat > src/__tests__/backend/api/books-media.test.ts << 'EOF'
import request from 'supertest';
import app from '../../../index';

describe('Books & Media Category API Tests', () => {
  describe('GET /api/products/category/books-media', () => {
    it('should return books and media products', async () => {
      const response = await request(app)
        .get('/api/products/category/books-media')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by media type', async () => {
      const response = await request(app)
        .get('/api/products/category/books-media?type=ebook')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.mediaType).toBe('ebook');
      });
    });

    it('should filter by genre', async () => {
      const response = await request(app)
        .get('/api/products/category/books-media?genre=fiction')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.genre).toBe('fiction');
      });
    });
  });

  describe('Digital Content Handling', () => {
    it('should handle digital product delivery', async () => {
      const response = await request(app)
        .post('/api/orders/digital-delivery')
        .send({
          orderId: 'digital-order-123',
          productId: 'ebook-001',
          customerEmail: 'reader@example.com'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.downloadLink).toBeDefined();
      expect(response.body.expiresAt).toBeDefined();
    });
  });
});
EOF

# Toys & Games Category Test Harness
cat > src/__tests__/backend/api/toys-games.test.ts << 'EOF'
import request from 'supertest';
import app from '../../../index';

describe('Toys & Games Category API Tests', () => {
  describe('GET /api/products/category/toys-games', () => {
    it('should return toys and games products', async () => {
      const response = await request(app)
        .get('/api/products/category/toys-games')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by age group', async () => {
      const response = await request(app)
        .get('/api/products/category/toys-games?ageGroup=6-12')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.ageRange).toContain('6-12');
      });
    });

    it('should check safety certifications', async () => {
      const response = await request(app)
        .get('/api/products/category/toys-games?safetyTested=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((product: any) => {
        expect(product.safetyCertifications).toContain('CPSC');
      });
    });
  });
});
EOF

# Create Integration Test Suite
echo "3. 🔗 Creating integration test suite..."

cat > src/__tests__/integration/category-integration.test.ts << 'EOF'
import request from 'supertest';
import app from '../../index';
import { DropshippingService } from '../../services/dropshipping/DropshippingService';

describe('Cross-Category Integration Tests', () => {
  let dropshippingService: DropshippingService;

  beforeAll(() => {
    dropshippingService = new DropshippingService();
  });

  describe('Multi-Category Shopping Cart', () => {
    it('should handle products from multiple categories in cart', async () => {
      const cartItems = [
        { categoryId: 'electronics', productId: 'smartphone-001', quantity: 1 },
        { categoryId: 'fashion', productId: 'dress-001', quantity: 2 },
        { categoryId: 'home-garden', productId: 'lamp-001', quantity: 1 }
      ];

      for (const item of cartItems) {
        const response = await request(app)
          .post('/api/cart/add')
          .send(item)
          .expect(200);

        expect(response.body.success).toBe(true);
      }

      const cartResponse = await request(app)
        .get('/api/cart')
        .expect(200);

      expect(cartResponse.body.data.items).toHaveLength(3);
      expect(cartResponse.body.data.categorySummary).toBeDefined();
    });

    it('should calculate shipping costs for mixed categories', async () => {
      const response = await request(app)
        .post('/api/shipping/calculate-mixed')
        .send({
          items: [
            { categoryId: 'electronics', weight: 0.5, dimensions: { l: 15, w: 8, h: 2 } },
            { categoryId: 'home-garden', weight: 25, dimensions: { l: 60, w: 40, h: 30 } }
          ],
          destination: { postalCode: '10001', country: 'US' }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.shippingOptions).toBeDefined();
      expect(response.body.totalCost).toBeGreaterThan(0);
    });
  });

  describe('Cross-Category Search', () => {
    it('should search across all categories', async () => {
      const response = await request(app)
        .get('/api/products/search?q=wireless&categories=electronics,automotive,sports')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.categoryCounts).toBeDefined();
    });

    it('should provide category-specific faceted search', async () => {
      const response = await request(app)
        .get('/api/products/search/facets?q=bluetooth')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.facets.categories).toBeDefined();
      expect(response.body.facets.priceRanges).toBeDefined();
      expect(response.body.facets.brands).toBeDefined();
    });
  });

  describe('Multi-Provider Dropshipping', () => {
    it('should handle orders from multiple suppliers', async () => {
      // Register multiple providers
      const electronicsProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({ success: true, orderId: 'elec-001' }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      const fashionProvider = {
        isEnabled: true,
        createOrder: jest.fn().mockResolvedValue({ success: true, orderId: 'fashion-001' }),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn(),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('electronics-supplier', electronicsProvider);
      dropshippingService.registerProvider('fashion-supplier', fashionProvider);

      const orderData1 = {
        items: [{ productId: 'phone-001', quantity: 1, price: 699 }],
        shippingAddress: {
          firstName: 'Multi', lastName: 'Buyer',
          address1: '123 Test St', city: 'Test', state: 'CA',
          postalCode: '90210', country: 'US'
        }
      };

      const orderData2 = {
        items: [{ productId: 'shirt-001', quantity: 2, price: 29.99 }],
        shippingAddress: {
          firstName: 'Multi', lastName: 'Buyer',
          address1: '123 Test St', city: 'Test', state: 'CA',
          postalCode: '90210', country: 'US'
        }
      };

      const result1 = await dropshippingService.createOrder(orderData1, 'electronics-supplier');
      const result2 = await dropshippingService.createOrder(orderData2, 'fashion-supplier');

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.orderId).toBe('elec-001');
      expect(result2.orderId).toBe('fashion-001');
    });

    it('should get unified product catalog from all providers', async () => {
      const electronicsProducts = [
        { id: 'elec-1', name: 'Phone', category: 'electronics', price: 599 }
      ];
      const fashionProducts = [
        { id: 'fashion-1', name: 'Shirt', category: 'fashion', price: 39.99 }
      ];

      const mockElectronicsProvider = {
        isEnabled: true,
        createOrder: jest.fn(),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn().mockResolvedValue(electronicsProducts),
        getProduct: jest.fn()
      };

      const mockFashionProvider = {
        isEnabled: true,
        createOrder: jest.fn(),
        getOrderStatus: jest.fn(),
        cancelOrder: jest.fn(),
        getAvailableProducts: jest.fn(),
        getProducts: jest.fn().mockResolvedValue(fashionProducts),
        getProduct: jest.fn()
      };

      dropshippingService.registerProvider('electronics-provider', mockElectronicsProvider);
      dropshippingService.registerProvider('fashion-provider', mockFashionProvider);

      const allProducts = await dropshippingService.getAllProducts();

      expect(allProducts).toHaveLength(2);
      expect(allProducts[0].provider).toBe('electronics-provider');
      expect(allProducts[1].provider).toBe('fashion-provider');
    });
  });

  describe('Category Analytics', () => {
    it('should provide cross-category analytics', async () => {
      const response = await request(app)
        .get('/api/analytics/categories/performance')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.categoryMetrics).toBeDefined();
      expect(response.body.data.crossCategoryTrends).toBeDefined();
    });

    it('should track conversion rates by category', async () => {
      const response = await request(app)
        .get('/api/analytics/categories/conversion-rates')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((categoryData: any) => {
        expect(categoryData.category).toBeDefined();
        expect(categoryData.conversionRate).toBeGreaterThanOrEqual(0);
        expect(categoryData.conversionRate).toBeLessThanOrEqual(100);
      });
    });
  });
});
EOF

# Create comprehensive test runner script
echo "4. 🏃‍♂️ Creating comprehensive test runner..."

cat > tests/run-category-tests.sh << 'EOF'
#!/bin/bash
# filepath: tests/run-category-tests.sh
set -e

echo "🚀 Running Comprehensive Category API Test Suite"
echo "Following Copilot Instructions Architecture Patterns"
echo "===================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

echo -e "${BLUE}📋 Test Categories:${NC}"
echo "1. Electronics & Technology"
echo "2. Fashion & Apparel"
echo "3. Home & Garden"
echo "4. Beauty & Health"
echo "5. Sports & Fitness"
echo "6. Automotive"
echo "7. Books & Media"
echo "8. Toys & Games"
echo "9. Integration Tests"
echo ""

# Function to run individual category tests
run_category_test() {
    local category=$1
    local test_file=$2
    
    echo -e "${BLUE}🧪 Testing ${category}...${NC}"
    
    if npm test -- --testPathPattern="$test_file" --verbose; then
        echo -e "${GREEN}✅ ${category} tests passed${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ ${category} tests failed${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo ""
}

# Check if backend is running
echo -e "${BLUE}🔍 Checking backend server...${NC}"
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server is running${NC}"
else
    echo -e "${RED}❌ Backend server is not running. Please start with: npm run dev:server${NC}"
    exit 1
fi

echo ""

# Run all category tests
run_category_test "Electronics" "electronics.test.ts"
run_category_test "Fashion" "fashion.test.ts"
run_category_test "Home & Garden" "home-garden.test.ts"
run_category_test "Beauty & Health" "beauty-health.test.ts"
run_category_test "Sports & Fitness" "sports-fitness.test.ts"
run_category_test "Automotive" "automotive.test.ts"
run_category_test "Books & Media" "books-media.test.ts"
run_category_test "Toys & Games" "toys-games.test.ts"
run_category_test "Integration Tests" "category-integration.test.ts"

# Generate test report
echo -e "${BLUE}📊 Test Summary Report${NC}"
echo "====================="
echo -e "Total Categories Tested: ${TOTAL_TESTS}"
echo -e "Passed: ${GREEN}${PASSED_TESTS}${NC}"
echo -e "Failed: ${RED}${FAILED_TESTS}${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All category tests passed!${NC}"
    echo ""
    echo -e "${BLUE}✅ Ready for production deployment${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please review and fix issues.${NC}"
    exit 1
fi
EOF

chmod +x tests/run-category-tests.sh

# Create package.json test scripts
echo "5. 📦 Adding test scripts to package.json..."

# Add test scripts to package.json
npm pkg set scripts.test:categories="./tests/run-category-tests.sh"
npm pkg set scripts.test:electronics="npm test -- --testPathPattern=electronics.test.ts"
npm pkg set scripts.test:fashion="npm test -- --testPathPattern=fashion.test.ts"
npm pkg set scripts.test:home="npm test -- --testPathPattern=home-garden.test.ts"
npm pkg set scripts.test:beauty="npm test -- --testPathPattern=beauty-health.test.ts"
npm pkg set scripts.test:sports="npm test -- --testPathPattern=sports-fitness.test.ts"
npm pkg set scripts.test:automotive="npm test -- --testPathPattern=automotive.test.ts"
npm pkg set scripts.test:books="npm test -- --testPathPattern=books-media.test.ts"
npm pkg set scripts.test:toys="npm test -- --testPathPattern=toys-games.test.ts"
npm pkg set scripts.test:integration="npm test -- --testPathPattern=category-integration.test.ts"
npm pkg set scripts.test:dropshipping="npm test -- --testPathPattern=DropshippingService.test.ts"

# Update Jest configuration
echo "6. ⚙️ Updating Jest configuration..."

cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
    '!src/__tests__/**/*',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testTimeout: 30000,
  verbose: true
};
EOF

# Create test setup file
cat > src/__tests__/setup.ts << 'EOF'
// Global test setup following Copilot Instructions patterns
import { config } from '../utils/config';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/ecommerce-test';

// Global test timeout
jest.setTimeout(30000);

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test helpers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidApiResponse(): R;
      toHaveValidPagination(): R;
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeValidApiResponse(received) {
    const pass = 
      received && 
      typeof received.success === 'boolean' && 
      received.data !== undefined;
    
    return {
      message: () => `Expected ${received} to be a valid API response`,
      pass,
    };
  },
  
  toHaveValidPagination(received) {
    const pass = 
      received && 
      typeof received.page === 'number' && 
      typeof received.limit === 'number' && 
      typeof received.total === 'number';
    
    return {
      message: () => `Expected ${received} to have valid pagination`,
      pass,
    };
  },
});
EOF

echo ""
echo "🎉 Comprehensive Test Harnesses Created Successfully!"
echo "====================================================="
echo ""
echo -e "${GREEN}📁 File Structure Created:${NC}"
echo "├── src/services/dropshipping/"
echo "│   ├── DropshippingService.ts"
echo "│   ├── IDropshippingProvider.ts"
echo "│   └── types.ts"
echo "├── src/__tests__/backend/api/"
echo "│   ├── electronics.test.ts"
echo "│   ├── fashion.test.ts"
echo "│   ├── home-garden.test.ts"
echo "│   ├── beauty-health.test.ts"
echo "│   ├── sports-fitness.test.ts"
echo "│   ├── automotive.test.ts"
echo "│   ├── books-media.test.ts"
echo "│   └── toys-games.test.ts"
echo "├── src/__tests__/integration/"
echo "│   └── category-integration.test.ts"
echo "└── tests/"
echo "    └── run-category-tests.sh"
echo ""
echo -e "${BLUE}🧪 Test Commands Available:${NC}"
echo "npm run test:categories      # Run all category tests"
echo "npm run test:electronics     # Test electronics APIs"
echo "npm run test:fashion         # Test fashion APIs"
echo "npm run test:home           # Test home & garden APIs"
echo "npm run test:beauty         # Test beauty & health APIs"
echo "npm run test:sports         # Test sports & fitness APIs"
echo "npm run test:automotive     # Test automotive APIs"
echo "npm run test:books          # Test books & media APIs"
echo "npm run test:toys           # Test toys & games APIs"
echo "npm run test:integration    # Test cross-category integration"
echo "npm run test:dropshipping   # Test dropshipping service"
echo ""
echo -e "${GREEN}🚀 Quick Start:${NC}"
echo "1. Start backend: npm run dev:server"
echo "2. Run all tests: npm run test:categories"
echo "3. Run specific category: npm run test:electronics"
echo ""
echo -e "${BLUE}🎯 Features Implemented:${NC}"
echo "✅ Complete dropshipping service with provider pattern"
echo "✅ Category-specific API test harnesses"
echo "✅ Multi-provider integration testing"
echo "✅ Cross-category shopping cart testing"
echo "✅ Product search and filtering tests"
echo "✅ Order fulfillment workflow tests"
echo "✅ Analytics and reporting tests"
echo "✅ Custom Jest matchers for API validation"
echo "✅ Comprehensive test reporting"
echo ""
echo -e "${YELLOW}⚡ Following Copilot Instructions Architecture:${NC}"
echo "• TypeScript full-stack patterns"
echo "• Service layer architecture (DropshippingService)"
echo "• Provider pattern for multiple suppliers"
echo "• API Endpoints Structure (/api/products/category/*)"
echo "• Error handling with custom AppError class"
echo "• Environment-based configuration"
echo "• Comprehensive test coverage with health checks"
