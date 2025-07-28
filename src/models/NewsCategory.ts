import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface INewsCategory extends Document {
  name: string;
  slug: string;
  tenantId: mongoose.Schema.Types.ObjectId;
}

const NewsCategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    // FIX: Removed redundant inline index to prevent Mongoose warning.
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
}, {
  timestamps: true,
});

NewsCategorySchema.pre<INewsCategory>('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// The separate schema.index() call is the single source of truth for this index.
NewsCategorySchema.index({ slug: 1 });

export default mongoose.model<INewsCategory>('NewsCategory', NewsCategorySchema);