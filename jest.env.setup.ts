process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.PORT = '3002'; // Use different port for tests
process.env.DEFAULT_TENANT_ID = '6884bf4702e02fe6eb401303';
process.env.DISABLE_SERVER_START = 'true'; // Prevent server from starting in tests