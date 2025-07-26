#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/fix-category-pages-corrected.sh

echo "🔧 Fixed Category Pages Generation following Critical Development Workflows..."
echo "📁 Working directory: $(pwd)"

# Colors following Project-Specific Conventions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Safety check
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in project root directory${NC}"
    echo "Please navigate to /Users/thomasmcavoy/GitHub/shoppingcart first"
    exit 1
fi

echo -e "${YELLOW}📦 Creating backup...${NC}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="../category_fix_corrected_backup_${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}"
cp -r frontend "${BACKUP_DIR}/" 2>/dev/null || echo "No frontend to backup"
echo -e "✅ Backup created at: ${BACKUP_DIR}"

echo ""
echo -e "${BLUE}🔧 Creating proper directory structure${NC}"
mkdir -p frontend/app/{categories,cart,debug}
mkdir -p frontend/app/{electronics,fashion,sports,home-garden,beauty-health,automotive,books-media,toys-games}
mkdir -p frontend/context
mkdir -p frontend/components/navigation

echo ""
echo -e "${CYAN}🔧 Creating missing error.tsx for categories${NC}"
cat > frontend/app/categories/error.tsx << 'EOF'
'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Categories Error Page following Error Handling Pattern from Copilot Instructions
 */

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CategoriesError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.704-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Categories Error</h1>
        <p className="text-gray-600 mb-6">
          Something went wrong while loading the categories page.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Go Home
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer">Error Details</summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
EOF
echo "✅ Created: frontend/app/categories/error.tsx"

echo ""
echo -e "${CYAN}🔧 Creating fixed category page template function${NC}"
create_fixed_category_page() {
    local category_slug="$1"
    local category_emoji="$2"
    local category_color="$3"
    local category_description="$4"
    
    # Convert slug to proper name (avoid shell substitution issues)
    local category_name=""
    case "$category_slug" in
        "electronics") category_name="Electronics" ;;
        "fashion") category_name="Fashion" ;;
        "sports") category_name="Sports" ;;
        "home-garden") category_name="Home Garden" ;;
        "beauty-health") category_name="Beauty Health" ;;
        "automotive") category_name="Automotive" ;;
        "books-media") category_name="Books Media" ;;
        "toys-games") category_name="Toys Games" ;;
        *) category_name=$(echo "$category_slug" | tr '-' ' ' | sed 's/\b\w/\U&/g') ;;
    esac
    
    local component_name=$(echo "$category_name" | sed 's/ //g')

cat > "frontend/app/${category_slug}/page.tsx" << EOF
'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';
import { StarIcon, ShoppingCartIcon, ShieldCheckIcon, HeartIcon } from '@heroicons/react/24/outline';

/**
 * ${category_name} Page following Frontend Structure from Copilot Instructions
 * Generated for multi-vendor e-commerce platform with dropshipping integration
 */

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
  description: string;
  category: string;
  vendor?: string;
  inStock: boolean;
  shippingTime?: string;
}

export default function ${component_name}Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem, state } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call following Cross-Service Communication patterns
      // const response = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/products?category=${category_slug}\`);
      // const data = await response.json();
      
      // Mock products for ${category_name} following Database Patterns
      const mockProducts: Product[] = [
        {
          id: '${category_slug}-premium-001',
          name: 'Premium ${category_name} Product Pro',
          price: 299.99,
          originalPrice: 399.99,
          rating: 4.8,
          reviews: 1247,
          image: '/api/placeholder/300/300',
          verified: true,
          description: 'Professional grade ${category_name} equipment with advanced features and premium build quality',
          category: '${category_name}',
          vendor: 'SecureTech Solutions',
          inStock: true,
          shippingTime: '2-3 business days',
        },
        {
          id: '${category_slug}-tactical-002',
          name: 'Tactical ${category_name} Elite Series',
          price: 189.99,
          originalPrice: 249.99,
          rating: 4.9,
          reviews: 2891,
          image: '/api/placeholder/300/300',
          verified: true,
          description: 'Military-grade ${category_name} gear designed for professional use with durability guarantee',
          category: '${category_name}',
          vendor: 'TacticalGear Pro',
          inStock: true,
          shippingTime: '1-2 business days',
        },
        {
          id: '${category_slug}-essential-003',
          name: 'Essential ${category_name} Starter Kit',
          price: 79.99,
          originalPrice: 99.99,
          rating: 4.7,
          reviews: 856,
          image: '/api/placeholder/300/300',
          verified: true,
          description: 'Complete starter kit for ${category_name} with everything you need to get started',
          category: '${category_name}',
          vendor: 'ValueMax Direct',
          inStock: true,
          shippingTime: '3-5 business days',
        },
        {
          id: '${category_slug}-deluxe-004',
          name: 'Deluxe ${category_name} Collection',
          price: 449.99,
          originalPrice: 599.99,
          rating: 4.9,
          reviews: 423,
          image: '/api/placeholder/300/300',
          verified: true,
          description: 'Comprehensive deluxe collection featuring top-tier ${category_name} products',
          category: '${category_name}',
          vendor: 'Premium Solutions Inc',
          inStock: true,
          shippingTime: '1-2 business days',
        },
        {
          id: '${category_slug}-compact-005',
          name: 'Compact ${category_name} Mobile',
          price: 129.99,
          originalPrice: 159.99,
          rating: 4.6,
          reviews: 1156,
          image: '/api/placeholder/300/300',
          verified: true,
          description: 'Portable and compact ${category_name} solution perfect for mobile professionals',
          category: '${category_name}',
          vendor: 'MobileTech Labs',
          inStock: true,
          shippingTime: '2-4 business days',
        },
        {
          id: '${category_slug}-advanced-006',
          name: 'Advanced ${category_name} System',
          price: 349.99,
          originalPrice: 429.99,
          rating: 4.8,
          reviews: 678,
          image: '/api/placeholder/300/300',
          verified: true,
          description: 'Advanced ${category_name} system with cutting-edge technology and smart features',
          category: '${category_name}',
          vendor: 'InnovateTech Corp',
          inStock: true,
          shippingTime: '1-3 business days',
        }
      ];
      
      // Simulate API delay following Development vs Production patterns
      await new Promise(resolve => setTimeout(resolve, 800));
      setProducts(mockProducts);
      
    } catch (err) {
      console.error('Error loading ${category_name} products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        description: product.description,
        category: product.category,
        vendor: product.vendor,
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const calculateDiscount = (original: number, current: number): number => {
    return Math.round(((original - current) / original) * 100);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error Loading ${category_name}</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={loadProducts}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section following Design Patterns */}
      <section className="bg-gradient-to-r ${category_color} text-white py-16 mt-16">
        <div className="container">
          <div className="flex items-center mb-6">
            <span className="text-6xl mr-4">${category_emoji}</span>
            <div>
              <h1 className="text-4xl font-bold">${category_name}</h1>
              <p className="text-white/80 text-lg">${category_description}</p>
            </div>
          </div>
          
          {/* Cart Status following UI Patterns */}
          {state.totalItems > 0 && (
            <div className="bg-white/20 border border-white/30 rounded-lg p-4 mt-4 max-w-md">
              <p className="text-white/90">
                🛒 Cart: {state.totalItems} items (\${state.totalPrice.toFixed(2)})
              </p>
            </div>
          )}
          
          {/* Product Count */}
          <div className="mt-4">
            <p className="text-white/80">
              {isLoading ? 'Loading products...' : \`\${products.length} products available\`}
            </p>
          </div>
        </div>
      </section>

      <div className="container py-8">
        {/* Loading State following UI Patterns */}
        {isLoading ? (
          <div className="product-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="product-card animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Products Grid following Component Organization */}
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card group">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105" 
                    />
                    
                    {/* Product Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.verified && (
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <ShieldCheckIcon className="w-3 h-3 mr-1" />
                          Verified
                        </div>
                      )}
                      {product.originalPrice && (
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {calculateDiscount(product.originalPrice, product.price)}% OFF
                        </div>
                      )}
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white">
                        <HeartIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-2">
                      {product.vendor && (
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          {product.vendor}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={\`w-4 h-4 \${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {product.rating} ({product.reviews.toLocaleString()})
                      </span>
                    </div>
                    
                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          \${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            \${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Shipping Info */}
                    {product.shippingTime && (
                      <p className="text-xs text-green-600 mb-3">
                        🚚 {product.shippingTime}
                      </p>
                    )}
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={state.isLoading || !product.inStock}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCartIcon className="w-4 h-4 mr-2" />
                      {state.isLoading ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button (Future Enhancement) */}
            <div className="text-center mt-12">
              <button className="btn-outline">
                Load More Products
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
EOF
    echo "✅ Created: frontend/app/${category_slug}/page.tsx"
}

echo ""
echo -e "${GREEN}🚀 Creating fixed category pages following Architecture Patterns${NC}"

# Create core 8 category pages with fixed template
create_fixed_category_page "electronics" "📱" "from-blue-500 to-cyan-500" "Professional security electronics and gadgets"
create_fixed_category_page "fashion" "👕" "from-pink-500 to-rose-500" "Security apparel and tactical clothing"
create_fixed_category_page "sports" "⚽" "from-green-500 to-emerald-500" "Tactical fitness and outdoor gear"
create_fixed_category_page "home-garden" "🏠" "from-orange-500 to-amber-500" "Home security and garden tools"
create_fixed_category_page "beauty-health" "💄" "from-purple-500 to-violet-500" "Health and wellness products"
create_fixed_category_page "automotive" "🚗" "from-red-500 to-pink-500" "Vehicle security and accessories"
create_fixed_category_page "books-media" "📚" "from-indigo-500 to-blue-500" "Security training and educational materials"
create_fixed_category_page "toys-games" "🎮" "from-yellow-500 to-orange-500" "Educational toys and training games"

echo ""
echo -e "${CYAN}🔧 Cleaning up malformed category directories${NC}"
# Remove any malformed directories that may have been created
find frontend/app -name "0" -type d -exec rm -rf {} \; 2>/dev/null || true
find frontend/app -name "*\$*" -type d -exec rm -rf {} \; 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ FIXED CATEGORY SYSTEM COMPLETE!${NC}"
echo ""
echo -e "${PURPLE}📊 SUMMARY - Fixed Category Coverage:${NC}"
echo "  📁 8 properly formatted category directories created"
echo "  📱 Electronics, Fashion, Sports, Home & Garden"
echo "  💄 Beauty & Health, Automotive, Books & Media, Toys & Games"
echo "  ✅ All pages have proper React component exports"
echo "  ✅ Error handling pages created"
echo "  ✅ Template string substitution fixed"
echo ""
echo -e "${BLUE}🚀 TESTING COMMANDS following Critical Development Workflows:${NC}"
echo "npm run dev:all"
echo "open http://localhost:3001"
echo "open http://localhost:3001/categories"
echo "open http://localhost:3001/electronics"
echo "curl http://localhost:3000/health"
echo ""
echo -e "${GREEN}💡 All category pages now have proper React exports and error handling!${NC}"
echo -e "${YELLOW}📦 Backup preserved at: ${BACKUP_DIR}${NC}"
