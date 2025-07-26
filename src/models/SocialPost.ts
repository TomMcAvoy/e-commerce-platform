import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialPost extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  category: string;
  topics: string[];
  likes: mongoose.Types.ObjectId[];
  replies: mongoose.Types.ObjectId[];
  moderationStatus: 'approved' | 'pending' | 'flagged' | 'removed';
  safetyRating: number;
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
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'left-wing-politics',
      'right-wing-politics', 
      'centrist-politics',
      'breaking-news',
      'local-community',
      'student-life',
      'teen-zone',
      'global-discussions'
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
  }
}, {
  timestamps: true
});

// Indexes for performance following your Database Patterns
socialPostSchema.index({ category: 1, createdAt: -1 });
socialPostSchema.index({ author: 1, createdAt: -1 });
socialPostSchema.index({ moderationStatus: 1, safetyRating: 1 });

export default mongoose.model<ISocialPost>('SocialPost', socialPostSchema);
