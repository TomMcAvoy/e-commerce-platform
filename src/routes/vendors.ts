import { Router } from 'express';
import { getVendors, getVendor } from '../controllers/vendorController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getVendors);
router.get('/:id', getVendor);

export default router;
