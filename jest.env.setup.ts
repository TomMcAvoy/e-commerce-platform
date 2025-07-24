// Environment variables for testing - loaded before any tests run
process.env.NODE_ENV = 'test';

// JWT Configuration (following your auth patterns)
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only-very-long-and-secure';
process.env.JWT_EXPIRE = '30d';

// Database Configuration (using test database)
process.env.MONGODB_URI = 'mongodb://localhost:27017/shoppingcart-test';
process.env.REDIS_URL = 'redis://localhost:6379/1';

// Server Configuration (different port to avoid conflicts)
process.env.PORT = '3002';

// Dropshipping Provider API Keys (from your instructions)
process.env.PRINTFUL_API_KEY = 'test-printful-api-key';
process.env.SPOCKET_API_KEY = 'test-spocket-api-key';

// Disable features that can interfere with testing
process.env.RATE_LIMIT_ENABLED = 'false';
process.env.CORS_ENABLED = 'true';
process.env.HELMET_ENABLED = 'false';

// Email Service (mock for tests)
process.env.EMAIL_SERVICE = 'test';
process.env.FROM_EMAIL = 'test@shoppingcart.com';

// File Upload Configuration
process.env.UPLOAD_PATH = './uploads/test';
process.env.MAX_FILE_SIZE = '5000000';

// Frontend API URL (following your CORS patterns)
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3002/api';

// Database connection options for testing
process.env.DB_OPTIONS = JSON.stringify({
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false,
  bufferMaxEntries: 0
});