import mongoose, { Schema, Document } from 'mongoose';

const VariantOptionSchema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
});

const InventorySchema = new Schema({
  quantity: { type: Number, required: true, default: 0 },
  trackQuantity: { type: Boolean, default: true },
  allowBackorder: { type: Boolean, default: false },
  lowStockThreshold: { type: Number, default: 5 }
});

const DimensionsSchema = new Schema({
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  unit: { type: String, required: true, enum: ['cm', 'in'], default: 'cm' }
});

const ProductVariantSchema = new Schema({
  name: { type: String, required: true },
  options: [VariantOptionSchema],
  price: Number,
  compareAtPrice: Number,
  cost: Number,
  sku: String,
  barcode: String,
  inventory: InventorySchema,
  images: [String],
  weight: Number,
  dimensions: DimensionsSchema
});

const ProductAttributeSchema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  isFilter: { type: Boolean, default: false }
});

const DropshippingInfoSchema = new Schema({
  supplier: { type: String, required: true },
  supplierProductId: { type: String, required: true },
  supplierPrice: { type: Number, required: true },
  processingTime: { type: Number, required: true }, // in days
  shippingTime: { type: Number, required: true }, // in days
  apiEndpoint: String
});

const SEOInfoSchema = new Schema({
  metaTitle: String,
  metaDescription: String,
  slug: { type: String, required: true, unique: true },
  keywords: [String]
});

const ProductSchema = new Schema({
  vendorId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  inventory: {
    type: InventorySchema,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  variants: [ProductVariantSchema],
  attributes: [ProductAttributeSchema],
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: DimensionsSchema,
  shippingClass: {
    type: String,
    enum: ['standard', 'express', 'overnight', 'free'],
    default: 'standard'
  },
  dropshipping: DropshippingInfoSchema,
  seo: {
    type: SEOInfoSchema,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
ProductSchema.index({ vendorId: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ subcategory: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ 'seo.slug': 1 });

// Virtual for calculating discount percentage
ProductSchema.virtual('discountPercentage').get(function(this: any) {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

// Virtual for profit margin
ProductSchema.virtual('profitMargin').get(function(this: any) {
  if (this.cost && this.price > this.cost) {
    return Math.round(((this.price - this.cost) / this.price) * 100);
  }
  return 0;
});

// Pre-save middleware to generate SKU if not provided
ProductSchema.pre('save', function(this: any, next) {
  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('Product', ProductSchema);
