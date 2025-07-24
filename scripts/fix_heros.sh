#!/bin/bash
# filepath: fix-heroicons-dependency.sh

set -e

echo "🔧 Fixing Heroicons Dependency (Following Copilot Instructions)"
echo "Critical Development Workflows - Adding missing @heroicons/react package..."

cd frontend

# Fix 1: Add @heroicons/react to package.json
echo "📦 Adding @heroicons/react to dependencies..."
npm install @heroicons/react --legacy-peer-deps

# Fix 2: Update AffiliateSidebar to use correct Heroicons import pattern
echo "🎨 Updating AffiliateSidebar component following project conventions..."
cat > components/affiliate/AffiliateSidebar.tsx << 'EOF'
'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, StarIcon, TagIcon } from '@heroicons/react/24/outline';

interface AffiliateProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  affiliate: {
    commission: number;
    provider: string;
    url: string;
  };
}

interface AffiliateSidebarProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export function AffiliateSidebar({ isVisible = true, onClose }: AffiliateSidebarProps) {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAffiliateProducts();
  }, []);

  const loadAffiliateProducts = async () => {
    setIsLoading(true);
    try {
      // Mock affiliate products following dropshipping service patterns
      const mockProducts: AffiliateProduct[] = [
        {
          id: 'aff-1',
          name: 'Premium Wireless Headphones',
          price: 199.99,
          originalPrice: 299.99,
          discount: 33,
          rating: 4.8,
          reviews: 2847,
          image: '/api/placeholder/150/150',
          category: 'Electronics',
          affiliate: {
            commission: 8.5,
            provider: 'Amazon',
            url: 'https://amazon.com/premium-headphones'
          }
        },
        {
          id: 'aff-2',
          name: 'Smart Fitness Tracker',
          price: 89.99,
          originalPrice: 129.99,
          discount: 31,
          rating: 4.6,
          reviews: 1523,
          image: '/api/placeholder/150/150',
          category: 'Sports',
          affiliate: {
            commission: 12.0,
            provider: 'Best Buy',
            url: 'https://bestbuy.com/fitness-tracker'
          }
        },
        {
          id: 'aff-3',
          name: 'Professional Tool Set',
          price: 159.99,
          originalPrice: 219.99,
          discount: 27,
          rating: 4.9,
          reviews: 892,
          image: '/api/placeholder/150/150',
          category: 'Hardware',
          affiliate: {
            commission: 15.0,
            provider: 'Home Depot',
            url: 'https://homedepot.com/tool-set'
          }
        }
      ];

      // Simulate API delay following testing infrastructure patterns
      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to load affiliate products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAffiliateClick = (product: AffiliateProduct) => {
    // Track affiliate click following analytics patterns
    console.log(`Affiliate click: ${product.name} (${product.affiliate.provider})`);
    
    // Open affiliate link in new tab
    window.open(product.affiliate.url, '_blank', 'noopener,noreferrer');
  };

  if (!isVisible) return null;

  return (
    <div className="affiliate-sidebar">
      {/* Header following UI component patterns */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Premium Deals</h3>
          <p className="text-sm text-gray-600">Curated affiliate products</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content following scrollable patterns */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="affiliate-item group cursor-pointer"
                onClick={() => handleAffiliateClick(product)}
              >
                <div className="flex items-start space-x-3">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    {product.discount && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h4>
                    
                    {/* Rating */}
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-sm font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Affiliate Info */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-purple-600">
                        <TagIcon className="w-3 h-3 mr-1" />
                        {product.affiliate.commission}% commission
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {product.affiliate.provider}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA following conversion optimization patterns */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">
            Earn commissions on qualified purchases
          </p>
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
            View All Affiliate Products
          </button>
        </div>
      </div>
    </div>
  );
}
EOF

# Fix 3: Create Navigation component if it doesn't exist (following UI component patterns)
if [ ! -f "components/navigation/Navigation.tsx" ]; then
    echo "�� Creating Navigation component following project conventions..."
    mkdir -p components/navigation
    cat > components/navigation/Navigation.tsx << 'EOF'
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';

export function Navigation() {
  const { getItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'Mens Fashion', href: '/mens', color: 'text-gray-600 hover:text-blue-600' },
    { name: 'Sports Goods', href: '/sports', color: 'text-gray-600 hover:text-green-600' },
    { name: 'Hardware Tools', href: '/hardware', color: 'text-gray-600 hover:text-red-600' },
    { name: 'Social Feed', href: '/social', color: 'text-gray-600 hover:text-sky-600' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo following project conventions */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">PremiumHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`font-medium transition-colors ${category.color}`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right side icons following authentication patterns */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <ShoppingCartIcon className="w-6 h-6" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>
            
            <Link href="/auth/login" className="p-2 text-gray-700 hover:text-blue-600 transition-colors">
              <UserIcon className="w-6 h-6" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation following responsive patterns */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
EOF
fi

# Fix 4: Update package.json to ensure @heroicons/react is properly listed
echo "📝 Updating package.json to include @heroicons/react..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Ensure @heroicons/react is in dependencies
pkg.dependencies = pkg.dependencies || {};
pkg.dependencies['@heroicons/react'] = '^2.0.18';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ Updated package.json with @heroicons/react dependency');
"

cd ..

echo ""
echo "🎉 Heroicons Dependency Fixed!"
echo ""
echo "📋 Following Critical Development Workflows - Changes Applied:"
echo "1. ✅ Installed @heroicons/react package with --legacy-peer-deps"
echo "2. ✅ Updated AffiliateSidebar component with proper imports"
echo "3. ✅ Created Navigation component following UI patterns"
echo "4. ✅ Updated package.json dependencies"
echo ""
echo "🚀 Your Debugging & Testing Ecosystem is ready:"
echo "• Primary Debug Dashboard: http://localhost:3001/debug"
echo "• API Health Endpoints: http://localhost:3000/health"
echo "• Backend API Status: http://localhost:3000/api/status"
echo ""
echo "🎯 Critical Development Workflows:"
echo "• Start development: npm run dev:all"
echo "• Emergency stop: npm run kill"
echo "• Test API endpoints: npm run test:api"
echo ""
echo "✅ Frontend should now compile without Heroicons errors!"
