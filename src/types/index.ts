import { Request } from 'express';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  phoneNumber?: string;
  dateOfBirth?: Date;
  addresses: IAddress[];
  
  // Networking fields
  bio?: string;
  headline?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  location?: string;
  profileImage?: string;
  coverImage?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  interests?: string[];
  skills?: string[];
  networkingPreferences?: {
    isProfilePublic: boolean;
    allowConnectionRequests: boolean;
    showContactInfo: boolean;
    notifyOnNewConnections: boolean;
    notifyOnMessages: boolean;
  };
  connectionCount?: number;
  followerCount?: number;
  followingCount?: number;
  profileViews?: number;
  lastActiveAt?: Date;
  
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Express Request Extensions
export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export interface OptionalAuthRequest extends Request {
  user?: IUser;
}

export interface IVendor {
  _id?: string;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: IAddress;
  taxId?: string;
  bankAccount?: IBankAccount;
  isVerified: boolean;
  rating: number;
  totalSales: number;
  commission: number;
  products: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProduct {
  _id?: string;
  vendorId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  sku: string;
  barcode?: string;
  inventory: IInventory;
  images: string[];
  variants: IProductVariant[];
  attributes: IProductAttribute[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  dimensions?: IDimensions;
  shippingClass?: string;
  dropshipping?: IDropshippingInfo;
  seo: ISEOInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductVariant {
  _id?: string;
  name: string;
  options: IVariantOption[];
  price?: number;
  compareAtPrice?: number;
  cost?: number;
  sku?: string;
  barcode?: string;
  inventory?: IInventory;
  images?: string[];
  weight?: number;
  dimensions?: IDimensions;
}

export interface IVariantOption {
  name: string;
  value: string;
}

export interface IProductAttribute {
  name: string;
  value: string;
  isFilter: boolean;
}

export interface IInventory {
  quantity: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  lowStockThreshold?: number;
}

export interface IDimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface IDropshippingInfo {
  supplier: string;
  supplierProductId: string;
  supplierPrice: number;
  processingTime: number;
  shippingTime: number;
  apiEndpoint?: string;
}

export interface ISEOInfo {
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  keywords?: string[];
}

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  _id?: string;
  orderNumber: string;
  userId: string;
  vendorOrders: IVendorOrder[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: IAddress;
  billingAddress: IAddress;
  notes?: string;
  trackingNumbers: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVendorOrder {
  vendorId: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  trackingNumber?: string;
  fulfillmentDate?: Date;
}

export interface IOrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface ICart {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: ICartItem[];
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
  sku: string;
}

export interface IAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface IBankAccount {
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  bankName: string;
}

export interface IPayment {
  _id?: string;
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  gatewayResponse?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  _id?: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerified: boolean;
  isHelpful: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWishlist {
  _id?: string;
  userId: string;
  products: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICoupon {
  _id?: string;
  code: string;
  type: CouponType;
  value: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  vendorId?: string;
  applicableProducts?: string[];
  applicableCategories?: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Enums
export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  BANK_TRANSFER = 'bank_transfer'
}

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping'
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Request Types
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProductSearchQuery {
  q?: string;
  category?: string;
  subcategory?: string;
  vendor?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  attributes?: { [key: string]: string };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  provider?: string; // For dropshipping searches
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
