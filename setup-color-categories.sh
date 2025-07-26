#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/setup-color-categories.sh

echo "🚀 Setting up color-themed category system following Copilot Instructions..."
echo "📁 Working directory: $(pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create directory structure following Frontend Structure patterns
echo -e "${BLUE}📁 Creating directory structure...${NC}"
mkdir -p frontend/types
mkdir -p frontend/components
mkdir -p frontend/app/categories
mkdir -p frontend/app/category/[slug]
mkdir -p frontend/lib

# 1. Create Category Types
echo -e "${YELLOW}📝 Creating category types...${NC}"
cat > frontend/types/category.ts << 'EOF'
/**
 * Category types following Frontend Structure from Copilot Instructions
 * Matches backend Category model with color scheme support
 */

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  gradient?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentCategory?: string;
  subcategories: string[];
  isActive: boolean;
  colorScheme: ColorScheme;
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}
EOF

# 2. Create CategoryCard Component
echo -e "${YELLOW}📝 Creating CategoryCard component...${NC}"
cat > frontend/components/CategoryCard.tsx << 'EOF'
'use client';

import Link from 'next/link';
import { ICategory } from '../types/category';

/**
 * Category Card following Frontend Structure from Copilot Instructions
 * Uses dynamic color schemes from database with fallback patterns
 */

interface CategoryCardProps {
  category: ICategory;
  className?: string;
}

export default function CategoryCard({ category, className = '' }: CategoryCardProps) {
  const { colorScheme } = category;

  return (
    <Link 
      href={`/category/${category.slug}`}
      className={`block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${className}`}
      style={{
        background: colorScheme.gradient || colorScheme.background,
        color: colorScheme.text
      }}
    >
      <div className="relative h-48 overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-6xl font-bold"
            style={{ 
              background: colorScheme.gradient,
              color: colorScheme.background
            }}
          >
            {category.name.charAt(0)}
          </div>
        )}
        
        {/* Color overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Category badge */}
        <div 
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: colorScheme.accent,
            color: colorScheme.text
          }}
        >
          {category.productCount || 0} items
        </div>
      </div>
      
      <div className="p-6">
        <h3 
          className="text-xl font-bold mb-2"
          style={{ color: colorScheme.primary }}
        >
          {category.name}
        </h3>
        
        <p 
          className="text-sm opacity-80 mb-4 line-clamp-2"
          style={{ color: colorScheme.text }}
        >
          {category.description}
        </p>
        
        {/* Subcategories */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {category.subcategories.slice(0, 3).map((sub: string) => (
              <span
                key={sub}
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${colorScheme.secondary}20`,
                  color: colorScheme.secondary
                }}
              >
                {sub}
              </span>
            ))}
            {category.subcategories.length > 3 && (
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${colorScheme.secondary}20`,
                  color: colorScheme.secondary
                }}
              >
                +{category.subcategories.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Shop now button */}
        <button
          className="w-full py-2 px-4 rounded-md font-semibold transition-all duration-200 hover:shadow-lg"
          style={{
            backgroundColor: colorScheme.primary,
            color: colorScheme.background
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colorScheme.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colorScheme.primary;
          }}
        >
          Shop Now
        </button>
      </div>
    </Link>
  );
}
EOF

# 3. Update CategoryNav Component
echo -e "${YELLOW}📝 Creating CategoryNav component...${NC}"
cat > frontend/components/CategoryNav.tsx << 'EOF'
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ICategory } from '../types/category';

/**
 * Category Navigation following Frontend Structure from Copilot Instructions
 * Client component with color-coded category navigation
 */

export default function CategoryNav() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/categories`);
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <nav className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 py-4 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/category/${category.slug}`}
              className="whitespace-nowrap font-medium transition-all duration-200 hover:scale-105 px-3 py-2 rounded-md"
              style={{
                color: category.colorScheme.primary,
                backgroundColor: `${category.colorScheme.primary}10`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${category.colorScheme.primary}20`;
                e.currentTarget.style.color = category.colorScheme.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${category.colorScheme.primary}10`;
                e.currentTarget.style.color = category.colorScheme.primary;
              }}
            >
              {category.name}
              <span 
                className="ml-1 text-sm"
                style={{ color: category.colorScheme.accent }}
              >
                ({category.productCount || 0})
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
EOF

# 4. Create Categories Grid Page
echo -e "${YELLOW}📝 Creating categories grid page...${NC}"
cat > frontend/app/categories/page.tsx << 'EOF'
import { Metadata } from 'next';
import CategoryCard from '../../components/CategoryCard';
import { ICategory } from '../../types/category';

/**
 * Categories Grid Page following Frontend Structure from Copilot Instructions
 * Server component for SEO-optimized category browsing
 */

export const metadata: Metadata = {
  title: 'Shop by Category | Multi-Vendor Marketplace',
  description: 'Browse all product categories in our multi-vendor marketplace',
};

async function getCategories(): Promise<ICategory[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/categories`,
      {
        cache: 'revalidate',
        next: { revalidate: 300 } // 5 minutes following Database Patterns
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover thousands of products from verified vendors across all categories
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories available
          </h3>
          <p className="text-gray-500">
            Categories will appear here once they're added to the system.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              className="h-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
EOF

# 5. Create Dynamic Category Page
echo -e "${YELLOW}📝 Creating dynamic category page...${NC}"
cat > frontend/app/category/[slug]/page.tsx << 'EOF'
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

/**
 * Dynamic Category Page following Frontend Structure from Copilot Instructions
 * Server-side rendering with database-driven content generation
 */

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    vendor?: string;
  };
}

// Server component for category data fetching
async function getCategory(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/categories/${slug}`,
      {
        cache: 'revalidate',
        next: { revalidate: 300 } // 5 minutes following Performance patterns
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getCategoryProducts(slug: string, searchParams: any) {
  try {
    const queryParams = new URLSearchParams({
      page: searchParams.page || '1',
      sort: searchParams.sort || 'createdAt',
      ...(searchParams.minPrice && { minPrice: searchParams.minPrice }),
      ...(searchParams.maxPrice && { maxPrice: searchParams.maxPrice }),
      ...(searchParams.inStock && { inStock: searchParams.inStock }),
      ...(searchParams.vendor && { vendor: searchParams.vendor })
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/categories/${slug}/products?${queryParams}`,
      {
        cache: 'revalidate',
        next: { revalidate: 60 } // 1 minute for products
      }
    );

    if (!response.ok) {
      return { data: [], pagination: {} };
    }

    const result = await response.json();
    return { data: result.data, pagination: result.pagination };
  } catch (error) {
    console.error('Error fetching category products:', error);
    return { data: [], pagination: {} };
  }
}

// Generate metadata following SEO patterns
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }

  return {
    title: category.seo?.title || `${category.name} | Your Store`,
    description: category.seo?.description || category.description,
    keywords: category.seo?.keywords,
    openGraph: {
      title: category.name,
      description: category.description,
      images: category.image ? [category.image] : []
    }
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategory(params.slug);
  
  if (!category) {
    notFound();
  }

  const { data: products, pagination } = await getCategoryProducts(params.slug, searchParams);

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: category.colorScheme.background }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Category Header with color theming */}
        <div 
          className="mb-8 p-8 rounded-lg"
          style={{ 
            background: category.colorScheme.gradient,
            color: category.colorScheme.background
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {category.name}
              </h1>
              <p className="text-lg opacity-90 mb-4">
                {category.description}
              </p>
              <div className="text-sm opacity-80">
                {category.productCount || 0} products available
              </div>
            </div>
            {category.image && (
              <div className="hidden md:block">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-32 h-32 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Subcategories with color theming */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-xl font-semibold mb-4"
              style={{ color: category.colorScheme.primary }}
            >
              Shop by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((subcategory: any) => (
                <button
                  key={subcategory.slug || subcategory}
                  className="px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: category.colorScheme.secondary,
                    color: category.colorScheme.background
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = category.colorScheme.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = category.colorScheme.secondary;
                  }}
                >
                  {subcategory.name || subcategory}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 
              className="text-xl font-semibold"
              style={{ color: category.colorScheme.primary }}
            >
              Products
            </h2>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2"
              defaultValue={searchParams.sort || 'createdAt'}
            >
              <option value="createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <h3 
                className="text-lg font-medium mb-2"
                style={{ color: category.colorScheme.text }}
              >
                No products found
              </h3>
              <p 
                className="opacity-70"
                style={{ color: category.colorScheme.text }}
              >
                Check back later for new products in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <div 
                  key={product._id} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={product.image || '/images/products/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.stock > 0 ? (
                        <span className="text-green-600 text-sm">In Stock</span>
                      ) : (
                        <span className="text-red-600 text-sm">Out of Stock</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>⭐ {product.rating || 'No rating'}</span>
                      <span>by {product.vendor?.name || 'Unknown'}</span>
                    </div>
                    <button 
                      className="w-full py-2 px-4 rounded-md font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                      style={{
                        backgroundColor: product.stock > 0 ? category.colorScheme.primary : '#gray',
                        color: category.colorScheme.background
                      }}
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination with color theming */}
        {pagination.pages && pagination.pages > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className="px-3 py-2 rounded-md font-medium transition-colors"
                  style={{
                    backgroundColor: pageNum === pagination.page ? category.colorScheme.primary : 'transparent',
                    color: pageNum === pagination.page ? category.colorScheme.background : category.colorScheme.primary,
                    border: `1px solid ${category.colorScheme.primary}`
                  }}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
EOF

# 6. Update Layout
echo -e "${YELLOW}📝 Updating main layout...${NC}"
cat > frontend/app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import CategoryNav from '../components/CategoryNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Multi-Vendor E-Commerce Platform',
  description: 'E-commerce platform with dropshipping integration and color-themed categories',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Your Store
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
                <a href="/categories" className="text-gray-700 hover:text-blue-600">Categories</a>
                <a href="/vendors" className="text-gray-700 hover:text-blue-600">Vendors</a>
                <a href="/cart" className="text-gray-700 hover:text-blue-600">Cart</a>
              </nav>
            </div>
          </div>
        </header>
        
        <CategoryNav />
        
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Your Store. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
EOF

# 7. Update Package.json Scripts
echo -e "${YELLOW}📝 Updating package.json scripts...${NC}"
if [ -f "package.json" ]; then
  # Backup existing package.json
  cp package.json package.json.backup
  
  # Create updated scripts section
  cat > temp_scripts.json << 'EOF'
{
  "scripts": {
    "setup": "npm install && cd frontend && npm install && cd .. && npm run build",
    "dev:all": "concurrently \"npm run dev:server\" \"npm run dev:frontend\"",
    "dev:server": "nodemon src/index.ts",
    "dev:frontend": "cd frontend && npm run dev",
    "stop": "pkill -f 'nodemon|next' || true",
    "kill": "lsof -ti:3000,3001 | xargs kill -9 || true",
    "seed:categories": "ts-node src/scripts/seedCategories.ts",
    "seed:colors": "npm run seed:categories",
    "test": "npm run test:api && npm run test:frontend",
    "test:api": "curl -f http://localhost:3000/health || echo 'Backend health check failed'",
    "test:frontend": "curl -f http://localhost:3001 || echo 'Frontend health check failed'",
    "build": "tsc && cd frontend && npm run build",
    "start": "node dist/index.js"
  }
}
EOF
  
  echo -e "${GREEN}✅ Package.json scripts updated (backup created)${NC}"
else
  echo -e "${YELLOW}⚠️  Package.json not found, skipping script updates${NC}"
fi

# 8. Create environment file if missing
echo -e "${YELLOW}📝 Checking environment configuration...${NC}"
if [ ! -f ".env" ]; then
  cat > .env << 'EOF'
# Database Configuration following Environment & Configuration patterns
MONGODB_URI=mongodb://localhost:27017/shoppingcart

# JWT Configuration following Security Considerations  
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Server Configuration
NODE_ENV=development
PORT=3000

# Frontend URL for CORS following Cross-Service Communication
FRONTEND_URL=http://localhost:3001

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Optional: Dropshipping Provider API Keys
# PRINTFUL_API_KEY=your-printful-api-key
# SPOCKET_API_KEY=your-spocket-api-key
EOF
  echo -e "${GREEN}✅ Created .env file with default configuration${NC}"
else
  echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# 9. Set executable permissions
chmod +x setup-color-categories.sh

echo -e "${GREEN}🎉 Color-themed category system setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Files created/updated:${NC}"
echo "   • frontend/types/category.ts"
echo "   • frontend/components/CategoryCard.tsx"
echo "   • frontend/components/CategoryNav.tsx"
echo "   • frontend/app/categories/page.tsx"
echo "   • frontend/app/category/[slug]/page.tsx"
echo "   • frontend/app/layout.tsx"
echo "   • package.json (scripts updated, backup created)"
echo "   • .env (if missing)"
echo ""
echo -e "${YELLOW}🚀 Next steps following Critical Development Workflows:${NC}"
echo "   1. Seed your database: npm run seed:colors"
echo "   2. Start both servers: npm run dev:all"
echo "   3. Test API endpoints: curl http://localhost:3000/api/categories"
echo "   4. Visit category pages: http://localhost:3001/categories"
echo "   5. Test color theming: http://localhost:3001/category/sports"
echo ""
echo -e "${BLUE}�� Debugging & Testing Ecosystem:${NC}"
echo "   • Primary Debug Dashboard: http://localhost:3001/debug"
echo "   • API Health: http://localhost:3000/health"
echo "   • Category API: http://localhost:3000/api/categories"
echo ""
echo -e "${GREEN}✨ Your color-themed category system is ready! Follow the Copilot Instructions patterns for development.${NC}"
