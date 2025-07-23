import { config } from './config';

describe('Config', () => {
  it('should have required environment variables', () => {
    expect(config).toBeDefined();
    expect(config.port).toBeDefined();
    expect(config.nodeEnv).toBeDefined();
  });

  it('should have database configuration', () => {
    expect(config.mongoUri).toBeDefined();
  });

  it('should have JWT configuration', () => {
    expect(config.jwtSecret).toBeDefined();
    expect(config.jwtExpire).toBeDefined();
  });

  it('should have proper environment setup', () => {
    expect(['development', 'production', 'test']).toContain(config.nodeEnv);
  });

  it('should have valid port number', () => {
    expect(typeof config.port).toBe('number');
    expect(config.port).toBeGreaterThan(0);
  });
});
