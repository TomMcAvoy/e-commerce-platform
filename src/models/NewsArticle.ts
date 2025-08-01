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
  excerpt?: string;
  imageUrl?: string;
  author: string;
  publishedAt: Date;
  url: string;
  sourceName: string;
  sourceId: string;
  originalUrl?: string;
  summary?: string;
  category: mongoose.Schema.Types.ObjectId | string;
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
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: Schema.Types.Mixed,
    ref: 'NewsCategory'
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  summary: {
    type: String
  },
  imageUrl: {
    type: String
  },
  url: {
    type: String,
    required: [true, 'URL is required']
  },
  originalUrl: {
    type: String
  },
  sourceName: {
    type: String,
    required: [true, 'Source name is required']
  },
  sourceId: {
    type: String,
    required: [true, 'Source ID is required']
  },
  author: {
    type: String,
    default: 'Whitestart Security Team'
  },
  publishedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  country: {
    type: String,
    index: true
  }
}, {
  timestamps: true
});

export default mongoose.model<INewsArticle>('NewsArticle', NewsArticleSchema);