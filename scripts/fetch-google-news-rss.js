const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const NewsArticle = require('../dist/models/NewsArticle').default;
const NewsCategory = require('../dist/models/NewsCategory').default;
const slugify = require('slugify');

class GoogleNewsRSSService {
  constructor(tenantId = '6884bf4702e02fe6eb401303') {
    this.tenantId = tenantId;
  }

  getGoogleNewsUrl(country) {
    const countryMap = {
      'usa': 'US',
      'canada': 'CA', 
      'uk': 'GB',
      'scotland': 'GB'
    };

    const countryCode = countryMap[country] || 'US';
    return `https://news.google.com/rss?hl=en-${countryCode}&gl=${countryCode}&ceid=${countryCode}:en`;
  }

  extractXMLContent(xml, tag) {
    const regex = new RegExp(`<${tag}[^>]*>(.*?)<\/${tag}>`, 's');
    const match = xml.match(regex);
    return match ? match[1].replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').trim() : '';
  }

  async parseRSSFeed(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) return [];
      
      const xmlText = await response.text();
      
      const items = [];
      const itemMatches = xmlText.match(/<item>(.*?)<\/item>/gs);
      
      if (itemMatches) {
        for (const itemMatch of itemMatches.slice(0, 15)) {
          const title = this.extractXMLContent(itemMatch, 'title');
          const link = this.extractXMLContent(itemMatch, 'link');
          const pubDate = this.extractXMLContent(itemMatch, 'pubDate');
          const description = this.extractXMLContent(itemMatch, 'description');
          const source = this.extractXMLContent(itemMatch, 'source') || 'Google News';
          
          // Try to extract image
          let imageUrl = '';
          const imgMatch = itemMatch.match(/<img[^>]+src="([^"]+)"/i);
          if (imgMatch) {
            imageUrl = imgMatch[1];
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

  async getOrCreateCategory(categoryName) {
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

  categorizeNews(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.match(/business|economy|finance|market|stock|trade|company/)) return 'business';
    if (text.match(/sport|football|basketball|soccer|tennis|game|match/)) return 'sports';
    if (text.match(/tech|technology|ai|software|computer|digital|internet/)) return 'technology';
    if (text.match(/health|medical|hospital|doctor|disease|medicine/)) return 'health';
    if (text.match(/science|research|study|discovery|scientist/)) return 'science';
    if (text.match(/entertainment|movie|music|celebrity|hollywood|tv/)) return 'entertainment';
    
    return 'general';
  }

  async fetchNewsByCountry(country) {
    try {
      const url = this.getGoogleNewsUrl(country);
      const items = await this.parseRSSFeed(url);
      
      if (items.length === 0) return 0;

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
        const result = await NewsArticle.bulkWrite(operations);
        const imported = result.upsertedCount + result.modifiedCount;
        console.log(`    ✅ ${imported} articles imported`);
        return imported;
      }
      return 0;
    } catch (error) {
      console.error(`    ❌ Error fetching ${country}:`, error.message);
      return 0;
    }
  }
}

async function fetchGoogleNewsRSS() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const newsService = new GoogleNewsRSSService();
    
    console.log('🌍 Fetching news from Google News RSS feeds...\n');
    
    const countries = ['usa', 'canada', 'uk', 'scotland'];
    let totalImported = 0;
    
    for (const country of countries) {
      console.log(`📍 Processing ${country.toUpperCase()}:`);
      const imported = await newsService.fetchNewsByCountry(country);
      totalImported += imported;
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('');
    }
    
    console.log(`🎉 Successfully imported ${totalImported} articles from Google News!`);
    
    // Show summary
    const categoryCounts = await NewsCategory.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId('6884bf4702e02fe6eb401303') } },
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📂 Categories created:');
    categoryCounts.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} category`);
    });
    
    const articleCounts = await NewsArticle.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId('6884bf4702e02fe6eb401303') } },
      { $group: { _id: '$sourceId', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📰 Articles by source:');
    articleCounts.forEach(source => {
      console.log(`   ${source._id}: ${source.count} articles`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fetchGoogleNewsRSS();