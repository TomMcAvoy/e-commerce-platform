// Add proper JWT options type
import { SignOptions } from 'jsonwebtoken';

// Replace the getSignedJwtToken method with proper typing
UserSchema.methods.getSignedJwtToken = function(): string {
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  };
  
  return jwt.sign(
    { id: this._id }, 
    process.env.JWT_SECRET as string, 
    options
  );
};
