#!/bin/bash

# ======================================================================================
# == Automated Script to Enhance Workspace Files for New Comprehensive Data Models    ==
# == This script will update seeders, controllers, and frontend components.           ==
# == A backup of each modified file will be created with a .bak extension.            ==
# ======================================================================================

echo "🚀 Starting workspace enhancement process..."

# --- 1. Update ComprehensiveSeeder.ts ---
SEEDER_PATH="src/seeders/ComprehensiveSeeder.ts"
echo "🔄 Updating database seeder at $SEEDER_PATH..."
if [ -f "$SEEDER_PATH" ]; then
    cp "$SEEDER_PATH" "$SEEDER_PATH.bak"
    echo "   -> Backup created at $SEEDER_PATH.bak"
cat <<'EOF' > "$SEEDER_PATH"
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
else
    echo "   -> ⚠️  Warning: $SEEDER_PATH not found. Skipping."
fi

# --- 2. Update productController.ts ---
PRODUCT_CONTROLLER_PATH="src/controllers/productController.ts"
echo "🔄 Updating product controller at $PRODUCT_CONTROLLER_PATH..."
if [ -f "$PRODUCT_CONTROLLER_PATH" ]; then
    cp "$PRODUCT_CONTROLLER_PATH" "$PRODUCT_CONTROLLER_PATH.bak"
    echo "   -> Backup created at $PRODUCT_CONTROLLER_PATH.bak"
cat <<'EOF' > "$PRODUCT_CONTROLLER_PATH"
import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import AppError from '../utils/AppError';

/**
 * Creates a new product with the comprehensive data model.
 * Expects nested objects for price, variants, b2b, etc.
 */
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract the vendorId from the authenticated user (set by 'protect' middleware)
    const vendorId = req.user._id;

    // The request body now contains the new, nested structure
    const productData = { ...req.body, vendorId };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing product.
 */
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('No product found with that ID', 404));
    }

    // Ensure the user updating the product is the vendor who owns it or an admin
    if (product.vendorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new AppError('You are not authorized to update this product', 403));
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: Other controller functions (getProduct, deleteProduct, etc.) should be placed here.
// They generally require fewer changes than create/update.
EOF
else
    echo "   -> ⚠️  Warning: $PRODUCT_CONTROLLER_PATH not found. Skipping."
fi

# --- 3. Update categoryController.ts ---
CATEGORY_CONTROLLER_PATH="src/controllers/categoryController.ts"
echo "🔄 Updating category controller at $CATEGORY_CONTROLLER_PATH..."
if [ -f "$CATEGORY_CONTROLLER_PATH" ]; then
    cp "$CATEGORY_CONTROLLER_PATH" "$CATEGORY_CONTROLLER_PATH.bak"
    echo "   -> Backup created at $CATEGORY_CONTROLLER_PATH.bak"
cat <<'EOF' > "$CATEGORY_CONTROLLER_PATH"
import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import AppError from '../utils/AppError';

/**
 * Creates a new category, automatically calculating path and level for hierarchies.
 */
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

    const categoryData = {
      name,
      slug,
      parentCategory,
      level,
      path,
      ...restOfBody
    };

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// NOTE: Other category controller functions would follow a similar pattern.
EOF
else
    echo "   -> ⚠️  Warning: $CATEGORY_CONTROLLER_PATH not found. Skipping."
fi

# --- 4. Update authController.ts ---
AUTH_CONTROLLER_PATH="src/controllers/authController.ts"
echo "🔄 Updating auth controller at $AUTH_CONTROLLER_PATH..."
if [ -f "$AUTH_CONTROLLER_PATH" ]; then
    cp "$AUTH_CONTROLLER_PATH" "$AUTH_CONTROLLER_PATH.bak"
    echo "   -> Backup created at $AUTH_CONTROLLER_PATH.bak"
cat <<'EOF' > "$AUTH_CONTROLLER_PATH"
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';
// Assuming sendTokenResponse is in a utility file, e.g., '../utils/sendTokenResponse'
import { sendTokenResponse } from '../utils/sendTokenResponse';

/**
 * Registers a new user, creating a customer or vendor profile based on role.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, role, companyName } = req.body;

    const userData: any = { firstName, lastName, email, password, role };

    // Create a vendor profile if the role is 'vendor'
    if (role === 'vendor') {
      if (!companyName) {
        return next(new AppError('Company name is required for vendors', 400));
      }
      userData.vendorProfile = { companyName };
    } else {
      // Default to a basic customer profile
      userData.customerProfile = { loyaltyTier: 'bronze' };
    }

    const user = await User.create(userData);

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// NOTE: Other auth functions (login, getMe, etc.) should be placed here.
EOF
else
    echo "   -> ⚠️  Warning: $AUTH_CONTROLLER_PATH not found. Skipping."
fi

# --- 5. Create/Update frontend ProductForm.tsx ---
FORM_DIR="frontend/components/forms"
FORM_PATH="$FORM_DIR/ProductForm.tsx"
echo "🔄 Creating/Updating frontend product form at $FORM_PATH..."
mkdir -p "$FORM_DIR"
if [ -f "$FORM_PATH" ]; then
    cp "$FORM_PATH" "$FORM_PATH.bak"
    echo "   -> Backup created at $FORM_PATH.bak"
fi
cat <<'EOF' > "$FORM_PATH"
'use client';

import { useState } from 'react';
// Assuming your models can be imported. Adjust path if needed.
// You might need to create a shared types package or duplicate interfaces on the frontend.
// import { IProduct } from '../../../../src/models/Product';

// For now, we'll define a local type to avoid import issues.
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
    // Here you would call your API function from lib/api.ts
    console.log('Submitting form data:', formData);
    // e.g., createProduct(formData, token);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold">Product Form</h2>
      
      {/* Basic Info */}
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

      {/* Variants Section */}
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

echo "✅ Script finished."
echo "➡️  Next steps:"
echo "   1. Make the script executable: chmod +x enhance_models.sh"
echo "   2. Run the script: ./enhance_models.sh"
echo "   3. Review the changes and the .bak files."
echo "   4. Run 'npm run reset:db' to seed your database with the new structure."
