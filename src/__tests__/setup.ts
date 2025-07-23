import { config } from 'dotenv';

// Load environment variables for testing
config();

// Global test setup
beforeAll(() => {
  // Setup any global test configuration
});

afterAll(() => {
  // Cleanup after all tests
});

// Export a dummy test to satisfy Jest requirement
describe('Test Setup', () => {
  it('should setup test environment', () => {
    expect(true).toBe(true);
  });
});
