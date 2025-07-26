// ✅ Environment setup that runs before jest.setup.ts

// Prevent any real server startup
process.env.NODE_ENV = 'test';
process.env.PORT = '3000'; // ✅ Set to valid port number for config tests
process.env.SKIP_SERVER_START = 'true';

// Set test-specific MongoDB URI (will be overridden by MongoMemoryServer)
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-placeholder';

// Mock other environment variables following project patterns
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.JWT_EXPIRE = '30d';
process.env.BCRYPT_ROUNDS = '1'; // Faster for tests

// API configuration for testing
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';

console.log('🧪 Jest environment variables configured for testing');

