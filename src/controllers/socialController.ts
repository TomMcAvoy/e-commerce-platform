import { Request, Response, NextFunction } from 'express';
import SocialPost from '../models/SocialPost';
import AppError from '../utils/AppError';

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
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    const { content, category, topics } = req.body;
    
    // Content safety check would go here
    const safetyRating = await checkContentSafety(content);
    
    const post = await SocialPost.create({
      content,
      category,
      topics,
      author: req.user._id, // Now safe to access
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
