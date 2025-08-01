import axios from 'axios';
import NewsArticle from '../../models/NewsArticle';

export class MediaStackService {
  private apiKey: string;
  private baseURL = 'http://api.mediastack.com/v1';

  constructor() {
    this.apiKey = process.env.MEDIASTACK_API_KEY || '';
  }

  async fetchNews(): Promise<void> {
    if (!this.apiKey) {
      console.log('📰 MEDIASTACK_API_KEY not configured');
      return;
    }

    try {
      const countries = ['us', 'ca', 'gb'];
      const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
      
      for (const country of countries) {
        for (const category of categories) {
          const response = await axios.get(`${this.baseURL}/news`, {
            params: {
              access_key: this.apiKey,
              countries: country,
              categories: category,
              limit: 5
            }
          });

          const articles = response.data.data || [];
          
          for (const article of articles) {
            if (!article.title || !article.description) continue;
            
            const exists = await NewsArticle.findOne({ url: article.url });
            if (exists) continue;

            await NewsArticle.create({
              tenantId: process.env.DEFAULT_TENANT_ID,
              title: article.title,
              slug: this.generateSlug(article.title),
              content: article.description,
              excerpt: article.description?.substring(0, 200),
              imageUrl: article.image,
              author: article.author || 'MediaStack',
              publishedAt: new Date(article.published_at),
              url: article.url,
              sourceName: article.source,
              sourceId: 'mediastack',
              country: country,
              category: category
            });
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log('✅ MediaStack news fetch completed');
    } catch (error) {
      console.error('❌ MediaStack fetch failed:', error);
    }
  }

  private generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 100);
  }
}

export const mediaStackService = new MediaStackService();