import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'vendor' | 'admin';
  isActive?: boolean;
}

export interface IUserDocument extends IUser, Document {
  generateToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Fix JWT signing method - following sendTokenResponse() pattern
userSchema.methods.generateToken = function(): string {
  const secret = process.env.JWT_SECRET;
  const expire = process.env.JWT_EXPIRE || '30d';
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  // Fix: Proper type handling for JWT signing
  return jwt.sign(
    { id: this._id.toString() }, 
    secret, 
    { expiresIn: expire }
  );
};

userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Performance indexes for multi-vendor platform
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, isActive: 1 });

export default mongoose.model<IUserDocument>('User', userSchema);
