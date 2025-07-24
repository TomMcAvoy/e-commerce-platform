import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import userRoutes from './users';
import vendorRoutes from './vendors';
import cartRoutes from './cart';
import orderRoutes from './orders';
import categoryRoutes from './categories';
import dropshippingRoutes from './dropshipping';
import analyticsRoutes from './analytics';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount all routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/vendors', vendorRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);
router.use('/dropshipping', dropshippingRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
