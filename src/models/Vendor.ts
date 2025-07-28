import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  tenantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  businessName: string;
  slug: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
  };
  taxId?: string;
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    accountType: string;
    bankName: string;
  };
  isVerified: boolean;
  rating: number;
  totalSales: number;
  commission: number;
  products: string[];
  createdAt: Date;
  updatedAt: Date;
}
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
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
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
  timestamps: true
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

// Pre-save hook to generate and ensure unique slugs
VendorSchema.pre('save', async function(next) {
  // Only generate slug if it doesn't exist or businessName has changed
  if (!this.slug || this.isModified('businessName')) {
    // Generate slug from businessName
    const baseSlug = this.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    this.slug = baseSlug;
    
    // Check for duplicate slugs within the same tenant
    const Vendor = this.constructor as any;
    const slugRegEx = new RegExp(`^${baseSlug}(-[0-9]*)?$`, 'i');
    const vendorsWithSlug = await Vendor.find({ 
      slug: slugRegEx,
      tenantId: this.tenantId,
      _id: { $ne: this._id } // Exclude current vendor
    });
    
    // If we have duplicates, add a suffix to make the slug unique
    if (vendorsWithSlug.length > 0) {
      this.slug = `${baseSlug}-${vendorsWithSlug.length + 1}`;
    }
  }
  
  next();
});

export default mongoose.model('Vendor', VendorSchema);
