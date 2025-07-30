import cron from 'node-cron';
import NewsService from './NewsService';
import Tenant from '../models/Tenant';
import NewsCategory from '../models/NewsCategory';

class NewsScheduler {
  public static initialize() {
    if (!process.env.NEWS_API_KEY) {
      console.log('🗞️ NewsScheduler disabled - NEWS_API_KEY not configured');
      return;
    }

    // Schedule to run every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      console.log('🌍 Running scheduled international news fetch...');
      try {
        const tenant = await Tenant.findOne();
        if (tenant) {
          const newsService = new NewsService(tenant._id.toString());
          
          // Get news categories to fetch for
          const categories = await NewsCategory.find({ tenantId: tenant._id });
          const categoryNames = categories.length > 0 
            ? categories.map(cat => cat.slug)
            : ['general', 'business', 'technology', 'health', 'sports', 'entertainment'];
          
          // Fetch from priority countries - Enhanced with European and Asian countries
          const countries = [
            // English-speaking
            'usa', 'uk', 'scotland', 'canada', 'australia',
            // Major European
            'germany', 'france', 'italy', 'spain', 'netherlands', 'ireland', 'norway', 'sweden', 'denmark',
            // Major Asian
            'japan', 'india', 'china', 'southkorea', 'singapore', 'thailand'
          ];
          
          for (const country of countries) {
            console.log(`📰 Fetching news from ${country.toUpperCase()}...`);
            
            // Fetch for each category
            for (const category of categoryNames) {
              try {
                await newsService.fetchAndCacheNewsByCategory(country, category);
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between categories
              } catch (error) {
                console.error(`Error fetching ${category} news from ${country}:`, error);
              }
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between countries
          }
          
          console.log('✅ Completed international news fetch');
        } else {
          console.warn('No tenants found, skipping scheduled news fetch.');
        }
      } catch (error) {
        console.error('Error during scheduled news fetch:', error);
      }
    });
    console.log('🗞️ NewsScheduler initialized. Will fetch international news every 30 minutes.');
    
    // Initial fetch on startup
    setTimeout(async () => {
      console.log('🚀 Initial news fetch on startup...');
      try {
        const tenant = await Tenant.findOne();
        if (tenant) {
          const newsService = new NewsService(tenant._id.toString());
          
          // Seed news categories if they don't exist
          await this.seedNewsCategories(tenant._id.toString());
          
          // Initial fetch for general news
          await newsService.fetchAndCacheNewsByCategory('usa', 'general');
        }
      } catch (error) {
        console.error('Error during initial news fetch:', error);
      }
    }, 5000); // Wait 5 seconds after server start
  }

  private static async seedNewsCategories(tenantId: string) {
    const defaultCategories = [
      { name: 'General', slug: 'general' },
      { name: 'Business', slug: 'business' },
      { name: 'Technology', slug: 'technology' },
      { name: 'Health', slug: 'health' },
      { name: 'Sports', slug: 'sports' },
      { name: 'Entertainment', slug: 'entertainment' },
      { name: 'Science', slug: 'science' },
      { name: 'Politics', slug: 'politics' },
      { name: 'Toys & Games', slug: 'toys' }
    ];

    for (const category of defaultCategories) {
      await NewsCategory.findOneAndUpdate(
        { slug: category.slug, tenantId },
        { $set: { name: category.name, slug: category.slug, tenantId } },
        { upsert: true, new: true }
      );
    }
    console.log('✅ News categories seeded');
  }
}

export default NewsScheduler;