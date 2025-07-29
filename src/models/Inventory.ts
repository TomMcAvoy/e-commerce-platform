import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  product: mongoose.Types.ObjectId;
  quantity: number;
  reservedQuantity: number;
  reorderLevel: number;
  maxStock: number;
  location: string;
  lastUpdated: Date;
}

const InventorySchema = new Schema<IInventory>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 0 },
  reservedQuantity: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 10 },
  maxStock: { type: Number, default: 1000 },
  location: { type: String, default: 'Main Warehouse' },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IInventory>('Inventory', InventorySchema);