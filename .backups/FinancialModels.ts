import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  type: 'sale' | 'refund' | 'fee' | 'commission' | 'payout' | 'adjustment';
  orderId?: mongoose.Types.ObjectId;
  vendorId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  transactionDate: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayoutRequest extends Document {
  vendorId: mongoose.Types.ObjectId;
  vendorName: string;
  amount: number;
  requestDate: Date;
  approvedDate?: Date;
  processedDate?: Date;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    accountName: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema({
  type: {
    type: String,
    enum: ['sale', 'refund', 'fee', 'commission', 'payout', 'adjustment'],
    required: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  transactionDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

const PayoutRequestSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  vendorName: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  requestDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  approvedDate: Date,
  processedDate: Date,
  status: {
    type: String,
    enum: ['pending', 'approved', 'processed', 'rejected'],
    default: 'pending'
  },
  bankDetails: {
    accountNumber: { type: String, trim: true },
    routingNumber: { type: String, trim: true },
    accountName: { type: String, trim: true }
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for Transaction
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ vendorId: 1 });
TransactionSchema.index({ customerId: 1 });
TransactionSchema.index({ transactionDate: 1 });
TransactionSchema.index({ orderId: 1 });

// Indexes for PayoutRequest
PayoutRequestSchema.index({ vendorId: 1 });
PayoutRequestSchema.index({ status: 1 });
PayoutRequestSchema.index({ requestDate: 1 });

// Virtual for net amount (considering refunds and fees)
TransactionSchema.virtual('netAmount').get(function() {
  if (this.type === 'refund' || this.type === 'fee') {
    return -Math.abs(this.amount);
  }
  return this.amount;
});

// Method to approve payout
PayoutRequestSchema.methods.approve = function() {
  this.status = 'approved';
  this.approvedDate = new Date();
  return this.save();
};

// Method to process payout
PayoutRequestSchema.methods.process = function() {
  this.status = 'processed';
  this.processedDate = new Date();
  return this.save();
};

// Method to reject payout
PayoutRequestSchema.methods.reject = function(reason?: string) {
  this.status = 'rejected';
  if (reason) {
    this.notes = reason;
  }
  return this.save();
};

// Static method to get transaction summary
TransactionSchema.statics.getTransactionSummary = function(vendorId?: string, startDate?: Date, endDate?: Date) {
  const match: any = {};
  
  if (vendorId) match.vendorId = new mongoose.Types.ObjectId(vendorId);
  if (startDate || endDate) {
    match.transactionDate = {};
    if (startDate) match.transactionDate.$gte = startDate;
    if (endDate) match.transactionDate.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get pending payouts
PayoutRequestSchema.statics.getPendingPayouts = function() {
  return this.find({ status: 'pending' })
    .populate('vendorId', 'businessName businessEmail')
    .sort({ requestDate: 1 });
};

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export const PayoutRequest = mongoose.model<IPayoutRequest>('PayoutRequest', PayoutRequestSchema);
