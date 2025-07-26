import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  userId: mongoose.Types.ObjectId;
  employeeId: string;
  department: string;
  position: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  startDate: Date;
  endDate?: Date;
  managerId?: mongoose.Types.ObjectId;
  salary: {
    amount: number;
    currency: string;
    type: 'hourly' | 'monthly' | 'yearly';
  };
  benefits: {
    healthInsurance: boolean;
    dentalInsurance: boolean;
    retirement401k: boolean;
    paidTimeOff: number; // days per year
  };
  bankDetails?: {
    accountNumber: string;
    routingNumber: string;
    accountName: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  isActive: boolean;
  performanceRating?: number; // 1-5 scale
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimeEntry extends Document {
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  breakTime: number; // minutes
  totalHours: number;
  overtimeHours: number;
  projectId?: string;
  description?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayrollRecord extends Document {
  employeeId: mongoose.Types.ObjectId;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  regularHours: number;
  overtimeHours: number;
  regularPay: number;
  overtimePay: number;
  grossPay: number;
  deductions: {
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    healthInsurance: number;
    retirement401k: number;
    other: number;
  };
  netPay: number;
  paymentDate?: Date;
  paymentMethod: 'direct_deposit' | 'check' | 'cash';
  status: 'calculated' | 'approved' | 'paid';
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'intern'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  managerId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  salary: {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    type: { 
      type: String, 
      enum: ['hourly', 'monthly', 'yearly'], 
      required: true 
    }
  },
  benefits: {
    healthInsurance: { type: Boolean, default: false },
    dentalInsurance: { type: Boolean, default: false },
    retirement401k: { type: Boolean, default: false },
    paidTimeOff: { type: Number, default: 0 }
  },
  bankDetails: {
    accountNumber: { type: String, trim: true },
    routingNumber: { type: String, trim: true },
    accountName: { type: String, trim: true }
  },
  emergencyContact: {
    name: { type: String, required: true, trim: true },
    relationship: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  performanceRating: {
    type: Number,
    min: 1,
    max: 5
  },
  lastReviewDate: Date,
  nextReviewDate: Date
}, {
  timestamps: true
});

const TimeEntrySchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  clockIn: {
    type: Date,
    required: true
  },
  clockOut: Date,
  breakTime: {
    type: Number,
    default: 0,
    min: 0
  },
  totalHours: {
    type: Number,
    default: 0,
    min: 0
  },
  overtimeHours: {
    type: Number,
    default: 0,
    min: 0
  },
  projectId: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  approvedAt: Date
}, {
  timestamps: true
});

const PayrollRecordSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  payPeriodStart: {
    type: Date,
    required: true
  },
  payPeriodEnd: {
    type: Date,
    required: true
  },
  regularHours: {
    type: Number,
    required: true,
    min: 0
  },
  overtimeHours: {
    type: Number,
    default: 0,
    min: 0
  },
  regularPay: {
    type: Number,
    required: true,
    min: 0
  },
  overtimePay: {
    type: Number,
    default: 0,
    min: 0
  },
  grossPay: {
    type: Number,
    required: true,
    min: 0
  },
  deductions: {
    federalTax: { type: Number, default: 0 },
    stateTax: { type: Number, default: 0 },
    socialSecurity: { type: Number, default: 0 },
    medicare: { type: Number, default: 0 },
    healthInsurance: { type: Number, default: 0 },
    retirement401k: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  netPay: {
    type: Number,
    required: true,
    min: 0
  },
  paymentDate: Date,
  paymentMethod: {
    type: String,
    enum: ['direct_deposit', 'check', 'cash'],
    default: 'direct_deposit'
  },
  status: {
    type: String,
    enum: ['calculated', 'approved', 'paid'],
    default: 'calculated'
  }
}, {
  timestamps: true
});

// Indexes
EmployeeSchema.index({ employeeId: 1 });
EmployeeSchema.index({ userId: 1 });
EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ managerId: 1 });
EmployeeSchema.index({ isActive: 1 });

TimeEntrySchema.index({ employeeId: 1, date: 1 });
TimeEntrySchema.index({ status: 1 });
TimeEntrySchema.index({ date: 1 });

PayrollRecordSchema.index({ employeeId: 1 });
PayrollRecordSchema.index({ payPeriodStart: 1, payPeriodEnd: 1 });
PayrollRecordSchema.index({ status: 1 });

// Virtual for full employment duration
EmployeeSchema.virtual('employmentDuration').get(function() {
  const endDate = this.endDate || new Date();
  const diffTime = Math.abs(endDate.getTime() - this.startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to calculate time entry hours
TimeEntrySchema.methods.calculateHours = function() {
  if (this.clockOut && this.clockIn) {
    const totalMinutes = (this.clockOut.getTime() - this.clockIn.getTime()) / (1000 * 60);
    const workMinutes = totalMinutes - this.breakTime;
    this.totalHours = Math.max(0, workMinutes / 60);
    
    // Calculate overtime (assuming 8 hours is regular)
    this.overtimeHours = Math.max(0, this.totalHours - 8);
  }
  return this;
};

// Method to calculate payroll
PayrollRecordSchema.methods.calculateNetPay = function(this: IPayrollRecord) {
  const totalDeductions = Object.values(this.deductions).reduce((sum, deduction) => sum + (deduction as number), 0);
  this.netPay = this.grossPay - totalDeductions;
};

// Static method to find subordinates
EmployeeSchema.statics.findSubordinates = function(managerId: string) {
  return this.find({ managerId: new mongoose.Types.ObjectId(managerId), isActive: true })
    .populate('userId', 'firstName lastName email');
};

// Static method to get department summary
EmployeeSchema.statics.getDepartmentSummary = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$department',
        employeeCount: { $sum: 1 },
        avgSalary: { $avg: '$salary.amount' },
        employmentTypes: { $push: '$employmentType' }
      }
    }
  ]);
};

// Pre-save middleware to calculate hours
TimeEntrySchema.pre('save', function(next) {
  if (this.isModified('clockOut') || this.isModified('clockIn') || this.isModified('breakTime')) {
    (this as any).calculateHours();
  }
  next();
});

export const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
export const TimeEntry = mongoose.model<ITimeEntry>('TimeEntry', TimeEntrySchema);
export const PayrollRecord = mongoose.model<IPayrollRecord>('PayrollRecord', PayrollRecordSchema);
