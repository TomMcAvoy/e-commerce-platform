import News from '../models/News';
import Tenant from '../models/Tenant';
import AppError from '../utils/AppError';

export { NEWS_SOURCES };

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

// Comprehensive international news sources by country/region
const NEWS_SOURCES = {
  usa: 'cnn,fox-news,abc-news,nbc-news,cbs-news,usa-today,the-washington-post,the-new-york-times,associated-press,reuters',
  uk: 'bbc-news,the-guardian-uk,independent,daily-mail,the-telegraph,sky-news,itv-news',
  scotland: 'bbc-scottish-news,the-scotsman,herald-scotland',
  canada: 'the-globe-and-mail,cbc-news,ctv-news,national-post,toronto-star',
  australia: 'abc-news-au,news-com-au,the-australian,sydney-morning-herald',
  germany: 'der-spiegel,die-zeit,bild',
  france: 'le-monde,le-figaro,liberation',
  italy: 'la-repubblica,corriere-della-sera,la-gazzetta-dello-sport',
  spain: 'el-pais,el-mundo,marca',
  netherlands: 'nu-nl,nos-nl',
  ireland: 'rte,irish-times',
  india: 'the-times-of-india,hindustan-times,ndtv',
  japan: 'japan-today,asahi-shimbun',
  china: 'xinhua-net,south-china-morning-post',
  russia: 'rt,sputnik-news',
  brazil: 'globo,folha-de-s-paulo',
  mexico: 'milenio,el-universal',
  argentina: 'la-nacion,clarin',
  southafrica: 'news24,iol'
};

// Default sources in priority order (USA, UK, Scotland, Canada first)
const DEFAULT_SOURCES = `${NEWS_SOURCES.usa},${NEWS_SOURCES.uk},${NEWS_SOURCES.scotland},${NEWS_SOURCES.canada}`.substring(0, 500);

class NewsService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
    if (!API_KEY) {
      console.warn('NEWS_API_KEY not found. External news fetching will be disabled.');
    }
  }

  public async fetchAndCacheNews(country?: string) {
    if (!API_KEY) return;

    try {
      const sources = country && NEWS_SOURCES[country as keyof typeof NEWS_SOURCES] 
        ? NEWS_SOURCES[country as keyof typeof NEWS_SOURCES]
        : DEFAULT_SOURCES;
      
      const response = await fetch(`${BASE_URL}?sources=${sources}&apiKey=${API_KEY}`);
      if (!response.ok) {
        throw new AppError(`News API request failed with status ${response.status}`, response.status);
      }
      const data = await response.json();

      if (data.articles && data.articles.length > 0) {
        const operations = data.articles.map((article: any) => ({
          updateOne: {
            filter: { title: article.title, tenantId: this.tenantId },
            update: {
              $set: {
                tenantId: this.tenantId,
                sourceId: article.source.id,
                sourceName: article.source.name,
                author: article.author,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: new Date(article.publishedAt),
                content: article.content,
                country: this.getCountryFromSource(article.source.id),
                isActive: true
              }
            },
            upsert: true
          }
        }));
        await News.bulkWrite(operations);
        console.log(`🗞️  Successfully cached ${operations.length} news articles from ${country || 'default sources'}.`);
      }
    } catch (error) {
      console.error('Error fetching or caching news:', error);
    }
  }

  private getCountryFromSource(sourceId: string): string {
    for (const [country, sources] of Object.entries(NEWS_SOURCES)) {
      if (sources.includes(sourceId)) return country;
    }
    return 'international';
  }

  public static getAvailableCountries() {
    return {
      usa: 'United States',
      uk: 'United Kingdom', 
      scotland: 'Scotland',
      canada: 'Canada',
      australia: 'Australia',
      germany: 'Germany',
      france: 'France',
      italy: 'Italy',
      spain: 'Spain',
      netherlands: 'Netherlands',
      ireland: 'Ireland',
      india: 'India',
      japan: 'Japan',
      china: 'China',
      russia: 'Russia',
      brazil: 'Brazil',
      mexico: 'Mexico',
      argentina: 'Argentina',
      southafrica: 'South Africa'
    };
  }
}

export default NewsService;