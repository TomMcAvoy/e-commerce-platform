import cron from 'node-cron';
import NewsService from './NewsService';
import Tenant from '../models/Tenant';

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
          
          // Fetch from priority countries
          const countries = ['usa', 'uk', 'scotland', 'canada', 'australia', 'germany', 'france'];
          
          for (const country of countries) {
            console.log(`📰 Fetching news from ${country.toUpperCase()}...`);
            await newsService.fetchAndCacheNews(country);
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
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
          await newsService.fetchAndCacheNews('usa'); // Start with USA
        }
      } catch (error) {
        console.error('Error during initial news fetch:', error);
      }
    }, 5000); // Wait 5 seconds after server start
  }
}

export default NewsScheduler;