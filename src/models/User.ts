import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '../types';

const AddressSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: String,
  address1: { type: String, required: true },
  address2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: String,
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new Schema<IUser & Document>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CUSTOMER
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  dateOfBirth: Date,
  addresses: [AddressSchema],
  
  // Networking fields
  bio: {
    type: String,
    maxlength: 500
  },
  headline: {
    type: String,
    maxlength: 120
  },
  company: {
    type: String,
    maxlength: 100
  },
  jobTitle: {
    type: String,
    maxlength: 100
  },
  industry: {
    type: String,
    maxlength: 50
  },
  location: {
    type: String,
    maxlength: 100
  },
  profileImage: {
    type: String
  },
  coverImage: {
    type: String
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    instagram: String,
    facebook: String,
    website: String
  },
  interests: [String],
  skills: [String],
  networkingPreferences: {
    isProfilePublic: { type: Boolean, default: true },
    allowConnectionRequests: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: false },
    notifyOnNewConnections: { type: Boolean, default: true },
    notifyOnMessages: { type: Boolean, default: true }
  },
  connectionCount: {
    type: Number,
    default: 0
  },
  followerCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  profileViews: {
    type: Number,
    default: 0
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  },
  
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      delete ret.password;
      return ret;
    }
  }
});

// Index for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model<IUser & Document>('User', UserSchema);
