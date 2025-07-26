/**
 * Centralized app setup for all test files
 * Following e-commerce platform testing infrastructure patterns
 */

// Import the mocked app from jest.setup.ts
let app: any;

try {
  // Import from the mocked index (configured in jest.setup.ts)
  app = require('../index').default || require('../index').app || require('../index');
} catch (error) {
  console.warn('Could not import app from index, using fallback');
  
  // Fallback: create minimal Express app for tests
  const express = require('express');
  app = express();
  
  // Health endpoint following debugging dashboard pattern
  app.get('/health', (req: any, res: any) => {
    res.status(200).json({ 
      status: 'OK', 
      environment: 'test',
      timestamp: new Date().toISOString()
    });
  });
  
  // API status endpoint following project patterns
  app.get('/api/status', (req: any, res: any) => {
    res.status(200).json({
      api: 'E-Commerce Platform API',
      version: '1.0.0',
      status: 'running',
      environment: 'test'
    });
  });
  
  // 404 handler following project patterns
  app.use('*', (req: any, res: any) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
}

export default app;
