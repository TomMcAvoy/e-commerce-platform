import express from 'express';
import { syncToShopify, handleWebhook } from '../controllers/shopifyController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/sync', protect, syncToShopify);
router.post('/webhook', handleWebhook);

export default router;