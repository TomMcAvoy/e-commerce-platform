import mongoose, { Document, Schema } from 'mongoose';

// Represents a single item within an order
const OrderItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true }, // Price at time of purchase
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
});

// Represents the shipping address for the order
const ShippingAddressSchema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

// Represents the result from the payment provider
const PaymentResultSchema = new Schema({
  id: { type: String },
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String },
});

export interface IOrder extends Document {
  tenantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderItems: Array<{
    name: string;
    quantity: number;
    image: string;
    price: number;
    product: mongoose.Types.ObjectId;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

const OrderSchema = new Schema<IOrder>({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  orderItems: [OrderItemSchema],
  shippingAddress: ShippingAddressSchema,
  paymentMethod: { type: String, required: true },
  paymentResult: PaymentResultSchema,
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paidAt: { type: Date },
  shippedAt: { type: Date },
  deliveredAt: { type: Date },
}, {
  timestamps: true,
});

export default mongoose.model<IOrder>('Order', OrderSchema);
