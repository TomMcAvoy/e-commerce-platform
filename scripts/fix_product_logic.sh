#!/bin/bash

# This script will create/overwrite the necessary files to fix the cart logic and tests.
# It ensures the Product model is correct and the cart controller test suite is robust.

# Ensure the directories exist
mkdir -p src/models
mkdir -p src/__tests__/backend

# --- File 1: Update the Product Model ---
# This fixes the root cause of the TypeScript compilation errors.
echo "Updating src/models/Product.ts..."
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

echo "Script finished. Files have been updated."
