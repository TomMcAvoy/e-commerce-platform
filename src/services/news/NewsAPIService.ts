import axios from 'axios';
import AppError from '../../utils/AppError';
import NewsArticle from '../../models/News';

interface NewsAPIArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  author: string;
}

export class NewsAPIService {
  private apiKey: string;
  private baseURL = 'https://newsapi.org/v2';

  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || '';
    if (!this.apiKey) {
      console.log('📰 NEWS_API_KEY not configured - news fetching disabled');
    }
  }

  async fetchAndSaveNews(): Promise<void> {
    if (!this.apiKey) {
      console.log('📰 NEWS_API_KEY not configured - skipping news fetch');
      return;
    }

    try {
      console.log('🗞️  Starting news fetch from NewsAPI...');
      
      const categories = ['world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health'];
      let totalProcessed = 0;

      for (const category of categories) {
        try {
          const articles = await this.getTopHeadlines(category);
          const processed = await this.processArticles(articles, category);
          totalProcessed += processed;
          
          // Respect NewsAPI rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to fetch ${category} articles:`, error);
        }
      }

      console.log(`✅ News fetch completed. Processed ${totalProcessed} articles.`);
    } catch (error) {
      console.error('❌ News fetch failed:', error);
      throw new AppError('Failed to fetch news', 500);
    }
  }

  private async getTopHeadlines(category: string): Promise<NewsAPIArticle[]> {
    try {
      const response = await axios.get(`${this.baseURL}/top-headlines`, {
        params: {
          apiKey: this.apiKey,
          category,
          country: 'us',
          pageSize: 5 // Small batch to respect rate limits
        },
        timeout: 10000
      });

      return response.data.articles.filter((article: NewsAPIArticle) => 
        article.title && 
        article.description && 
        article.content &&
        !article.title.includes('[Removed]') &&
        article.urlToImage
      );
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new AppError('NewsAPI rate limit exceeded', 429);
      }
      console.error('NewsAPI Error:', error.response?.data || error.message);
      throw new AppError('Failed to fetch headlines', 500);
    }
  }

  private async processArticles(articles: NewsAPIArticle[], category: string): Promise<number> {
    let processed = 0;
    
    for (const article of articles) {
      try {
        // Check if article already exists
        const existingArticle = await NewsArticle.findOne({
          originalUrl: article.url
        });

        if (existingArticle) {
          continue;
        }

        const systemUserId = await this.getSystemUserId();
        const categoryDoc = await this.getCategoryByName(category);

        const newsArticle = new NewsArticle({
          title: article.title,
          summary: article.description,
          content: this.cleanContent(article.content),
          author: systemUserId,
          authorName: article.author || article.source.name,
          source: article.source.name,
          url: article.url,
          sourceName: article.source.name,
          sourceId: article.source.id || 'newsapi',
          tenantId: process.env.DEFAULT_TENANT_ID || '6884bf4702e02fe6eb401303',
          category: categoryDoc?._id || category,
          tags: [category, article.source.name.toLowerCase()],
          media: article.urlToImage ? [{
            type: 'image',
            url: article.urlToImage,
            caption: article.title
          }] : [],
          publishedAt: new Date(article.publishedAt),
          readTime: this.calculateReadTime(article.content),
          seoMetadata: {
            slug: this.generateSlug(article.title),
            metaTitle: article.title.substring(0, 60),
            metaDescription: article.description.substring(0, 160),
            keywords: [category, article.source.name.toLowerCase()]
          }
        });

        await newsArticle.save();
        processed++;
        
        console.log(`📄 Saved: ${article.title}`);
      } catch (error) {
        console.error(`Failed to process: ${article.title}`, error);
      }
    }

    return processed;
  }

  private cleanContent(content: string): string {
    if (!content) return '';
    return content.replace(/\[\+\d+ chars\]$/, '').trim();
  }

  private calculateReadTime(content: string): number {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100);
  }

  private async getSystemUserId(): Promise<string> {
    return process.env.SYSTEM_USER_ID || '60d0fe4f5311236168a109ca';
  }

  private async getCategoryByName(categoryName: string) {
    try {
      const NewsCategory = require('../../models/NewsCategory').default;
      return await NewsCategory.findOne({ 
        $or: [
          { slug: categoryName },
          { googleNewsCategory: categoryName },
          { name: { $regex: new RegExp(categoryName, 'i') } }
        ]
      });
    } catch (error) {
      console.error('Error finding news category:', error);
      return null;
    }
  }
}

export const newsAPIService = new NewsAPIService();