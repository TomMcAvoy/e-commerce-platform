import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parentCategory?: mongoose.Types.ObjectId;
  subcategories: mongoose.Types.ObjectId[];
  image?: string;
  icon?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  
  // Alibaba-style features
  categoryType: 'main' | 'sub' | 'leaf';
  industryTags: string[];
  targetMarket: string[];
  minOrderQuantity?: number;
  supportsCustomization: boolean;
  supportsPrivateLabel: boolean;
  certificationRequired: boolean;
  tradeAssurance: boolean;
  
  // Market insights
  searchVolume?: number;
  supplierCount?: number;
  avgPrice?: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Seasonal data
  seasonalTrends?: {
    peakMonths: number[];
    description: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  subcategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  image: String,
  icon: String,
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  seoTitle: String,
  seoDescription: String,
  
  // Alibaba-style features
  categoryType: {
    type: String,
    enum: ['main', 'sub', 'leaf'],
    default: 'leaf'
  },
  industryTags: [String],
  targetMarket: [String],
  minOrderQuantity: Number,
  supportsCustomization: {
    type: Boolean,
    default: false
  },
  supportsPrivateLabel: {
    type: Boolean,
    default: false
  },
  certificationRequired: {
    type: Boolean,
    default: false
  },
  tradeAssurance: {
    type: Boolean,
    default: false
  },
  
  // Market insights
  searchVolume: Number,
  supplierCount: Number,
  avgPrice: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  // Seasonal data
  seasonalTrends: {
    peakMonths: [Number],
    description: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance following Database Patterns
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ isActive: 1, order: 1 });
CategorySchema.index({ categoryType: 1, isActive: 1 });
CategorySchema.index({ industryTags: 1 });
CategorySchema.index({ targetMarket: 1 });
CategorySchema.index({ name: 'text', description: 'text' });

export default mongoose.model<ICategory>('Category', CategorySchema);
