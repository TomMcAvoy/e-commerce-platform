import mongoose, { Schema, Document, Model } from 'mongoose'; // <-- Import Model

/**
 * Definitive Category Model combining a scalable hierarchy with rich B2B and merchandising features.
 * Follows all Database Patterns from Copilot Instructions.
 */
export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  
  // Hierarchy Management
  parentCategory?: mongoose.Types.ObjectId;
  children?: mongoose.Types.ObjectId[];
  level: number; // 0=root, 1=main, 2=sub, 3=leaf
  path: string; // Full hierarchy path
  breadcrumbs: string[];
  
  // Display & UI
  image?: string;
  icon?: string;
  color?: string;
  displayName?: string;
  
  // Status & Visibility
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  showInMenu: boolean;
  showOnHomepage: boolean;
  sortOrder: number;
  menuOrder: number;
  
  // E-commerce Data
  productCount: number;
  minPrice?: number;
  maxPrice?: number;
  commissionRate: number;
  
  // SEO & Marketing
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  
  // External Mapping (for catalog imports)
  externalMappings?: {
    amazon?: string;
    temu?: string;
    alibaba?: string;
    walmart?: string;
    ebay?: string;
  };
  
  // Multi-tenant following Database Patterns
  tenantId: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
  updatePath(): Promise<void>; // <-- Add method to interface
}

const CategorySchema: Schema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    lowercase: true,
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  
  // Hierarchy
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  level: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0
  },
  path: {
    type: String,
    required: true
  },
  breadcrumbs: [String],
  
  // Display
  image: String,
  icon: String,
  color: String,
  displayName: String,
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  showInMenu: {
    type: Boolean,
    default: true
  },
  showOnHomepage: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  menuOrder: {
    type: Number,
    default: 0
  },
  
  // E-commerce
  productCount: {
    type: Number,
    default: 0
  },
  minPrice: Number,
  maxPrice: Number,
  commissionRate: {
    type: Number,
    default: 5,
    min: 0,
    max: 100
  },
  
  // SEO
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  
  // External mappings
  externalMappings: {
    amazon: String,
    temu: String,
    alibaba: String,
    walmart: String,
    ebay: String
  },
  
  // Multi-tenant following Database Patterns
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'Tenant ID is required']
  }
}, {
  timestamps: true
});

// --- Indexes for Performance ---
CategorySchema.index({ tenantId: 1 });
CategorySchema.index({ tenantId: 1, parentCategory: 1 });
CategorySchema.index({ tenantId: 1, level: 1 });
CategorySchema.index({ tenantId: 1, isActive: 1, isFeatured: 1 });
CategorySchema.index({ tenantId: 1, isActive: 1, showInMenu: 1, menuOrder: 1 });
CategorySchema.index({ tenantId: 1, isActive: 1, showOnHomepage: 1 });
CategorySchema.index({ tenantId: 1, path: 1 });
CategorySchema.index({ keywords: 'text', name: 'text', description: 'text' });

// VIRTUALS
CategorySchema.virtual('fullPath').get(function(this: ICategory) { // <-- Type 'this'
  if (!this.breadcrumbs || !this.name) return '';
  return this.breadcrumbs.join(' > ') + (this.breadcrumbs.length > 0 ? ' > ' : '') + this.name;
});

// METHODS
CategorySchema.methods.updatePath = async function(this: ICategory) { // <-- Type 'this'
  if (this.parentCategory) {
    // Cast `this.constructor` to the Model type to access static methods
    const parent = await (this.constructor as Model<ICategory>).findById(this.parentCategory);
    if (parent) {
      this.breadcrumbs = [...parent.breadcrumbs, parent.name];
    }
  } else {
    this.breadcrumbs = [];
  }
};

// Pre-save middleware
CategorySchema.pre('save', async function(this: ICategory, next) { // <-- Type 'this'
  if (this.isModified('parentCategory') || this.isNew) {
    await this.updatePath();
  }
  next();
});

// This pattern prevents the OverwriteModelError and logs the compilation event.
if (!mongoose.models.Category) {
  console.log(`[Model Compilation] Compiling 'Category' in src/models/Category.ts`);
}
export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

