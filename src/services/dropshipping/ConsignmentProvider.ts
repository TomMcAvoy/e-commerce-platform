import { IDropshippingProvider, ProductSearchParams, OrderCreationResult, DropshipOrderData } from './types';

export class ConsignmentProvider implements IDropshippingProvider {
  getProviderName(): string {
    return 'consignment';
  }

  async fetchProducts(params: ProductSearchParams = {}) {
    // Products from consignment partners
    return [
      {
        id: 'consign-001',
        title: 'Consignment Product',
        price: 25.00,
        supplier: 'Consignment Partner',
        paymentTerms: 'pay_after_sale'
      }
    ];
  }

  async createOrder(orderData: DropshipOrderData): Promise<OrderCreationResult> {
    return {
      success: true,
      orderId: `consign-${Date.now()}`,
      externalOrderId: `consign-${Date.now()}`,
      status: 'shipped_pay_on_sale',
      paymentDue: 'after_customer_delivery'
    };
  }

  async checkHealth() {
    return { status: 'healthy', provider: 'consignment' };
  }
}