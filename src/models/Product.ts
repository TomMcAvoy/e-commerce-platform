import mongoose, { Document, Schema, model } from 'mongoose';
import eventService, { EventNames } from "../services/eventService";

export interface IProduct extends Document {
  tenantId: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  vendorId: mongoose.Types.ObjectId;
  sku: string;
  asin: string;
  images: string[];
  inventory: {
    quantity: number;
    lowStock: number; // This might be the intended low stock threshold
    inStock: boolean;
    lowStockThreshold: number; // Explicitly add for clarity if needed
  };
  cost?: number; // Add optional cost property
  features?: string[];
  sizes?: string[];
  colors?: string[];
  gender?: string;
  seasonalTags?: string[];
  sport?: string;
  fitnessLevel?: string;
  room?: string;
  materials?: string[];
  seasonalAvailability?: string[];
  skinType?: string;
  productType?: string;
  fdaCompliant?: boolean;
  mediaType?: string;
  genre?: string;
  ageRange?: string;
  safetyCertifications?: string[];
  compatibility?: Array<{ make: string; model: string; year: number; }>;
  seo?: { title?: string; description?: string; keywords?: string[]; };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  slug: string; // <-- Add slug
}

const ProductSchema = new Schema<IProduct>({
  tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true }, // REMOVED: index: true
  name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: [200, 'Product name cannot exceed 200 characters'], index: true },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  description: { type: String, required: [true, 'Product description is required'], maxlength: [2000, 'Description cannot exceed 2000 characters'] },
  price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
  originalPrice: { type: Number, min: [0, 'Original price cannot be negative'] },
  category: { type: String, required: [true, 'Category is required'], trim: true, lowercase: true },
  subcategory: { type: String, trim: true, lowercase: true },
  brand: { type: String, required: [true, 'Brand is required'], trim: true, maxlength: [100, 'Brand name cannot exceed 100 characters'] },
  vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Vendor is required'] },
  sku: { type: String, required: [true, 'SKU is required'], trim: true, uppercase: true },
  asin: { type: String, required: [true, 'ASIN is required'], trim: true, uppercase: true },
  images: [{ type: String, trim: true }],
  cost: { type: Number, required: false, min: 0 }, // Add cost to schema
  inventory: {
    quantity: { type: Number, required: [true, 'Inventory quantity is required'], min: [0, 'Quantity cannot be negative'], default: 0 },
    lowStock: { type: Number, default: 10 }, // This is likely the threshold
    inStock: { type: Boolean, default: true }
  },
  features: [{ type: String, trim: true }],
  sizes: [{ type: String, trim: true }],
  colors: [{ type: String, trim: true }],
  gender: { type: String, enum: ['male', 'female', 'unisex'], lowercase: true },
  seasonalTags: [{ type: String, trim: true, lowercase: true }],
  sport: { type: String, trim: true, lowercase: true },
  fitnessLevel: { type: String, trim: true, lowercase: true },
  room: { type: String, trim: true, lowercase: true },
  materials: [{ type: String, trim: true, lowercase: true }],
  seasonalAvailability: [{ type: String, trim: true, lowercase: true }],
  skinType: { type: String, trim: true, lowercase: true },
  productType: { type: String, trim: true, lowercase: true },
  fdaCompliant: { type: Boolean, default: false },
  mediaType: { type: String, trim: true, lowercase: true },
  genre: { type: String, trim: true, lowercase: true },
  ageRange: { type: String, trim: true },
  safetyCertifications: [{ type: String, trim: true, uppercase: true }],
  compatibility: [{ make: { type: String, required: true, trim: true }, model: { type: String, required: true, trim: true }, year: { type: Number, required: true } }],
  seo: { title: { type: String, maxlength: 60 }, description: { type: String, maxlength: 160 }, keywords: [{ type: String, trim: true, lowercase: true }] },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// --- PERFORMANCE INDEXES ---
ProductSchema.index({ tenantId: 1, isActive: 1 }); // Combined tenant and active status
ProductSchema.index({ vendorId: 1, isActive: 1 });
ProductSchema.index({ brand: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, subcategory: 1, isActive: 1 });
ProductSchema.index({ sku: 1, tenantId: 1 }, { unique: true });
ProductSchema.index({ asin: 1, tenantId: 1 }, { unique: true });
// ProductSchema.index({ tenantId: 1, slug: 1 }, { unique: true }); // REMOVED

// --- VIRTUALS ---
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

ProductSchema.virtual('discountedPrice').get(function() {
  return this.price; // For now, just return the current price
});

// Virtual for reviews
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

// --- MIDDLEWARE ---
ProductSchema.pre('save', function (next) {
  if (this.inventory) { // <-- Add null check
    this.inventory.inStock = this.inventory.quantity > 0;
  }
  next();
});

// FIX: Use the correct hook name 'deleteOne' for post-document-deletion middleware
ProductSchema.post('deleteOne', { document: true, query: false }, async function() {
    console.log(`Deleting reviews for product ${this._id}`);
    eventService.emit(EventNames.PRODUCT_DELETED, this);
    // Example: await this.model('Review').deleteMany({ product: this._id });
});

// --- EVENT-DRIVEN ARCHITECTURE HOOKS ---
ProductSchema.post("save", function(doc, next) {
  try {
    // isNew is a Mongoose internal flag available in pre-save, but not post-save.
    // A common workaround is to check if createdAt and updatedAt are the same.
    const isNew = doc.createdAt.getTime() === doc.updatedAt.getTime();
    if (isNew) {
      eventService.emit(EventNames.PRODUCT_CREATED, doc);
    } else {
      eventService.emit(EventNames.PRODUCT_UPDATED, doc);
    }
  } catch (error) {
    console.error("Error emitting product save event:", error);
  }
  next();
});

// REMOVE the old "remove" hook, as it's replaced by the "deleteOne" hook above.
/*
ProductSchema.post("remove", function(doc, next) {
  try {
    eventService.emit(EventNames.PRODUCT_DELETED, doc);
  } catch (error) {
    console.error("Error emitting product delete event:", error);
  }
  next();
});
*/

// This pattern prevents the OverwriteModelError and logs the compilation event.
if (!mongoose.models.Product) {
  // This log will only appear the first time this file is imported and the model is compiled.
  console.log(`[Model Compilation] Compiling 'Product' in src/models/Product.ts`);
}
export default model<IProduct>('Product', ProductSchema);
