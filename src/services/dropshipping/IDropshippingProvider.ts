// Following DropshippingService architecture pattern
export interface IDropshippingProvider {
  isEnabled: boolean;
  
  // Order management methods
  createOrder(orderData: any): Promise<any>;
  getOrderStatus(orderId: string): Promise<any>;
  cancelOrder(orderId: string): Promise<any>;
  
  // Product management methods
  getAvailableProducts(query?: any): Promise<any[]>;
  getProducts(query?: any): Promise<any[]>;
  getProduct(productId: string): Promise<any>;
  
  // Health check method
  healthCheck?(): Promise<boolean>;
}

export interface DropshippingOrder {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface DropshippingProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  images: string[];
  category: string;
  stock: number;
  provider: string;
}
