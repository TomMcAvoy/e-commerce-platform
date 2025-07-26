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
  SpocketConfig,
  DropshippingError,
  RateLimitError,
  ProductNotFoundError,
  OrderCreationError
} from './types';

export class SpocketProvider implements IDropshippingProvider {
  public readonly name = 'Spocket';
  private client: AxiosInstance;
  private config: SpocketConfig;

  constructor(config: SpocketConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.environment === 'sandbox' 
        ? 'https://api.spocket.co/api/v1' 
        : 'https://api.spocket.co/api/v1',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 429) {
          throw new RateLimitError('Spocket', error.response.headers['retry-after']);
        }
        if (error.response?.status === 404) {
          throw new ProductNotFoundError('Spocket', 'unknown');
        }
        throw new DropshippingError(
          error.message || 'Spocket API error',
          'Spocket',
          error.response?.status?.toString(),
          error.response?.data
        );
      }
    );
  }

  async initialize(): Promise<void> {
    try {
      // Test the connection by getting user info
      const response = await this.client.get('/user');
      console.log(`✅ Spocket initialized for user: ${response.data.email || 'Unknown'}`);
    } catch (error) {
      throw new DropshippingError('Failed to initialize Spocket', 'Spocket', 'INIT_FAILED', error);
    }
  }

  async searchProducts(query: ProductSearchParams): Promise<DropshipProduct[]> {
    try {
      const params: any = {
        page: query.page || 1,
        per_page: query.limit || 20
      };

      if (query.keyword) params.search = query.keyword;
      if (query.category) params.category = query.category;
      if (query.minPrice) params.min_price = query.minPrice;
      if (query.maxPrice) params.max_price = query.maxPrice;
      if (query.sortBy) {
        params.sort_by = query.sortBy;
        params.sort_order = query.sortOrder || 'desc';
      }

      const response = await this.client.get('/products', { params });
      const products = response.data.products || [];

      return products.map((product: any) => this.transformProduct(product));
    } catch (error) {
      throw new DropshippingError('Failed to search Spocket products', 'Spocket', 'SEARCH_FAILED', error);
    }
  }

  async getProduct(productId: string): Promise<DropshipProduct> {
    try {
      const response = await this.client.get(`/products/${productId}`);
      return this.transformProduct(response.data.product);
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw error;
      }
      throw new DropshippingError('Failed to get Spocket product', 'Spocket', 'GET_PRODUCT_FAILED', error);
    }
  }

  async importProduct(productId: string): Promise<ImportResult> {
    try {
      // Import product to store
      const response = await this.client.post(`/products/${productId}/import`);
      
      return {
        success: true,
        productId,
        localProductId: response.data.product_id?.toString(),
        message: 'Product imported successfully from Spocket'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to import product from Spocket',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  async syncInventory(productIds: string[]): Promise<InventoryUpdate[]> {
    const updates: InventoryUpdate[] = [];
    
    try {
      const response = await this.client.post('/products/inventory', {
        product_ids: productIds
      });

      const inventoryData = response.data.products || [];
      
      for (const product of inventoryData) {
        updates.push({
          productId: product.id?.toString(),
          stock: product.inventory || 0,
          price: parseFloat(product.price || '0'),
          available: product.inventory > 0
        });

        // Add variant updates if available
        if (product.variants) {
          for (const variant of product.variants) {
            updates.push({
              productId: product.id?.toString(),
              variantId: variant.id?.toString(),
              stock: variant.inventory || 0,
              price: parseFloat(variant.price || '0'),
              available: variant.inventory > 0
            });
          }
        }
      }
    } catch (error) {
      console.error('Failed to sync Spocket inventory:', error);
      // Return empty stock for all products on error
      for (const productId of productIds) {
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
      const spocketOrder = {
        shipping_address: {
          first_name: orderData.shippingAddress.firstName,
          last_name: orderData.shippingAddress.lastName,
          address1: orderData.shippingAddress.address1,
          address2: orderData.shippingAddress.address2 || '',
          city: orderData.shippingAddress.city,
          province: orderData.shippingAddress.state,
          country: orderData.shippingAddress.country,
          zip: orderData.shippingAddress.postalCode,
          phone: orderData.customerInfo.phone || ''
        },
        line_items: orderData.items.map(item => ({
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price.toFixed(2)
        })),
        customer: {
          email: orderData.customerInfo.email,
          first_name: orderData.customerInfo.name.split(' ')[0],
          last_name: orderData.customerInfo.name.split(' ').slice(1).join(' ')
        },
        note: orderData.notes || ''
      };

      const response = await this.client.post('/orders', spocketOrder);
      const order = response.data.order;

      return {
        success: true,
        orderId: order.id?.toString(),
        trackingNumber: order.tracking_number,
        cost: parseFloat(order.total_price || '0'),
        message: 'Order created successfully with Spocket'
      };
    } catch (error) {
      throw new OrderCreationError('Spocket', error instanceof Error ? error.message : 'Unknown error', error);
    }
  }

  async getOrderStatus(orderId: string): Promise<OrderStatus> {
    try {
      const response = await this.client.get(`/orders/${orderId}`);
      const order = response.data.order;

      return {
        orderId,
        status: this.mapSpocketStatus(order.fulfillment_status),
        trackingNumber: order.tracking_number,
        trackingUrl: order.tracking_url,
        estimatedDelivery: order.estimated_delivery ? new Date(order.estimated_delivery) : undefined,
        updates: order.status_updates?.map((update: any) => ({
          timestamp: new Date(update.created_at),
          status: update.status,
          location: update.location,
          description: update.message
        })) || []
      };
    } catch (error) {
      throw new DropshippingError('Failed to get Spocket order status', 'Spocket', 'GET_STATUS_FAILED', error);
    }
  }

  async getShippingInfo(orderId: string): Promise<ShippingInfo> {
    try {
      const response = await this.client.get(`/orders/${orderId}/shipping`);
      const shipping = response.data.shipping;

      return {
        methods: shipping.methods?.map((method: any) => ({
          name: method.name,
          cost: parseFloat(method.price || '0'),
          time: {
            min: method.min_delivery_days || 3,
            max: method.max_delivery_days || 7,
            unit: 'days' as const
          },
          trackingAvailable: method.tracking_available || true
        })) || [],
        processingTime: shipping.processing_time || 1,
        countries: shipping.countries || ['US', 'CA', 'EU']
      };
    } catch (error) {
      throw new DropshippingError('Failed to get Spocket shipping info', 'Spocket', 'GET_SHIPPING_FAILED', error);
    }
  }

  private transformProduct(spocketProduct: any): DropshipProduct {
    return {
      id: spocketProduct.id?.toString() || '',
      title: spocketProduct.title || '',
      description: spocketProduct.description || '',
      images: spocketProduct.images?.map((img: any) => img.src || img.url) || [],
      price: parseFloat(spocketProduct.price || '0'),
      compareAtPrice: parseFloat(spocketProduct.compare_at_price || '0') || undefined,
      currency: spocketProduct.currency || 'USD',
      category: spocketProduct.category || 'General',
      tags: spocketProduct.tags || [],
      variants: (spocketProduct.variants || []).map((variant: any) => ({
        id: variant.id?.toString() || '',
        name: variant.title || '',
        options: this.parseVariantOptions(variant),
        price: parseFloat(variant.price || '0'),
        stock: variant.inventory_quantity || 0,
        sku: variant.sku || '',
        image: variant.image_src
      })),
      supplier: {
        id: spocketProduct.supplier?.id?.toString() || '',
        name: spocketProduct.supplier?.name || 'Unknown Supplier',
        rating: spocketProduct.supplier?.rating || 4.0,
        country: spocketProduct.supplier?.country || 'US',
        shippingTime: {
          min: spocketProduct.supplier?.shipping_time?.min || 3,
          max: spocketProduct.supplier?.shipping_time?.max || 7,
          unit: 'days'
        },
        communicationRating: spocketProduct.supplier?.communication_rating,
        serviceRating: spocketProduct.supplier?.service_rating
      },
      shippingInfo: {
        methods: spocketProduct.shipping_methods?.map((method: any) => ({
          name: method.name,
          cost: parseFloat(method.price || '0'),
          time: {
            min: method.min_days || 3,
            max: method.max_days || 7,
            unit: 'days' as const
          },
          trackingAvailable: true
        })) || [],
        processingTime: spocketProduct.processing_time || 1,
        countries: spocketProduct.shipping_countries || ['US', 'CA']
      },
      specifications: spocketProduct.specifications || {},
      reviews: spocketProduct.reviews ? {
        rating: spocketProduct.reviews.average_rating || 0,
        count: spocketProduct.reviews.count || 0
      } : undefined
    };
  }

  private parseVariantOptions(variant: any): { [key: string]: string } {
    const options: { [key: string]: string } = {};
    
    if (variant.option1) options.option1 = variant.option1;
    if (variant.option2) options.option2 = variant.option2;
    if (variant.option3) options.option3 = variant.option3;
    
    // Map common option names
    if (variant.size) options.size = variant.size;
    if (variant.color) options.color = variant.color;
    if (variant.material) options.material = variant.material;
    
    return options;
  }

  private mapSpocketStatus(status: string): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' {
    const statusMap: { [key: string]: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' } = {
      'unfulfilled': 'pending',
      'pending': 'pending',
      'processing': 'processing',
      'fulfilled': 'shipped',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'cancelled',
      'refunded': 'cancelled'
    };

    return statusMap[status] || 'pending';
  }
}
