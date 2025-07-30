import express from 'express';
import { importProducts, syncInventory, getAccountInfo } from '../controllers/dsersController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/import', importProducts);
router.post('/sync', syncInventory);
router.get('/account', getAccountInfo);

export default router;