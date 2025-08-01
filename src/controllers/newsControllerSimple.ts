import { Request, Response } from 'express';
import mongoose from 'mongoose';

let NewsArticle;
try {
  NewsArticle = mongoose.model('NewsArticle');
} catch {
  NewsArticle = mongoose.model('NewsArticle', new mongoose.Schema({}, { strict: false }), 'newsarticles');
}

export const getNewsArticles = async (req: Request, res: Response) => {
  try {
    const { country, category } = req.query;
    let filter: any = {};
    
    if (country && country !== 'all') {
      filter.country = country;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    const articles = await NewsArticle.find(filter as any).sort({ publishedAt: -1 }).limit(50);
    
    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch news' });
  }
};

export const getNewsCountries = async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { code: 'us', name: 'United States' },
      { code: 'ca', name: 'Canada' },
      { code: 'gb', name: 'United Kingdom' },
      { code: 'scotland', name: 'Scotland' }
    ]
  });
};

export const getNewsCategories = async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { code: 'general', name: 'General' },
      { code: 'business', name: 'Business' },
      { code: 'technology', name: 'Technology' },
      { code: 'entertainment', name: 'Entertainment' },
      { code: 'health', name: 'Health' },
      { code: 'science', name: 'Science' },
      { code: 'sports', name: 'Sports' }
    ]
  });
};

export default { getNewsArticles, getNewsCountries, getNewsCategories };