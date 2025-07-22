import mongoose, { Document, Schema } from 'mongoose';

export interface IQualityInspection extends Document {
  inspectionNumber: string;
  productId: mongoose.Types.ObjectId;
  productName: string;
  batchNumber?: string;
  inspectionType: 'incoming' | 'in-process' | 'final' | 'supplier-audit';
  inspectionDate: Date;
  inspector: string;
  status: 'pending' | 'in-progress' | 'passed' | 'failed' | 'conditional';
  testResults: Array<{
    testName: string;
    specification: string;
    actualValue: string;
    result: 'pass' | 'fail' | 'marginal';
    notes?: string;
  }>;
  nonConformances?: Array<{
    description: string;
    severity: 'minor' | 'major' | 'critical';
    correctiveAction: string;
    responsibleParty: string;
    dueDate: Date;
    status: 'open' | 'in-progress' | 'closed';
  }>;
  attachments?: Array<{
    fileName: string;
    fileType: string;
    uploadDate: Date;
  }>;
  overallResult: 'pass' | 'fail' | 'conditional' | 'pending';
  certificateNumber?: string;
  vendorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TestResultSchema = new Schema({
  testName: { type: String, required: true },
  specification: { type: String, required: true },
  actualValue: { type: String, required: true },
  result: { 
    type: String, 
    enum: ['pass', 'fail', 'marginal'], 
    required: true 
  },
  notes: String
});

const NonConformanceSchema = new Schema({
  description: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['minor', 'major', 'critical'], 
    required: true 
  },
  correctiveAction: { type: String, required: true },
  responsibleParty: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'closed'], 
    default: 'open' 
  }
});

const AttachmentSchema = new Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

const QualityInspectionSchema = new Schema({
  inspectionNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true,
    trim: true
  },
  batchNumber: {
    type: String,
    trim: true
  },
  inspectionType: {
    type: String,
    enum: ['incoming', 'in-process', 'final', 'supplier-audit'],
    required: true
  },
  inspectionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  inspector: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'passed', 'failed', 'conditional'],
    default: 'pending'
  },
  testResults: [TestResultSchema],
  nonConformances: [NonConformanceSchema],
  attachments: [AttachmentSchema],
  overallResult: {
    type: String,
    enum: ['pass', 'fail', 'conditional', 'pending'],
    required: true
  },
  certificateNumber: {
    type: String,
    trim: true
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor'
  }
}, {
  timestamps: true
});

// Indexes
QualityInspectionSchema.index({ inspectionNumber: 1 });
QualityInspectionSchema.index({ productId: 1 });
QualityInspectionSchema.index({ inspectionType: 1 });
QualityInspectionSchema.index({ status: 1 });
QualityInspectionSchema.index({ inspectionDate: 1 });
QualityInspectionSchema.index({ overallResult: 1 });

// Virtual for pass rate
QualityInspectionSchema.virtual('passRate').get(function() {
  if (!this.testResults || this.testResults.length === 0) return 0;
  const passedTests = this.testResults.filter(test => test.result === 'pass').length;
  return Math.round((passedTests / this.testResults.length) * 100);
});

// Method to calculate overall result
QualityInspectionSchema.methods.calculateOverallResult = function(this: IQualityInspection) {
  if (!this.testResults || this.testResults.length === 0) {
    this.overallResult = 'pending';
    return;
  }

  const failedTests = this.testResults.filter((test: any) => test.result === 'fail');
  const marginalTests = this.testResults.filter((test: any) => test.result === 'marginal');

  if (failedTests.length > 0) {
    this.overallResult = 'fail';
  } else if (marginalTests.length > 0) {
    this.overallResult = 'conditional';
  } else {
    this.overallResult = 'pass';
  }
};

// Method to generate certificate number
QualityInspectionSchema.methods.generateCertificate = function() {
  if (this.overallResult === 'pass' && !this.certificateNumber) {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    this.certificateNumber = `QC-${year}-${timestamp}`;
  }
  return this.certificateNumber;
};

// Static method to find by result
QualityInspectionSchema.statics.findByResult = function(result: string) {
  return this.find({ overallResult: result }).populate('productId').populate('vendorId');
};

// Pre-save middleware to auto-calculate overall result
QualityInspectionSchema.pre('save', function(next) {
  if (this.isModified('testResults')) {
    (this as any).calculateOverallResult();
    if (this.overallResult === 'pass') {
      (this as any).generateCertificate();
    }
  }
  next();
});

export default mongoose.model<IQualityInspection>('QualityInspection', QualityInspectionSchema);
