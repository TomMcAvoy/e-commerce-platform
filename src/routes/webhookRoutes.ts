import express from 'express';
import { handleStripeWebhook } from '../controllers/webhookController';

const router = express.Router();

// Stripe requires the raw body to verify signatures, so we use express.raw middleware here
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;