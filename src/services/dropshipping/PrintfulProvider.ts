import axios, { AxiosInstance } from 'axios';
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
  PrintfulConfig,
  DropshippingError,
  RateLimitError,
  ProductNotFoundError,
  OrderCreationError
} from './types';

export class PrintfulProvider implements IDropshippingProvider {
  public readonly name = 'Printful';
  private client: AxiosInstance;
  private config: PrintfulConfig;

  constructor(config: PrintfulConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.environment === 'sandbox' 
        ? 'https://api.printful.com' 
        : 'https://api.printful.com',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'X-PF-Store-Id': config.storeId
      },
      timeout: 30000
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 429) {
          throw new RateLimitError('Printful', error.response.headers['retry-after']);
        }
        if (error.response?.status === 404) {
          throw new ProductNotFoundError('Printful', 'unknown');
        }
        throw new DropshippingError(
          error.message || 'Printful API error',
          'Printful',
          error.response?.status?.toString(),
          error.response?.data
        );
      }
    );
  }

  async initialize(): Promise<void> {
    try {
      // Test the connection
      const response = await this.client.get('/store');
      console.log(`✅ Printful initialized for store: ${response.data.result?.name || 'Unknown'}`);
    } catch (error) {
      throw new DropshippingError('Failed to initialize Printful', 'Printful', 'INIT_FAILED', error);
    }
  }

  async searchProducts(query: ProductSearchParams): Promise<DropshipProduct[]> {
    try {
      // Get all available products (Printful doesn't have a search endpoint)
      const response = await this.client.get('/products');
      const products = response.data.result || [];

      // Filter products based on query
      let filteredProducts = products;
      
      if (query.keyword) {
        const keyword = query.keyword.toLowerCase();
        filteredProducts = products.filter((product: any) => 
          product.title.toLowerCase().includes(keyword) ||
          product.description?.toLowerCase().includes(keyword)
        );
      }

      if (query.category) {
        filteredProducts = filteredProducts.filter((product: any) => 
          product.type_name?.toLowerCase().includes(query.category!.toLowerCase())
        );
      }

      // Apply pagination
      const page = query.page || 1;
      const limit = query.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return filteredProducts.slice(startIndex, endIndex).map(this.transformProduct);
    } catch (error) {
      throw new DropshippingError('Failed to search Printful products', 'Printful', 'SEARCH_FAILED', error);
    }
  }

  async getProduct(productId: string): Promise<DropshipProduct> {
    try {
      const response = await this.client.get(`/products/${productId}`);
      return this.transformProduct(response.data.result);
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw error;
      }
      throw new DropshippingError('Failed to get Printful product', 'Printful', 'GET_PRODUCT_FAILED', error);
    }
  }

  async importProduct(productId: string): Promise<ImportResult> {
    try {
      const product = await this.getProduct(productId);
      
      // Here you would save the product to your local database
      // For now, we'll simulate a successful import
      
      return {
        success: true,
        productId,
        localProductId: `local_${productId}`,
        message: 'Product imported successfully from Printful'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to import product from Printful',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  async syncInventory(productIds: string[]): Promise<InventoryUpdate[]> {
    const updates: InventoryUpdate[] = [];
    
    for (const productId of productIds) {
      try {
        const product = await this.getProduct(productId);
        
        updates.push({
          productId,
          stock: 999, // Printful is print-on-demand, so always in stock
          available: true
        });

        // Add variant updates
        for (const variant of product.variants) {
          updates.push({
            productId,
            variantId: variant.id,
            stock: 999,
            price: variant.price,
            available: true
          });
        }
      } catch (error) {
        console.error(`Failed to sync inventory for product ${productId}:`, error);
        updates.push({
          productId,
          stock: 0,
          available: false
        });
      }
    }

    return updates;
  }

  async createOrder(orderData: DropshipOrderData): Promise<DropshipOrderResult> {
    try {
      const printfulOrder = {
        external_id: `order_${Date.now()}`,
        shipping: 'STANDARD',
        recipient: {
          name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
          company: '',
          address1: orderData.shippingAddress.address1,
          address2: orderData.shippingAddress.address2 || '',
          city: orderData.shippingAddress.city,
          state_code: orderData.shippingAddress.state,
          country_code: orderData.shippingAddress.country,
          zip: orderData.shippingAddress.postalCode,
          phone: orderData.customerInfo.phone || '',
          email: orderData.customerInfo.email
        },
        items: orderData.items.map(item => ({
          sync_variant_id: item.variantId || item.productId,
          quantity: item.quantity,
          retail_price: item.price.toFixed(2)
        }))
      };

      const response = await this.client.post('/orders', printfulOrder);
      const order = response.data.result;

      return {
        success: true,
        orderId: order.id?.toString(),
        cost: parseFloat(order.costs?.total || '0'),
        message: 'Order created successfully with Printful'
      };
    } catch (error) {
      throw new OrderCreationError('Printful', error instanceof Error ? error.message : 'Unknown error', error);
    }
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    try {
      const response = await this.client.get(`/orders/${orderId}`);
      const order = response.data.result;

      return {
        orderId,
        status: this.mapPrintfulStatus(order.status),
        trackingNumber: order.shipments?.[0]?.tracking_number,
        trackingUrl: order.shipments?.[0]?.tracking_url,
        updates: [{
          timestamp: new Date(order.updated),
          status: order.status,
          description: `Order ${order.status}`
        }]
      };
    } catch (error) {
      throw new DropshippingError('Failed to get Printful order status', 'Printful', 'GET_STATUS_FAILED', error);
    }
  }

  async getShippingInfo(orderId: string): Promise<ShippingInfo> {
    try {
      const response = await this.client.get(`/orders/${orderId}`);
      const order = response.data.result;

      return {
        methods: [{
          name: 'Standard',
          cost: parseFloat(order.costs?.shipping || '0'),
          time: { min: 7, max: 14, unit: 'days' },
          trackingAvailable: true
        }],
        processingTime: 3,
        countries: ['US', 'CA', 'EU', 'AU', 'JP'] // Printful ships worldwide
      };
    } catch (error) {
      throw new DropshippingError('Failed to get Printful shipping info', 'Printful', 'GET_SHIPPING_FAILED', error);
    }
  }

  private transformProduct(printfulProduct: any): DropshipProduct {
    return {
      id: printfulProduct.id?.toString() || '',
      title: printfulProduct.title || '',
      description: printfulProduct.description || '',
      images: printfulProduct.image ? [printfulProduct.image] : [],
      price: parseFloat(printfulProduct.price || '0'),
      currency: 'USD',
      category: printfulProduct.type_name || 'Custom Products',
      tags: [printfulProduct.type_name, 'print-on-demand', 'custom'].filter(Boolean),
      variants: (printfulProduct.variants || []).map((variant: any) => ({
        id: variant.id?.toString() || '',
        name: variant.name || '',
        options: this.parseVariantOptions(variant),
        price: parseFloat(variant.price || '0'),
        stock: 999, // Print-on-demand, always available
        sku: variant.sku || '',
        image: variant.image || printfulProduct.image
      })),
      supplier: {
        id: 'printful',
        name: 'Printful',
        rating: 4.8,
        country: 'LV',
        shippingTime: { min: 7, max: 14, unit: 'days' }
      },
      shippingInfo: {
        methods: [{
          name: 'Standard',
          cost: 4.99,
          time: { min: 7, max: 14, unit: 'days' },
          trackingAvailable: true
        }],
        processingTime: 3,
        countries: ['US', 'CA', 'EU', 'AU', 'JP']
      },
      specifications: {
        'Print Method': 'DTG/Embroidery',
        'Material': 'Various',
        'Care Instructions': 'Machine wash cold'
      }
    };
  }

  private parseVariantOptions(variant: any): { [key: string]: string } {
    const options: { [key: string]: string } = {};
    
    if (variant.size) options.size = variant.size;
    if (variant.color) options.color = variant.color;
    
    return options;
  }

  private mapPrintfulStatus(status: string): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' {
    const statusMap: { [key: string]: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' } = {
      'draft': 'pending',
      'pending': 'pending',
      'confirmed': 'processing',
      'inprocess': 'processing',
      'onhold': 'processing',
      'partial': 'shipped',
      'fulfilled': 'shipped',
      'shipped': 'shipped',
      'returned': 'cancelled',
      'canceled': 'cancelled'
    };

    return statusMap[status] || 'pending';
  }
}
