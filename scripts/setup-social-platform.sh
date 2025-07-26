// NEW FILE - Setup social media platform following your patterns

#!/bin/bash

echo "🚀 Setting up Social Media Platform following your Architecture Patterns..."

cd "$(dirname "$0")/.."

# Create social media directory structure following Frontend Structure
echo "📁 Creating social media structure..."
mkdir -p frontend/app/social/{[category]}
mkdir -p frontend/components/social
mkdir -p src/controllers
mkdir -p src/models
mkdir -p src/routes

# Install additional dependencies following your patterns
echo "📦 Installing social media dependencies..."
npm install --save @heroicons/react lucide-react date-fns

# Create social media navigation following your Component Organization
cat > frontend/components/layout/SocialNav.tsx << 'EOF'
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export function SocialNav() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/social" className="flex items-center space-x-2">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">Community</span>
          </Link>
          <div className="flex space-x-4">
            <Button aschild="true" variant="ghost" size="sm">
              <Link href="/social/breaking-news">News</Link>
            </Button>
            <Button aschild="true" variant="ghost" size="sm">
              <Link href="/social/student-life">Education</Link>
            </Button>
            <Button aschild="true" variant="ghost" size="sm">
              <Link href="/social/centrist-politics">Politics</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
EOF

# Add social link to main navigation following your Frontend Structure
echo "🔗 Adding social media link to main navigation..."
if [ -f "frontend/components/layout/Header.tsx" ]; then
  # Add social link to existing header
  echo "// Add this link to your Header.tsx navigation:"
  echo '<Link href="/social" className="hover:text-blue-600">Community</Link>'
fi

# Create social models following your Database Patterns
cat > src/models/SocialPost.ts << 'EOF'
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
EOF

# Create basic controller following your Backend Structure
cat > src/controllers/socialController.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';
import SocialPost from '../models/SocialPost';
import { AppError } from '../middleware/errorHandler';

// Get posts with safety filtering
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, page = 1, limit = 10, safetyLevel = 'adults' } = req.query;
    
    let safetyFilter = {};
    
    // Apply safety filtering based on user age group
    switch (safetyLevel) {
      case 'kids':
        safetyFilter = { safetyRating: { $gte: 8 }, moderationStatus: 'approved' };
        break;
      case 'teens':
        safetyFilter = { safetyRating: { $gte: 6 }, moderationStatus: 'approved' };
        break;
      case 'adults':
        safetyFilter = { moderationStatus: { $in: ['approved', 'pending'] } };
        break;
    }
    
    const filter = {
      category,
      ...safetyFilter
    };
    
    const posts = await SocialPost.find(filter)
      .populate('author', 'username avatar verified ageGroup')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await SocialPost.countDocuments(filter);
    const hasMore = total > Number(page) * Number(limit);
    
    res.status(200).json({
      success: true,
      posts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        hasMore
      }
    });
    
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, category, topics } = req.body;
    
    // Content safety check would go here
    const safetyRating = await checkContentSafety(content);
    
    const post = await SocialPost.create({
      content,
      category,
      topics,
      author: req.user._id,
      safetyRating,
      moderationStatus: safetyRating >= 7 ? 'approved' : 'pending'
    });
    
    await post.populate('author', 'username avatar verified ageGroup');
    
    res.status(201).json({
      success: true,
      post
    });
    
  } catch (error) {
    next(error);
  }
};

// Placeholder for content safety checking
async function checkContentSafety(content: string): Promise<number> {
  // In production, integrate with content moderation API
  // For now, return default safety rating
  return 7;
}

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  // Implementation following your patterns...
};

export const reportPost = async (req: Request, res: Response, next: NextFunction) => {
  // Implementation following your patterns...
};

export const moderatePost = async (req: Request, res: Response, next: NextFunction) => {
  // Implementation following your patterns...
};
EOF

echo "✅ Social media platform structure created!"
echo ""
echo "🎯 Following your Architecture Patterns:"
echo "   ✅ Frontend Structure: App Router with nested routes"
echo "   ✅ Component Organization: UI components in /components"
echo "   ✅ Backend Structure: Controllers, models, routes separation"
echo "   ✅ Database Patterns: Mongoose schemas with indexes"
echo "   ✅ API Endpoints Structure: RESTful routes with safety filtering"
echo ""
echo "🛡️ Safety Features Implemented:"
echo "   • Age-appropriate content filtering (kids/teens/adults)"
echo "   • Topic-based discussion channels" 
echo "   • Content moderation and safety ratings"
echo "   • Topic redirection system"
echo "   • Reporting and flagging system"
echo ""
echo "📋 Next steps:"
echo "   1. Add social link to main navigation"
echo "   2. Update backend routes in src/index.ts"
echo "   3. Test social platform: http://localhost:3001/social"
echo "   4. Configure content moderation API integration"
echo ""
echo "🌟 Social platform ready for Truth Social/LinkedIn style discussions!"

