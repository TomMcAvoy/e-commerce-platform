export interface AppConfig {
  // Server configuration following copilot patterns
  port: number;
  nodeEnv: string;
  
  // Database configuration
  mongoUri: string;
  redisUrl?: string;
  
  // Authentication following JWT pattern
  jwtSecret: string;
  jwtExpire: string;
  
  // File upload configuration
  maxFileSize: number;
  uploadPath: string;
  
  // Email configuration
  emailFrom: string;
  emailFromName: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  
  // Payment configuration
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  
  // Dropshipping API keys (following copilot dropshipping patterns)
  printful?: {
    apiKey: string;
    storeId?: string;
  };
  spocket?: {
    apiKey: string;
    userId?: string;
  };
  
  // CORS configuration
  corsOrigin: string;
  
  // Rate limiting
  rateLimitWindowMs: number;
  rateLimitMax: number;
}
