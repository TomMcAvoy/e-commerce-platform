import mongoose, { Schema, Document } from 'mongoose';

/**
 * Mongoose Schema for News Articles, following Database Patterns.
 * Includes tenant isolation and performance indexes.
 */
export interface INewsArticle extends Document {
  tenantId: mongoose.Schema.Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  publishedAt: Date;
}

const NewsArticleSchema: Schema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'Tenant ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'NewsCategory',
    required: [true, 'News category is required']
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  author: {
    type: String,
    default: 'Whitestart Security Team'
  },
  publishedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

export default mongoose.model<INewsArticle>('NewsArticle', NewsArticleSchema);