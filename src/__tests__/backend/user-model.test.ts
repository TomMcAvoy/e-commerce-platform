import User from '../../models/User'; // Correct: Use default import for the Mongoose model
import bcrypt from 'bcryptjs';
import { IUserDocument, IUser } from '../../models/User';

// Mock the bcryptjs library
jest.mock('bcryptjs');

describe('User Model', () => {
  describe('matchPassword', () => {
    it('should return true when passwords match', async () => {
      // We don't need to save the user, just instantiate it to test the method
      const user = new User({ password: 'password123' }) as IUserDocument;
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      const isMatch = await user.matchPassword('password123');
      
      expect(isMatch).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password);
    });

    it('should return false when passwords do not match', async () => {
      const user = new User({ password: 'password123' }) as IUserDocument;
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      const isMatch = await user.matchPassword('wrongpassword');
      
      expect(isMatch).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', user.password);
    });

    it('should return false if the user has no password', async () => {
        const user = new User({ name: 'Test User' }) as IUserDocument; // No password
        const isMatch = await user.matchPassword('anypassword');
        expect(isMatch).toBe(false);
        expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });
});
