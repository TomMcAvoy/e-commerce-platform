import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler'; // Use named import
import { notFound } from './middleware/notFound';

const app = express();

// Security middleware following Security Considerations
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint following API Endpoints Structure
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes following API Endpoints Structure
app.use('/api', routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler); // Must be after all routes

export default app;
