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
    
    const articles = await NewsArticle.find(filter as any).sort({ priority: 1, publishedAt: -1 }).limit(50);
    
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
      { code: 'us', name: 'United States', region: 'North America' },
      { code: 'ca', name: 'Canada', region: 'North America' },
      { code: 'gb', name: 'United Kingdom', region: 'Europe' },
      { code: 'au', name: 'Australia', region: 'Oceania' }
    ]
  });
};

export const getNewsCategories = async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { code: 'general', name: 'General', icon: '📰' },
      { code: 'business', name: 'Business', icon: '💼' },
      { code: 'technology', name: 'Technology', icon: '💻' },
      { code: 'entertainment', name: 'Entertainment', icon: '🎬' },
      { code: 'health', name: 'Health', icon: '🏥' },
      { code: 'science', name: 'Science', icon: '🔬' },
      { code: 'sports', name: 'Sports', icon: '⚽' },
      { code: 'events', name: 'Events', icon: '🎪' },
      { code: 'world', name: 'World News', icon: '🌍' },
      { code: 'uk-news', name: 'UK News', icon: '🇬🇧' },
      { code: 'us-news', name: 'US News', icon: '🇺🇸' },
      { code: 'sport', name: 'Sport', icon: '🏆' }
    ]
  });
};

export default { getNewsArticles, getNewsCountries, getNewsCategories };