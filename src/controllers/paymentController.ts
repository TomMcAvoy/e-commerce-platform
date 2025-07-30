import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import Stripe from 'stripe';
import Order from '../models/Order';
import AppError from '../utils/AppError';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16'
});

/**
 * @desc    Create a payment intent for an existing order
 * @route   POST /api/payments/create-intent
 * @access  Private
 */
export const createPaymentIntent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }
  
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

  // In a real implementation, you would create a real Stripe PaymentIntent
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: Math.round(order.totalPrice * 100), // Stripe requires amount in cents
  //   currency: 'usd',
  //   metadata: { 
  //      orderId: order._id.toString(),
  //      tenantId: req.tenantId.toString() 
  //   },
  // });
  // const clientSecret = paymentIntent.client_secret;

  // For now, we'll return a mock client secret for frontend development
  console.log(`MOCK PAYMENT: Creating payment intent for Order ${order._id} with amount ${order.totalPrice}`);
  const mockClientSecret = `pi_${order._id}_secret_${Date.now()}`;

  // Store the mock payment intent ID on the order
  order.paymentInfo.paymentIntentId = mockClientSecret;
  await order.save();

  res.status(200).json({ success: true, clientSecret: mockClientSecret });
});

/**
 * @desc    Handle Stripe webhook events to update order status
 * @route   POST /api/payments/webhook
 * @access  Public
 */
export const handleStripeWebhook = asyncHandler(async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`❌ Webhook signature verification failed.`, err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log(`✅ PaymentIntent was successful for: ${paymentIntent.id}`);
            
            // Find the order associated with this payment intent
            const order = await Order.findOne({ 'paymentInfo.paymentIntentId': paymentIntent.id });
            if (order) {
                order.status = 'paid';
                order.paymentInfo.status = 'succeeded';
                order.paidAt = new Date();
                await order.save();
                console.log(`📦 Order ${order._id} marked as paid.`);
            } else {
                console.error(`❌ Order not found for payment_intent ${paymentIntent.id}`);
            }
            break;
        case 'payment_intent.payment_failed':
            const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log(`❌ Payment failed for: ${failedPaymentIntent.id}`);
            // Optionally, update order status to 'payment_failed'
            break;
        default:
            console.log(`🤷‍♀️ Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
});

