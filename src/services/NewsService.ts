import News from '../models/News';
import Tenant from '../models/Tenant'; // Assuming you have a Tenant model
import AppError from '../utils/AppError';

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

// List of sources to fetch from
const SOURCES = 'cnn,fox-news,bbc-news,the-globe-and-mail,bbc-scottish-news';

class NewsService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
    if (!API_KEY) {
      console.warn('NEWS_API_KEY not found. External news fetching will be disabled.');
    }
  }

  public async fetchAndCacheNews() {
    if (!API_KEY) return;

    try {
      const response = await fetch(`${BASE_URL}?sources=${SOURCES}&apiKey=${API_KEY}`);
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
                isActive: true
              }
            },
            upsert: true
          }
        }));
        await News.bulkWrite(operations);
        console.log(`🗞️  Successfully cached ${operations.length} news articles.`);
      }
    } catch (error) {
      console.error('Error fetching or caching news:', error);
    }
  }
}

export default NewsService;