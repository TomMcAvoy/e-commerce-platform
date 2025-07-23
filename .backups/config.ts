import dotenv from 'dotenv';
import { AppConfig } from '../types/config';

// Load environment variables following copilot patterns
dotenv.config();

export const config: AppConfig = {
  // Server configuration
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
  redisUrl: process.env.REDIS_URL,
  
  // Authentication following JWT pattern from copilot instructions
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  
  // File upload configuration
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  
  // Email configuration
  emailFrom: process.env.EMAIL_FROM || 'noreply@ecommerce.com',
  emailFromName: process.env.EMAIL_FROM_NAME || 'E-Commerce Platform',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  
  // Payment configuration
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Dropshipping API keys following copilot service patterns
  printful: process.env.PRINTFUL_API_KEY ? {
    apiKey: process.env.PRINTFUL_API_KEY,
    storeId: process.env.PRINTFUL_STORE_ID
  } : undefined,
  spocket: process.env.SPOCKET_API_KEY ? {
    apiKey: process.env.SPOCKET_API_KEY,
    userId: process.env.SPOCKET_USER_ID
  } : undefined,
  
  // CORS configuration for development
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100')
};
