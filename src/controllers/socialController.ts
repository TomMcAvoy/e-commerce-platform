import { Request, Response, NextFunction } from 'express';
import SocialPost from '../models/SocialPost';
import AppError from '../utils/AppError';
import { ContentAnalysisService } from '../services/ContentAnalysisService';
import { NotificationService } from '../services/NotificationService';

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
    
    // Analyze content using AI/ML
    const analysis = await ContentAnalysisService.analyzeContent(content, category);
    
    // Store original content if moderation is needed
    const originalContent = analysis.needsModeration ? content : undefined;
    const finalContent = analysis.suggestedRewrite || content;
    
    // Use suggested category if confidence is high
    let finalCategory = category;
    let wasRecategorized = false;
    let recategorizationReason = '';
    
    if (ContentAnalysisService.shouldRecategorize(content, category, analysis)) {
      finalCategory = analysis.suggestedCategory;
      wasRecategorized = true;
      recategorizationReason = `Content better fits "${analysis.suggestedCategory}" category based on AI analysis (confidence: ${Math.round(analysis.confidence * 100)}%)`;
    }
    
    const post = await SocialPost.create({
      content: finalContent,
      originalContent,
      category: finalCategory,
      originalCategory: wasRecategorized ? category : undefined,
      topics: analysis.topics.length > 0 ? analysis.topics : topics,
      author: req.user._id,
      safetyRating: analysis.appropriatenessScore,
      toxicityLevel: analysis.toxicityLevel,
      grammarScore: analysis.grammarScore,
      appropriatenessScore: analysis.appropriatenessScore,
      wasModerated: analysis.needsModeration,
      wasRecategorized,
      moderationReason: analysis.needsModeration ? 'Content rewritten for community standards' : undefined,
      recategorizationReason: wasRecategorized ? recategorizationReason : undefined,
      analysisConfidence: analysis.confidence,
      moderationStatus: analysis.appropriatenessScore >= 7 ? 'approved' : 'pending'
    });
    
    await post.populate('author', 'username avatar verified ageGroup');
    
    // Send notifications if needed
    if (wasRecategorized) {
      await NotificationService.notifyPostRecategorized(
        req.user._id,
        post._id,
        category,
        finalCategory,
        ContentAnalysisService.generateRecategorizationNotification(category, finalCategory, recategorizationReason)
      );
    }
    
    if (analysis.needsModeration) {
      await NotificationService.notifyContentModerated(
        req.user._id,
        post._id,
        content,
        finalContent,
        'Content was automatically improved for better community engagement'
      );
    }
    
    res.status(201).json({
      success: true,
      post,
      analysis: {
        wasModerated: analysis.needsModeration,
        wasRecategorized,
        originalCategory: wasRecategorized ? category : undefined,
        suggestedTopics: analysis.topics,
        confidenceScore: Math.round(analysis.confidence * 100)
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Enhanced content moderation with recategorization
export const moderatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const { action, reason } = req.body; // action: 'approve', 'flag', 'remove', 'reanalyze'
    
    const post = await SocialPost.findById(postId).populate('author', 'username email');
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    
    switch (action) {
      case 'approve':
        post.moderationStatus = 'approved';
        await NotificationService.notifyPostApproved(post.author._id, post._id);
        break;
        
      case 'flag':
        post.moderationStatus = 'flagged';
        break;
        
      case 'remove':
        post.moderationStatus = 'removed';
        await NotificationService.notifyPostRemoved(post.author._id, post._id, reason);
        break;
        
      case 'reanalyze':
        // Re-analyze the content and potentially update category
        const analysis = await ContentAnalysisService.analyzeContent(post.content, post.category);
        
        if (ContentAnalysisService.shouldRecategorize(post.content, post.category, analysis)) {
          const originalCategory = post.category;
          post.originalCategory = originalCategory;
          post.category = analysis.suggestedCategory;
          post.wasRecategorized = true;
          post.recategorizationReason = `Re-analyzed and moved to better category (confidence: ${Math.round(analysis.confidence * 100)}%)`;
          
          await NotificationService.notifyPostRecategorized(
            post.author._id,
            post._id,
            originalCategory,
            analysis.suggestedCategory,
            ContentAnalysisService.generateRecategorizationNotification(originalCategory, analysis.suggestedCategory, post.recategorizationReason!)
          );
        }
        
        // Update analysis scores
        post.safetyRating = analysis.appropriatenessScore;
        post.toxicityLevel = analysis.toxicityLevel;
        post.grammarScore = analysis.grammarScore;
        post.appropriatenessScore = analysis.appropriatenessScore;
        post.analysisConfidence = analysis.confidence;
        post.topics = analysis.topics;
        
        break;
    }
    
    await post.save();
    
    res.status(200).json({
      success: true,
      message: `Post ${action} successfully`,
      post
    });
    
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    
    const { postId } = req.params;
    const post = await SocialPost.findById(postId);
    
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    
    const userId = req.user._id;
    const hasLiked = post.likes.includes(userId);
    
    if (hasLiked) {
      // Remove like
      post.likes = post.likes.filter(id => !id.equals(userId));
    } else {
      // Add like
      post.likes.push(userId);
    }
    
    await post.save();
    
    res.status(200).json({
      success: true,
      liked: !hasLiked,
      likesCount: post.likes.length
    });
    
  } catch (error) {
    next(error);
  }
};

export const reportPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    
    const { postId } = req.params;
    const { reason, description } = req.body;
    
    const post = await SocialPost.findById(postId);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    
    // Flag post for review
    post.moderationStatus = 'flagged';
    await post.save();
    
    // Log the report (in production, save to a Reports model)
    console.log('📝 Post reported:', {
      postId,
      reportedBy: req.user._id,
      reason,
      description,
      timestamp: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Post reported successfully. Our team will review it shortly.'
    });
    
  } catch (error) {
    next(error);
  }
};

// Get user notifications
export const getUserNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }
    
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    const notifications = await NotificationService.getUserNotifications(
      req.user._id,
      Number(limit),
      offset
    );
    
    const unreadCount = await NotificationService.getUnreadCount(req.user._id);
    
    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        hasMore: notifications.length === Number(limit)
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
export const markNotificationRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { notificationId } = req.params;
    
    await NotificationService.markAsRead(notificationId);
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
    
  } catch (error) {
    next(error);
  }
};
