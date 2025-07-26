import { Router } from 'express';
import { 
  getCategoryAnalytics, 
  getConversionRates 
} from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect, authorize('admin')); // All analytics require admin

router.get('/categories/performance', getCategoryAnalytics);
router.get('/categories/conversion-rates', getConversionRates);

export default router;
