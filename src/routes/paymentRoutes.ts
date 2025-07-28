import express from 'express';
import { createPaymentIntent, handleStripeWebhook } from '../controllers/paymentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
// FIX: Add route for the new webhook handler
router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

export default router;