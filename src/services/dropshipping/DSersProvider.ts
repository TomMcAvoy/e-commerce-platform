import { IDropshippingProvider, ProductSearchParams, OrderCreationResult, DropshipOrderData, InventoryUpdate, ShippingInfo } from './types';
import axios from 'axios';

export class DSersProvider implements IDropshippingProvider {
  private apiKey: string;
  private baseUrl = 'https://api.dsers.com/v1';

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey;
  }

  getProviderName(): string {
    return 'dsers';
  }

  async fetchProducts(params: ProductSearchParams = {}) {
    try {
      const response = await axios.get(`${this.baseUrl}/products`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        params: {
          keyword: params.keyword || '',
          category: params.category,
          page: params.page || 1,
          limit: params.limit || 20
        }
      });

      return response.data.products.map((product: any) => ({
        id: product.product_id,
        name: product.title,
        description: product.description,
        price: product.price,
        imageUrl: product.images?.[0] || '',
        variants: product.variants || [],
        vendor: 'AliExpress'
      }));
    } catch (error) {
      console.error('DSers API error:', error);
      return [];
    }
  }

  async createOrder(orderData: DropshipOrderData): Promise<OrderCreationResult> {
    try {
      const response = await axios.post(`${this.baseUrl}/orders`, {
        products: orderData.items.map(item => ({
          variant_id: item.externalVariantId,
          quantity: item.quantity
        })),
        shipping_address: orderData.shippingAddress,
        customer_info: orderData.customerInfo,
        notes: orderData.notes
      }, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });

      return {
        orderId: orderData.orderId,
        externalOrderId: response.data.dsers_order_id,
        status: 'pending'
      };
    } catch (error) {
      throw new Error(`DSers order creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateInventory(updates: InventoryUpdate[]): Promise<void> {
    try {
      for (const update of updates) {
        await axios.put(`${this.baseUrl}/inventory/${update.externalVariantId}`, {
          quantity: update.quantity
        }, {
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        });
      }
      console.log('✅ DSers inventory updated');
    } catch (error) {
      console.error('DSers inventory update failed:', error);
      throw error;
    }
  }

  async calculateShipping(orderData: DropshipOrderData): Promise<ShippingInfo> {
    try {
      const response = await axios.post(`${this.baseUrl}/shipping/calculate`, {
        items: orderData.items,
        destination: orderData.shippingAddress
      }, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });

      return {
        cost: response.data.cost || 15.99,
        estimatedDelivery: response.data.estimated_delivery || '7-15 days'
      };
    } catch (error) {
      // Return default shipping info if calculation fails
      return {
        cost: 15.99,
        estimatedDelivery: '7-15 days'
      };
    }
  }

  async checkHealth() {
    try {
      await axios.get(`${this.baseUrl}/account`, {
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      return { status: 'healthy', details: { provider: 'dsers', connection: 'active' } };
    } catch (error) {
      return { status: 'unhealthy', details: { provider: 'dsers', error: error instanceof Error ? error.message : 'Connection failed' } };
    }
  }
}