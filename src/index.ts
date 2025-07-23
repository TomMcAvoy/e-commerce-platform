
import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit'; // Added for security
import path from 'path'; // Added for serving static files
import { connectDB } from './config/db';
import AppError from './utils/AppError';
import errorHandler from './middleware/errorHandler';
import apiRoutes from './routes/index';

dotenv.config();
connectDB();

const app: Express = express();

// --- Core Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));

// Set security HTTP headers according to best practices
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Rate Limiting ---
// As per security instructions, apply rate limiting to all API routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});
app.use('/api', limiter);

// --- Static File Serving ---
// As per file upload instructions, serve the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


// --- Health & API Routes ---
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'E-Commerce Platform API is healthy',
        version: process.env.npm_package_version,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Main API routes
app.use('/api', apiRoutes);


// --- Error Handling ---
// Handle 404 for routes not found, according to the AppError pattern
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(errorHandler);


// --- Server Initialization ---
const PORT = process.env.PORT || 3000;

// Start server only if not in a test environment
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections for a graceful shutdown
  process.on('unhandledRejection', (err: Error) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
}

export default app;