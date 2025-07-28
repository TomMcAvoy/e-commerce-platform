import cron from 'node-cron';
import { newsAPIService } from '../services/news/NewsAPIService';

export function initializeNewsScheduler(): void {
  // Run news fetch every 2 hours (to respect NewsAPI rate limits)
  cron.schedule('0 */2 * * *', async () => {
    try {
      console.log('🗞️  Starting scheduled news fetch...');
      await newsAPIService.fetchAndSaveNews();
      console.log('✅ Scheduled news fetch completed successfully');
    } catch (error) {
      console.error('❌ Scheduled news fetch failed:', error);
    }
  });

  // Initial fetch on startup (with delay to ensure database is ready)
  setTimeout(async () => {
    try {
      console.log('🚀 Starting initial news fetch...');
      await newsAPIService.fetchAndSaveNews();
      console.log('✅ Initial news fetch completed');
    } catch (error) {
      console.error('❌ Initial news fetch failed:', error);
    }
  }, 10000); // 10 second delay

  console.log('📅 News scheduler initialized - fetching every 2 hours');
}