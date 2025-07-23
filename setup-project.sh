#!/bin/bash
# This script sets up the core backend structure and configuration
# to resolve common startup errors like missing files and incorrect wiring.
# It follows the patterns defined in .github/copilot-instructions.md.

set -e

echo "🚀 Starting Core Project Setup..."
echo "================================="

# --- 1. Create Essential Directories ---
echo "1. Creating essential backend directories..."
mkdir -p src/config src/utils src/middleware src/controllers src/routes src/models
echo "   ✅ Directories created."

# --- 2. Create Core Backend Files ---
echo "2. Creating missing core backend files..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "   - Creating default .env file..."
  cat > .env << 'EOF'
# Backend Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce_platform

# Security
JWT_SECRET=your_super_secret_jwt_key_that_is_long_and_random
JWT_EXPIRE=30d
EOF
  echo "   ✅ .env file created. Please review it."
else
  echo "   - .env file already exists, skipping."
fi

# Create Database Connection file
echo "   - Creating src/config/db.ts..."
cat > src/config/db.ts << 'EOF'
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`💾 MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
EOF

# Create Custom Error Utility
echo "   - Creating src/utils/AppError.ts..."
cat > src/utils/AppError.ts << 'EOF'
class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
EOF

# Create Error Handling Middleware
echo "   - Creating src/middleware/errorHandler.ts..."
cat > src/middleware/errorHandler.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥', err);
  }

  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message || 'Something went very wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
EOF

# Create the main server file with correct wiring
echo "   - Creating a robust src/index.ts..."
cat > src/index.ts << 'EOF'
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import errorHandler from './middleware/errorHandler';
import AppError from './utils/AppError';

// Import routes
import productRoutes from './routes/products';
// import authRoutes from './routes/auth';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Security and logging middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// API Status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is running' });
});

// Mount routers
// app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Handle 404 - Not Found for API routes
app.all('/api/*', (req: Request, res: Response, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err: Error, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
EOF
echo "   ✅ Core backend files created."

# --- 3. Final Instructions ---
echo ""
echo "✅ Core Project Setup Complete!"
echo "=============================="
echo ""
echo "This script has created the essential files and directories for the backend."
echo "Your project should now be in a state where the setup command can succeed."
echo ""
echo "🚨 TEAM, CRITICAL NEXT STEP: Run the main setup command."
echo "   This will install all dependencies for both backend and frontend."
echo ""
echo "   Run this command in your terminal:"
echo "   npm run setup"
echo ""
echo "After setup completes, you can start both servers with:"
echo "   npm run dev:all"
echo ""
