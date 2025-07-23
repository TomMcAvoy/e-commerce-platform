import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Global test timeout following copilot patterns
jest.setTimeout(30000);

// Mock console methods in test environment
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

// Global test helpers
global.beforeEach(() => {
  jest.clearAllMocks();
});
