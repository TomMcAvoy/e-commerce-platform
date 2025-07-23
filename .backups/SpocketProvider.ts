import { IDropshippingProvider } from '../IDropshippingProvider';

export class SpocketProvider implements IDropshippingProvider {
  public isEnabled: boolean = true;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
    this.isEnabled = !!this.apiKey;
  }

  async createOrder(orderData: any): Promise<any> {
    if (!this.isEnabled) {
      throw new Error('Spocket provider is not enabled');
    }
    // Implementation placeholder
    throw new Error('Spocket createOrder not implemented');
  }

  async getOrderStatus(orderId: string): Promise<any> {
    if (!this.isEnabled) {
      throw new Error('Spocket provider is not enabled');
    }
    // Implementation placeholder
    throw new Error('Spocket getOrderStatus not implemented');
  }

  async cancelOrder(orderId: string): Promise<any> {
    if (!this.isEnabled) {
      throw new Error('Spocket provider is not enabled');
    }
    // Implementation placeholder
    throw new Error('Spocket cancelOrder not implemented');
  }

  async getAvailableProducts(query?: any): Promise<any[]> {
    return this.getProducts(query);
  }

  async getProducts(query?: any): Promise<any[]> {
    if (!this.isEnabled) {
      return [];
    }
    // Implementation placeholder
    return [];
  }

  async getProduct(productId: string): Promise<any> {
    if (!this.isEnabled) {
      throw new Error('Spocket provider is not enabled');
    }
    // Implementation placeholder
    throw new Error('Spocket getProduct not implemented');
  }
}
