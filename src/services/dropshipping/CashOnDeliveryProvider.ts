import { IDropshippingProvider, ProductSearchParams, OrderCreationResult, DropshipOrderData } from './types';

export class CashOnDeliveryProvider implements IDropshippingProvider {
  getProviderName(): string {
    return 'cod';
  }

  async fetchProducts(params: ProductSearchParams = {}) {
    // Return products that support cash on delivery
    return [];
  }

  async createOrder(orderData: DropshipOrderData): Promise<OrderCreationResult> {
    // Create order with payment on delivery terms
    return {
      success: true,
      orderId: `cod-${Date.now()}`,
      externalOrderId: `cod-${Date.now()}`,
      status: 'pending_payment_on_delivery'
    };
  }

  async checkHealth() {
    return { status: 'healthy', provider: 'cod' };
  }
}