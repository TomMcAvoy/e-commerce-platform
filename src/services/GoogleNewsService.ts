import News from '../models/News';

interface GoogleNewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
}

class GoogleNewsService {
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

    const categoryMap: { [key: string]: string } = {
      'general': 'h',
      'business': 'b',
      'entertainment': 'e',
      'health': 'm',
      'science': 'snc',
      'sports': 's',
      'technology': 't'
    };

    const countryCode = countryMap[country] || 'US';
    const categoryCode = categoryMap[category] || 'h';
    
    return `https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFZxYUdjU0FtVnVHZ0pWVXlnQVAB?hl=en-${countryCode}&gl=${countryCode}&ceid=${countryCode}:en`;
  }

  private async parseRSSFeed(url: string): Promise<GoogleNewsItem[]> {
    try {
      const response = await fetch(url);
      if (!response.ok) return [];
      
      const xmlText = await response.text();
      
      // Simple XML parsing for RSS items
      const items: GoogleNewsItem[] = [];
      const itemMatches = xmlText.match(/<item>(.*?)<\/item>/gs);
      
      if (itemMatches) {
        for (const itemMatch of itemMatches.slice(0, 10)) { // Limit to 10 items
          const title = this.extractXMLContent(itemMatch, 'title');
          const link = this.extractXMLContent(itemMatch, 'link');
          const pubDate = this.extractXMLContent(itemMatch, 'pubDate');
          const description = this.extractXMLContent(itemMatch, 'description');
          const source = this.extractXMLContent(itemMatch, 'source') || 'Google News';
          
          if (title && link) {
            items.push({ title, link, pubDate, description, source });
          }
        }
      }
      
      return items;
    } catch (error) {
      console.error('Error parsing RSS feed:', error);
      return [];
    }
  }

  private extractXMLContent(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 's');
    const match = xml.match(regex);
    return match ? match[1].replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').trim() : '';
  }

  public async fetchNewsByCountryAndCategory(country: string, category: string = 'general'): Promise<void> {
    try {
      const url = this.getGoogleNewsUrl(country, category);
      const items = await this.parseRSSFeed(url);
      
      if (items.length === 0) return;

      const operations = items.map((item) => ({
        updateOne: {
          filter: { title: item.title, tenantId: this.tenantId },
          update: {
            $set: {
              tenantId: this.tenantId,
              sourceId: 'google-news',
              sourceName: item.source,
              author: item.source,
              title: item.title,
              description: item.description,
              url: item.link,
              urlToImage: '',
              publishedAt: new Date(item.pubDate || Date.now()),
              content: item.description,
              country,
              category,
              isActive: true
            }
          },
          upsert: true
        }
      }));

      await News.bulkWrite(operations);
      console.log(`✅ Fetched ${items.length} ${category} articles from ${country}`);
    } catch (error) {
      console.error(`Error fetching news for ${country}/${category}:`, error);
    }
  }

  public async fetchAllNews(): Promise<void> {
    const countries = ['usa', 'canada', 'uk', 'scotland'];
    const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];

    for (const country of countries) {
      for (const category of categories) {
        await this.fetchNewsByCountryAndCategory(country, category);
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}

export default GoogleNewsService;