import { config } from '../../config';

// Set a default test environment
process.env.NODE_ENV = 'test';

describe('Config', () => {
  it('should have all required properties defined', () => {
    expect(config.nodeEnv).toBeDefined();
    expect(config.port).toBeDefined();
    expect(config.db.uri).toBeDefined();
    expect(config.jwt.secret).toBeDefined();
    expect(config.redis.url).toBeDefined();
    expect(config.cors.origin).toBeDefined();
  });

  it('should have correct values for test environment', () => {
    // The config object is loaded once, so we check the value it was loaded with.
    expect(config.nodeEnv).toEqual('test');
  });
});
