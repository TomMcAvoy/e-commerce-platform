#!/bin/bash
# This script sets up the text search index and API endpoint for products,
# enabling wildcard search functionality as per copilot-instructions.md.

set -e

echo "🚀 Setting up Wildcard Search Functionality..."
echo "=============================================="

# --- Step 1: Update the Product Model with a Text Index ---
echo "1. Updating src/models/Product.ts with a text index..."
# This model is designed to match the detailed data in fix-database-cleanup.sh
cat > src/models/Product.ts << 'EOF'
import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  subcategory?: string;
  brand: string;
  vendorId: mongoose.Schema.Types.ObjectId;
  inventory: {
    quantity: number;
    inStock: boolean;
    lowStock?: number;
    fulfillmentType?: string;
  };
  images?: string[];
  searchTerms?: string[];
  bulletPoints?: string[];
  specifications?: Record<string, string>;
  averageRating?: number;
  reviewCount?: number;
  salesRank?: number;
  primeEligible?: boolean;
  discountPercent?: number;
  isActive: boolean;
  asin: string;
  sku: string;
  upc?: string;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, required: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String },
  brand: { type: String, required: true, index: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inventory: {
    quantity: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    lowStock: { type: Number },
    fulfillmentType: { type: String }
  },
  images: [{ type: String }],
  searchTerms: [{ type: String }],
  bulletPoints: [{ type: String }],
  specifications: { type: Map, of: String },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  salesRank: { type: Number },
  primeEligible: { type: Boolean, default: false },
  discountPercent: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true, index: true },
  asin: { type: String, unique: true, required: true },
  sku: { type: String, unique: true, required: true },
  upc: { type: String }
}, {
  timestamps: true
});

// CRITICAL: Create a text index for powerful searching across multiple fields.
ProductSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  category: 'text',
  searchTerms: 'text'
}, {
  weights: {
    name: 10,
    brand: 7,
    searchTerms: 5,
    category: 3,
    description: 1
  },
  name: 'ProductTextIndex'
});

export default mongoose.model<IProduct>('Product', ProductSchema);
EOF
echo "   ✅ Product model updated."

# --- Step 2: Create the Product Controller with Search Logic ---
echo "2. Creating src/controllers/productController.ts..."
mkdir -p src/controllers
cat > src/controllers/productController.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import AppError from '../utils/AppError';

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchQuery = req.query.q as string;

    if (!searchQuery || searchQuery.trim() === '') {
      return next(new AppError('Please provide a search query parameter "q".', 400));
    }

    const products = await Product.find(
      { $text: { $search: searchQuery } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .populate('vendorId', 'name');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
EOF
echo "   ✅ Product controller created."

# --- Step 3: Create the Product Routes File ---
echo "3. Creating src/routes/products.ts..."
mkdir -p src/routes
cat > src/routes/products.ts << 'EOF'
import express from 'express';
import { searchProducts } from '../controllers/productController';

const router = express.Router();
router.get('/search', searchProducts);

export default router;
EOF
echo "   ✅ Product routes created."

# --- Step 4: Ensure Server Uses the New Routes ---
echo "4. Ensuring src/index.ts uses the product routes..."
if ! grep -q "app.use('/api/products'" src/index.ts; then
  # Using awk for a more robust insertion before the errorHandler
  awk '/app.use\(errorHandler\);/ { print "app.use(\"/api/products\", productRoutes);" } { print }' src/index.ts > src/index.tmp && mv src/index.tmp src/index.ts
  # Now add the import at the top
  awk '/import errorHandler from/ { print; print "import productRoutes from \"./routes/products\";"; next }1' src/index.ts > src/index.tmp && mv src/index.tmp src/index.ts
  echo "   ✅ Added product routes to src/index.ts."
else
  echo "   ✅ Product routes already configured in src/index.ts."
fi

# --- Final Instructions ---
echo ""
echo "✅ Search System Setup Complete!"
echo "=============================="
echo ""
echo "🚨 TEAM, CRITICAL NEXT STEP: We MUST reset the database to apply the new search index."
echo "   The search will NOT work until we do this."
echo ""
echo "   Run the following command in your terminal:"
echo "   npm run reset:real"
echo ""
echo "After resetting, you can test the search endpoint at:"
echo "   http://localhost:3000/api/products/search?q=iphone"
echo ""
