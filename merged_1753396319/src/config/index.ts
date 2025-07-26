import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/shoppingcart-dev',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'a-very-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    cookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN || 30,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  },
};
