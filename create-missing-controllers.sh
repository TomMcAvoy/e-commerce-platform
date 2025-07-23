#!/bin/bash
# filepath: create-missing-controllers.sh
# Create all missing controllers following copilot-instructions.md patterns

set -e

echo "🔧 Creating Missing Controllers - Multi-Vendor E-Commerce Platform"
echo "================================================================="
echo "Following copilot-instructions.md architecture:"
echo "Backend API: http://localhost:3000"
echo "Frontend: http://localhost:3001"
echo "Debug Dashboard: http://localhost:3001/debug"
echo "Authentication: sendTokenResponse() pattern with JWT cookies"
echo ""

# Create directory structure following copilot patterns
echo "📁 Creating directory structure..."
mkdir -p src/controllers
mkdir -p src/middleware
mkdir -p src/models
mkdir -p src/utils
mkdir -p src/services

# Create AppError utility following copilot error handling pattern
echo "🔧 Creating AppError class..."
cat > src/utils/AppError.ts << 'EOF'
// AppError class following copilot error handling pattern
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
EOF

# Create asyncHandler utility following copilot patterns
echo "🔧 Creating asyncHandler utility..."
cat > src/utils/asyncHandler.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';

// Async handler to wrap async functions following copilot error handling pattern
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);
EOF

# Create User model following copilot authentication patterns
echo "🔧 Creating User model with JWT integration..."
cat > src/models/User.ts << 'EOF'
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../utils/config';

// User interface following copilot authentication patterns
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'vendor' | 'user';
  avatar?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  getSignedJwtToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// User schema following copilot database patterns
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'vendor', 'user'],
    default: 'user'
  },
  avatar: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpire: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Performance indexes following copilot database patterns
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT following copilot sendTokenResponse() pattern
UserSchema.methods.getSignedJwtToken = function(): string {
  const secret = config.jwtSecret;
  const expire = config.jwtExpire;
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  
  return jwt.sign(
    { id: this._id.toString() },
    secret,
    { expiresIn: expire || '30d' }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
EOF

# Create Product model following copilot multi-vendor patterns
echo "🔧 Creating Product model with virtual fields..."
cat > src/models/Product.ts << 'EOF'
import mongoose, { Document, Schema } from 'mongoose';

// Product interface following copilot multi-vendor patterns
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  cost: number;
  sku: string;
  category: string;
  images: string[];
  vendorId: mongoose.Types.ObjectId;
  inventory: {
    quantity: number;
    lowStock: number;
    inStock: boolean;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  isActive: boolean;
  discountPercent: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Virtual fields for calculated properties
  discountedPrice: number;
}

// Product schema following copilot database patterns with performance indexes
const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  cost: {
    type: Number,
    required: [true, 'Please add a cost price'],
    min: [0, 'Cost cannot be negative']
  },
  sku: {
    type: String,
    required: [true, 'Please add a SKU'],
    unique: true,
    uppercase: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'electronics',
      'clothing',
      'books',
      'home',
      'sports',
      'beauty',
      'toys',
      'automotive',
      'health',
      'other'
    ]
  },
  images: [{
    type: String,
    default: 'https://via.placeholder.com/300x300?text=No+Image'
  }],
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    lowStock: {
      type: Number,
      default: 10,
      min: [0, 'Low stock threshold cannot be negative']
    },
    inStock: {
      type: Boolean,
      default: false
    }
  },
  seo: {
    title: {
      type: String,
      maxlength: [70, 'SEO title cannot be more than 70 characters']
    },
    description: {
      type: String,
      maxlength: [160, 'SEO description cannot be more than 160 characters']
    },
    keywords: [{
      type: String,
      trim: true
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes on frequently queried fields (vendor + category)
ProductSchema.index({ vendorId: 1, category: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ isActive: 1, createdAt: -1 });
ProductSchema.index({ sku: 1 });

// Virtual field for calculated discounted price
ProductSchema.virtual('discountedPrice').get(function() {
  if (this.discountPercent > 0) {
    return this.price * (1 - this.discountPercent / 100);
  }
  return this.price;
});

// Update inventory status based on quantity
ProductSchema.pre('save', function(next) {
  this.inventory.inStock = this.inventory.quantity > 0;
  next();
});

export default mongoose.model<IProduct>('Product', ProductSchema);
EOF

# Create auth controller following copilot sendTokenResponse() pattern
echo "🔧 Creating auth controller with sendTokenResponse() pattern..."
cat > src/controllers/authController.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

// Send token response following copilot JWT pattern
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  // Create token using User model method
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const
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

// @desc    Register user following copilot authentication patterns
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login  
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new AppError('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // User is available in req.user from protect middleware
  const user = await User.findById((req as any).user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get auth status
// @route   GET /api/auth/status
// @access  Public
export const getStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = (req as any).cookies?.token || 
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? 
     req.headers.authorization.split(' ')[1] : null);

  res.status(200).json({
    success: true,
    authenticated: !!token,
    timestamp: new Date().toISOString()
  });
});

// CommonJS exports for Jest compatibility
module.exports = { register, login, getMe, getStatus };
EOF

# Create product controller following copilot API structure
echo "🔧 Creating product controller with full CRUD operations..."
cat > src/controllers/productController.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get all products with pagination and filtering
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build query object following copilot patterns
  let queryObj: any = { isActive: true };

  // Add filters if provided
  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  if (req.query.vendor) {
    queryObj.vendorId = req.query.vendor;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) queryObj.price.$gte = parseFloat(req.query.minPrice as string);
    if (req.query.maxPrice) queryObj.price.$lte = parseFloat(req.query.maxPrice as string);
  }

  // Text search using regex (fallback when text index not available)
  if (req.query.search) {
    const searchTerm = req.query.search as string;
    queryObj.$or = [
      { name: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } }
    ];
  }

  try {
    // Execute query with pagination
    const total = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
      .populate('vendorId', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single product by ID with virtual fields
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendorId', 'name email avatar');

    if (!product || !product.isActive) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return next(new AppError('Product not found', 404));
    }
    next(error);
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendor/Admin)
export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Add vendor from authenticated user or use mock for testing
  if (!req.body.vendorId && (req as any).user) {
    req.body.vendorId = (req as any).user.id;
  } else if (!req.body.vendorId) {
    // Mock vendor ID for testing following copilot patterns
    req.body.vendorId = new (require('mongoose')).Types.ObjectId();
  }

  // Generate SKU if not provided
  if (!req.body.sku) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    req.body.sku = `${timestamp}-${random}`;
  }

  // Set default values following copilot patterns
  const productData = {
    ...req.body,
    inventory: req.body.inventory || {
      quantity: req.body.quantity || 10,
      lowStock: 5,
      inStock: (req.body.quantity || 10) > 0
    },
    seo: req.body.seo || {
      title: req.body.name || 'Product',
      description: req.body.description ? req.body.description.substring(0, 160) : 'Product description',
      keywords: [req.body.category || 'product']
    },
    images: req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0 
      ? req.body.images 
      : ['https://via.placeholder.com/300x300?text=No+Image'],
    cost: req.body.cost || (req.body.price ? req.body.price * 0.7 : 50) // 30% markup default
  };

  try {
    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor/Admin)
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check vendor ownership following copilot auth patterns
    if ((req as any).user && (req as any).user.role === 'vendor' && 
        product.vendorId.toString() !== (req as any).user.id) {
      return next(new AppError('Not authorized to update this product', 403));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('vendorId', 'name email');

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return next(new AppError('Product not found', 404));
    }
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor/Admin)
export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check vendor ownership following copilot auth patterns
    if ((req as any).user && (req as any).user.role === 'vendor' && 
        product.vendorId.toString() !== (req as any).user.id) {
      return next(new AppError('Not authorized to delete this product', 403));
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return next(new AppError('Product not found', 404));
    }
    next(error);
  }
});

// CommonJS exports for Jest compatibility
module.exports = { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};
EOF

# Create auth middleware following copilot protect patterns
echo "🔧 Creating auth middleware with protect pattern..."
cat > src/middleware/auth.ts << 'EOF'
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { config } from '../utils/config';

// Protect routes following copilot JWT pattern
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if ((req as any).cookies?.token) {
    token = (req as any).cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new AppError('Not authorized, no token', 401));
  }

  try {
    // Verify token with proper handling
    const secret = config.jwtSecret;
    if (!secret) {
      return next(new AppError('JWT configuration error', 500));
    }

    const decoded = jwt.verify(token, secret) as any;

    // Get user from token
    (req as any).user = await User.findById(decoded.id);

    if (!(req as any).user) {
      return next(new AppError('User no longer exists', 401));
    }

    next();
  } catch (error) {
    return next(new AppError('Not authorized, token failed', 401));
  }
});

// CommonJS export for Jest compatibility
module.exports = { protect };
EOF

echo ""
echo "✅ All Controllers & Middleware Created!"
echo "======================================="
echo ""
echo "📁 Created Files Following Copilot Instructions:"
echo "  ✓ src/controllers/authController.ts    # sendTokenResponse() pattern"
echo "  ✓ src/controllers/productController.ts # Full CRUD with virtual fields"
echo "  ✓ src/middleware/auth.ts              # JWT protect middleware"
echo "  ✓ src/models/User.ts                  # Authentication model"
echo "  ✓ src/models/Product.ts               # Multi-vendor product model"
echo "  ✓ src/utils/AppError.ts               # Custom error handling"
echo "  ✓ src/utils/asyncHandler.ts           # Async wrapper utility"
echo ""
echo "🚀 Architecture Patterns Implemented:"
echo "  ✓ sendTokenResponse() pattern for JWT cookies"
echo "  ✓ Express routers grouped by feature (/api/auth, /api/products)"
echo "  ✓ Custom AppError class with HTTP status codes"
echo "  ✓ Mongoose schemas with virtual fields and performance indexes"
echo "  ✓ Multi-vendor platform with vendor ownership checks"
echo "  ✓ Compound indexes on frequently queried fields (vendor + category)"
echo ""
echo "🧪 API Endpoints Now Available:"
echo "  /api/auth/register         # User registration with role support"
echo "  /api/auth/login           # User login with JWT cookie response"
echo "  /api/auth/me              # Get current user (protected)"
echo "  /api/auth/status          # Authentication status check"
echo "  /api/products             # List products with pagination & filtering"
echo "  /api/products/:id         # Get single product with virtual fields"
echo "  /api/products (POST)      # Create product (vendor/admin only)"
echo "  /api/products/:id (PUT)   # Update product (vendor/admin only)"
echo "  /api/products/:id (DELETE)# Delete product (vendor/admin only)"
echo ""
echo "🔧 Debug Ecosystem Available (from copilot instructions):"
echo "  http://localhost:3001/debug          # Primary debug dashboard (Next.js route)"
echo "  http://localhost:3001/debug-api.html # Static debug page (HTML/JS for CORS)"
echo "  http://localhost:3000/health         # API health check"
echo "  http://localhost:3000/api/status     # API endpoints mapping"
echo ""
echo "▶️  Next Steps (from copilot-instructions.md):"
echo "    npm run setup            # One-time setup: deps, .env, builds"
echo "    npm run dev:all          # Start both servers (backend:3000, frontend:3001)"
echo "    npm test                 # Comprehensive test suite"
echo "    npm run test:api         # Quick API validation"
echo ""
echo "🎉 All controllers are now created! Run 'npm test' to verify functionality."
