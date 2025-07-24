import { 
  DropshipOrderData, 
  DropshipOrderResult, 
  DropshipProduct, 
  OrderStatus, 
  ProductQuery 
} from './types';

export interface IDropshippingProvider {
  isEnabled: boolean;
  
  /**
   * Create a new dropshipping order
   */
  createOrder(orderData: DropshipOrderData): Promise<DropshipOrderResult>;
  
  /**
   * Get the status of an existing order
   */
  getOrderStatus(orderId: string): Promise<OrderStatus>;
  
  /**
   * Cancel an existing order
   */
  cancelOrder(orderId: string): Promise<boolean>;
  
  /**
   * Get available products from this provider
   */
  getAvailableProducts(query?: ProductQuery): Promise<DropshipProduct[]>;
  
  /**
   * Get products with query parameters
   */
  getProducts(query?: ProductQuery): Promise<DropshipProduct[]>;
  
  /**
   * Get a specific product by ID
   */
  getProduct(productId: string): Promise<DropshipProduct | null>;
}
