import { IOrder } from '../../models/Order';

// This is the contract that every dropshipping provider must implement.
export interface IDropshippingProvider {
  getProviderName(): string;
  checkHealth(): Promise<{ status: string; details: any }>;
  fetchProducts(params: ProductSearchParams): Promise<DropshipProduct[]>;
  createOrder(orderData: any): Promise<OrderCreationResult>;
  updateInventory(updates: InventoryUpdate[]): Promise<void>;
  calculateShipping(orderData: DropshipOrderData): Promise<ShippingInfo>;
  getOrderStatus?(provider: string, externalOrderId: string): Promise<OrderStatus>;
}

export interface ProductSearchParams {
  category?: string;
  keyword?: string;
  limit?: number;
  page?: number;
}

export interface DropshipProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  variants: any[];
  vendor: string;
}

export interface DropshipOrderData {
  orderId: string;
  items: { externalVariantId: string; quantity: number }[];
  shippingAddress: any;
  customerInfo: { name: string; email: string; phone?: string };
  notes?: string;
}

export interface OrderCreationResult {
  orderId: string;
  externalOrderId: string;
  status: string;
  providerData?: any;
}

export interface OrderStatus {
    status: string;
    trackingNumber?: string;
    trackingUrl?: string;
}

export interface ImportResult {
  success: boolean;
  productId?: string;
  message: string;
}

export interface InventoryUpdate {
  externalVariantId: string;
  quantity: number;
}

export interface ShippingInfo {
  cost: number;
  estimatedDelivery: string;
}

export interface PrintfulConfig { apiKey: string; }
export interface SpocketConfig { apiKey: string; }

export class DropshippingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DropshippingError';
  }
}
export class RateLimitError extends DropshippingError {}
export class ProductNotFoundError extends DropshippingError {}
export class OrderCreationError extends DropshippingError {}
