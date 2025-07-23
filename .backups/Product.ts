import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  vendor: mongoose.Types.ObjectId;
  stock: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDocument extends IProduct, Document {
  _id: mongoose.Types.ObjectId;
  id: string;
}

const productSchema = new Schema<IProductDocument>({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add indexes for performance
productSchema.index({ category: 1, vendor: 1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IProductDocument>('Product', productSchema);
