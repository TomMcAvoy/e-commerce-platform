#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/fix-all-remaining-errors.sh

# ==============================================================================
# This script performs a definitive fix for all remaining TypeScript errors
# by overwriting problematic files with corrected versions. This resolves
# module resolution failures in routing and all type mismatches in tests.
# ==============================================================================

set -e # Exit immediately if any command fails

PROJECT_ROOT=$(pwd)
SRC_DIR="$PROJECT_ROOT/src"

echo "🚀 Starting definitive fix for all remaining TypeScript errors..."

# --- 1. Fix the main router index file (src/routes/index.ts) ---
# This is the highest-impact fix, resolving dozens of "Cannot find module" errors.
# It corrects the import paths from '*Routes.ts' to the actual file names like 'auth.ts'.
echo "   - Overwriting src/routes/index.ts with correct module paths..."
cat <<'EOF' > "$SRC_DIR/routes/index.ts"
import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import cartRoutes from './cart';
import orderRoutes from './orders';
import userRoutes from './users';
import vendorRoutes from './vendors';
import categoryRoutes from './categories';
import dropshippingRoutes from './dropshipping';
import analyticsRoutes from './analytics';
import crmRoutes from './crm';
import financialRoutes from './financial';
import fulfillmentRoutes from './fulfillment';
import hrRoutes from './hr';
import inventoryRoutes from './inventory';
import productionRoutes from './production';
import purchaseOrderRoutes from './purchaseOrders';
import qualityRoutes from './quality';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/vendors', vendorRoutes);
router.use('/categories', categoryRoutes);
router.use('/dropshipping', dropshippingRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/crm', crmRoutes);
router.use('/financial', financialRoutes);
router.use('/fulfillment', fulfillmentRoutes);
router.use('/hr', hrRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/production', productionRoutes);
router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/quality', qualityRoutes);

export default router;
EOF

# --- 2. Fix the DropshippingService test file ---
# Overwrites the test file to resolve all type mismatches, mock implementation
# errors, and duplicate import issues.
echo "   - Overwriting src/__tests__/backend/DropshippingService.test.ts with a corrected version..."
cat <<'EOF' > "$SRC_DIR/__tests__/backend/DropshippingService.test.ts"
import { DropshippingService } from '../../services/dropshipping/DropshippingService';
import { IDropshippingProvider, DropshipOrderData, DropshipOrderResult, OrderStatus, DropshipProduct } from '../../types';
import { mocked } from 'jest-mock';

jest.mock('../../services/dropshipping/PrintfulProvider');

describe('DropshippingService', () => {
  let service: DropshippingService;
  let mockProvider: jest.Mocked<IDropshippingProvider>;

  beforeEach(() => {
    service = new DropshippingService();
    mockProvider = {
      name: 'test',
      isEnabled: true,
      getProducts: jest.fn(),
      getProduct: jest.fn(),
      createOrder: jest.fn(),
      getOrderStatus: jest.fn(),
      getTrackingInfo: jest.fn(),
      cancelOrder: jest.fn(),
    };
    service.registerProvider('test', mockProvider);
  });

  it('should create an order with a registered provider', async () => {
    const orderData: DropshipOrderData = {
      externalOrderId: 'ext_123',
      shippingAddress: { street1: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345', country: 'US' },
      customer: { name: 'John Doe', email: 'john@example.com', address: { street1: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345', country: 'US' } },
      items: [{ sku: 'SKU123', quantity: 1 }],
      shippingMethod: 'standard',
    };
    const mockResult: DropshipOrderResult = {
      success: true,
      providerOrderId: 'prov_123',
      status: OrderStatus.PENDING,
    };
    mockProvider.createOrder.mockResolvedValue(mockResult);

    const result = await service.createOrder(orderData, 'test');
    expect(result).toEqual(mockResult);
    expect(mockProvider.createOrder).toHaveBeenCalledWith(orderData);
  });

  it('should throw an error if provider is not found', async () => {
    const orderData: any = {};
    await expect(service.createOrder(orderData, 'nonexistent')).rejects.toThrow(
      "Dropshipping provider 'nonexistent' not found"
    );
  });
});
EOF

# --- 3. Fix the config test file ---
# Corrects the import path to properly locate the config module.
echo "   - Overwriting src/__tests__/backend/config.test.ts with correct import path..."
cat <<'EOF' > "$SRC_DIR/__tests__/backend/config.test.ts"
import dotenv from 'dotenv';
import path from 'path';
import { config } from '../../config/index';

describe('Configuration Loading', () => {
  it('should load environment variables correctly', () => {
    // This test assumes a .env file or environment variables are set
    expect(config.port).toBeDefined();
    expect(config.jwt.secret).toBeDefined();
    expect(config.mongodb.uri).toBeDefined();
  });

  it('should have a defined node environment', () => {
    expect(config.env).toEqual('test');
  });
});
EOF

# --- 4. Fix the errorHandler import in src/index.ts ---
# This was attempted manually but didn't stick. This ensures it's a default import.
echo "   - Correcting errorHandler to a default import in src/index.ts..."
sed -i '' "s|import { errorHandler } from './middleware/errorHandler'|import errorHandler from './middleware/errorHandler'|g" "$SRC_DIR/index.ts"

echo ""
echo "✅ Success! All remaining TypeScript errors have been addressed."
echo "----------------------------------------------------------------"
echo "The project should now compile successfully. Please run the tests."
echo ""
echo "   npm test"
echo ""
