import axios from 'axios';
import * as cheerio from 'cheerio';
import NewsArticle from '../../models/NewsArticle';

export class BBCService {
  private baseURL = 'http://feeds.bbci.co.uk/news';

  async fetchBBCNews(): Promise<void> {
    try {
      console.log('📰 Fetching from BBC RSS feeds...');
      
      const feeds = [
        { url: `${this.baseURL}/rss.xml`, category: 'general', country: 'gb' },
        { url: `${this.baseURL}/world/rss.xml`, category: 'general', country: 'global' },
        { url: `${this.baseURL}/business/rss.xml`, category: 'business', country: 'gb' },
        { url: `${this.baseURL}/technology/rss.xml`, category: 'technology', country: 'gb' }
      ];

      let totalProcessed = 0;

      for (const feed of feeds) {
        try {
          const response = await axios.get(feed.url, { timeout: 10000 });
          const $ = cheerio.load(response.data, { xmlMode: true });
          
          const items = $('item').slice(0, 8);
          
          for (let i = 0; i < items.length; i++) {
            const item = items.eq(i);
            const title = item.find('title').text().trim();
            const link = item.find('link').text().trim();
            const description = item.find('description').text().trim();
            const pubDate = item.find('pubDate').text().trim();

            if (!title || !link) continue;

            const existing = await NewsArticle.findOne({ url: link });
            if (existing) continue;

            // Extract image from description
            let imageUrl = null;
            if (description) {
              const desc$ = cheerio.load(description);
              imageUrl = desc$('img').first().attr('src') || null;
            }

            await NewsArticle.create({
              tenantId: process.env.DEFAULT_TENANT_ID,
              title: title,
              slug: this.generateSlug(title),
              content: this.stripHtml(description),
              excerpt: this.stripHtml(description).substring(0, 200),
              imageUrl: imageUrl,
              author: 'BBC',
              publishedAt: pubDate ? new Date(pubDate) : new Date(),
              url: link,
              sourceName: 'BBC',
              sourceId: 'bbc-rss',
              country: feed.country,
              category: feed.category,
              priority: imageUrl ? 1 : 2
            });

            totalProcessed++;
            console.log(`📄 Saved BBC: ${title.substring(0, 60)}...`);
          }

          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error: any) {
          console.error(`Failed to fetch BBC feed:`, error.message);
        }
      }

      console.log(`✅ BBC fetch completed. Processed ${totalProcessed} articles.`);
    } catch (error) {
      console.error('❌ BBC fetch failed:', error);
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 100);
  }

  private stripHtml(html: string): string {
    if (!html) return '';
    return cheerio.load(html).text().trim();
  }
}

export const bbcService = new BBCService();