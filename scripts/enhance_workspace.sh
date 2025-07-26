#!/bin/bash
#
# ======================================================================================
# == Automated Script to Enhance Workspace Files for New Comprehensive Data Models    ==
# == This script is safe to run from any directory.                                   ==
# == It will:                                                                         ==
# ==   1. Navigate to the project root.                                               ==
# ==   2. Create backups of all modified files (.bak).                                ==
# ==   3. Update the seeder, controllers, and frontend form.                          ==
# ==   4. Update package.json with a streamlined 'reset:db' command.                  ==
# ======================================================================================

# Exit immediately if a command exits with a non-zero status.
set -e

# Navigate to the project root directory from the script's location.
cd "$(dirname "$0")/.."
PROJECT_ROOT=$(pwd)
echo "🚀 Running enhancement script from project root: $PROJECT_ROOT"

# --- Function to safely update a file ---
update_file() {
    local FILE_PATH="$1"
    local CONTENT="$2"
    
    echo "🔄 Updating $FILE_PATH..."
    
    # Create parent directories if they don't exist
    mkdir -p "$(dirname "$FILE_PATH")"

    if [ -f "$FILE_PATH" ]; then
        cp "$FILE_PATH" "$FILE_PATH.bak"
        echo "   -> Backup created at $FILE_PATH.bak"
    fi
    echo "$CONTENT" > "$FILE_PATH"
    echo "   -> Successfully updated."
}

# --- 1. Define File Contents ---

# Content for ComprehensiveSeeder.ts
read -r -d '' SEEDER_CONTENT <<'EOF'
import mongoose from 'mongoose';
import Category, { ICategory } from '../models/Category';
import Product from '../models/Product';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

class ComprehensiveSeeder {
  private async connectDatabase(): Promise<void> {
    try {
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-dev';
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Database connection established');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  private async clearDatabase(): Promise<void> {
    try {
      console.log('🧹 Wiping database completely...');
      await Promise.all([
        Category.deleteMany({}),
        Product.deleteMany({}),
        User.deleteMany({})
      ]);
      console.log('✅ Database wiped clean');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      throw error;
    }
  }

  private async seedUsers(): Promise<{ admin: IUser; vendor: IUser; customer: IUser }> {
    console.log('👥 Seeding users with detailed profiles...');
    
    const users = {
      admin: await User.create({
        firstName: 'Admin', lastName: 'User', email: 'admin@example.com',
        password: 'AdminPassword123!', role: 'admin', isEmailVerified: true
      }),
      vendor: await User.create({
        firstName: 'Top', lastName: 'Vendor', email: 'vendor@example.com',
        password: 'VendorPassword123!', role: 'vendor', isEmailVerified: true,
        vendorProfile: {
          companyName: 'Global Tech Supplies',
          businessType: 'manufacturer',
          yearEstablished: 2010,
          verificationStatus: 'gold_supplier',
          responseRate: 98.5,
          responseTime: '<12h',
          tradeAssuranceLevel: 50000
        }
      }),
      customer: await User.create({
        firstName: 'John', lastName: 'Doe', email: 'customer@example.com',
        password: 'CustomerPassword123!', role: 'user', isEmailVerified: true,
        customerProfile: {
          loyaltyTier: 'silver',
          referralCode: 'JOHN-D-123',
          savedAddresses: [{ alias: 'Home', street: '123 Main St', city: 'Anytown', zip: '12345', country: 'USA' }]
        }
      })
    };
    console.log('✅ Users seeded.');
    return users;
  }

  private async seedCategories(): Promise<{ electronics: ICategory; laptops: ICategory }> {
    console.log('📂 Seeding hierarchical categories...');

    const electronics = await Category.create({
      name: 'Electronics', slug: 'electronics', path: 'electronics', level: 0,
      description: 'Gadgets, devices, and more.', categoryType: 'main',
      isFeatured: true, order: 1,
      seo: { title: 'Buy Electronics Online', description: 'The best deals on all electronics.'}
    });

    const laptops = await Category.create({
      name: 'Laptops', slug: 'laptops', path: 'electronics/laptops', level: 1,
      description: 'Powerful and portable computers.', parentCategory: electronics._id,
      categoryType: 'leaf', tradeAssurance: true, supportsCustomization: true,
      marketInsights: { searchVolume: 150000, supplierCount: 850 }
    });
    
    console.log('✅ Categories seeded.');
    return { electronics, laptops };
  }

  private async seedProducts(users: { vendor: IUser }, categories: { laptops: ICategory }): Promise<void> {
    console.log('📦 Seeding products with variants and B2B data...');

    await Product.create({
      name: 'ProBook X1',
      description: 'The ultimate laptop for professionals.',
      category: categories.laptops.slug,
      brand: 'TechCorp',
      vendorId: users.vendor._id,
      sku: 'TC-PBX1-2025',
      isActive: true,
      price: { current: 1299.99, original: 1499.99, currency: 'USD' },
      variants: {
        type: 'size',
        options: [
          { name: '13-inch', sku_suffix: '13', inventory: 50 },
          { name: '15-inch', sku_suffix: '15', additional_price: 200, inventory: 30 }
        ]
      },
      b2b: {
        productType: 'ready_to_ship',
        minOrderQuantity: 5,
        priceTiers: [{ quantity: 10, price: 1200 }, { quantity: 50, price: 1150 }],
        leadTime: '3-5 business days',
        supplyAbility: '5000 units/month'
      },
      shipping: { weight_kg: 1.5, dimensions_cm: { length: 35, width: 25, height: 2.5 }, originCountry: 'USA' },
      reviews: { averageRating: 4.8, ratingCount: 150 },
      features: ['Backlit Keyboard', 'Fingerprint Reader', 'Thunderbolt 4'],
      seo: { title: 'ProBook X1 Laptop', description: 'Buy the ProBook X1 for peak performance.'}
    });
    console.log('✅ Products seeded.');
  }

  public async seedEverything(): Promise<void> {
    try {
      await this.connectDatabase();
      await this.clearDatabase();
      const users = await this.seedUsers();
      const categories = await this.seedCategories();
      await this.seedProducts(users, categories);
      console.log('🎉 Comprehensive seeding completed successfully!');
    } catch (error) {
      console.error('❌ Seeding failed:', error);
    } finally {
      await mongoose.connection.close();
    }
  }
}

const seeder = new ComprehensiveSeeder();
seeder.seedEverything();
EOF

# Content for productController.ts
read -r -d '' PRODUCT_CONTROLLER_CONTENT <<'EOF'
import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import AppError from '../utils/AppError';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vendorId = req.user._id;
    const productData = { ...req.body, vendorId };
    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }
    if (product.vendorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new AppError('You are not authorized to update this product', 403));
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
};
EOF

# Content for categoryController.ts
read -r -d '' CATEGORY_CONTROLLER_CONTENT <<'EOF'
import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import AppError from '../utils/AppError';

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, slug, parentCategory, ...restOfBody } = req.body;
    let path = slug;
    let level = 0;
    if (parentCategory) {
      const parent = await Category.findById(parentCategory);
      if (!parent) {
        return next(new AppError('Parent category not found', 404));
      }
      level = parent.level + 1;
      path = `${parent.path}/${slug}`;
    }
    const categoryData = { name, slug, parentCategory, level, path, ...restOfBody };
    const category = await Category.create(categoryData);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};
EOF

# Content for authController.ts
read -r -d '' AUTH_CONTROLLER_CONTENT <<'EOF'
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';
import { sendTokenResponse } from '../utils/sendTokenResponse';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role, companyName } = req.body;
    const userData: any = { firstName, lastName, email, password, role };
    if (role === 'vendor') {
      if (!companyName) {
        return next(new AppError('Company name is required for vendors', 400));
      }
      userData.vendorProfile = { companyName };
    } else {
      userData.customerProfile = { loyaltyTier: 'bronze' };
    }
    const user = await User.create(userData);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};
EOF

# Content for ProductForm.tsx
read -r -d '' PRODUCT_FORM_CONTENT <<'EOF'
'use client';

import { useState } from 'react';

type ProductFormData = {
  name?: string;
  sku?: string;
  price?: { current: number; original?: number; currency: string; };
  variants?: { type: 'color' | 'size' | 'style'; options: any[] };
  b2b?: { minOrderQuantity: number; priceTiers: any[]; productType: 'ready_to_ship' | 'customizable'; leadTime: string; supplyAbility: string; };
};

export default function ProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    price: { current: 0, original: 0, currency: 'USD' },
    variants: { type: 'color', options: [] },
    b2b: { minOrderQuantity: 1, priceTiers: [], productType: 'ready_to_ship', leadTime: '', supplyAbility: '' }
  });

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newOptions = [...(formData.variants?.options || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, variants: { ...formData.variants, options: newOptions } });
  };

  const addVariantOption = () => {
    const newOptions = [...(formData.variants?.options || []), { name: '', sku_suffix: '', inventory: 0 }];
    setFormData({ ...formData, variants: { ...formData.variants, options: newOptions } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold">Product Form</h2>
      <div className="space-y-2">
        <div>
          <label className="block">Product Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 rounded bg-gray-700"/>
        </div>
        <div>
          <label className="block">SKU</label>
          <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full p-2 rounded bg-gray-700"/>
        </div>
        <div>
          <label className="block">Price</label>
          <input type="number" value={formData.price?.current} onChange={(e) => setFormData({ ...formData, price: { ...formData.price, current: parseFloat(e.target.value) } })} className="w-full p-2 rounded bg-gray-700"/>
        </div>
      </div>
      <div className="p-4 border border-gray-600 rounded">
        <h3 className="font-semibold">Variants</h3>
        {formData.variants?.options?.map((option, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <input placeholder="Name (e.g., Red)" value={option.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)} className="flex-1 p-2 rounded bg-gray-700"/>
            <input placeholder="SKU Suffix" value={option.sku_suffix} onChange={(e) => handleVariantChange(index, 'sku_suffix', e.target.value)} className="p-2 rounded bg-gray-700"/>
            <input type="number" placeholder="Inventory" value={option.inventory} onChange={(e) => handleVariantChange(index, 'inventory', parseInt(e.target.value))} className="w-24 p-2 rounded bg-gray-700"/>
          </div>
        ))}
        <button type="button" onClick={addVariantOption} className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">Add Variant</button>
      </div>
      <button type="submit" className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-bold">Save Product</button>
    </form>
  );
}
EOF

# --- 2. Apply Updates ---
update_file "src/seeders/ComprehensiveSeeder.ts" "$SEEDER_CONTENT"
update_file "src/controllers/productController.ts" "$PRODUCT_CONTROLLER_CONTENT"
update_file "src/controllers/categoryController.ts" "$CATEGORY_CONTROLLER_CONTENT"
update_file "src/controllers/authController.ts" "$AUTH_CONTROLLER_CONTENT"
update_file "frontend/components/forms/ProductForm.tsx" "$PRODUCT_FORM_CONTENT"

# --- 3. Update package.json scripts ---
PACKAGE_JSON_PATH="package.json"
echo "🔄 Updating scripts in $PACKAGE_JSON_PATH..."
if [ -f "$PACKAGE_JSON_PATH" ]; then
    cp "$PACKAGE_JSON_PATH" "$PACKAGE_JSON_PATH.bak"
    echo "   -> Backup created at $PACKAGE_JSON_PATH.bak"
    # Use awk to replace the entire scripts block. This is safer than sed for complex JSON.
    awk '
      BEGIN {p=1}
      /"scripts": {/ {
        print "  \"scripts\": {";
        print "    \"setup\": \"npm install && cd frontend && npm install --legacy-peer-deps && echo '✅ Setup complete'\",";
        print "    \"dev:all\": \"concurrently \\\"npm run dev:server\\\" \\\"npm run dev:frontend\\\" --names \\\"Backend,Frontend\\\" --prefix-colors \\\"blue,green\\\"\",";
        print "    \"dev:server\": \"echo '🔥 Starting backend server on port 3000...' && nodemon src/index.ts\",";
        print "    \"dev:frontend\": \"echo '🎨 Starting frontend server on port 3001...' && cd frontend && npm run dev\",";
        print "    \"stop\": \"pkill -f 'nodemon|next' || true\",";
        print "    \"kill\": \"lsof -ti:3000,3001 | xargs kill -9 || true\",";
        print "    \"seed\": \"echo '🌱 Seeding database with comprehensive data...' && ts-node src/seeders/ComprehensiveSeeder.ts\",";
        print "    \"cleanup\": \"echo '�� Wiping database completely...' && ts-node src/seeders/scripts/cleanupDatabase.ts\",";
        print "    \"reset:db\": \"echo '🔄 Resetting database with comprehensive data...' && npm run cleanup && npm run seed\",";
        print "    \"build\": \"tsc\",";
        print "    \"start\": \"node dist/index.js\",";
        print "    \"test\": \"jest --detectOpenHandles --forceExit\",";
        print "    \"test:api\": \"jest --testPathPattern=\\\"api|health\\\" --detectOpenHandles\"";
        print "  },";
        p=0;
      }
      /},/ && p==0 {p=1; next}
      p {print}
    ' "$PACKAGE_JSON_PATH.bak" > "$PACKAGE_JSON_PATH"
    echo "   -> Successfully updated scripts and added 'reset:db'."
else
    echo "   -> ⚠️  Warning: $PACKAGE_JSON_PATH not found. Skipping script update."
fi

echo ""
echo "✅ Script finished successfully."
echo "➡️  Next steps:"
echo "   1. Make the script executable: chmod +x scripts/enhance_workspace.sh"
echo "   2. Run the script from the project root: ./scripts/enhance_workspace.sh"
echo "   3. Review the changes and the .bak files."
echo "   4. Run 'npm run reset:db' to seed your database with the new structure."
