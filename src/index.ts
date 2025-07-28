import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';

// Custom modules
import connectDB from './config/db';
import errorHandler from './middleware/error';
import tenantMiddleware from './middleware/tenant';
import NewsScheduler from './services/NewsScheduler';
import AppError from './utils/AppError';
import { errorHandler as customErrorHandler } from './middleware/errorHandler'; // Use named import

// Route files
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import vendorRoutes from './routes/vendorRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';
import newsRoutes from './routes/newsRoutes';
import newsCategoryRoutes from './routes/newsCategoryRoutes';
import seederRoutes from './routes/admin/seeder';

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security middleware
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 200
});
app.use(limiter);

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Tenant Middleware (must be before routes)
app.use(tenantMiddleware);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/news-categories', newsCategoryRoutes);
app.use('/api/admin', seederRoutes);

// Health check endpoints
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/api/status', (req, res) => res.status(200).json({ status: 'API is running' }));

// Error Handler Middleware - MUST be last
app.use(customErrorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(
    colors.blue.bold(
      `🔥 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  );
  // Connect to Database
  connectDB();
  
  // Initialize the news scheduler
  NewsScheduler.initialize();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error, promise) => {
  console.log(colors.red(`Error: ${err.message}`));
  // Close server & exit process
  server.close(() => process.exit(1));
});

export { app }; // <-- Export the app instance for testing

