import dotenv from 'dotenv';
import { logger } from './logger';

// Load environment variables
dotenv.config();

export interface AppConfig {
  // Server Configuration
  port: number;
  nodeEnv: string;
  
  // Database Configuration
  mongoUri: string;
  redisUrl?: string;
  
  // Authentication
  jwtSecret: string;
  jwtExpire: string;
  cookieExpire: number;
  
  // Email Configuration
  emailFrom: string;
  emailName: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  
  // File Upload Configuration
  maxFileSize: number;
  uploadPath: string;
  
  // Rate Limiting
  rateLimitWindow: number;
  rateLimitMax: number;
  
  // CORS Configuration
  corsOrigins: string[];
  
  // Dropshipping API Keys
  printfulApiKey?: string;
  spocketApiKey?: string;
  aliexpressApiKey?: string;
  modalystApiKey?: string;
  
  // Payment Configuration
  stripePublicKey?: string;
  stripeSecretKey?: string;
  paypalClientId?: string;
  paypalClientSecret?: string;
  
  // Frontend URL
  frontendUrl: string;
  
  // Security
  encryptionKey: string;
  
  // Logging
  logLevel: string;
  logRetentionDays: number;
}

class ConfigValidator {
  private static instance: ConfigValidator;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadAndValidateConfig();
  }

  public static getInstance(): ConfigValidator {
    if (!ConfigValidator.instance) {
      ConfigValidator.instance = new ConfigValidator();
    }
    return ConfigValidator.instance;
  }

  private loadAndValidateConfig(): AppConfig {
    const config: AppConfig = {
      // Server Configuration
      port: this.getNumber('PORT', 3000),
      nodeEnv: this.getString('NODE_ENV', 'development'),
      
      // Database Configuration
      mongoUri: this.getRequiredString('MONGO_URI'),
      redisUrl: this.getOptionalString('REDIS_URL'),
      
      // Authentication
      jwtSecret: this.getRequiredString('JWT_SECRET'),
      jwtExpire: this.getString('JWT_EXPIRE', '30d'),
      cookieExpire: this.getNumber('JWT_COOKIE_EXPIRE', 30),
      
      // Email Configuration
      emailFrom: this.getString('FROM_EMAIL', 'noreply@shopcart.com'),
      emailName: this.getString('FROM_NAME', 'ShopCart'),
      smtpHost: this.getOptionalString('SMTP_HOST'),
      smtpPort: this.getOptionalNumber('SMTP_PORT'),
      smtpUser: this.getOptionalString('SMTP_EMAIL'),
      smtpPassword: this.getOptionalString('SMTP_PASSWORD'),
      
      // File Upload Configuration
      maxFileSize: this.getNumber('MAX_FILE_UPLOAD', 1000000), // 1MB default
      uploadPath: this.getString('FILE_UPLOAD_PATH', './uploads'),
      
      // Rate Limiting
      rateLimitWindow: this.getNumber('RATE_LIMIT_WINDOW', 15 * 60 * 1000), // 15 minutes
      rateLimitMax: this.getNumber('RATE_LIMIT_MAX', 100),
      
      // CORS Configuration
      corsOrigins: this.getStringArray('CORS_ORIGINS', ['http://localhost:3001']),
      
      // Dropshipping API Keys
      printfulApiKey: this.getOptionalString('PRINTFUL_API_KEY'),
      spocketApiKey: this.getOptionalString('SPOCKET_API_KEY'),
      aliexpressApiKey: this.getOptionalString('ALIEXPRESS_API_KEY'),
      modalystApiKey: this.getOptionalString('MODALYST_API_KEY'),
      
      // Payment Configuration
      stripePublicKey: this.getOptionalString('STRIPE_PUBLISHABLE_KEY'),
      stripeSecretKey: this.getOptionalString('STRIPE_SECRET_KEY'),
      paypalClientId: this.getOptionalString('PAYPAL_CLIENT_ID'),
      paypalClientSecret: this.getOptionalString('PAYPAL_CLIENT_SECRET'),
      
      // Frontend URL
      frontendUrl: this.getString('FRONTEND_URL', 'http://localhost:3001'),
      
      // Security
      encryptionKey: this.getRequiredString('ENCRYPTION_KEY'),
      
      // Logging
      logLevel: this.getString('LOG_LEVEL', 'info'),
      logRetentionDays: this.getNumber('LOG_RETENTION_DAYS', 30)
    };

    this.validateConfig(config);
    return config;
  }

  private getString(key: string, defaultValue: string): string {
    const value = process.env[key];
    return value !== undefined ? value : defaultValue;
  }

  private getOptionalString(key: string): string | undefined {
    return process.env[key];
  }

  private getRequiredString(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
  }

  private getNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (value !== undefined) {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) {
        throw new Error(`Environment variable ${key} must be a valid number`);
      }
      return parsed;
    }
    return defaultValue;
  }

  private getOptionalNumber(key: string): number | undefined {
    const value = process.env[key];
    if (value !== undefined) {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed)) {
        throw new Error(`Environment variable ${key} must be a valid number`);
      }
      return parsed;
    }
    return undefined;
  }

  private getBoolean(key: string, defaultValue?: boolean): boolean | undefined {
    const value = process.env[key];
    if (value !== undefined) {
      return value.toLowerCase() === 'true';
    }
    return defaultValue;
  }

  private getStringArray(key: string, defaultValue?: string[]): string[] {
    const value = process.env[key];
    if (value !== undefined) {
      return value.split(',').map(item => item.trim());
    }
    return defaultValue || [];
  }

  private validateConfig(config: AppConfig): void {
    const errors: string[] = [];

    // Validate environment
    if (!['development', 'production', 'test'].includes(config.nodeEnv)) {
      errors.push('NODE_ENV must be development, production, or test');
    }

    // Validate port
    if (config.port < 1 || config.port > 65535) {
      errors.push('PORT must be between 1 and 65535');
    }

    // Validate JWT secret strength in production
    if (config.nodeEnv === 'production' && config.jwtSecret.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters in production');
    }

    // Validate encryption key
    if (config.encryptionKey.length < 32) {
      errors.push('ENCRYPTION_KEY must be at least 32 characters');
    }

    // Validate MongoDB URI format
    if (!config.mongoUri.startsWith('mongodb://') && !config.mongoUri.startsWith('mongodb+srv://')) {
      errors.push('MONGO_URI must be a valid MongoDB connection string');
    }

    // Validate email configuration if SMTP is configured
    if (config.smtpHost && (!config.smtpUser || !config.smtpPassword)) {
      errors.push('SMTP_EMAIL and SMTP_PASSWORD are required when SMTP_HOST is set');
    }

    // Validate CORS origins
    if (config.corsOrigins.length === 0) {
      errors.push('At least one CORS origin must be specified');
    }

    // Validate log level
    const validLogLevels = ['error', 'warn', 'info', 'debug'];
    if (!validLogLevels.includes(config.logLevel)) {
      errors.push('LOG_LEVEL must be one of: error, warn, info, debug');
    }

    // Production-specific validations
    if (config.nodeEnv === 'production') {
      if (config.frontendUrl.includes('localhost')) {
        errors.push('FRONTEND_URL should not use localhost in production');
      }

      if (config.corsOrigins.some(origin => origin.includes('localhost'))) {
        errors.push('CORS_ORIGINS should not include localhost in production');
      }

      // Warn about missing optional but recommended configurations
      const warnings: string[] = [];
      
      if (!config.redisUrl) {
        warnings.push('REDIS_URL is recommended for production (caching and sessions)');
      }

      if (!config.smtpHost) {
        warnings.push('SMTP configuration is recommended for production (email notifications)');
      }

      if (!config.stripeSecretKey && !config.paypalClientId) {
        warnings.push('Payment gateway configuration is recommended for production');
      }

      if (warnings.length > 0) {
        logger.warn('Production configuration warnings', { warnings });
      }
    }

    if (errors.length > 0) {
      logger.error('Configuration validation failed', { errors });
      throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
    }

    logger.info('Configuration loaded successfully', {
      nodeEnv: config.nodeEnv,
      port: config.port,
      hasRedis: !!config.redisUrl,
      hasSmtp: !!config.smtpHost,
      hasStripe: !!config.stripeSecretKey,
      hasPaypal: !!config.paypalClientId,
      corsOrigins: config.corsOrigins
    });
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  // Generate a sample .env file with all possible variables
  public static generateSampleEnv(): string {
    return `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/shopcart
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
ENCRYPTION_KEY=your-super-secure-encryption-key-32-chars

# Email Configuration
FROM_EMAIL=noreply@shopcart.com
FROM_NAME=ShopCart
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# File Upload Configuration
MAX_FILE_UPLOAD=1000000
FILE_UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# CORS Configuration
CORS_ORIGINS=http://localhost:3001,http://localhost:3000

# Dropshipping API Keys
PRINTFUL_API_KEY=your-printful-api-key
SPOCKET_API_KEY=your-spocket-api-key
ALIEXPRESS_API_KEY=your-aliexpress-api-key
MODALYST_API_KEY=your-modalyst-api-key

# Payment Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Logging
LOG_LEVEL=info
LOG_RETENTION_DAYS=30
`;
  }
}

// Export singleton instance
export const config = ConfigValidator.getInstance().getConfig();

// Export validator for testing
export { ConfigValidator };
