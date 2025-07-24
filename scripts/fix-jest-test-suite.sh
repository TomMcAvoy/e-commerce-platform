#!/bin/bash

echo "🚀 Fixing Jest Test Suite..."
echo "======================================"

# 1. Fix App Export and Imports
echo "🔧 Fixing Express app export for testing..."
# Add export to src/index.ts
if ! grep -q "export default app;" src/index.ts; then
  echo -e "\nexport default app;" >> src/index.ts
fi

echo "🔧 Updating test files to import the app correctly..."
# Find all test files importing 'app' and fix the path
find src -name "*.test.ts" -exec sed -i.bak "s|require('../../app')|require('../index')|g" {} +
find src -name "*.test.ts" -exec sed -i.bak "s|require('../app')|require('../index')|g" {} +
find src -name "*.test.ts" -exec sed -i.bak "s|from '../index'|from '../index'|g" {} +
find src -name "*.test.ts" -exec sed -i.bak "s|from '../../index'|from '../index'|g" {} +
# Correct the default import syntax
find src -name "*.test.ts" -exec sed -i.bak "s|import app from '../index'; // Default import following copilot patterns|import app from '../index';|g" {} +


# 2. Fix Database Connection for Tests
echo "🔧 Creating a global test setup for database connection..."
# Create setup file
cat > src/__tests__/setup.ts << 'EOF'
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
EOF

# Update jest.config.js to use the new setup file
echo "🔧 Configuring Jest to use the setup file..."
if ! grep -q "setupFilesAfterEnv" jest.config.js; then
  sed -i.bak "/testEnvironment: 'node',/a \  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']," jest.config.js
else
  sed -i.bak "s|setupFilesAfterEnv:.*|setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],|g" jest.config.js
fi


# 3. Fix AppError Imports
echo "🔧 Correcting AppError import statements..."
find src -type f -name "*.ts" -exec sed -i.bak "s|import { AppError } from '../utils/AppError'|import AppError from '../utils/AppError'|g" {} +


# 4. Fix JWT Signing in User Model
echo "🔧 Fixing jwt.sign method call in User model..."
sed -i.bak "s|return jwt.sign({ id: this._id },|return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRE });\n// @ts-ignore\n}|g" src/models/User.ts
# Remove the line that was causing a syntax error
sed -i.bak "/process.env.JWT_SECRET!,/d" src/models/User.ts


# Cleanup backup files created by sed
find . -name "*.bak" -type f -delete

echo ""
echo "✅ All fixes applied!"
echo "▶️  Run 'npm test' to see the results."
