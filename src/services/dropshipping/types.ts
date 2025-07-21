// Base interface for all dropshipping providers
export interface IDropshippingProvider {
  name: string;
  initialize(config?: any): Promise<void>;
  searchProducts(query: ProductSearchParams): Promise<DropshipProduct[]>;
  getProduct(productId: string): Promise<DropshipProduct>;
  importProduct(productId: string): Promise<ImportResult>;
  syncInventory(productIds: string[]): Promise<InventoryUpdate[]>;
  createOrder(orderData: DropshipOrderData): Promise<DropshipOrderResult>;
  getOrderStatus(orderId: string): Promise<OrderStatus>;
  getShippingInfo(orderId: string): Promise<ShippingInfo>;
}

export interface ProductSearchParams {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'sales' | 'newest';
  sortOrder?: 'asc' | 'desc';
  country?: string;
  supplierId?: string;
}

export interface DropshipProduct {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  currency: string;
  category: string;
  tags: string[];
  variants: ProductVariant[];
  supplier: SupplierInfo;
  shippingInfo: ShippingInfo;
  specifications: { [key: string]: string };
  reviews?: {
    rating: number;
    count: number;
  };
}

export interface ProductVariant {
  id: string;
  name: string;
  options: { [key: string]: string }; // e.g., { color: 'red', size: 'M' }
  price: number;
  stock: number;
  sku?: string;
  image?: string;
}

export interface SupplierInfo {
  id: string;
  name: string;
  rating: number;
  country: string;
  shippingTime: {
    min: number;
    max: number;
    unit: 'days' | 'weeks';
  };
  communicationRating?: number;
  serviceRating?: number;
}

export interface ShippingInfo {
  methods: ShippingMethod[];
  processingTime: number; // days
  countries: string[];
}

export interface ShippingMethod {
  name: string;
  cost: number;
  time: {
    min: number;
    max: number;
    unit: 'days' | 'weeks';
  };
  trackingAvailable: boolean;
}

export interface ImportResult {
  success: boolean;
  productId?: string;
  localProductId?: string;
  message: string;
  errors?: string[];
}

export interface InventoryUpdate {
  productId: string;
  variantId?: string;
  stock: number;
  price?: number;
  available: boolean;
}

export interface DropshipOrderData {
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  shippingMethod?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
}

export interface DropshipOrderResult {
  success: boolean;
  orderId?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  cost: number;
  message: string;
  errors?: string[];
}

export interface OrderStatus {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: Date;
  updates: StatusUpdate[];
}

export interface StatusUpdate {
  timestamp: Date;
  status: string;
  location?: string;
  description: string;
}

// Configuration interfaces
export interface AliExpressConfig {
  appKey: string;
  appSecret: string;
  sessionKey?: string;
  environment: 'sandbox' | 'production';
}

export interface SpocketConfig {
  apiKey: string;
  environment: 'sandbox' | 'production';
}

export interface PrintfulConfig {
  apiKey: string;
  storeId?: string;
  environment: 'sandbox' | 'production';
}

export interface ModalystConfig {
  apiKey: string;
  shopId: string;
  environment: 'sandbox' | 'production';
}

// Error types
export class DropshippingError extends Error {
  constructor(
    message: string,
    public provider: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'DropshippingError';
  }
}

export class RateLimitError extends DropshippingError {
  constructor(provider: string, retryAfter?: number) {
    super(`Rate limit exceeded for ${provider}`, provider, 'RATE_LIMIT');
    this.details = { retryAfter };
  }
}

export class ProductNotFoundError extends DropshippingError {
  constructor(provider: string, productId: string) {
    super(`Product ${productId} not found on ${provider}`, provider, 'PRODUCT_NOT_FOUND');
    this.details = { productId };
  }
}

export class OrderCreationError extends DropshippingError {
  constructor(provider: string, reason: string, details?: any) {
    super(`Failed to create order on ${provider}: ${reason}`, provider, 'ORDER_CREATION_FAILED');
    this.details = details;
  }
}
