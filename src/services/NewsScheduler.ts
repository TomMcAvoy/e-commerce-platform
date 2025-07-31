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
      console.log('📰 Seeding initial news articles...');
      
      // Check if we already have news articles
      const existingCount = await NewsArticle.countDocuments({});
      if (existingCount > 0) {
        console.log(`📰 Found ${existingCount} existing news articles, skipping seeding`);
        return;
      }

      const tenantId = '6884bf4702e02fe6eb401303'; // Default tenant ID
      
      // First, create news categories if they don't exist
      const categoryNames = ['Technology', 'Industry News', 'Fire Safety'];
      const categories = [];
      
      for (const name of categoryNames) {
        let category = await NewsCategory.findOne({ name, tenantId });
        if (!category) {
          category = await NewsCategory.create({
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            tenantId
          });
        }
        categories.push(category);
      }
      
      console.log(`📰 Ensured ${categories.length} news categories exist`);

      // Sample news articles for security industry
      const sampleNews = [
        {
          tenantId,
          title: "New AI-Powered CCTV Systems Revolutionize Security Monitoring",
          slug: "ai-powered-cctv-systems-revolutionize-security-monitoring",
          content: "Advanced artificial intelligence integration in surveillance systems is transforming how security professionals monitor and respond to threats. These new systems can detect unusual behavior patterns and send instant alerts to security teams, significantly reducing response times and improving overall safety.",
          excerpt: "AI-powered CCTV systems are transforming security monitoring with advanced threat detection capabilities.",
          imageUrl: "/placeholder.svg",
          author: "Security Industry Expert",
          category: categories[0]._id, // Technology
          publishedAt: new Date(),
        },
        {
          tenantId,
          title: "International Security Standards Updated for 2024",
          slug: "international-security-standards-updated-2024",
          content: "The International Security Industry Organization has released updated standards for access control systems, emphasizing enhanced cybersecurity measures and data protection protocols. These updates address emerging threats and incorporate lessons learned from recent security incidents.",
          excerpt: "New international security standards focus on enhanced cybersecurity and data protection.",
          imageUrl: "/placeholder.svg",
          author: "Industry Standards Committee",
          category: categories[1]._id, // Industry News
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        },
        {
          tenantId,
          title: "Fire Safety Technology Advances in Smart Buildings",
          slug: "fire-safety-technology-advances-smart-buildings",
          content: "Smart building integration with fire safety systems is becoming increasingly sophisticated, with IoT sensors and automated response systems providing enhanced protection and faster emergency response times. Building managers can now monitor fire safety systems remotely and receive real-time alerts.",
          excerpt: "Smart buildings are integrating advanced fire safety technology with IoT sensors.",
          imageUrl: "/placeholder.svg",
          author: "Fire Safety Technology News",
          category: categories[2]._id, // Fire Safety
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        }
      ];

      // Insert sample news articles
      const articles = await NewsArticle.insertMany(sampleNews);
      console.log(`📰 Successfully seeded ${articles.length} news articles`);
      
    } catch (error) {
      console.error('❌ Error seeding news articles:', error);
    }
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
