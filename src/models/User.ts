import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Definitive User Model combining B2C customer profiles with B2B vendor profiles.
 * Follows all Database Patterns and Security Considerations from Copilot Instructions.
 */
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'customer' | 'vendor' | 'admin';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'] 
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'] 
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: 6,
    select: false 
  },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
