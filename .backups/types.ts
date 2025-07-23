export interface DropshipOrderItem {
  productId: string;
  quantity: number;
  price: number;
  // Note: name is not part of the core interface but can be added in implementations
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface DropshipOrderData {
  items: DropshipOrderItem[];
  shippingAddress: ShippingAddress;
}

export interface DropshipOrderResult {
  success: boolean;
  orderId: string;
  providerOrderId?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  cost: number;
  message: string;
}

export interface StatusUpdate {
  timestamp: Date;
  status: string;
  message: string;
}

export interface OrderStatus {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  lastUpdated: Date;
  updates: StatusUpdate[];
}

export interface DropshipProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  variants: ProductVariant[];
  provider: string;
  category: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface ProductSearchQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  provider?: string;
}

export interface IDropshippingProvider {
  createOrder(orderData: DropshipOrderData): Promise<DropshipOrderResult>;
  getOrderStatus(orderId: string): Promise<OrderStatus>;
  cancelOrder(orderId: string): Promise<boolean>;
  getAvailableProducts(query?: ProductSearchQuery): Promise<DropshipProduct[]>;
}
