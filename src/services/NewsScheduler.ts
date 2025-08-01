import cron from 'node-cron';
import NewsArticle from '../models/NewsArticle';
import NewsCategory from '../models/NewsCategory';

export class NewsScheduler {
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;
    
    console.log('🗞️ NewsScheduler initialized - seeding initial news data.');
    
    // Schedule news fetching every 24 hours (for now, just re-seed if empty)
    cron.schedule('0 0 * * *', () => {
      this.fetchInternationalNews();
    });

    this.isInitialized = true;
    
    // Run initial fetch to seed data
    setTimeout(() => this.fetchInternationalNews(), 2000);
  }

  private async fetchInternationalNews() {
    try {
      console.log('📰 Fetching real news from multiple sources...');
      
      // Fetch from NewsAPI
      try {
        const { newsAPIService } = await import('../news/NewsAPIService');
        await newsAPIService.fetchAndSaveNews();
      } catch (error) {
        console.log('⚠️ NewsAPI failed, continuing with other sources');
      }
      
      // Fetch from MediaStack (free tier)
      try {
        const { mediaStackService } = await import('../news/MediaStackService');
        await mediaStackService.fetchNews();
      } catch (error) {
        console.log('⚠️ MediaStack failed, continuing');
      }
      
      console.log('✅ Multi-source news fetch completed');
    } catch (error) {
      console.error('❌ All news sources failed:', error);
      await this.fallbackSeed();
    }
  }

  private async fallbackSeed() {
    console.log('📰 Using fallback news seeding...');
    const existingCount = await NewsArticle.countDocuments({});
    if (existingCount > 0) return;
    
    const tenantId = '6884bf4702e02fe6eb401303';
    const sampleNews = [{
      tenantId,
      title: "Breaking: Technology News Update",
      slug: "breaking-technology-news-update",
      content: "Latest technology developments and industry updates.",
      excerpt: "Technology industry updates and news.",
      imageUrl: "https://picsum.photos/400/300?random=1",
      author: "News Team",
      publishedAt: new Date(),
      url: "https://example.com/tech-news",
      sourceName: "Tech News",
      sourceId: "tech-001"
    }];
    
    await NewsArticle.insertMany(sampleNews);
    console.log('📰 Fallback seeding completed');
  }

  // Get existing articles from database
  public async getStoredArticles(limit = 20) {
    try {
      const articles = await NewsArticle.find({})
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();
      
      return articles;
    } catch (error) {
      console.log('Error fetching stored articles:', error);
      return [];
    }
  }
}

// Export singleton instance
export const newsScheduler = new NewsScheduler();
export default newsScheduler;
