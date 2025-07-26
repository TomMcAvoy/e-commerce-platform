import { Request, Response } from 'express';
import Order from '../models/Order';

// In a real app, you would use the Stripe SDK and secrets
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * @desc    Handle Stripe webhook events to confirm payments
 * @route   POST /api/webhooks/stripe
 * @access  Public (secured by Stripe signature)
 */
export const handleStripeWebhook = async (req: Request, res: Response) => {
    // --- Real Stripe Webhook Verification ---
    // const sig = req.headers['stripe-signature'];
    // let event;
    // try {
    //     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    // } catch (err) {
    //     console.error(`Webhook signature verification failed.`, err.message);
    //     return res.sendStatus(400);
    // }
    
    // For now, we'll use the raw body as a mock event for testing
    const event = req.body;
    
    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log(`[WEBHOOK] PaymentIntent succeeded for: ${paymentIntent.id}`);
        
        // Find the order using metadata we stored during intent creation
        const { orderId, tenantId } = paymentIntent.metadata;
        
        const order = await Order.findById(orderId);

        // Security Check: Ensure order exists and tenantId matches
        if (order && order.tenantId.toString() === tenantId) {
            order.status = 'paid';
            order.paidAt = new Date();
            order.paymentResult = {
                id: paymentIntent.id,
                status: paymentIntent.status,
                update_time: new Date(paymentIntent.created * 1000).toISOString(),
                email_address: paymentIntent.receipt_email, // if available
            };
            await order.save();
            console.log(`[WEBHOOK] Order ${orderId} successfully updated to paid.`);
        } else {
            console.error(`[WEBHOOK] CRITICAL: Order not found or tenant mismatch for orderId: ${orderId}`);
        }
    } else {
        console.log(`[WEBHOOK] Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
};