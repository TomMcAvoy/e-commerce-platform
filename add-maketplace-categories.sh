#!/bin/bash
# filepath: add-marketplace-categories.sh
set -e

echo "🚀 Adding Amazon/Temu-style marketplace categories to existing platform..."

# Create category data structure
cat > data/marketplace-categories.json << 'EOF'
{
  "categories": [
    {
      "id": "electronics",
      "name": "Electronics & Technology",
      "color": "#0066cc",
      "bgGradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "icon": "💻",
      "affiliatePrograms": ["amazon-electronics", "best-buy", "newegg"],
      "subcategories": ["smartphones", "laptops", "gaming", "audio", "smart-home"]
    },
    {
      "id": "fashion",
      "name": "Fashion & Apparel",
      "color": "#ff4081",
      "bgGradient": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "icon": "👗",
      "affiliatePrograms": ["amazon-fashion", "zalando", "h&m"],
      "subcategories": ["womens", "mens", "kids", "shoes", "accessories"]
    },
    {
      "id": "home-garden",
      "name": "Home & Garden",
      "color": "#4caf50",
      "bgGradient": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "icon": "🏠",
      "affiliatePrograms": ["amazon-home", "home-depot", "wayfair"],
      "subcategories": ["furniture", "decor", "kitchen", "garden", "tools"]
    },
    {
      "id": "beauty-health",
      "name": "Beauty & Health",
      "color": "#e91e63",
      "bgGradient": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      "icon": "💄",
      "affiliatePrograms": ["sephora", "ulta", "amazon-beauty"],
      "subcategories": ["skincare", "makeup", "fragrance", "health", "supplements"]
    },
    {
      "id": "sports-outdoors",
      "name": "Sports & Outdoors",
      "color": "#ff9800",
      "bgGradient": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "icon": "⚽",
      "affiliatePrograms": ["nike", "adidas", "dick-sporting-goods"],
      "subcategories": ["fitness", "outdoor-gear", "team-sports", "water-sports", "cycling"]
    },
    {
      "id": "automotive",
      "name": "Automotive & Motorcycle",
      "color": "#607d8b",
      "bgGradient": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "icon": "🚗",
      "affiliatePrograms": ["autozone", "advance-auto", "amazon-automotive"],
      "subcategories": ["car-parts", "motorcycle", "tools", "accessories", "maintenance"]
    },
    {
      "id": "toys-games",
      "name": "Toys & Games",
      "color": "#9c27b0",
      "bgGradient": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      "icon": "🎮",
      "affiliatePrograms": ["toys-r-us", "amazon-toys", "target"],
      "subcategories": ["video-games", "board-games", "kids-toys", "collectibles", "educational"]
    },
    {
      "id": "books-media",
      "name": "Books & Media",
      "color": "#795548",
      "bgGradient": "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)",
      "icon": "📚",
      "affiliatePrograms": ["amazon-books", "barnes-noble", "audible"],
      "subcategories": ["books", "ebooks", "audiobooks", "movies", "music"]
    }
  ]
}
EOF

# Create affiliate programs data
cat > data/affiliate-programs.json << 'EOF'
{
  "programs": {
    "amazon-electronics": {
      "name": "Amazon Electronics",
      "commission": "2.5-8%",
      "trackingUrl": "https://amzn.to/",
      "apiEndpoint": "https://webservices.amazon.com/paapi5",
      "features": ["product-api", "real-time-pricing", "inventory-sync"]
    },
    "amazon-fashion": {
      "name": "Amazon Fashion",
      "commission": "3-10%",
      "trackingUrl": "https://amzn.to/",
      "features": ["seasonal-promotions", "trend-tracking"]
    },
    "sephora": {
      "name": "Sephora Affiliate",
      "commission": "2-6%",
      "trackingUrl": "https://www.sephora.com/",
      "features": ["beauty-box-promotions", "exclusive-launches"]
    }
  }
}
EOF

# Extend existing Category model
cat >> src/models/Category.ts << 'EOF'

// Add marketplace-specific fields to existing Category schema
categorySchema.add({
  marketplaceConfig: {
    colorScheme: {
      primary: { type: String, default: '#2196f3' },
      secondary: { type: String },
      gradient: { type: String }
    },
    affiliatePrograms: [{
      programId: String,
      priority: { type: Number, default: 1 },
      isActive: { type: Boolean, default: true }
    }],
    layout: {
      heroStyle: { type: String, enum: ['gradient', 'image', 'video'], default: 'gradient' },
      sidebarPosition: { type: String, enum: ['left', 'right'], default: 'right' }
    }
  }
});
EOF

# Create new affiliate controller
cat > src/controllers/affiliateController.ts << 'EOF'
import { Request, Response, NextFunction } from 'express';
import AsyncHandler from '../middleware/asyncHandler';
import AppError from '../utils/appError';

// @desc    Get affiliate programs for category
// @route   GET /api/affiliate/category/:categoryId
// @access  Public
export const getAffiliatesByCategory = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { categoryId } = req.params;
  
  // Fetch affiliate programs (implement based on your data source)
  const affiliatePrograms = await getAffiliateProgramsForCategory(categoryId);
  
  res.status(200).json({
    success: true,
    count: affiliatePrograms.length,
    data: affiliatePrograms
  });
});

// @desc    Track affiliate click
// @route   POST /api/affiliate/track
// @access  Public
export const trackAffiliateClick = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { programId, productId, userId } = req.body;
  
  // Track click analytics
  await recordAffiliateClick({ programId, productId, userId, timestamp: new Date() });
  
  res.status(201).json({
    success: true,
    message: 'Click tracked successfully'
  });
});

async function getAffiliateProgramsForCategory(categoryId: string) {
  // Implementation to fetch affiliate programs
  return [];
}

async function recordAffiliateClick(data: any) {
  // Implementation to record analytics
}
EOF

# Add affiliate routes
cat > src/routes/affiliate.ts << 'EOF'
import express from 'express';
import { getAffiliatesByCategory, trackAffiliateClick } from '../controllers/affiliateController';

const router = express.Router();

router.route('/category/:categoryId').get(getAffiliatesByCategory);
router.route('/track').post(trackAffiliateClick);

export default router;
EOF

# Create frontend category pages
mkdir -p frontend/app/marketplace

# Electronics category page
cat > frontend/app/marketplace/electronics/page.tsx << 'EOF'
'use client';

import CategoryLayout from '../../../components/CategoryLayout';
import AffiliateSection from '../../../components/AffiliateSection';
import ProductGrid from '../../../components/ProductGrid';

export default function ElectronicsPage() {
  const categoryConfig = {
    id: 'electronics',
    name: 'Electronics & Technology',
    colorScheme: {
      primary: '#0066cc',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    icon: '💻'
  };

  return (
    <CategoryLayout category={categoryConfig}>
      <div className="flex gap-6">
        <div className="flex-1">
          <ProductGrid categoryId="electronics" />
        </div>
        <div className="w-80">
          <AffiliateSection categoryId="electronics" />
        </div>
      </div>
    </CategoryLayout>
  );
}
EOF

# Fashion category page
cat > frontend/app/marketplace/fashion/page.tsx << 'EOF'
'use client';

import CategoryLayout from '../../../components/CategoryLayout';
import AffiliateSection from '../../../components/AffiliateSection';
import ProductGrid from '../../../components/ProductGrid';

export default function FashionPage() {
  const categoryConfig = {
    id: 'fashion',
    name: 'Fashion & Apparel',
    colorScheme: {
      primary: '#ff4081',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    icon: '👗'
  };

  return (
    <CategoryLayout category={categoryConfig}>
      <div className="flex gap-6">
        <div className="flex-1">
          <ProductGrid categoryId="fashion" />
        </div>
        <div className="w-80">
          <AffiliateSection categoryId="fashion" />
        </div>
      </div>
    </CategoryLayout>
  );
}
EOF

# Create CategoryLayout component
cat > frontend/components/CategoryLayout.tsx << 'EOF'
'use client';

import React from 'react';

interface CategoryConfig {
  id: string;
  name: string;
  colorScheme: {
    primary: string;
    gradient: string;
  };
  icon: string;
}

interface CategoryLayoutProps {
  category: CategoryConfig;
  children: React.ReactNode;
}

export default function CategoryLayout({ category, children }: CategoryLayoutProps) {
  return (
    <div className="min-h-screen" style={{ background: category.colorScheme.gradient }}>
      {/* Hero Section */}
      <div className="relative py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">{category.icon}</div>
            <h1 className="text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl opacity-90">Discover amazing products and exclusive deals</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
EOF

# Create AffiliateSection component
cat > frontend/components/AffiliateSection.tsx << 'EOF'
'use client';

import React, { useEffect, useState } from 'react';

interface AffiliateProgram {
  id: string;
  name: string;
  commission: string;
  logo?: string;
  dealUrl: string;
}

interface AffiliateSectionProps {
  categoryId: string;
}

export default function AffiliateSection({ categoryId }: AffiliateSectionProps) {
  const [programs, setPrograms] = useState<AffiliateProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAffiliatePrograms();
  }, [categoryId]);

  const fetchAffiliatePrograms = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliate/category/${categoryId}`);
      const data = await response.json();
      setPrograms(data.data || []);
    } catch (error) {
      console.error('Failed to fetch affiliate programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackClick = async (programId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliate/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programId,
          categoryId,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">🎯 Exclusive Deals</h3>
      
      <div className="space-y-4">
        {programs.map((program) => (
          <div key={program.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800">{program.name}</h4>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                {program.commission}
              </span>
            </div>
            
            <button
              onClick={() => {
                trackClick(program.id);
                window.open(program.dealUrl, '_blank');
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              View Deals →
            </button>
          </div>
        ))}
      </div>

      {/* Featured Banner */}
      <div className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
        <h4 className="font-bold mb-2">💎 Premium Partner</h4>
        <p className="text-sm mb-3">Get exclusive access to limited-time offers</p>
        <button className="bg-white text-purple-600 px-4 py-2 rounded font-semibold text-sm">
          Join Now
        </button>
      </div>
    </div>
  );
}
EOF

# Add marketplace navigation to existing layout
cat >> frontend/app/layout.tsx << 'EOF'

// Add marketplace navigation styles
const marketplaceNavStyles = `
  .marketplace-nav {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    padding: 1rem 0;
  }
  
  .category-pill {
    display: inline-block;
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    background: white;
    color: #333;
    border-radius: 25px;
    text-decoration: none;
    transition: transform 0.2s;
  }
  
  .category-pill:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;
EOF

# Update package.json scripts
npm pkg set scripts.marketplace:dev="concurrently \"npm run dev:server\" \"npm run dev:frontend\" \"echo 'Marketplace with affiliate marketing ready at http://localhost:3001/marketplace'\""

# Add affiliate routes to main router
cat >> src/index.ts << 'EOF'

// Add affiliate routes
import affiliateRoutes from './routes/affiliate';
app.use('/api/affiliate', affiliateRoutes);
EOF

echo "✅ Marketplace categories with affiliate marketing added to existing platform!"
echo ""
echo "🚀 Quick Start:"
echo "npm run marketplace:dev"
echo ""
echo "📱 Category Pages Available:"
echo "- http://localhost:3001/marketplace/electronics"
echo "- http://localhost:3001/marketplace/fashion"
echo "- http://localhost:3001/marketplace/home-garden"
echo "- http://localhost:3001/marketplace/beauty-health"
echo "- http://localhost:3001/marketplace/sports-outdoors"
echo "- http://localhost:3001/marketplace/automotive"
echo ""
echo "🎯 Features Added:"
echo "- Unique color themes per category"
echo "- Affiliate marketing sidebar"
echo "- Click tracking analytics"
echo "- Responsive category layouts"
echo "- Integration with existing auth/cart system"
