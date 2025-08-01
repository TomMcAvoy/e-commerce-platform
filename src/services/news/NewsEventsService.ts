import axios from 'axios';
import NewsArticle from '../../models/NewsArticle';

export class NewsEventsService {
  private apiKey: string;
  private baseURL = 'https://newsapi.org/v2';

  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || '';
  }

  async fetchEvents(): Promise<void> {
    if (!this.apiKey) return;

    try {
      console.log('🎪 Fetching events from NewsAPI...');
      
      const eventQueries = ['events', 'conference', 'summit', 'festival', 'concert', 'sports event'];
      let totalProcessed = 0;

      for (const query of eventQueries) {
        try {
          const response = await axios.get(`${this.baseURL}/everything`, {
            params: {
              apiKey: this.apiKey,
              q: query,
              sortBy: 'publishedAt',
              pageSize: 10,
              language: 'en'
            }
          });

          const articles = response.data.articles.filter((article: any) => 
            article.title && 
            article.description && 
            article.urlToImage &&
            !article.title.includes('[Removed]')
          );

          for (const article of articles) {
            const existing = await NewsArticle.findOne({ url: article.url });
            if (existing) continue;

            await NewsArticle.create({
              tenantId: process.env.DEFAULT_TENANT_ID,
              title: article.title,
              slug: this.generateSlug(article.title),
              content: article.content || article.description,
              excerpt: article.description?.substring(0, 200),
              imageUrl: article.urlToImage,
              author: article.author || article.source.name,
              publishedAt: new Date(article.publishedAt),
              url: article.url,
              sourceName: article.source.name,
              sourceId: 'newsapi-events',
              country: 'global',
              category: 'events'
            });

            totalProcessed++;
            console.log(`🎪 Saved event: ${article.title}`);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to fetch ${query} events:`, error);
        }
      }

      console.log(`✅ Events fetch completed. Processed ${totalProcessed} events.`);
    } catch (error) {
      console.error('❌ Events fetch failed:', error);
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100);
  }
}

export const newsEventsService = new NewsEventsService();