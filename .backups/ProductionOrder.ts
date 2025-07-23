import mongoose, { Document, Schema } from 'mongoose';

export interface IProductionOrder extends Document {
  orderNumber: string;
  productId: mongoose.Types.ObjectId;
  productName: string;
  quantity: number;
  targetDate: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'planned' | 'released' | 'in-progress' | 'completed' | 'cancelled';
  billOfMaterials: Array<{
    materialId: string;
    materialName: string;
    quantityRequired: number;
    unit: string;
    costPerUnit: number;
    totalCost: number;
  }>;
  routing: Array<{
    operationNumber: number;
    workCenter: string;
    operationDescription: string;
    setupTime: number;
    processTime: number;
    estimatedDuration: number;
  }>;
  actualCosts: {
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    totalCost: number;
  };
  progress: {
    percentComplete: number;
    completedOperations: number;
    totalOperations: number;
    actualStartDate?: Date;
    estimatedCompletionDate?: Date;
    actualCompletionDate?: Date;
  };
  vendorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BillOfMaterialsSchema = new Schema({
  materialId: { type: String, required: true },
  materialName: { type: String, required: true },
  quantityRequired: { type: Number, required: true },
  unit: { type: String, required: true },
  costPerUnit: { type: Number, required: true },
  totalCost: { type: Number, required: true }
});

const RoutingSchema = new Schema({
  operationNumber: { type: Number, required: true },
  workCenter: { type: String, required: true },
  operationDescription: { type: String, required: true },
  setupTime: { type: Number, default: 0 },
  processTime: { type: Number, required: true },
  estimatedDuration: { type: Number, required: true }
});

const ProductionOrderSchema = new Schema({
  orderNumber: {
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
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  targetDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['planned', 'released', 'in-progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  billOfMaterials: [BillOfMaterialsSchema],
  routing: [RoutingSchema],
  actualCosts: {
    materialCost: { type: Number, default: 0 },
    laborCost: { type: Number, default: 0 },
    overheadCost: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 }
  },
  progress: {
    percentComplete: { type: Number, default: 0, min: 0, max: 100 },
    completedOperations: { type: Number, default: 0 },
    totalOperations: { type: Number, default: 0 },
    actualStartDate: Date,
    estimatedCompletionDate: Date,
    actualCompletionDate: Date
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor'
  }
}, {
  timestamps: true
});

// Indexes
ProductionOrderSchema.index({ orderNumber: 1 });
ProductionOrderSchema.index({ productId: 1 });
ProductionOrderSchema.index({ status: 1 });
ProductionOrderSchema.index({ targetDate: 1 });
ProductionOrderSchema.index({ priority: 1 });

// Virtual for completion percentage
ProductionOrderSchema.virtual('percentComplete').get(function(this: IProductionOrder) {
  if (!this.progress || this.progress.totalOperations === 0) return 0;
  return Math.round((this.progress.completedOperations / this.progress.totalOperations) * 100);
});

// Method to update progress
ProductionOrderSchema.methods.updateProgress = function(completedOperations: number) {
  this.progress.completedOperations = completedOperations;
  this.progress.percentComplete = this.completionPercentage;
  
  if (completedOperations >= this.progress.totalOperations) {
    this.status = 'completed';
    this.progress.actualCompletionDate = new Date();
  }
  
  return this.save();
};

// Static method to find by status
ProductionOrderSchema.statics.findByStatus = function(status: string) {
  return this.find({ status }).populate('productId').populate('vendorId');
};

// Pre-save middleware to calculate total operations
ProductionOrderSchema.pre('save', function(this: IProductionOrder, next) {
  // Auto-generate order number if not provided
  if (!this.orderNumber) {
    this.orderNumber = `PO-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  }

  // Calculate total operations from routing
  if (this.routing && this.progress) {
    this.progress.totalOperations = this.routing.length;
  }

  next();
});

export default mongoose.model<IProductionOrder>('ProductionOrder', ProductionOrderSchema);
