import { Request, Response, NextFunction } from 'express';
import NewsArticle from '../models/News';
import { newsAPIService } from '../services/news/NewsAPIService';
import { AppError } from '../utils/appError';

// Get news feed following your API response patterns
export const getNewsFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const skip = (page - 1) * limit;

    const filter: any = { status: 'published' };
    if (category && category !== 'all') {
      filter.category = category;
    }

    const articles = await NewsArticle
      .find(filter)
      .populate('author', 'name profilePicture')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await NewsArticle.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: articles.length,
      data: {
        articles: articles.map(article => ({
          _id: article._id,
          title: article.title,
          summary: article.summary,
          authorName: article.authorName,
          source: article.source,
          category: article.category,
          publishedAt: article.publishedAt,
          readTime: article.readTime,
          media: article.media || [],
          likesCount: article.likes?.length || 0,
          commentsCount: article.comments?.length || 0,
          views: article.views || 0,
          seoMetadata: article.seoMetadata
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single article by slug
export const getArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    
    const article = await NewsArticle
      .findOne({ 'seoMetadata.slug': slug, status: 'published' })
      .populate('author', 'name profilePicture')
      .populate('comments.author', 'name profilePicture');

    if (!article) {
      return next(new AppError('Article not found', 404));
    }

    // Increment view count
    article.views = (article.views || 0) + 1;
    await article.save();

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// Fetch fresh news (admin only or scheduled)
export const fetchNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await newsAPIService.fetchAndSaveNews();
    
    res.status(200).json({
      success: true,
      message: 'News fetch completed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike article following your auth patterns
export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('Please log in to like articles', 401));
    }

    const article = await NewsArticle.findById(id);
    if (!article) {
      return next(new AppError('Article not found', 404));
    }

    const hasLiked = article.likes.includes(userId as any);
    
    if (hasLiked) {
      article.likes = article.likes.filter(id => id.toString() !== userId);
    } else {
      article.likes.push(userId as any);
    }

    await article.save();

    res.status(200).json({
      success: true,
      data: {
        liked: !hasLiked,
        likesCount: article.likes.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add comment following your auth patterns
export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('Please log in to comment', 401));
    }

    if (!content || content.trim().length === 0) {
      return next(new AppError('Comment content is required', 400));
    }

    const article = await NewsArticle.findById(id);
    if (!article) {
      return next(new AppError('Article not found', 404));
    }

    const comment = {
      author: userId,
      content: content.trim(),
      createdAt: new Date()
    };

    article.comments.push(comment as any);
    await article.save();

    // Populate the comment author for response
    await article.populate('comments.author', 'name profilePicture');
    const newComment = article.comments[article.comments.length - 1];

    res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (error) {
    next(error);
  }
};