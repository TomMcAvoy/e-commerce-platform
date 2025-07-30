import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialPost extends Document {
  content: string;
  originalContent?: string; // Store original before moderation
  author: mongoose.Types.ObjectId;
  category: string;
  originalCategory?: string; // Store original category if moved
  topics: string[];
  likes: mongoose.Types.ObjectId[];
  replies: mongoose.Types.ObjectId[];
  moderationStatus: 'approved' | 'pending' | 'flagged' | 'removed';
  safetyRating: number;
  toxicityLevel: number;
  grammarScore: number;
  appropriatenessScore: number;
  wasModerated: boolean;
  wasRecategorized: boolean;
  moderationReason?: string;
  recategorizationReason?: string;
  analysisConfidence: number;
  createdAt: Date;
  updatedAt: Date;
}

const socialPostSchema = new Schema({
  content: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true
  },
  originalContent: {
    type: String,
    maxlength: 2000,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'pets',
      'obscure',
      'breaking-news',
      'local-community',
      'student-life',
      'teen-zone',
      'global-discussions',
      'technology',
      'health-wellness',
      'entertainment',
      'sports',
      'food-cooking',
      'travel',
      'fashion-beauty',
      'home-garden',
      'business-finance',
      'education',
      'relationships',
      'hobbies-crafts',
      'politics'
    ]
  },
  originalCategory: {
    type: String,
    enum: [
      'pets',
      'obscure',
      'breaking-news',
      'local-community',
      'student-life',
      'teen-zone',
      'global-discussions',
      'technology',
      'health-wellness',
      'entertainment',
      'sports',
      'food-cooking',
      'travel',
      'fashion-beauty',
      'home-garden',
      'business-finance',
      'education',
      'relationships',
      'hobbies-crafts',
      'politics'
    ]
  },
  topics: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'SocialPost'
  }],
  moderationStatus: {
    type: String,
    enum: ['approved', 'pending', 'flagged', 'removed'],
    default: 'pending'
  },
  safetyRating: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  toxicityLevel: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  grammarScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 7
  },
  appropriatenessScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 8
  },
  wasModerated: {
    type: Boolean,
    default: false
  },
  wasRecategorized: {
    type: Boolean,
    default: false
  },
  moderationReason: {
    type: String,
    maxlength: 500
  },
  recategorizationReason: {
    type: String,
    maxlength: 500
  },
  analysisConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  }
}, {
  timestamps: true
});

// Indexes for performance following your Database Patterns
socialPostSchema.index({ category: 1, createdAt: -1 });
socialPostSchema.index({ author: 1, createdAt: -1 });
socialPostSchema.index({ moderationStatus: 1, safetyRating: 1 });

export default mongoose.model<ISocialPost>('SocialPost', socialPostSchema);
