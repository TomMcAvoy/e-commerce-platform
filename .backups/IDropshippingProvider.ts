export interface IDropshippingProvider {
  isEnabled: boolean;
  createOrder(orderData: any): Promise<any>;
  getOrderStatus(orderId: string): Promise<any>;
  cancelOrder(orderId: string): Promise<any>;
  getAvailableProducts(query?: any): Promise<any[]>;
  getProducts(query?: any): Promise<any[]>;
  getProduct(productId: string): Promise<any>;
}
