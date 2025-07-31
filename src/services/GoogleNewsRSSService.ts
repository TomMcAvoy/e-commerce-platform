import NewsArticle from '../models/NewsArticle';
import NewsCategory from '../models/NewsCategory';
import slugify from 'slugify';

interface GoogleNewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  imageUrl?: string;
}

class GoogleNewsRSSService {
  private tenantId: string;

  constructor(tenantId: string = '6884bf4702e02fe6eb401303') {
    this.tenantId = tenantId;
  }

  private getGoogleNewsUrl(country: string, category: string = 'general'): string {
    const countryMap: { [key: string]: string } = {
      'usa': 'US',
      'canada': 'CA', 
      'uk': 'GB',
      'scotland': 'GB'
    };

    // Use Google News RSS feed - general news for all countries
    const countryCode = countryMap[country] || 'US';
    return `https://news.google.com/rss?hl=en-${countryCode}&gl=${countryCode}&ceid=${countryCode}:en`;
  }

  private extractXMLContent(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 's');
    const match = xml.match(regex);
    return match ? match[1].replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').trim() : '';
  }

  private async parseRSSFeed(url: string): Promise<GoogleNewsItem[]> {
    try {
      const response = await fetch(url);
      if (!response.ok) return [];
      
      const xmlText = await response.text();
      
      const items: GoogleNewsItem[] = [];
      const itemMatches = xmlText.match(/<item>(.*?)<\/item>/gs);
      
      if (itemMatches) {
        for (const itemMatch of itemMatches.slice(0, 15)) {
          const title = this.extractXMLContent(itemMatch, 'title');
          const link = this.extractXMLContent(itemMatch, 'link');
          const pubDate = this.extractXMLContent(itemMatch, 'pubDate');
          const description = this.extractXMLContent(itemMatch, 'description');
          const source = this.extractXMLContent(itemMatch, 'source') || 'Google News';
          
          // Try to extract image from description or media tags
          let imageUrl = '';
          const imgMatch = itemMatch.match(/<img[^>]+src="([^"]+)"/i);
          if (imgMatch) {
            imageUrl = imgMatch[1];
          } else {
            const mediaMatch = itemMatch.match(/<media:thumbnail[^>]+url="([^"]+)"/i);
            if (mediaMatch) {
              imageUrl = mediaMatch[1];
            }
          }
          
          if (title && link) {
            items.push({ title, link, pubDate, description, source, imageUrl });
          }
        }
      }
      
      return items;
    } catch (error) {
      console.error('Error parsing RSS feed:', error);
      return [];
    }
  }

  private async getOrCreateCategory(categoryName: string): Promise<string> {
    try {
      const slug = slugify(categoryName, { lower: true, strict: true });
      
      let category = await NewsCategory.findOne({ 
        slug, 
        tenantId: this.tenantId 
      });
      
      if (!category) {
        category = new NewsCategory({
          name: categoryName,
          slug,
          tenantId: this.tenantId
        });
        await category.save();
      }
      
      return category._id.toString();
    } catch (error) {
      console.error('Error creating category:', error);
      return '';
    }
  }

  private categorizeNews(title: string, description: string): string {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.match(/business|economy|finance|market|stock|trade|company/)) return 'business';
    if (text.match(/sport|football|basketball|soccer|tennis|game|match/)) return 'sports';
    if (text.match(/tech|technology|ai|software|computer|digital|internet/)) return 'technology';
    if (text.match(/health|medical|hospital|doctor|disease|medicine/)) return 'health';
    if (text.match(/science|research|study|discovery|scientist/)) return 'science';
    if (text.match(/entertainment|movie|music|celebrity|hollywood|tv/)) return 'entertainment';
    
    return 'general';
  }

  public async fetchNewsByCountry(country: string): Promise<void> {
    try {
      const url = this.getGoogleNewsUrl(country);
      const items = await this.parseRSSFeed(url);
      
      if (items.length === 0) return;

      const operations = [];
      
      for (const item of items) {
        const categoryName = this.categorizeNews(item.title, item.description);
        const categoryId = await this.getOrCreateCategory(categoryName);
        
        operations.push({
          updateOne: {
            filter: { 
              title: item.title, 
              tenantId: this.tenantId 
            },
            update: {
              $set: {
                tenantId: this.tenantId,
                title: item.title,
                slug: slugify(item.title, { lower: true, strict: true }),
                content: item.description || item.title,
                excerpt: item.description?.substring(0, 300),
                url: item.link,
                originalUrl: item.link,
                sourceName: item.source,
                sourceId: 'google-news-' + country,
                author: item.source,
                publishedAt: new Date(item.pubDate || Date.now()),
                category: categoryId,
                imageUrl: item.imageUrl || ''
              }
            },
            upsert: true
          }
        });
      }

      if (operations.length > 0) {
        await NewsArticle.bulkWrite(operations);
        console.log(`✅ Fetched ${items.length} articles from ${country.toUpperCase()}`);
      }
    } catch (error) {
      console.error(`Error fetching news for ${country}:`, error);
    }
  }

  public async fetchAllCountriesNews(): Promise<void> {
    const countries = ['usa', 'canada', 'uk', 'scotland'];

    for (const country of countries) {
      await this.fetchNewsByCountry(country);
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

export default GoogleNewsRSSService;