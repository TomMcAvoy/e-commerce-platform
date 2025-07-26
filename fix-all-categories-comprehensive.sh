#!/bin/bash
# filepath: /Users/thomasmcavoy/GitHub/shoppingcart/fix-all-categories-comprehensive.sh

echo "🔍 Comprehensive Category Analysis following Architecture Patterns..."
echo "📁 Working directory: $(pwd)"

# Colors following Project-Specific Conventions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}📋 SCANNING EXISTING CATEGORY DIRECTORIES${NC}"
echo "Current category directories found:"
find frontend/app -maxdepth 1 -type d -name "*" ! -name "app" ! -name "debug" ! -name "cart" ! -name "categories" ! -name "api" ! -name "globals" | sort

echo ""
echo -e "${CYAN}📊 COMPLETE CATEGORY LIST following Database Patterns${NC}"

# Complete category list based on your e-commerce platform patterns
declare -A CATEGORIES
CATEGORIES=(
    ["electronics"]="📱|from-blue-500 to-cyan-500|Professional security electronics and gadgets"
    ["fashion"]="👕|from-pink-500 to-rose-500|Security apparel and tactical clothing"
    ["sports"]="⚽|from-green-500 to-emerald-500|Tactical fitness and outdoor gear"
    ["home-garden"]="🏠|from-orange-500 to-amber-500|Home security and garden tools"
    ["beauty-health"]="💄|from-purple-500 to-violet-500|Health and wellness products"
    ["automotive"]="🚗|from-red-500 to-pink-500|Vehicle security and accessories"
    ["books-media"]="📚|from-indigo-500 to-blue-500|Security training and educational materials"
    ["toys-games"]="🎮|from-yellow-500 to-orange-500|Educational toys and training games"
    ["food-beverages"]="🍕|from-green-400 to-emerald-400|Premium food and beverage products"
    ["office-supplies"]="📎|from-gray-500 to-slate-500|Professional office and business supplies"
    ["pet-supplies"]="🐕|from-amber-500 to-yellow-500|Pet care and animal products"
    ["baby-kids"]="👶|from-pink-400 to-purple-400|Baby and children's products"
    ["industrial"]="🏭|from-gray-600 to-gray-700|Industrial and manufacturing equipment"
    ["medical"]="🏥|from-blue-400 to-cyan-400|Medical and healthcare supplies"
    ["outdoor"]="🏕️|from-green-600 to-emerald-600|Outdoor and camping equipment"
    ["tools-hardware"]="🔧|from-orange-600 to-red-600|Tools and hardware supplies"
    ["musical-instruments"]="🎵|from-purple-400 to-pink-400|Musical instruments and audio equipment"
    ["art-crafts"]="🎨|from-yellow-400 to-orange-400|Art supplies and craft materials"
    ["collectibles"]="💎|from-violet-500 to-purple-500|Collectibles and vintage items"
    ["jewelry"]="💍|from-yellow-600 to-amber-600|Jewelry and accessories"
)

echo ""
echo -e "${YELLOW}📦 Creating backup...${NC}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="../category_fix_backup_${TIMESTAMP}"
mkdir -p "${BACKUP_DIR}"
cp -r frontend "${BACKUP_DIR}/" 2>/dev/null || echo "No frontend to backup"
echo -e "✅ Backup created at: ${BACKUP_DIR}"

echo ""
echo -e "${BLUE}�� Creating directory structure for ALL categories${NC}"
for category in "${!CATEGORIES[@]}"; do
    mkdir -p "frontend/app/${category}"
    echo "  📁 Created: frontend/app/${category}/"
done

echo ""
echo -e "${CYAN}🔧 Creating category page template function${NC}"
create_comprehensive_category_page() {
    local category_slug="$1"
    local category_info="$2"
    
    IFS='|' read -r emoji color description <<< "$category_info"
    
    # Convert slug to proper name
    local category_name=$(echo "$category_slug" | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
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
          description: 'Professional grade ${category_name.toLowerCase()} equipment with advanced features and premium build quality',
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
          description: 'Military-grade ${category_name.toLowerCase()} gear designed for professional use with durability guarantee',
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
          description: 'Complete starter kit for ${category_name.toLowerCase()} with everything you need to get started',
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
          description: 'Comprehensive deluxe collection featuring top-tier ${category_name.toLowerCase()} products',
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
          description: 'Portable and compact ${category_name.toLowerCase()} solution perfect for mobile professionals',
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
          description: 'Advanced ${category_name.toLowerCase()} system with cutting-edge technology and smart features',
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
      console.error('Error loading ${category_name.toLowerCase()} products:', err);
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
      <section className="bg-gradient-to-r ${color} text-white py-16 mt-16">
        <div className="container">
          <div className="flex items-center mb-6">
            <span className="text-6xl mr-4">${emoji}</span>
            <div>
              <h1 className="text-4xl font-bold">${category_name}</h1>
              <p className="text-white/80 text-lg">${description}</p>
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
echo -e "${GREEN}🚀 Creating ALL category pages following Architecture Patterns${NC}"
for category in "${!CATEGORIES[@]}"; do
    create_comprehensive_category_page "$category" "${CATEGORIES[$category]}"
done

echo ""
echo -e "${CYAN}🔧 Updating Categories Page with complete list${NC}"
cat > frontend/app/categories/page.tsx << 'EOF'
'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';

/**
 * Complete Categories Page following Frontend Structure from Copilot Instructions
 * All categories for multi-vendor e-commerce platform
 */

export default function CategoriesPage() {
  const { state } = useCart();

  const categories = [
    { name: 'Electronics', slug: 'electronics', emoji: '📱', description: 'Professional security electronics and gadgets', color: 'from-blue-500 to-cyan-500' },
    { name: 'Fashion', slug: 'fashion', emoji: '👕', description: 'Security apparel and tactical clothing', color: 'from-pink-500 to-rose-500' },
    { name: 'Sports & Fitness', slug: 'sports', emoji: '⚽', description: 'Tactical fitness and outdoor gear', color: 'from-green-500 to-emerald-500' },
    { name: 'Home & Garden', slug: 'home-garden', emoji: '🏠', description: 'Home security and garden tools', color: 'from-orange-500 to-amber-500' },
    { name: 'Beauty & Health', slug: 'beauty-health', emoji: '💄', description: 'Health and wellness products', color: 'from-purple-500 to-violet-500' },
    { name: 'Automotive', slug: 'automotive', emoji: '🚗', description: 'Vehicle security and accessories', color: 'from-red-500 to-pink-500' },
    { name: 'Books & Media', slug: 'books-media', emoji: '📚', description: 'Security training and educational materials', color: 'from-indigo-500 to-blue-500' },
    { name: 'Toys & Games', slug: 'toys-games', emoji: '🎮', description: 'Educational toys and training games', color: 'from-yellow-500 to-orange-500' },
    { name: 'Food & Beverages', slug: 'food-beverages', emoji: '🍕', description: 'Premium food and beverage products', color: 'from-green-400 to-emerald-400' },
    { name: 'Office Supplies', slug: 'office-supplies', emoji: '📎', description: 'Professional office and business supplies', color: 'from-gray-500 to-slate-500' },
    { name: 'Pet Supplies', slug: 'pet-supplies', emoji: '🐕', description: 'Pet care and animal products', color: 'from-amber-500 to-yellow-500' },
    { name: 'Baby & Kids', slug: 'baby-kids', emoji: '👶', description: 'Baby and children\'s products', color: 'from-pink-400 to-purple-400' },
    { name: 'Industrial', slug: 'industrial', emoji: '🏭', description: 'Industrial and manufacturing equipment', color: 'from-gray-600 to-gray-700' },
    { name: 'Medical', slug: 'medical', emoji: '🏥', description: 'Medical and healthcare supplies', color: 'from-blue-400 to-cyan-400' },
    { name: 'Outdoor', slug: 'outdoor', emoji: '🏕️', description: 'Outdoor and camping equipment', color: 'from-green-600 to-emerald-600' },
    { name: 'Tools & Hardware', slug: 'tools-hardware', emoji: '🔧', description: 'Tools and hardware supplies', color: 'from-orange-600 to-red-600' },
    { name: 'Musical Instruments', slug: 'musical-instruments', emoji: '🎵', description: 'Musical instruments and audio equipment', color: 'from-purple-400 to-pink-400' },
    { name: 'Art & Crafts', slug: 'art-crafts', emoji: '🎨', description: 'Art supplies and craft materials', color: 'from-yellow-400 to-orange-400' },
    { name: 'Collectibles', slug: 'collectibles', emoji: '💎', description: 'Collectibles and vintage items', color: 'from-violet-500 to-purple-500' },
    { name: 'Jewelry', slug: 'jewelry', emoji: '💍', description: 'Jewelry and accessories', color: 'from-yellow-600 to-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        <section className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-16">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4">All Categories</h1>
            <p className="text-blue-100 text-lg">
              Explore our comprehensive range of {categories.length} product categories
            </p>
            
            {state.totalItems > 0 && (
              <div className="bg-blue-600/20 border border-blue-300 rounded-lg p-4 mt-6 max-w-md">
                <p className="text-blue-100">
                  🛒 Cart: {state.totalItems} items (${state.totalPrice.toFixed(2)})
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.slug}
                href={`/${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                  <div className={`h-32 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <span className="text-6xl">{category.emoji}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                    <span className="text-blue-600 font-semibold group-hover:text-blue-800">
                      Explore Collection →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
EOF
echo "✅ Updated: frontend/app/categories/page.tsx"

echo ""
echo -e "${GREEN}✅ COMPREHENSIVE CATEGORY SYSTEM COMPLETE!${NC}"
echo ""
echo -e "${PURPLE}📊 SUMMARY - Complete Category Coverage:${NC}"
echo "  📁 ${#CATEGORIES[@]} category directories created"
echo "  📱 Electronics, Fashion, Sports, Home & Garden"
echo "  💄 Beauty & Health, Automotive, Books & Media"
echo "  🎮 Toys & Games, Food & Beverages, Office Supplies"
echo "  🐕 Pet Supplies, Baby & Kids, Industrial, Medical"
echo "  🏕️ Outdoor, Tools & Hardware, Musical Instruments"
echo "  🎨 Art & Crafts, Collectibles, Jewelry"
echo ""
echo -e "${BLUE}🚀 TESTING COMMANDS following Critical Development Workflows:${NC}"
echo "npm run dev:all"
echo "open http://localhost:3001/categories"
echo "open http://localhost:3001/electronics"
echo "open http://localhost:3001/fashion"
echo "curl http://localhost:3000/health"
echo ""
echo -e "${GREEN}💡 All ${#CATEGORIES[@]} categories now have complete pages with cart integration!${NC}"
echo -e "${YELLOW}📦 Backup preserved at: ${BACKUP_DIR}${NC}"
