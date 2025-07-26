import mongoose, { Document, Schema } from 'mongoose';

/**
 * Category Model following Database Patterns from Copilot Instructions
 * Includes color schemes and visual theming for multi-vendor platform
 */

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentCategory?: mongoose.Types.ObjectId;
  subcategories: string[];
  isActive: boolean;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    gradient?: string;
  };
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  productCount: number; // Virtual field
}

const CategorySchema = new Schema({
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
    required: [true, 'Category description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    default: null
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  subcategories: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  // Color scheme following Project-Specific Conventions
  colorScheme: {
    primary: {
      type: String,
      required: [true, 'Primary color is required'],
      validate: {
        validator: function(v: string) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Primary color must be a valid hex color'
      }
    },
    secondary: {
      type: String,
      required: [true, 'Secondary color is required'],
      validate: {
        validator: function(v: string) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Secondary color must be a valid hex color'
      }
    },
    accent: {
      type: String,
      required: [true, 'Accent color is required'],
      validate: {
        validator: function(v: string) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Accent color must be a valid hex color'
      }
    },
    background: {
      type: String,
      required: [true, 'Background color is required'],
      validate: {
        validator: function(v: string) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Background color must be a valid hex color'
      }
    },
    text: {
      type: String,
      required: [true, 'Text color is required'],
      validate: {
        validator: function(v: string) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Text color must be a valid hex color'
      }
    },
    gradient: {
      type: String,
      default: null,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Optional field
          return v.includes('linear-gradient') || v.includes('radial-gradient');
        },
        message: 'Gradient must be a valid CSS gradient'
      }
    }
  },
  seo: {
    title: { type: String, maxlength: 60 },
    description: { type: String, maxlength: 160 },
    keywords: { type: String, maxlength: 255 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Performance indexes following Database Patterns
CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ name: 'text', description: 'text' });

// Virtual field for product count
CategorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Pre-save middleware to generate slug and gradient
CategorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  
  // Auto-generate gradient if not provided
  if (this.isModified('colorScheme') && !this.colorScheme.gradient) {
    this.colorScheme.gradient = `linear-gradient(135deg, ${this.colorScheme.primary} 0%, ${this.colorScheme.secondary} 100%)`;
  }
  
  next();
});

export default mongoose.model<ICategory>('Category', CategorySchema);

