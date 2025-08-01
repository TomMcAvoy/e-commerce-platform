import axios from 'axios';
import * as cheerio from 'cheerio';
import NewsArticle from '../../models/NewsArticle';

export class GoogleNewsService {
  private baseURL = 'https://news.google.com/rss';

  async fetchGoogleNews(): Promise<void> {
    try {
      console.log('📰 Fetching from Google News RSS...');
      
      const countries = [
        { code: 'US', name: 'us' },
        { code: 'GB', name: 'gb' },
        { code: 'CA', name: 'ca' },
        { code: 'AU', name: 'au' }
      ];

      let totalProcessed = 0;

      for (const country of countries) {
        try {
          console.log(`📂 Fetching Google News for ${country.code}`);
          const response = await axios.get(`${this.baseURL}?hl=en-${country.code}&gl=${country.code}&ceid=${country.code}:en`, {
            timeout: 5000
          });

          const $ = cheerio.load(response.data, { xmlMode: true });
          
          const items = $('item').toArray().slice(0, 5);
          
          for (const element of items) {
            const title = $(element).find('title').text();
            const link = $(element).find('link').text();
            const description = $(element).find('description').text();
            const pubDate = $(element).find('pubDate').text();
            const source = $(element).find('source').text() || 'Google News';

            if (!title || !link) continue;

            // Check if article already exists
            const existing = await NewsArticle.findOne({ url: link });
            if (existing) continue;

            await NewsArticle.create({
              tenantId: process.env.DEFAULT_TENANT_ID,
              title: title,
              slug: this.generateSlug(title),
              content: this.cleanText(description),
              excerpt: this.cleanText(description).substring(0, 200),
              imageUrl: null, // Google RSS doesn't include images
              author: source,
              publishedAt: new Date(pubDate),
              url: link,
              sourceName: source,
              sourceId: 'google-news',
              country: country.name,
              category: 'general'
            });

            totalProcessed++;
            console.log(`📄 Saved: ${title}`);
          }

          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`Failed to fetch Google News for ${country.code}:`, error);
        }
      }

      console.log(`✅ Google News fetch completed. Processed ${totalProcessed} articles.`);
    } catch (error) {
      console.error('❌ Google News fetch failed:', error);
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100);
  }

  private cleanText(html: string): string {
    const $ = cheerio.load(html);
    return $.text().trim();
  }
}

export const googleNewsService = new GoogleNewsService();