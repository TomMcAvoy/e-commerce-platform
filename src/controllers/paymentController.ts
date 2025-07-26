import { Response, NextFunction } from 'express';
import Order from '../models/Order';
import AppError from '../utils/AppError';
import { AuthenticatedRequest } from '../types';

// In a real app, you would install and import the stripe package.
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * @desc    Create a payment intent for an existing order
 * @route   POST /api/payments/create-intent
 * @access  Private
 */
export const createPaymentIntent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;

    // Find the user's pending order within the current tenant
    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.user._id, 
      tenantId: req.tenantId 
    });

    if (!order) {
      return next(new AppError('Order not found or does not belong to the current user', 404));
    }

    if (order.status !== 'pending') {
        return next(new AppError('This order has already been processed and cannot be paid for again.', 400));
    }

    // --- Real Stripe Integration Example ---
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(order.totalPrice * 100), // Stripe requires amount in cents
    //   currency: 'usd',
    //   metadata: { 
    //      orderId: order._id.toString(),
    //      tenantId: req.tenantId.toString() 
    //   },
    // });
    // res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret });

    // For now, we'll return a mock client secret for frontend development
    console.log(`MOCK PAYMENT: Creating payment intent for Order ${order._id} with amount ${order.totalPrice}`);
    const mockClientSecret = `pi_${order._id}_secret_${Date.now()}`;
    res.status(200).json({ success: true, clientSecret: mockClientSecret });

  } catch (error) {
    next(error);
  }
};

