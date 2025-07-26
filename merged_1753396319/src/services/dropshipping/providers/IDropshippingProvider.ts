/**
 * IDropshippingProvider interface following Critical Integration Points from Copilot Instructions
 * Defines contract for all dropshipping providers
 */
export interface IDropshippingProvider {
  createOrder(orderData: any): Promise<any>;
  getProducts(query?: any): Promise<any>;
  checkHealth(): Promise<any>;
  syncProducts(): Promise<any>;
  calculateShipping(data: any): Promise<any>;
}