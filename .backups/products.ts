import express from 'express';
import { searchProducts } from '../controllers/productController';

const router = express.Router();
router.get('/search', searchProducts);

export default router;
