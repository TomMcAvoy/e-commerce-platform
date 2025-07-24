// Global test setup - runs after environment setup but before tests
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// CRITICAL: Mock the entire DropshippingService module at the file level
jest.mock('./src/services/dropshipping/DropshippingService', () => {
  const mockProvider = {
    name: 'Mock Provider',
    isEnabled: true,
    createOrder: jest.fn().mockResolvedValue({ 
      success: true, 
      orderId: 'mock-order-123',
      provider: 'mock-provider',
      status: 'pending'
    }),
    getOrderStatus: jest.fn().mockResolvedValue({ 
      orderId: 'mock-order-123', 
      status: 'processing' 
    }),
    getProducts: jest.fn().mockResolvedValue([]),
    getProduct: jest.fn().mockResolvedValue({}),
    getAvailableProducts: jest.fn().mockResolvedValue([]),
    cancelOrder: jest.fn().mockResolvedValue(true),
  };

  const mockService = {
    registerProvider: jest.fn(),
    getProvider: jest.fn().mockReturnValue(mockProvider),
    getEnabledProviders: jest.fn().mockReturnValue([mockProvider]),
    getDefaultProvider: jest.fn().mockReturnValue(mockProvider),
    isProviderEnabled: jest.fn().mockReturnValue(true),
    getProviderStatus: jest.fn().mockReturnValue({ enabled: 1, disabled: 0, total: 1 }),
    createOrder: jest.fn().mockResolvedValue({ 
      success: true, 
      orderId: 'mock-order-123',
      provider: 'mock-provider'
    }),
    getOrderStatus: jest.fn().mockResolvedValue({ orderId: 'mock-order-123', status: 'processing' }),
    cancelOrder: jest.fn().mockResolvedValue(true),
    getAvailableProducts: jest.fn().mockResolvedValue([]),
    getProductsFromProvider: jest.fn().mockResolvedValue([]),
    getAllProducts: jest.fn().mockResolvedValue([]),
    getProviderHealth: jest.fn().mockResolvedValue([]),
    searchProducts: jest.fn().mockResolvedValue([]),
    syncProduct: jest.fn().mockResolvedValue({}),
    getProductFromProvider: jest.fn().mockResolvedValue({}),
  };

  return {
    DropshippingService: jest.fn().mockImplementation(() => mockService),
    dropshippingService: mockService,
    IDropshippingProvider: {},
  };
});

// Mock bcryptjs for consistent password testing
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$10$mockedHashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('$2a$10$mockedSalt'),
}));

// Mock jsonwebtoken for auth testing
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ id: 'mock-user-id' }),
  decode: jest.fn().mockReturnValue({ id: 'mock-user-id' }),
}));

// Silence console logs except errors for cleaner test output
const originalConsole = global.console;
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: originalConsole.error, // Keep errors visible
};

// Global database setup
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'shoppingcart-test',
        storageEngine: 'wiredTiger'
      }
    });
    
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
    
    console.log('✓ Test MongoDB started');
  } catch (error) {
    console.error('✗ Failed to start test database:', error);
    throw error;
  }
}, 60000);

afterAll(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    
    if (mongoServer) {
      await mongoServer.stop();
      console.log('✓ Test MongoDB stopped');
    }
  } catch (error) {
    console.error('✗ Error during test cleanup:', error);
  }
}, 30000);

// Clear database between tests
beforeEach(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const collections = await mongoose.connection.db.collections();
      await Promise.all(collections.map(collection => collection.deleteMany({})));
    }
  } catch (error) {
    console.error('Error clearing test database:', error);
  }
});

// Clear mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});

jest.setTimeout(30000);
