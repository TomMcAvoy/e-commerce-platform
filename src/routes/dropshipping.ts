import express from 'express';
import {
  getProviders,
  getDropshippingHealth,
  fulfillOrder,
  getDropshippingOrderStatus,
  getProviderProducts
} from '../controllers/dropshippingController';
import { protect, authorize } from '../middleware/auth';
import asyncHandler from 'express-async-handler';

const router = express.Router();

/**
 * Dropshipping routes following Critical Integration Points from Copilot Instructions
 * Implements provider pattern with proper authentication and error handling
 */

// Public status endpoint following Debugging & Testing Ecosystem
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      providers: ['printful', 'spocket'],
      status: 'active',
      environment: process.env.NODE_ENV || 'development'
    },
    message: 'Dropshipping service is operational',
    timestamp: new Date().toISOString()
  });
});

// Protected routes following Authentication Flow patterns
router.use(protect); // All routes below require authentication

// Order management following API Endpoints Structure
router.post('/fulfill', authorize('admin', 'vendor'), asyncHandler(fulfillOrder));
router.get('/status/:provider/:externalOrderId', authorize('admin', 'vendor'), asyncHandler(getDropshippingOrderStatus));

// Product management
router.get('/products/:provider', authorize('admin', 'vendor'), asyncHandler(getProviderProducts));

// Provider management following Service Architecture pattern
router.get('/health', authorize('admin'), getDropshippingHealth);
router.get('/providers', authorize('admin'), getProviders);

export default router;
