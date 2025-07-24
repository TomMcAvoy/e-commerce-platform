import { Router } from 'express';
import { 
  getDropshippingData, 
  createDropshippingOrder,
  calculateShipping 
} from '../controllers/dropshippingController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getDropshippingData);
router.post('/orders', protect, createDropshippingOrder);
router.post('/shipping/calculate', calculateShipping);

export default router;
