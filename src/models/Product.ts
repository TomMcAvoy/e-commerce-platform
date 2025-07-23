import mongoose, { Document, Schema } from 'mongoose';

export interface IProductVariant {
  _id: mongoose.Types.ObjectId;
  value: string;
  price: number;
  sku: string;
  stock: number;
}

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  vendor: mongoose.Types.ObjectId;
  stock: number;
  variants?: IProductVariant[];
  images?: string[];
  sku?: string;
  isArchived?: boolean;
  isActive?: boolean;
}

export interface IProductDocument extends IProduct, Document {
  variants: mongoose.Types.DocumentArray<IProductVariant>;
}

const productVariantSchema = new Schema({
  value: { type: String, required: true },
  price: { type: Number, required: true },
  sku: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 }
});

const productSchema = new Schema<IProductDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stock: { type: Number, required: true, default: 0 },
  variants: [productVariantSchema],
  images: [{ type: String }],
  sku: { type: String },
  isArchived: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Performance indexes for multi-vendor queries
productSchema.index({ vendor: 1, category: 1 });
productSchema.index({ isArchived: 1, vendor: 1 });
productSchema.index({ isActive: 1, category: 1 });

export default mongoose.model<IProductDocument>('Product', productSchema);
