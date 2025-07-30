/**
 * Centralized app setup for all test files
 * Following e-commerce platform testing infrastructure patterns
 */

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from '../routes';
import { errorHandler } from '../middleware/errorHandler';

// Create test app with proper configuration
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Mock authentication middleware for testing
app.use('/api', (req: any, res: any, next: any) => {
  // Mock user for protected routes
  req.user = {
    _id: '507f1f77bcf86cd799439011', // Mock user ID
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  };
  next();
});

// Health endpoint following debugging dashboard pattern
app.get('/health', (req: any, res: any) => {
  res.status(200).json({ 
    status: 'OK', 
    environment: 'test',
    timestamp: new Date().toISOString()
  });
});

// API routes following unified route structure
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

export default app;
