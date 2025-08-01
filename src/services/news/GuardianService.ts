import axios from 'axios';
import NewsArticle from '../../models/NewsArticle';

export class GuardianService {
  private apiKey = 'test'; // Guardian API allows 'test' key for development
  private baseURL = 'https://content.guardianapis.com';

  async fetchGuardianNews(): Promise<void> {
    try {
      console.log('📰 Fetching from The Guardian API...');
      
      const sections = ['world', 'uk-news', 'us-news', 'technology', 'business', 'sport'];
      let totalProcessed = 0;

      for (const section of sections) {
        try {
          const response = await axios.get(`${this.baseURL}/search`, {
            params: {
              'api-key': this.apiKey,
              section: section,
              'show-fields': 'thumbnail,trailText,byline',
              'page-size': 10,
              'order-by': 'newest'
            }
          });

          const articles = response.data.response.results;

          for (const article of articles) {
            const existing = await NewsArticle.findOne({ url: article.webUrl });
            if (existing) continue;

            await NewsArticle.create({
              tenantId: process.env.DEFAULT_TENANT_ID,
              title: article.webTitle,
              slug: this.generateSlug(article.webTitle),
              content: article.fields?.trailText || '',
              excerpt: article.fields?.trailText?.substring(0, 200) || '',
              imageUrl: article.fields?.thumbnail || null,
              author: article.fields?.byline || 'The Guardian',
              publishedAt: new Date(article.webPublicationDate),
              url: article.webUrl,
              sourceName: 'The Guardian',
              sourceId: 'guardian',
              country: section.includes('us') ? 'us' : section.includes('uk') ? 'gb' : 'global',
              category: this.mapSection(section),
              priority: article.fields?.thumbnail ? 1 : 2
            });

            totalProcessed++;
            console.log(`📄 Saved Guardian: ${article.webTitle.substring(0, 60)}...`);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          console.error(`Failed to fetch Guardian ${section}:`, error.message);
        }
      }

      console.log(`✅ Guardian fetch completed. Processed ${totalProcessed} articles.`);
    } catch (error) {
      console.error('❌ Guardian fetch failed:', error);
    }
  }

  private mapSection(section: string): string {
    const mapping: { [key: string]: string } = {
      'world': 'general',
      'uk-news': 'general',
      'us-news': 'general',
      'technology': 'technology',
      'business': 'business',
      'sport': 'sports'
    };
    return mapping[section] || 'general';
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100);
  }
}

export const guardianService = new GuardianService();