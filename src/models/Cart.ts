import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  variantId?: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  name: string;
  sku: string;
}

export interface ICart {
  _id?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICartDocument extends ICart, Document {
  items: mongoose.Types.DocumentArray<ICartItem>;
}

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: Schema.Types.ObjectId },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true }
});

const cartSchema = new Schema<ICartDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String },
  items: [cartItemSchema]
}, {
  timestamps: true
});

// Ensure either userId or sessionId exists
cartSchema.index({ userId: 1 }, { sparse: true });
cartSchema.index({ sessionId: 1 }, { sparse: true });

// Virtual for total price
cartSchema.virtual('totalPrice').get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

export default mongoose.model<ICartDocument>('Cart', cartSchema);
