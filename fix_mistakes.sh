#!/bin/bash
# Fix script for e-commerce platform test issues

echo "🔧 Starting comprehensive test fix..."

# Create missing route files
mkdir -p src/routes src/controllers src/models src/middleware

# 1. Fix main routes index
cat > src/routes/index.ts << 'EOF'
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
EOF

# 2. Create missing auth routes
cat > src/routes/auth.ts << 'EOF'
import { Router } from 'express';
import { register, login, getAuthStatus } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/status', getAuthStatus);
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

export default router;
EOF

# 3. Create missing product routes
cat > src/routes/products.ts << 'EOF'
import { Router } from 'express';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  searchProducts,
  getProductsByCategory
} from '../controllers/productController';
import { protect } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/category/:category/seasonal', getProductsByCategory);

export default router;
EOF

# 4. Create missing cart routes
cat > src/routes/cart.ts << 'EOF'
import { Router } from 'express';
import { 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  getCart, 
  clearCart 
} from '../controllers/cartController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth); // Allow both authenticated and guest users

router.route('/')
  .get(getCart);

router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCart);

export default router;
EOF

# 5. Create missing user routes
cat > src/routes/users.ts << 'EOF'
import { Router } from 'express';
import { getUsers, getUser, updateUser } from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(protect, authorize('admin'), getUsers);

router.route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser);

export default router;
EOF

# 6. Create missing vendor routes
cat > src/routes/vendors.ts << 'EOF'
import { Router } from 'express';
import { getVendors, getVendor } from '../controllers/vendorController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getVendors);
router.get('/:id', getVendor);

export default router;
EOF

# 7. Create missing order routes
cat > src/routes/orders.ts << 'EOF'
import { Router } from 'express';
import { createOrder, getOrders, getOrder } from '../controllers/orderController';
import { protect } from '../middleware/auth';

const router = Router();

router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.get('/:id', protect, getOrder);

export default router;
EOF

# 8. Create missing category routes
cat > src/routes/categories.ts << 'EOF'
import { Router } from 'express';
import { getCategories, getCategory } from '../controllers/categoryController';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);

export default router;
EOF

# 9. Create missing dropshipping routes
cat > src/routes/dropshipping.ts << 'EOF'
import { Router } from 'express';
import { 
  getDropshippingData, 
  createDropshippingOrder,
  calculateShipping 
} from '../controllers/dropshippingController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getDropshippingData);
router.post('/orders', protect, createDropshippingOrder);
router.post('/shipping/calculate', calculateShipping);

export default router;
EOF

# 10. Create missing analytics routes
cat > src/routes/analytics.ts << 'EOF'
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
EOF

# 11. Fix auth middleware
cat > src/middleware/auth.ts << 'EOF'
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized, no token', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Not authorized, token failed', 401));
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }

    // Continue regardless of auth status
    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authorized', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized for this route', 403));
    }

    next();
  };
};
EOF

# 12. Create missing controllers
cat > src/controllers/authController.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { sendTokenResponse } from '../utils/auth';
import AppError from '../utils/AppError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role = 'buyer' } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const getAuthStatus = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Authentication service is running',
    timestamp: new Date().toISOString(),
    authenticated: false
  });
};
EOF

# 13. Create missing User model
cat > src/models/User.ts << 'EOF'
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);
EOF

# 14. Create AppError utility
cat > src/utils/AppError.ts << 'EOF'
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
EOF

# 15. Create auth utility
cat > src/utils/auth.ts << 'EOF'
import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
};
EOF

# 16. Fix the broken DropshippingService test file
echo "Fixing DropshippingService.test.ts syntax errors..."
sed -i '' 's/\\`\\${route}\\.ts\\`/`${route}.ts`/g' src/__tests__/backend/DropshippingService.test.ts

# 17. Install missing dependencies
echo "Installing missing dependencies..."
npm install bcryptjs jsonwebtoken cookie-parser
npm install --save-dev @types/bcryptjs @types/jsonwebtoken @types/cookie-parser

echo "✅ Test infrastructure fix completed!"
echo ""
echo "🚀 Next steps:"
echo "1. Run 'npm run dev:server' to start the backend"
echo "2. Run 'npm test' to verify fixes"
echo "3. Check http://localhost:3000/health for API status"
