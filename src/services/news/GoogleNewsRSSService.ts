import axios from 'axios';
import * as cheerio from 'cheerio';
import NewsArticle from '../../models/NewsArticle';

export class GoogleNewsRSSService {
  async fetchGoogleNewsRSS(): Promise<void> {
    try {
      console.log('🌐 Fetching from Google News RSS feeds...');
      
      const feeds = [
        { url: 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en', country: 'us', name: 'US' },
        { url: 'https://news.google.com/rss?hl=en-GB&gl=GB&ceid=GB:en', country: 'gb', name: 'UK' },
        { url: 'https://news.google.com/rss?hl=en-CA&gl=CA&ceid=CA:en', country: 'ca', name: 'Canada' },
        { url: 'https://news.google.com/rss?hl=en-AU&gl=AU&ceid=AU:en', country: 'au', name: 'Australia' }
      ];

      let totalProcessed = 0;

      for (const feed of feeds) {
        try {
          console.log(`📡 Fetching Google News ${feed.name}...`);
          
          const response = await axios.get(feed.url, {
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          const $ = cheerio.load(response.data, { xmlMode: true });
          
          const items = $('item').slice(0, 10);
          
          for (let i = 0; i < items.length; i++) {
            const item = items.eq(i);
            const title = item.find('title').text().trim();
            const link = item.find('link').text().trim();
            const description = item.find('description').text().trim();
            const pubDate = item.find('pubDate').text().trim();
            const source = item.find('source').text().trim() || 'Google News';

            if (!title || !link) continue;

            const existing = await NewsArticle.findOne({ url: link });
            if (existing) continue;

            // Try to extract image from description HTML
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
              author: source,
              publishedAt: pubDate ? new Date(pubDate) : new Date(),
              url: link,
              sourceName: source,
              sourceId: 'google-rss',
              country: feed.country,
              category: 'general',
              priority: imageUrl ? 1 : 2 // Lower priority for articles without images
            });

            totalProcessed++;
            console.log(`📄 Saved Google News: ${title.substring(0, 60)}...`);
          }

          await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (error: any) {
          console.error(`❌ Failed to fetch Google News ${feed.name}:`, error.message);
        }
      }

      console.log(`✅ Google News RSS completed. Processed ${totalProcessed} articles.`);
    } catch (error) {
      console.error('❌ Google News RSS failed:', error);
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

export const googleNewsRSSService = new GoogleNewsRSSService();