#!/bin/bash
# This script configures Jest to use an in-memory MongoDB server for testing,
# resolving database connection errors during test runs.

set -e

echo "🚀 Configuring Jest for In-Memory Database Testing..."
echo "===================================================="

# --- FIX 1: Prevent automatic DB connection on import in src/index.ts ---
echo "1. Patching src/index.ts to prevent auto-connect on import..."
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

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });

    process.on('unhandledRejection', (err: Error) => {
      console.error(`❌ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server only if this file is executed directly
if (require.main === module) {
  startServer();
}

export default app; // Export app for testing
EOF
echo "   ✅ src/index.ts patched successfully."


# --- FIX 2: Create a dedicated Jest configuration file ---
echo "2. Creating jest.config.js..."
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // This file runs before all tests, setting up the environment.
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // Clear mocks between every test
  clearMocks: true,
};
EOF
echo "   ✅ jest.config.js created."


# --- FIX 3: Create the test database setup file ---
echo "3. Creating test database setup file: src/__tests__/setup.ts..."
mkdir -p src/__tests__ # Ensure the directory exists
cat > src/__tests__/setup.ts << 'EOF'
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;

// Runs once before all test suites
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

// Runs once after all test suites
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// Runs before each test
beforeEach(async () => {
  // Clear all data from all collections
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
EOF
echo "   ✅ src/__tests__/setup.ts created."


# --- Final Instructions ---
echo ""
echo "✅ Jest Database Configuration Complete!"
echo "======================================"
echo ""
echo "The script has configured Jest to use a clean, in-memory database for every test run."
echo "This isolates tests from the development DB and prevents connection errors."
echo ""
echo "   Run this command to verify all tests now pass:"
echo "   npm test"
echo ""

