import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createClient } from 'redis';

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import userRoutes from './routes/users';
import orderRoutes from './routes/orders';
import vendorRoutes from './routes/vendors';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import dropshippingRoutes from './routes/dropshipping';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config();

class Server {
  public app: express.Application;
  private redisClient: any;

  constructor() {
    this.app = express();
    this.connectToDatabase();
    this.connectToRedis();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private async connectToDatabase(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shoppingcart';
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  private async connectToRedis(): Promise<void> {
    try {
      this.redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });

      this.redisClient.on('error', (err: Error) => console.error('Redis Client Error', err));
      await this.redisClient.connect();
      console.log('✅ Connected to Redis');
    } catch (error) {
      console.error('❌ Redis connection error:', error);
    }
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:3001',
        'http://localhost:3002'
      ],
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW!) || 15) * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!) || 100,
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use(limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Static files
    this.app.use('/uploads', express.static('uploads'));
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/products', productRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/orders', orderRoutes);
    this.app.use('/api/vendors', vendorRoutes);
    this.app.use('/api/categories', categoryRoutes);
    this.app.use('/api/cart', cartRoutes);
    this.app.use('/api/dropshipping', dropshippingRoutes);
  }

  private setupErrorHandling(): void {
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  public start(): void {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }

  public getRedisClient() {
    return this.redisClient;
  }
}

// Start server
const server = new Server();
server.start();

export default server;
