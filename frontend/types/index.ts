// Core interfaces for the multi-vendor e-commerce platform

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | ICategory;
  children?: ICategory[];
  products?: IProduct[]; // Add this line
  isActive: boolean;
  level: number;
  path: string;
  isFeatured: boolean;
  order: number;
  categoryType: 'main' | 'sub';
  industryTags: string[];
  targetMarket: string[];
  tradeAssurance: boolean;
  supportsCustomization: boolean;
  
  // SEO and market insights from backend
  seo?: {
    keywords: string[];
  };
  marketInsights?: {
    avgPrice: {
      currency: string;
    };
    seasonalTrends: {
      peakMonths: string[];
    };
  };
  
  // Legacy fields for compatibility
  colorScheme?: {
    primary: string;
    background: string;
    text: string;
  };
  subcategories?: ICategory[];
  
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ICategory | string;
  vendor: IVendor | string;
  slug: string;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  features?: string[];
  specifications?: Record<string, string>;
  tags?: string[];
  isActive: boolean;
  isFeatured: boolean;
  brand?: string;
  model?: string;
  warranty?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shippingInfo?: {
    freeShipping: boolean;
    estimatedDays: number;
    shippingCost: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IVendor {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: IAddress;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  businessInfo?: {
    registrationNumber: string;
    taxId: string;
    businessType: 'individual' | 'llc' | 'corporation' | 'partnership';
  };
  paymentInfo?: {
    paypalEmail?: string;
    stripeAccountId?: string;
    bankAccount?: {
      accountNumber: string;
      routingNumber: string;
      accountHolderName: string;
    };
  };
  settings?: {
    autoApproveOrders: boolean;
    processingTime: number;
    returnPolicy: string;
    shippingPolicy: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Represents a user, often the author of a post or comment.
export interface IUser {
  _id: string;
  name: string;
  avatar?: string;
}

// Represents a social media post.
export interface IPost {
  _id: string;
  content: string;
  author: IUser;
  image?: string;
  likes: string[]; // Array of user IDs who liked the post
  comments: any[]; // In a real app, this would be an array of IComment
  createdAt: string;
  updatedAt: string;
}

export interface IAddress {
  _id?: string;
  type: 'shipping' | 'billing' | 'both';
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface ICartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  vendor?: string;
  vendorName?: string;
  maxQuantity?: number;
  variations?: Record<string, string>;
  shippingCost?: number;
}

export interface ICart {
  items: ICartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user: IUser | string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  shippingAddress: IAddress;
  billingAddress: IAddress;
  paymentMethod: {
    type: 'credit_card' | 'paypal' | 'stripe' | 'bank_transfer';
    last4?: string;
    brand?: string;
  };
  tracking?: {
    number: string;
    carrier: string;
    url?: string;
  };
  notes?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  _id?: string;
  product: IProduct | string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  vendor: IVendor | string;
  vendorName: string;
  variations?: Record<string, string>;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking?: {
    number: string;
    carrier: string;
    url?: string;
  };
}

export interface IReview {
  _id: string;
  user: IUser | string;
  product: IProduct | string;
  vendor: IVendor | string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpful: number;
  reported: number;
  createdAt: string;
  updatedAt: string;
}

export interface IWishlist {
  _id: string;
  user: IUser | string;
  products: (IProduct | string)[];
  name: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters?: Record<string, any>;
  sort?: Record<string, any>;
}

// Dropshipping Integration Types (per your architecture)
export interface IDropshippingProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  isActive: boolean;
  settings?: Record<string, any>;
}

export interface IDropshippingProduct {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  variants?: IProductVariant[];
  supplier: string;
  category: string;
  tags: string[];
  specifications: Record<string, string>;
  shippingInfo: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    processingTime: number;
    shippingMethods: string[];
  };
}

export interface IProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  sku: string;
  stockQuantity: number;
  attributes: Record<string, string>;
  images?: string[];
  isActive: boolean;
}

// Search and Filter Types
export interface SearchFilters {
  category?: string;
  vendor?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  featured?: boolean;
  brand?: string;
  tags?: string[];
  sortBy?: 'price' | 'rating' | 'name' | 'newest' | 'popular';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResults<T> {
  results: T[];
  totalResults: number;
  facets: {
    categories: Array<{ name: string; count: number }>;
    vendors: Array<{ name: string; count: number }>;
    brands: Array<{ name: string; count: number }>;
    priceRanges: Array<{ range: string; count: number }>;
  };
  suggestions?: string[];
}

// Authentication Types
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  avatar?: string;
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'user' | 'vendor';
  acceptTerms: boolean;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'bank_account';
  isDefault: boolean;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  billingAddress?: IAddress;
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  clientSecret: string;
}

// Notification Types
export interface INotification {
  _id: string;
  user: string;
  type: 'order' | 'payment' | 'shipping' | 'system' | 'marketing';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  userId?: string;
  sessionId: string;
  data: Record<string, any>;
  timestamp: string;
}

// Error Handling (per your AppError pattern)
export interface AppErrorResponse {
  message: string;
  statusCode: number;
  stack?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'support' | 'business' | 'technical';
}

export interface VendorApplicationForm {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  businessType: string;
  description: string;
  productCategories: string[];
  estimatedMonthlyVolume: string;
  businessDocuments: File[];
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    key: keyof T;
    order: 'asc' | 'desc';
    onSort: (key: keyof T) => void;
  };
}