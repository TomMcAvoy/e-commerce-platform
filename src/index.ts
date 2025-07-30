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
import { setTenantId } from './middleware/tenant';
import NewsScheduler from './services/NewsScheduler';
import AppError from './utils/AppError';
import { errorHandler as customErrorHandler } from './middleware/errorHandler'; // Use named import

// Route files
import routes from './routes';


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
  windowMs: 1 * 60 * 1000, // 1 min
  max: 1000 // Increased for development
});
app.use(limiter);

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Tenant Middleware (must be before routes)
app.use(setTenantId);

// Mount routers
app.use('/api', routes);


// Health check endpoints
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/api/status', (req, res) => res.status(200).json({ status: 'API is running' }));

// Error Handler Middleware - MUST be last
app.use(customErrorHandler);

const PORT = process.env.NODE_ENV === 'test' ? 0 : (process.env.PORT || 3000);

// Connect to Database (always for both server and tests)
connectDB();

// Initialize the news scheduler (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  NewsScheduler.initialize();
}

let server: any;

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(
      colors.blue.bold(
        `🔥 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      )
    );
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error, promise) => {
  console.log(colors.red(`Error: ${err.message}`));
  // Close server & exit process (only if server exists)
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

export { app }; // <-- Export the app instance for testing

