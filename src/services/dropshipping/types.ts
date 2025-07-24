export interface DropshipOrderItem {
  productId: string;
  quantity: number;
  price: number;
  variantId?: string;
  customization?: Record<string, any>;
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
  phone?: string;
}

export interface DropshipOrderData {
  items: DropshipOrderItem[];
  shippingAddress: ShippingAddress;
  customerEmail?: string;
  orderNotes?: string;
}

export interface DropshipOrderResult {
  success: boolean;
  orderId?: string;
  providerOrderId?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  cost?: number;
  message?: string;
  error?: string;
}

export interface DropshipProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  variants?: ProductVariant[];
  category?: string;
  provider?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
  attributes: Record<string, string>;
}

export interface OrderStatus {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  updates?: OrderUpdate[];
}

export interface OrderUpdate {
  timestamp: Date;
  status: string;
  message: string;
  location?: string;
}

export interface ProductQuery {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

export interface ProviderHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'disabled';
  lastChecked: Date;
  responseTime?: number;
  error?: string;
}

export interface ProviderStatus {
  name: string;
  enabled: boolean;
  connected: boolean;
  lastUpdate: Date;
}
