import axios from 'axios';

export interface ContentAnalysisResult {
  suggestedCategory: string;
  confidence: number;
  topics: string[];
  appropriatenessScore: number;
  needsModeration: boolean;
  suggestedRewrite?: string;
  toxicityLevel: number;
  grammarScore: number;
}

export interface CategorySuggestion {
  category: string;
  confidence: number;
  reason: string;
}

export class ContentAnalysisService {
  private static readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  private static readonly API_URL = 'https://api.openai.com/v1/chat/completions';

  // Available categories that posts can be assigned to
  private static readonly CATEGORIES = [
    'pets',
    'obscure',
    'breaking-news',
    'local-community', 
    'student-life',
    'teen-zone',
    'global-discussions',
    'technology',
    'health-wellness',
    'entertainment',
    'sports',
    'food-cooking',
    'travel',
    'fashion-beauty',
    'home-garden',
    'business-finance',
    'education',
    'relationships',
    'hobbies-crafts',
    'politics'
  ];

  /**
   * Analyzes content and suggests appropriate category, topics, and moderation needs
   */
  static async analyzeContent(content: string, currentCategory?: string): Promise<ContentAnalysisResult> {
    try {
      // If no OpenAI key, fall back to basic analysis
      if (!this.OPENAI_API_KEY) {
        return this.basicContentAnalysis(content, currentCategory);
      }

      const prompt = `
Analyze this social media post and provide a JSON response with the following structure:

Content to analyze: "${content}"
Current category: ${currentCategory || 'none'}
Available categories: ${this.CATEGORIES.join(', ')}

Please provide:
{
  "suggestedCategory": "most appropriate category from the list",
  "confidence": number between 0-1,
  "topics": ["array", "of", "relevant", "topics"],
  "appropriatenessScore": number between 0-10 (10 = very appropriate),
  "needsModeration": boolean,
  "suggestedRewrite": "rewritten version if needed (neutral, polite, professional)",
  "toxicityLevel": number between 0-10 (0 = not toxic),
  "grammarScore": number between 0-10 (10 = perfect grammar),
  "reasoning": "why this category was chosen"
}

Rules:
- If content is about pets/animals → "pets"
- If content is very niche/specialized → "obscure" 
- If content contains profanity/toxicity, rewrite it professionally
- Examples: "fuck off" → "I respectfully disagree", "this sucks" → "this could be improved"
- Keep the core message but make it civil and neutral
- Topics should be 2-4 relevant keywords
`;

      const response = await axios.post(
        this.API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a content moderator and categorization expert. Respond only with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = JSON.parse(response.data.choices[0].message.content);
      
      // Validate the response
      if (!this.CATEGORIES.includes(result.suggestedCategory)) {
        result.suggestedCategory = this.categorizeBasedOnKeywords(content);
      }

      return {
        suggestedCategory: result.suggestedCategory,
        confidence: Math.min(Math.max(result.confidence, 0), 1),
        topics: result.topics || [],
        appropriatenessScore: Math.min(Math.max(result.appropriatenessScore, 0), 10),
        needsModeration: result.needsModeration || result.toxicityLevel > 3,
        suggestedRewrite: result.suggestedRewrite || undefined,
        toxicityLevel: Math.min(Math.max(result.toxicityLevel, 0), 10),
        grammarScore: Math.min(Math.max(result.grammarScore, 0), 10)
      };

    } catch (error) {
      console.error('OpenAI analysis failed, falling back to basic analysis:', error);
      return this.basicContentAnalysis(content, currentCategory);
    }
  }

  /**
   * Basic content analysis without AI (fallback)
   */
  private static basicContentAnalysis(content: string, currentCategory?: string): ContentAnalysisResult {
    const lowerContent = content.toLowerCase();
    
    // Category detection based on keywords
    const suggestedCategory = this.categorizeBasedOnKeywords(content);
    
    // Detect profanity and toxicity
    const toxicWords = ['fuck', 'shit', 'damn', 'hate', 'stupid', 'idiot', 'moron', 'suck'];
    const toxicityLevel = toxicWords.filter(word => lowerContent.includes(word)).length;
    
    // Generate rewrite if toxic
    let suggestedRewrite: string | undefined;
    if (toxicityLevel > 0) {
      suggestedRewrite = this.basicContentRewrite(content);
    }
    
    // Extract topics (simple keyword extraction)
    const topics = this.extractTopics(content);
    
    return {
      suggestedCategory,
      confidence: suggestedCategory !== 'obscure' ? 0.7 : 0.5,
      topics,
      appropriatenessScore: Math.max(10 - toxicityLevel * 2, 1),
      needsModeration: toxicityLevel > 0,
      suggestedRewrite,
      toxicityLevel: Math.min(toxicityLevel, 10),
      grammarScore: 7 // Default reasonable score
    };
  }

  /**
   * Categorize content based on keywords
   */
  private static categorizeBasedOnKeywords(content: string): string {
    const lowerContent = content.toLowerCase();
    
    // Pet keywords
    if (/\b(dog|cat|pet|animal|puppy|kitten|bird|fish|hamster|rabbit|vet|collar|leash|treat)\b/.test(lowerContent)) {
      return 'pets';
    }
    
    // Technology keywords
    if (/\b(code|programming|software|app|tech|computer|phone|AI|javascript|python|bug|server)\b/.test(lowerContent)) {
      return 'technology';
    }
    
    // Health keywords
    if (/\b(health|fitness|diet|exercise|doctor|medicine|wellness|mental|therapy|nutrition)\b/.test(lowerContent)) {
      return 'health-wellness';
    }
    
    // News keywords
    if (/\b(news|breaking|urgent|reported|announced|government|election|policy|crisis)\b/.test(lowerContent)) {
      return 'breaking-news';
    }
    
    // Student keywords
    if (/\b(student|school|university|college|exam|homework|professor|class|study|degree)\b/.test(lowerContent)) {
      return 'student-life';
    }
    
    // Sports keywords
    if (/\b(sports|football|basketball|soccer|game|team|player|match|score|championship)\b/.test(lowerContent)) {
      return 'sports';
    }
    
    // Food keywords
    if (/\b(food|recipe|cooking|restaurant|meal|dinner|lunch|breakfast|chef|delicious)\b/.test(lowerContent)) {
      return 'food-cooking';
    }
    
    // Default to obscure for specialized/niche content
    return 'obscure';
  }

  /**
   * Basic content rewriting to remove toxicity
   */
  private static basicContentRewrite(content: string): string {
    let rewritten = content;
    
    // Replace profanity with polite alternatives
    const replacements: { [key: string]: string } = {
      'fuck off': 'I respectfully disagree',
      'fuck': 'darn',
      'shit': 'stuff',
      'this sucks': 'this could be improved',
      'hate this': 'dislike this',
      'stupid': 'not ideal',
      'idiot': 'person',
      'moron': 'person',
      'damn': 'darn'
    };
    
    for (const [toxic, replacement] of Object.entries(replacements)) {
      rewritten = rewritten.replace(new RegExp(toxic, 'gi'), replacement);
    }
    
    return rewritten;
  }

  /**
   * Extract topics from content
   */
  private static extractTopics(content: string): string[] {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Remove common words
    const stopWords = ['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other'];
    const relevantWords = words.filter(word => !stopWords.includes(word));
    
    // Get most frequent words as topics
    const wordCount: { [key: string]: number } = {};
    relevantWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([word]) => word);
  }

  /**
   * Check if content should be moved to a different category
   */
  static shouldRecategorize(content: string, currentCategory: string, analysisResult: ContentAnalysisResult): boolean {
    return analysisResult.suggestedCategory !== currentCategory && 
           analysisResult.confidence > 0.6 &&
           analysisResult.suggestedCategory !== 'obscure';
  }

  /**
   * Generate notification message for author about category change
   */
  static generateRecategorizationNotification(
    originalCategory: string, 
    newCategory: string, 
    reason: string
  ): string {
    return `Hi! Your post has been moved from "${originalCategory}" to "${newCategory}" to help other users find it more easily. ${reason}. Thanks for understanding!`;
  }
}