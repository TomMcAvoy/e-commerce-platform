import { IDropshippingProvider, ProductSearchParams, OrderCreationResult, DropshipOrderData } from './types';
import axios from 'axios';

export class Net30Provider implements IDropshippingProvider {
  private apiKey: string;
  private baseUrl = 'https://api.alibaba.com/v1'; // Example B2B supplier

  constructor(config: { apiKey: string }) {
    this.apiKey = config.apiKey;
  }

  getProviderName(): string {
    return 'net30';
  }

  async fetchProducts(params: ProductSearchParams = {}) {
    const response = await axios.get(`${this.baseUrl}/products`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      params: { ...params, payment_terms: 'net30' }
    });
    return response.data.products;
  }

  async createOrder(orderData: DropshipOrderData): Promise<OrderCreationResult> {
    const response = await axios.post(`${this.baseUrl}/orders`, {
      ...orderData,
      payment_terms: 'net30',
      credit_application_id: process.env.CREDIT_APPLICATION_ID
    }, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    });

    return {
      success: true,
      orderId: response.data.order_id,
      externalOrderId: response.data.supplier_order_id,
      status: 'approved_net30',
      paymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };
  }

  async checkHealth() {
    return { status: 'healthy', provider: 'net30' };
  }
}