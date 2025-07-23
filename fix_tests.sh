#!/bin/bash

# This script resolves critical TypeScript errors by creating a missing 
# interface file and correcting type imports in the Product model.

# 1. Create the missing Dropshipping Provider interface file.
mkdir -p src/services/dropshipping
cat << 'EOF' > src/services/dropshipping/IDropshippingProvider.ts
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
  description: string;
  price: number;
  images: string[];
  provider: string;
  sku: string;
  stock: number;
}

export interface DropshipOrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface ShippingAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface DropshipCustomer {
  name: string;
  email: string;
}

export interface DropshipOrderData {
  customer: DropshipCustomer;
  shippingAddress: ShippingAddress;
  items: DropshipOrderItem[];
}

export interface DropshipOrderResult {
  success: boolean;
  orderId: string;
  status: OrderStatus;
  trackingUrl?: string;
  message?: string;
}

export interface ProductQueryResult {
  products: DropshipProduct[];
  totalPages: number;
  currentPage: number;
}

export interface IDropshippingProvider {
  getProducts(page: number, limit: number): Promise<ProductQueryResult>;
  getProduct(productId: string): Promise<DropshipProduct | null>;
  createOrder(orderPayload: DropshipOrderData): Promise<DropshipOrderResult>;
  checkAvailability(productId: string, variantId?: string): Promise<{ stock: number; price: number }>;
}
EOF

# 2. Correct the Product model to use named interface imports.
cat << 'EOF' > src/models/Product.ts
import mongoose from 'mongoose';
import { ICategory } from './Category';
import { IVendor } from './Vendor';

// Interface for a single product variant (e.g., size, color)
export interface IProductVariant {
  _id?: mongoose.Types.ObjectId;
  name: string; // e.g., "Color", "Size"
  value: string; // e.g., "Red", "Large"
  sku: string;
  price: number;
  stock: number;
}

// Main product interface
export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  category: mongoose.Schema.Types.ObjectId | ICategory;
  vendor: mongoose.Schema.Types.ObjectId | IVendor;
  stock: number;
  images: string[];
  sku: string;
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
  variants: IProductVariant[];
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for Product Variant
const ProductVariantSchema = new mongoose.Schema<IProductVariant>({
  name: { type: String, required: true },
  value: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

// Main Mongoose Schema for Product
const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    sku: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    variants: [ProductVariantSchema],
    isFeatured: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ price: 1, 'ratings.average': -1 });
ProductSchema.index({ vendor: 1, category: 1 });

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
EOF
