#!/bin/bash

# This script applies the necessary fixes to resolve the test failures.
# Run it from the root of your project directory: ./apply_fixes.sh

# --- Fix 1: Add missing Dropshipping types to src/types/index.ts ---
echo "✅ Applying fix 1: Adding Dropshipping types to src/types/index.ts..."
cat << 'EOF' >> src/types/index.ts

// Dropshipping types based on DropshippingService.test.ts requirements
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export interface DropshipProduct {
  id: string;
  name: string;
  price: number;
  variants: any[];
}

export interface DropshipOrderData {
  externalOrderId: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingMethod: string;
}

export interface DropshipOrderResult {
  success: boolean;
  orderId: string;
  trackingNumber?: string;
  status: OrderStatus;
  message?: string;
}

export interface IDropshippingProvider {
  name: string;
  isEnabled: boolean;
  getProducts(): Promise<DropshipProduct[]>;
  getProduct(id: string): Promise<DropshipProduct | null>;
  createOrder(orderData: DropshipOrderData): Promise<DropshipOrderResult>;
  getOrderStatus(orderId: string): Promise<OrderStatus>;
  getTrackingInfo(orderId: string): Promise<{ trackingNumber: string; url: string } | null>;
  cancelOrder(orderId: string): Promise<{ success: boolean; message?: string }>;
}
EOF

# --- Fix 2: Update src/__tests__/backend/config.test.ts ---
echo "✅ Applying fix 2: Correcting src/__tests__/backend/config.test.ts..."
cat << 'EOF' > src/__tests__/backend/config.test.ts
import { config } from '../../config';

// Set a default test environment
process.env.NODE_ENV = 'test';

describe('Config', () => {
  it('should have all required properties defined', () => {
    expect(config.nodeEnv).toBeDefined();
    expect(config.port).toBeDefined();
    expect(config.db.uri).toBeDefined();
    expect(config.jwt.secret).toBeDefined();
    expect(config.redis.url).toBeDefined();
    expect(config.cors.origin).toBeDefined();
  });

  it('should have correct values for test environment', () => {
    // The config object is loaded once, so we check the value it was loaded with.
    expect(config.nodeEnv).toEqual('test');
  });
});
EOF

# --- Fix 3: Add optionalAuth middleware to src/middleware/auth.ts ---
echo "✅ Applying fix 3: Adding optionalAuth to src/middleware/auth.ts..."
cat << 'EOF' >> src/middleware/auth.ts

// Middleware to check for a user, but not require one for certain routes
export const optionalAuth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(); // No token, just continue without a user
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    // Find user and attach to request object
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // Token is invalid or expired, but we don't block the request.
    // We simply proceed without an authenticated user.
    console.error('Optional auth check failed: Invalid token provided.');
  }
  
  next();
});
EOF

# --- Fix 4: Correct the import in src/__tests__/backend/user-model.test.ts ---
echo "✅ Applying fix 4: Correcting src/__tests__/backend/user-model.test.ts..."
cat << 'EOF' > src/__tests__/backend/user-model.test.ts
import User from '../../models/User'; // Correct: Use default import for the Mongoose model
import bcrypt from 'bcryptjs';
import { IUserDocument } from '../../models/User';

// Mock the bcryptjs library
jest.mock('bcryptjs');

describe('User Model', () => {
  describe('matchPassword', () => {
    it('should return true when passwords match', async () => {
      // We don't need to save the user, just instantiate it to test the method
      const user = new User({ password: 'password123' }) as IUserDocument;
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      const isMatch = await user.matchPassword('password123');
      
      expect(isMatch).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password);
    });

    it('should return false when passwords do not match', async () => {
      const user = new User({ password: 'password123' }) as IUserDocument;
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      const isMatch = await user.matchPassword('wrongpassword');
      
      expect(isMatch).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', user.password);
    });

    it('should return false if the user has no password', async () => {
        const user = new User({ name: 'Test User' }) as IUserDocument; // No password
        const isMatch = await user.matchPassword('anypassword');
        expect(isMatch).toBe(false);
        expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });
});
EOF

echo "🎉 All fixes have been applied successfully."
echo "➡️ Next step: Run 'npm test' to verify the changes."
