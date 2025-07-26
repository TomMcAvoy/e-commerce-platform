import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);

export default router;