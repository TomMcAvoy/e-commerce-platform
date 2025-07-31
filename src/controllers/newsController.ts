import { Request, Response, NextFunction } from 'express';
import News from '../models/News';
import AppError from '../utils/AppError';

// Get all news articles (public endpoint)
const getNewsArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const skip = (page - 1) * limit;
    const country = req.query.country as string;
    const category = req.query.category as string;
    
    const filter: any = {};
    if (country) filter.country = country;
    if (category) filter.category = category;
    
    const articles = await News.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await News.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

// Get news article by slug
const getNewsArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.tenantId 
      ? { title: req.params.slug, tenantId: req.tenantId }
      : { title: req.params.slug };
      
    const article = await News.findOne(filter);
      
    if (!article) {
      return next(new AppError('Article not found', 404));
    }

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// Get news feed (external sources)
const getNewsFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await News.find({})
      .sort({ publishedAt: -1 })
      .limit(20)
      .select('title description author publishedAt category')
      .lean();

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

// Get available countries
const getNewsCountries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countries = [
      { code: 'usa', name: 'United States', region: 'North America' },
      { code: 'canada', name: 'Canada', region: 'North America' },
      { code: 'uk', name: 'United Kingdom', region: 'Europe' },
      { code: 'scotland', name: 'Scotland', region: 'Europe' }
    ];

    res.status(200).json({
      success: true,
      count: countries.length,
      data: countries
    });
  } catch (error) {
    next(error);
  }
};

// Get available categories
const getNewsCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = [
      { code: 'general', name: 'General', icon: '📰' },
      { code: 'business', name: 'Business', icon: '💼' },
      { code: 'entertainment', name: 'Entertainment', icon: '🎬' },
      { code: 'health', name: 'Health', icon: '🏥' },
      { code: 'science', name: 'Science', icon: '🔬' },
      { code: 'sports', name: 'Sports', icon: '⚽' },
      { code: 'technology', name: 'Technology', icon: '💻' }
    ];

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Create news article
const createNewsArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articleData = {
      ...req.body,
      tenantId: req.tenantId || '6884bf4702e02fe6eb401303' // Default tenant
    };

    const article = new News(articleData);
    await article.save();

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// Export as object
const newsController = {
  getNewsArticles,
  getNewsArticleBySlug,
  getNewsFeed,
  getNewsCountries,
  getNewsCategories,
  createNewsArticle
};

export default newsController;
