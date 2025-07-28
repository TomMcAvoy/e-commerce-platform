import axios from 'axios';
import { IDropshippingProvider, OrderCreationResult, DropshipProduct, InventoryUpdate, DropshipOrderData, ShippingInfo } from './types';
import AppError from '../../utils/AppError';

export class SpocketProvider implements IDropshippingProvider {
  private apiKey: string;
  private baseUrl = 'https://api.spocket.co/v1';

  constructor({ apiKey }: { apiKey?: string }) {
    if (!apiKey) {
      throw new Error('Spocket API key is required.');
    }
    this.apiKey = apiKey;
  }

  getProviderName(): string {
    return 'Spocket';
  }

  async checkHealth(): Promise<{ status: string; details: any; }> {
    try {
      await axios.get(`${this.baseUrl}/products/count`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      return { status: 'ok', details: 'Spocket provider is healthy' };
    } catch (error: any) {
      return { status: 'error', details: error.message };
    }
  }

  async createOrder(order: any): Promise<OrderCreationResult> {
    try {
      const response = await axios.post(`${this.baseUrl}/orders`, order, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      return response.data;
    } catch (error: any) {
      throw new AppError(`Spocket API Error - Order creation failed: ${error.message}`, 500);
    }
  }
  
  async fetchProducts(): Promise<DropshipProduct[]> {
    // Implementation
    return [];
  }

  async getProduct(id: string): Promise<DropshipProduct | null> {
    // Implementation
    return null;
  }

  async updateInventory(updates: InventoryUpdate[]): Promise<void> {
    // Implementation
    console.log('Updating Spocket inventory:', updates);
    // Spocket might have a bulk update endpoint.
    // This is a placeholder.
    await Promise.resolve();
  }

  async getOrderStatus(externalOrderId: string): Promise<{ status: string; details?: any; }> {
    // Implementation
    return { status: 'unknown' };
  }

  async cancelOrder(externalOrderId: string): Promise<{ success: boolean; }> {
    // Implementation
    return { success: true };
  }

  async calculateShipping(orderData: DropshipOrderData): Promise<ShippingInfo> {
    // Implementation
    console.log('Calculating Spocket shipping for:', orderData);
    // Placeholder logic
    return { cost: 12.99, estimatedDelivery: '5-7 business days' };
  }
}
