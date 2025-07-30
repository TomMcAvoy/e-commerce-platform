/**
 * This file contains all the core TypeScript interfaces for the data models
 * used throughout the frontend application. Centralizing them here ensures
 * consistency and a single source of truth for data shapes.
 */

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  createdAt: string;
  // other user properties
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string; // ID of parent category
  level: number;
  isFeatured?: boolean;
}

export interface IVendor {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  rating?: number;
  // other vendor properties
}

export interface IProduct {
  _id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  vendorId: string;
  sku: string;
  asin: string;
  images: string[];
  inventory: {
    quantity: number;
    lowStock: number;
    inStock: boolean;
  };
  cost?: number;
  features?: string[];
  sizes?: string[];
  colors?: string[];
  seo?: { title?: string; description?: string; keywords?: string[]; };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Computed/populated fields for frontend display
  stock?: number; // Alias for inventory.quantity
  rating?: number;
  vendor?: IVendor;     // Populated vendor data
  categoryData?: ICategory; // Populated category data
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IOrder {
  _id: string;
  user: IUser;
  orderItems: ICartItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

export interface INews {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  category: string;
  imageUrl?: string;
  publishedAt: string;
}