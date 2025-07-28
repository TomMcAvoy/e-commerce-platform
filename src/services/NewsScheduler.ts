import cron from 'node-cron';
import NewsService from './NewsService';
import Tenant from '../models/Tenant';

class NewsScheduler {
  public static initialize() {
    // Schedule to run every hour
    cron.schedule('0 * * * *', async () => {
      console.log('Running scheduled news fetch...');
      try {
        // In a multi-tenant app, you'd loop through tenants.
        // For now, using a placeholder or the first tenant found.
        const tenant = await Tenant.findOne();
        if (tenant) {
          const newsService = new NewsService(tenant._id.toString());
          await newsService.fetchAndCacheNews();
        } else {
          console.warn('No tenants found, skipping scheduled news fetch.');
        }
      } catch (error) {
        console.error('Error during scheduled news fetch:', error);
      }
    });
    console.log('🗞️ NewsScheduler initialized. Will fetch news every hour.');
  }
}

export default NewsScheduler;