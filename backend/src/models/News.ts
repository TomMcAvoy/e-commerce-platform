import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  url: { type: String, required: true },
  caption: String,
  metadata: {
    width: Number,
    height: Number
  }
});

const NewsArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  summary: { type: String, required: true, maxlength: 500 },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  source: { type: String, required: true },
  originalUrl: { type: String, unique: true },
  category: {
    type: String,
    enum: ['technology', 'business', 'general', 'health', 'science', 'sports', 'entertainment'],
    required: true
  },
  tags: [String],
  media: [MediaSchema],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  publishedAt: { type: Date, required: true },
  readTime: { type: Number, default: 1 },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now }
  }],
  seoMetadata: {
    slug: { type: String, unique: true },
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance following project patterns
NewsArticleSchema.index({ category: 1, publishedAt: -1 });
NewsArticleSchema.index({ source: 1, publishedAt: -1 });
NewsArticleSchema.index({ 'seoMetadata.slug': 1 });
NewsArticleSchema.index({ originalUrl: 1 });

// Virtual fields following project patterns
NewsArticleSchema.virtual('likesCount').get(function() {
  return this.likes?.length || 0;
});

NewsArticleSchema.virtual('commentsCount').get(function() {
  return this.comments?.length || 0;
});

export default mongoose.model('NewsArticle', NewsArticleSchema);