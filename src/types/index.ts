
import { Request } from 'express';

// User role enum (not just type) for runtime usage
export enum UserRole {
  ADMIN = 'admin',
  VENDOR = 'vendor',
  CUSTOMER = 'user', // Maps to 'user' for backward compatibility
  USER = 'user'
}

// Standard API Response pattern from copilot instructions
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp?: string;
  stack?: string; // For development error responses
}

// Paginated response pattern for list endpoints
export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// JWT Authentication types following copilot auth patterns
export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Request interfaces for protected routes with proper nullability guards
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    _id: string; // MongoDB ObjectId compatibility
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    phoneNumber?: string;
    [key: string]: any;
  };
}

export interface OptionalAuthRequest extends Request {
  user?: {
    id: string;
    _id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    phoneNumber?: string;
    [key: string]: any;
  };
}

// Auth request types with all required fields
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  firstName?: string; // Optional for backward compatibility
  lastName?: string;  // Optional for backward compatibility
  role?: 'user' | 'vendor' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

// User types following database model pattern with all required fields
export interface IUser {
  name: string;
  email: string;
  password: string;
  firstName?: string; // Added for controller compatibility
  lastName?: string;  // Added for controller compatibility
  phoneNumber?: string; // Added for controller compatibility
  role: UserRole | 'user' | 'vendor' | 'admin'; // Union type for flexibility
  isEmailVerified: boolean;
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole | 'user' | 'vendor' | 'admin';
  isEmailVerified: boolean;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product search and filtering types with all properties
export interface ProductSearchQuery {
  q?: string; // search query
  category?: string;
  subcategory?: string; // Added missing property
  minPrice?: number;
  maxPrice?: number;
  vendor?: string;
  provider?: string; // Added missing property for dropshipping
  inStock?: boolean;
  tags?: string[]; // Added missing property
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Product interfaces for e-commerce following copilot patterns
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  vendor: string;
  vendorId?: string;
  sku: string;
  stock: number;
  isActive: boolean;
  tags: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// CRM and Customer Data types
export interface CustomerData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: any;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  status: string;
  tags?: string[];
  notes?: string;
}

// Financial and Transaction types
export interface Transaction {
  type: 'credit' | 'debit' | 'refund' | 'payout';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayoutRequest {
  vendorId: string;
  amount: number;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  notes?: string;
}

// Shipping and Fulfillment types
export interface ShipmentData {
  _id: string;
  orderId: string;
  carrier: string;
  status: 'pending' | 'shipped' | 'in_transit' | 'delivered' | 'failed';
  trackingNumber?: string;
  shippedDate?: Date;
  deliveryDate?: Date;
  estimatedDelivery?: Date;
  shippingAddress: any;
  items: any[];
}

// Production and Manufacturing types
export interface IProductionOrder {
  orderNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  status: 'pending' | 'in_production' | 'quality_check' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: Date;
  expectedCompletion?: Date;
  actualCompletion?: Date;
  assignedTo?: string;
  materials: any[];
  notes?: string;
  qualityChecks: any[];
  createdAt: Date;
  updatedAt: Date;
  vendorId?: string;
  customerId?: string;
  specifications?: any;
  cost?: number;
  margin?: number;
  batchNumber?: string;
  parentOrderId?: string;
  childOrders?: string[];
  attachments?: string[];
  timeline?: any[];
  alerts?: any[];
  metrics?: any;
  requirements?: any;
  compliance?: any;
  workflow?: any;
  approvals?: any[];
  revisions?: any[];
  dependencies?: string[];
  resources?: any[];
  constraints?: any;
  risks?: any[];
  mitigations?: any[];
  kpis?: any;
  budget?: any;
  forecast?: any;
  performance?: any;
  feedback?: any[];
  lessons?: any[];
  documentation?: any[];
  certifications?: any[];
  testing?: any[];
  validation?: any[];
  deployment?: any;
  maintenance?: any;
  support?: any;
  training?: any[];
  integration?: any;
  migration?: any;
  backup?: any;
  recovery?: any;
  monitoring?: any;
  analytics?: any;
  reporting?: any;
  automation?: any;
  optimization?: any;
  scalability?: any;
  security?: any;
  compliance_check?: any;
  audit?: any[];
  governance?: any;
}

// Purchase Order types
export interface PurchaseOrder {
  vendorId: string;
  items: any[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'acknowledged' | 'fulfilled' | 'cancelled';
  orderDate: Date;
  expectedDelivery?: Date;
  notes?: string;
}

// Quality Control types
export interface QualityInspection {
  inspectionNumber: string;
  productId: string;
  inspectionType: 'incoming' | 'in_process' | 'final' | 'random';
  inspectionDate: Date;
  inspector: string;
  status: 'passed' | 'failed' | 'pending' | 'conditional';
  findings?: string;
  recommendations?: string;
}

// Order and Cart types
export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  updatedAt: Date;
}

// Vendor types
export interface Vendor {
  _id: string;
  userId: string;
  businessName: string;
  description?: string;
  logo?: string;
  contactEmail: string;
  contactPhone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  businessLicense?: string;
  taxId?: string;
  isVerified: boolean;
  rating: number;
  totalSales: number;
  commissionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Error handling types
export interface AppErrorType extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
}

// Dropshipping types based on DropshippingService.test.ts requirements
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export interface DropshipProduct {
  id: string;
  name: string;
  price: number;
  variants: any[];
}

export interface DropshipOrderData {
  externalOrderId: string;
  customer: {
    name: string;
    email: string;
    // Corrected: Changed address from string to a structured object to match test data
    address: {
      street1: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingMethod: string;
}

export interface DropshipOrderResult {
  success: boolean;
  orderId: string;
  providerOrderId?: string; // Corrected: Added optional providerOrderId to match test data
  trackingNumber?: string;
  status: OrderStatus;
  message?: string;
}

export interface IDropshippingProvider {
  name: string;
  isEnabled: boolean;
  getProducts(): Promise<DropshipProduct[]>;
  getProduct(id: string): Promise<DropshipProduct | null>;
  createOrder(orderData: DropshipOrderData): Promise<DropshipOrderResult>;
  getOrderStatus(orderId: string): Promise<OrderStatus>;
  getTrackingInfo(orderId: string): Promise<{ trackingNumber: string; url: string } | null>;
  cancelOrder(orderId: string): Promise<{ success: boolean; message?: string }>;
}