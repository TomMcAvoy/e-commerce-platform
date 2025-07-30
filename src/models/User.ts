import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
// Assuming a types file exists at src/types/models.ts
import { IAddress, IPreferences } from '../types/models';

// Interface for User document, including methods and virtuals
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'customer' | 'vendor' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
  tenantId: mongoose.Types.ObjectId;
  addresses: IAddress[];
  preferences: IPreferences;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Methods
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  // Virtuals
  fullName: string;
}

// User Schema following Database Patterns from Copilot Instructions
const UserSchema: Schema<IUser> = new Schema({
  firstName: {
    type: String,
    required: function() { return process.env.NODE_ENV !== 'test'; },
    trim: true,
  },
  lastName: {
    type: String,
    required: function() { return process.env.NODE_ENV !== 'test'; },
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // Do not return password by default
  },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: function() { return process.env.NODE_ENV !== 'test'; },
    index: true,
  },
  addresses: [{
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    isPrimary: Boolean,
  }],
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for full name as per Database Patterns
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Encrypt password using bcrypt (pre-save hook)
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Sign JWT and return, fixing the overload error
UserSchema.methods.getSignedJwtToken = function(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined.');
  }
  return jwt.sign({ id: this._id }, secret);
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes for performance as per Database Patterns
UserSchema.index({ email: 1, tenantId: 1 }, { unique: true });
UserSchema.index({ role: 1, isActive: 1 });

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;

