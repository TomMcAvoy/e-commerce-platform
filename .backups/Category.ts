import mongoose, { Schema } from 'mongoose';

// Add the 'export' keyword here
export interface ICategory extends Document {
  name: string;
  description?: string;
  parent: mongoose.Schema.Types.ObjectId | ICategory | null;
  ancestors: (mongoose.Schema.Types.ObjectId | ICategory)[];
  createdAt: Date;
  updatedAt: Date;
}


const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  parentCategory: {
    type: String,
    default: null
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
CategorySchema.index({ slug: 1 });
CategorySchema.index({ parentCategory: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ sortOrder: 1 });

export default mongoose.model('Category', CategorySchema);
