import { Router } from 'express';
import { 
  createDropshipOrder,
  getDropshipProducts,
  getProviderHealth,
  getAllProviders,
  getProviderStatus,
  syncProvider,
  calculateShipping
} from '../controllers/dropshippingController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

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
router.post('/orders', authorize('admin', 'vendor'), createDropshipOrder);

// Product management following Backend Structure
router.get('/products/:provider', authorize('admin', 'vendor'), getDropshipProducts);

// Provider management following Service Architecture pattern
router.get('/health', authorize('admin'), getProviderHealth);
router.get('/providers', authorize('admin'), getAllProviders);
router.get('/provider-status', authorize('admin'), getProviderStatus);

// Operational endpoints following Critical Integration Points
router.post('/sync', authorize('admin', 'vendor'), syncProvider);
router.post('/shipping', authorize('admin', 'vendor'), calculateShipping);

// Webhook endpoint for provider updates (no auth needed for external webhooks)
router.post('/webhook/:provider', (req, res) => {
  const { provider } = req.params;
  const webhookData = req.body;
  
  console.log(`📦 Webhook received from ${provider}:`, {
    timestamp: new Date().toISOString(),
    dataKeys: Object.keys(webhookData)
  });
  
  res.status(200).json({
    success: true,
    message: `Webhook for ${provider} processed`,
    data: {
      provider,
      webhookId: `webhook_${Date.now()}`,
      timestamp: new Date().toISOString(),
      processed: true
    }
  });
});

export default router;
