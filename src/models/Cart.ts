import mongoose, { Schema } from 'mongoose';

const CartItemSchema = new Schema({
  productId: { type: String, required: true },
  variantId: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  image: String,
  sku: { type: String, required: true }
});

const CartSchema = new Schema({
  userId: {
    type: String,
    sparse: true
  },
  sessionId: {
    type: String,
    sparse: true
  },
  items: [CartItemSchema],
  subtotal: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
CartSchema.index({ userId: 1 });
CartSchema.index({ sessionId: 1 });
CartSchema.index({ updatedAt: 1 });

// Ensure either userId or sessionId is present
CartSchema.pre('save', function(this: any, next) {
  if (!this.userId && !this.sessionId) {
    next(new Error('Either userId or sessionId must be provided'));
  } else {
    next();
  }
});

// Calculate subtotal before saving
CartSchema.pre('save', function(this: any, next) {
  this.subtotal = this.items.reduce((total: number, item: any) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

export default mongoose.model('Cart', CartSchema);
