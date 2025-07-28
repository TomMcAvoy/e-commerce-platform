import mongoose, { Schema, Document } from 'mongoose';
import { Vendor as IVendor } from '@shoppingcart/shared/src/types/models/Vendor';
import { createSlugPreSaveHook } from '../../../utils/slugUtils';

export interface VendorDocument extends IVendor, Document {}

const BankAccountSchema = new Schema({
  accountNumber: { type: String, required: true },
  routingNumber: { type: String, required: true },
  accountType: { type: String, required: true },
  bankName: { type: String, required: true }
}, { _id: false });

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
}, { _id: false });

const VendorSchema = new Schema({
  tenantId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true, 
    index: true 
  },
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
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    index: true
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
VendorSchema.index({ userId: 1 });
VendorSchema.index({ businessName: 1 });
VendorSchema.index({ isVerified: 1 });
VendorSchema.index({ rating: -1 });
// Add a compound unique index for businessName per tenant
VendorSchema.index({ businessName: 1, tenantId: 1 }, { unique: true });
// Add a compound unique index for slug per tenant
VendorSchema.index({ slug: 1, tenantId: 1 }, { unique: true });

// Virtual for product count
VendorSchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'vendor',
  count: true
});

// Pre-save hook for slug generation
VendorSchema.pre('save', createSlugPreSaveHook({
  sourceField: 'businessName',
  slugField: 'slug',
  tenantIdField: 'tenantId'
}));

export default mongoose.model<VendorDocument>('Vendor', VendorSchema);