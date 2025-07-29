import User from '../../models/User';

describe('User Model', () => {
  it('should hash password before saving', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer' as const,
      tenantId: '507f1f77bcf86cd799439011'
    };

    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe('password123');
    expect(user.password).toBeDefined();
  });

  it('should match correct password', async () => {
    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test2@example.com',
      password: 'password123',
      role: 'customer' as const,
      tenantId: '507f1f77bcf86cd799439011'
    };

    const user = new User(userData);
    await user.save();

    const isMatch = await user.matchPassword('password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.matchPassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('should generate JWT token', () => {
    const user = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test3@example.com',
      password: 'password123',
      role: 'customer' as const,
      tenantId: '507f1f77bcf86cd799439011'
    });

    const token = user.getSignedJwtToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
});