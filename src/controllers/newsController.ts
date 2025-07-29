import { Request, Response, NextFunction } from 'express';
import NewsArticle from '../models/NewsArticle';
import News from '../models/News';
import AppError from '../utils/AppError';

// Define all controller functions as simple constants.
const getNewsArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const articles = await NewsArticle.find({ tenantId: req.tenantId })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

const getNewsArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await NewsArticle.findOne({ slug: req.params.slug, tenantId: req.tenantId })
      .populate('category', 'name slug');
      
    if (!article) {
      return next(new AppError(`News article not found with slug of ${req.params.slug}`, 404));
    }
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

const getNewsFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const source = req.query.source as string;
    const country = req.query.country as string;
    const category = req.query.category as string;
    const query: any = { tenantId: req.tenantId, isActive: true };

    if (source) {
      query.sourceId = source;
    }
    if (country) {
      query.country = country;
    }
    if (category) {
      query.category = category.toLowerCase();
    }

    const articles = await News.find(query)
      .sort({ publishedAt: -1 })
      .limit(50)
      .lean();

    res.status(200).json({
      success: true,
      filters: { source, country, category },
      count: articles.length,
      data: articles
    });
  } catch (error) {
    next(new AppError('Failed to get news feed from cache', 500));
  }
};

const getNewsCountries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countries = {
      usa: 'United States',
      uk: 'United Kingdom', 
      scotland: 'Scotland',
      canada: 'Canada',
      australia: 'Australia',
      germany: 'Germany',
      france: 'France',
      italy: 'Italy',
      spain: 'Spain',
      netherlands: 'Netherlands',
      ireland: 'Ireland',
      india: 'India',
      japan: 'Japan',
      china: 'China',
      russia: 'Russia',
      brazil: 'Brazil',
      mexico: 'Mexico',
      argentina: 'Argentina',
      southafrica: 'South Africa'
    };

    res.status(200).json({
      success: true,
      data: countries
    });
  } catch (error) {
    next(new AppError('Failed to get news countries', 500));
  }
};

// FIX: Use a single default export (namespace pattern). This is the definitive fix
// for the '[object Undefined]' error, ensuring all handlers are exported correctly.
export default {
  getNewsArticles,
  getNewsArticleBySlug,
  getNewsFeed,
  getNewsCountries
};