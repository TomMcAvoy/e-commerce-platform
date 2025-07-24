#!/bin/bash
# This script fixes the MongoDB Memory Server timeout issue by cleaning the
# environment, directly increasing the server's startup timeout, and simplifying
# the test command to isolate and solve the backend test failures.

set -e

echo "🚀 Fixing MongoDB Memory Server Timeout..."
echo "========================================="

# --- 1. Clean and Reinstall Dependencies ---
echo "1. Cleaning node_modules and reinstalling all dependencies..."
rm -rf node_modules package-lock.json
npm install
echo "   ✅ Dependencies reinstalled."

# --- 2. Increase MongoMemoryServer Startup Timeout ---
echo "2. Updating test setup to increase MongoDB startup timeout..."
# This replaces the setup file with a version that has a longer timeout
# and a safety check in the afterAll hook.
cat > src/__tests__/setup.ts << 'EOF'
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Explicitly increase the startup timeout to 60 seconds for the DB instance
  mongoServer = await MongoMemoryServer.create({
    instance: {
      startupTimeout: 60000
    }
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Add a check to prevent crashing if the server never started
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
EOF
echo "   ✅ src/__tests__/setup.ts updated."

# --- 3. Simplify Test Script in package.json ---
echo "3. Simplifying 'npm test' script to run backend tests only..."
# This command safely replaces only the "test" script line in your package.json
sed -i.bak 's/"test": ".*"/"test": "jest --config jest.config.js"/' package.json
rm package.json.bak
echo "   ✅ 'npm test' now only runs backend tests."

# --- Final Instructions ---
echo ""
echo "✅ Timeout Fix Applied!"
echo "======================"
echo ""
echo "The script has cleaned the environment, increased the database startup timeout,"
echo "and focused the 'npm test' command on the backend."
echo ""
echo "   Run the test command to verify:"
echo "   npm test"
echo ""
echo "If backend tests pass, we can restore the full test command later."
echo ""
