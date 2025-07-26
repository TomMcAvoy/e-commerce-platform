import mongoose, { Schema, Document } from 'mongoose';

/**
 * Definitive Category Model combining a scalable hierarchy with rich B2B and merchandising features.
 * Follows all Database Patterns from Copilot Instructions.
 */
export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;

  // --- HIERARCHY (Scalable Approach) ---
  parentCategory?: mongoose.Types.ObjectId;
  level: number; // Hierarchy depth (0 for root)
  path: string; // For breadcrumbs, e.g., "electronics/computers/laptops"

  // --- MERCHANDISING (Amazon/Temu Style) ---
  image?: string;
  icon?: string;
  isFeatured: boolean; // For homepage promotion
  order: number; // Manual sort order for display
  promotionText?: string; // e.g., "Up to 50% Off"
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  // --- B2B & MARKET INSIGHTS (Alibaba Style) ---
  categoryType: 'main' | 'sub' | 'leaf'; // Type of category in the hierarchy
  industryTags?: string[]; // e.g., "Manufacturing", "Agriculture"
  targetMarket?: string[]; // e.g., "North America", "Europe"
  tradeAssurance: boolean; // Does this category support Trade Assurance?
  supportsCustomization: boolean; // Are products typically customizable?
  marketInsights?: {
    searchVolume?: number;
    supplierCount?: number;
    avgPrice?: { min: number; max: number; currency: string; };
    seasonalTrends?: { peakMonths: number[]; description: string; };
  };

  affiliateCode?: string;
  affiliateUrl?: string;
  tenantId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Please add a category slug'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  affiliateCode: {
    type: String,
    trim: true,
    maxlength: [50, 'Affiliate code cannot be more than 50 characters'],
  },
  affiliateUrl: {
    type: String,
    trim: true,
    maxlength: [500, 'Affiliate URL cannot be more than 500 characters'],
  },
  isActive: { type: Boolean, default: true, index: true },

  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null, index: true },
  level: { type: Number, required: true, default: 0 },
  path: { type: String, required: true, index: true },

  image: String,
  icon: String,
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  promotionText: String,
  seo: {
    title: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 160 },
    keywords: [String]
  },

  categoryType: { type: String, enum: ['main', 'sub', 'leaf'], default: 'leaf' },
  industryTags: [String],
  targetMarket: [String],
  tradeAssurance: { type: Boolean, default: false },
  supportsCustomization: { type: Boolean, default: false },
  marketInsights: {
    searchVolume: Number,
    supplierCount: Number,
    avgPrice: { min: Number, max: Number, currency: { type: String, default: 'USD' } },
    seasonalTrends: { peakMonths: [Number], description: String }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for tenant-specific queries
CategorySchema.index({ tenantId: 1, slug: 1 });
CategorySchema.index({ tenantId: 1, name: 1 });

// --- KEPT: Performance Indexes ---
CategorySchema.index({ isActive: 1, isFeatured: 1, order: 1 });
CategorySchema.index({ name: 'text', description: 'text' });

export default mongoose.model<ICategory>('Category', CategorySchema);

