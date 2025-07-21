import mongoose, { Schema, Document } from 'mongoose';

const BankAccountSchema = new Schema({
  accountNumber: { type: String, required: true },
  routingNumber: { type: String, required: true },
  accountType: { type: String, required: true },
  bankName: { type: String, required: true }
});

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

const VendorSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  businessEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  businessPhone: {
    type: String,
    required: true,
    trim: true
  },
  businessAddress: {
    type: AddressSchema,
    required: true
  },
  taxId: {
    type: String,
    trim: true
  },
  bankAccount: BankAccountSchema,
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalSales: {
    type: Number,
    default: 0,
    min: 0
  },
  commission: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  products: [{
    type: String
  }]
}, {
  timestamps: true
});

// Indexes
VendorSchema.index({ userId: 1 });
VendorSchema.index({ businessName: 1 });
VendorSchema.index({ isVerified: 1 });
VendorSchema.index({ rating: -1 });

export default mongoose.model('Vendor', VendorSchema);
