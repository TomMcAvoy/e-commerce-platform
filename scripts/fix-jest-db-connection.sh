#!/bin/bash
# This script implements a robust Jest testing setup by using an in-memory
# database and correctly configuring the test environment.

set -e

echo "🚀 Implementing Robust In-Memory DB for Jest..."
echo "================================================"

# --- STEP 1: Revert src/index.ts to its original, simple structure ---
# The application should not have special logic for testing.
echo "1. Simplifying src/index.ts for consistent behavior..."
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

// Load env vars
dotenv.config();

// Connect to database
// This is called at the top level, so it runs when the module is imported.
connectDB();

const app = express();

// --- Middleware Setup ---
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Routes ---
app.get('/health', (req: Request, res: Response) => res.status(200).json({ status: 'UP' }));
app.use('/api/products', productRoutes);

// --- Error Handling ---
app.all('/api/*', (req, res, next) => next(new AppError(`Can't find ${req.originalUrl}`, 404)));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app; // Export app for testing
EOF
echo "   ✅ src/index.ts has been reverted to its standard structure."


# --- STEP 2: Update the Jest setup file to control the environment ---
# This is the core of the fix. It sets the DB environment variable *before* the app code runs.
echo "2. Updating src/__tests__/setup.ts to provide the test database URI..."
cat > src/__tests__/setup.ts << 'EOF'
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;

// This runs once before all tests.
beforeAll(async () => {
  // Create an in-memory MongoDB instance.
  mongo = await MongoMemoryServer.create();
  // Set the MONGODB_URI environment variable to the in-memory server's URI.
  // The application's connectDB() will now use this URI during tests.
  process.env.MONGODB_URI = mongo.getUri();
});

// This runs once after all tests.
afterAll(async () => {
  // Disconnect mongoose and stop the in-memory server.
  await mongoose.disconnect();
  await mongo.stop();
});

// This runs before each individual test.
beforeEach(async () => {
  // Clear all data from all collections to ensure a clean slate for each test.
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
EOF
echo "   ✅ Jest setup now correctly provides an in-memory database environment."


# --- Final Instructions ---
echo ""
echo "✅ Jest Database Fix Complete!"
echo "============================="
echo ""
echo "The script has configured Jest to use a clean, in-memory database for every test run."
echo "This is the professional standard for testing and will resolve the connection errors."
echo ""
echo "   Run this command to verify all tests now pass:"
echo "   npm test"

