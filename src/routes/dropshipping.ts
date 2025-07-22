import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getProviders,
  searchProducts,
  getProduct,
  importProduct,
  syncInventory,
  createOrder,
  getOrderStatus,
  healthCheck,
  bulkImport,
  importAliExpressCatalog,
  importAliExpressUrls,
  getAliExpressImportGuide
} from '../controllers/dropshippingController';
import { validateDropshippingImport, validateBulkImport } from '../middleware/validation';

const router = express.Router();

// Public routes
router.get('/providers', getProviders);
router.get('/health', healthCheck);

// Protected routes (require authentication)
router.get('/search', protect as any, searchProducts as any);
router.get('/products/:provider/:productId', protect as any, getProduct as any);

// Vendor/Admin only routes
router.post('/import', protect as any, authorize('vendor', 'admin') as any, validateDropshippingImport, importProduct as any);
router.post('/bulk-import', protect as any, authorize('vendor', 'admin') as any, bulkImport as any);
router.post('/sync-inventory', protect as any, authorize('vendor', 'admin') as any, syncInventory as any);
router.post('/orders', protect as any, authorize('vendor', 'admin') as any, createOrder as any);
router.get('/orders/:provider/:orderId', protect as any, authorize('vendor', 'admin') as any, getOrderStatus as any);

// AliExpress specific routes
router.get('/aliexpress/import-guide', protect as any, authorize('vendor', 'admin') as any, getAliExpressImportGuide as any);
router.post('/aliexpress/csv-import', protect as any, authorize('vendor', 'admin') as any, importAliExpressCatalog as any);
router.post('/aliexpress/url-import', protect as any, authorize('vendor', 'admin') as any, importAliExpressUrls as any);

export default router;
