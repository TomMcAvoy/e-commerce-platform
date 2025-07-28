import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './Product';

export interface ICartItem {
  product: mongoose.Types.ObjectId | IProduct;
  quantity: number;
  price: number; // Price at the time of adding to cart
  name: string;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
});

const CartSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  items: [CartItemSchema]
}, { timestamps: true });

export default mongoose.model<ICart>('Cart', CartSchema);
