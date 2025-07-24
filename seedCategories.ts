import Category from '../models/Category';
import { ICategory } from '../models/Category';

interface CategorySeedData {
  name: string;
  slug: string;
  description: string;
  categoryType: 'main' | 'sub' | 'leaf';
  industryTags: string[];
  targetMarket: string[];
  supportsCustomization: boolean;
  supportsPrivateLabel: boolean;
  subcategories?: CategorySeedData[];
}

export const alibabaCategoriesData: CategorySeedData[] = [
  {
    name: 'Agriculture & Food',
    slug: 'agriculture-food',
    description: 'Fresh produce, processed foods, agricultural machinery, and farm supplies',
    categoryType: 'main',
    industryTags: ['agriculture', 'food', 'farming', 'organic'],
    targetMarket: ['global', 'wholesale', 'retail'],
    supportsCustomization: true,
    supportsPrivateLabel: true,
    subcategories: [
      {
        name: 'Fresh Food',
        slug: 'fresh-food',
        description: 'Fresh fruits, vegetables, meat, seafood, and dairy products',
        categoryType: 'sub',
        industryTags: ['fresh', 'organic', 'farm-to-table'],
        targetMarket: ['restaurants', 'supermarkets', 'distributors'],
        supportsCustomization: false,
        supportsPrivateLabel: true,
        subcategories: [
          {
            name: 'Fresh Fruits',
            slug: 'fresh-fruits',
            description: 'Seasonal and exotic fresh fruits from global suppliers',
            categoryType: 'leaf',
            industryTags: ['fruits', 'organic', 'seasonal'],
            targetMarket: ['supermarkets', 'juice-bars', 'restaurants'],
            supportsCustomization: false,
            supportsPrivateLabel: true
          },
          {
            name: 'Fresh Vegetables',
            slug: 'fresh-vegetables',
            description: 'Farm-fresh vegetables and leafy greens',
            categoryType: 'leaf',
            industryTags: ['vegetables', 'organic', 'hydroponic'],
            targetMarket: ['restaurants', 'grocery-stores'],
            supportsCustomization: false,
            supportsPrivateLabel: true
          }
        ]
      },
      {
        name: 'Agricultural Machinery',
        slug: 'agricultural-machinery',
        description: 'Tractors, harvesters, irrigation systems, and farm equipment',
        categoryType: 'sub',
        industryTags: ['machinery', 'farming', 'automation'],
        targetMarket: ['farmers', 'agricultural-cooperatives'],
        supportsCustomization: true,
        supportsPrivateLabel: false
      }
    ]
  },
  {
    name: 'Apparel & Fashion',
    slug: 'apparel-fashion',
    description: 'Clothing, accessories, textiles, and fashion items for all demographics',
    categoryType: 'main',
    industryTags: ['fashion', 'clothing', 'textiles', 'accessories'],
    targetMarket: ['retailers', 'boutiques', 'e-commerce'],
    supportsCustomization: true,
    supportsPrivateLabel: true,
    subcategories: [
      {
        name: 'Women\'s Clothing',
        slug: 'womens-clothing',
        description: 'Dresses, tops, bottoms, outerwear, and intimate apparel',
        categoryType: 'sub',
        industryTags: ['womens', 'fashion', 'trendy'],
        targetMarket: ['fashion-retailers', 'boutiques'],
        supportsCustomization: true,
        supportsPrivateLabel: true,
        subcategories: [
          {
            name: 'Dresses',
            slug: 'dresses',
            description: 'Casual, formal, party, and wedding dresses',
            categoryType: 'leaf',
            industryTags: ['dresses', 'formal', 'casual', 'party'],
            targetMarket: ['fashion-boutiques', 'online-stores'],
            supportsCustomization: true,
            supportsPrivateLabel: true
          }
        ]
      },
      {
        name: 'Men\'s Clothing',
        slug: 'mens-clothing',
        description: 'Shirts, pants, suits, casual wear, and accessories',
        categoryType: 'sub',
        industryTags: ['mens', 'formal', 'casual'],
        targetMarket: ['menswear-stores', 'corporate'],
        supportsCustomization: true,
        supportsPrivateLabel: true
      }
    ]
  },
  {
    name: 'Automobiles & Motorcycles',
    slug: 'automobiles-motorcycles',
    description: 'Vehicles, auto parts, accessories, and maintenance equipment',
    categoryType: 'main',
    industryTags: ['automotive', 'vehicles', 'parts', 'accessories'],
    targetMarket: ['dealers', 'mechanics', 'consumers'],
    supportsCustomization: true,
    supportsPrivateLabel: false,
    subcategories: [
      {
        name: 'Auto Parts',
        slug: 'auto-parts',
        description: 'Engine parts, brake systems, electrical components, and accessories',
        categoryType: 'sub',
        industryTags: ['parts', 'aftermarket', 'OEM'],
        targetMarket: ['auto-shops', 'dealers', 'DIY'],
        supportsCustomization: true,
        supportsPrivateLabel: false
      }
    ]
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    description: 'Cosmetics, skincare, haircare, and personal hygiene products',
    categoryType: 'main',
    industryTags: ['beauty', 'cosmetics', 'skincare', 'personal-care'],
    targetMarket: ['beauty-stores', 'salons', 'spas'],
    supportsCustomization: true,
    supportsPrivateLabel: true,
    subcategories: [
      {
        name: 'Makeup',
        slug: 'makeup',
        description: 'Foundation, lipstick, eyeshadow, and cosmetic tools',
        categoryType: 'sub',
        industryTags: ['makeup', 'cosmetics', 'beauty'],
        targetMarket: ['beauty-retailers', 'makeup-artists'],
        supportsCustomization: true,
        supportsPrivateLabel: true
      }
    ]
  },
  {
    name: 'Construction & Real Estate',
    slug: 'construction-real-estate',
    description: 'Building materials, construction equipment, and real estate services',
    categoryType: 'main',
    industryTags: ['construction', 'building', 'real-estate', 'materials'],
    targetMarket: ['contractors', 'developers', 'architects'],
    supportsCustomization: true,
    supportsPrivateLabel: false,
    subcategories: [
      {
        name: 'Building Materials',
        slug: 'building-materials',
        description: 'Cement, steel, lumber, tiles, and construction supplies',
        categoryType: 'sub',
        industryTags: ['materials', 'construction', 'building'],
        targetMarket: ['contractors', 'builders'],
        supportsCustomization: true,
        supportsPrivateLabel: false
      }
    ]
  },
  {
    name: 'Consumer Electronics',
    slug: 'consumer-electronics',
    description: 'Smartphones, computers, audio equipment, and electronic gadgets',
    categoryType: 'main',
    industryTags: ['electronics', 'technology', 'gadgets', 'digital'],
    targetMarket: ['retailers', 'distributors', 'consumers'],
    supportsCustomization: true,
    supportsPrivateLabel: true,
    subcategories: [
      {
        name: 'Mobile Phones & Accessories',
        slug: 'mobile-phones-accessories',
        description: 'Smartphones, cases, chargers, and mobile accessories',
        categoryType: 'sub',
        industryTags: ['mobile', 'smartphones', 'accessories'],
        targetMarket: ['electronics-stores', 'online-retailers'],
        supportsCustomization: true,
        supportsPrivateLabel: true,
        subcategories: [
          {
            name: 'Phone Cases',
            slug: 'phone-cases',
            description: 'Protective cases for all smartphone models',
            categoryType: 'leaf',
            industryTags: ['cases', 'protection', 'accessories'],
            targetMarket: ['phone-stores', 'online-shops'],
            supportsCustomization: true,
            supportsPrivateLabel: true
          }
        ]
      }
    ]
  },
  {
    name: 'Energy',
    slug: 'energy',
    description: 'Solar panels, batteries, generators, and renewable energy solutions',
    categoryType: 'main',
    industryTags: ['energy', 'solar', 'renewable', 'power'],
    targetMarket: ['installers', 'utilities', 'governments'],
    supportsCustomization: true,
    supportsPrivateLabel: false
  },
  {
    name: 'Environment',
    slug: 'environment',
    description: 'Water treatment, waste management, and environmental protection equipment',
    categoryType: 'main',
    industryTags: ['environment', 'water', 'waste', 'green-tech'],
    targetMarket: ['municipalities', 'industries', 'environmental-services'],
    supportsCustomization: true,
    supportsPrivateLabel: false
  },
  {
    name: 'Furniture',
    slug: 'furniture',
    description: 'Home and office furniture, outdoor furniture, and custom designs',
    categoryType: 'main',
    industryTags: ['furniture', 'home', 'office', 'decor'],
    targetMarket: ['furniture-stores', 'interior-designers', 'hotels'],
    supportsCustomization: true,
    supportsPrivateLabel: true,
    subcategories: [
      {
        name: 'Office Furniture',
        slug: 'office-furniture',
        description: 'Desks, chairs, filing cabinets, and workspace solutions',
        categoryType: 'sub',
        industryTags: ['office', 'workspace', 'ergonomic'],
        targetMarket: ['businesses', 'coworking-spaces'],
        supportsCustomization: true,
        supportsPrivateLabel: true
      }
    ]
  },
  {
    name: 'Gifts & Crafts',
    slug: 'gifts-crafts',
    description: 'Handicrafts, promotional items, art supplies, and gift products',
    categoryType: 'main',
    industryTags: ['gifts', 'crafts', 'handmade', 'promotional'],
    targetMarket: ['gift-shops', 'art-stores', 'promotional-companies'],
    supportsCustomization: true,
    supportsPrivateLabel: true
  },
  {
    name: 'Health & Medical',
    slug: 'health-medical',
    description: 'Medical equipment, pharmaceuticals, health supplements, and wellness products',
    categoryType: 'main',
    industryTags: ['health', 'medical', 'pharmaceutical', 'wellness'],
    targetMarket: ['hospitals', 'clinics', 'pharmacies'],
    supportsCustomization: false,
    supportsPrivateLabel: true,
    subcategories: [
      {
        name: 'Medical Equipment',
        slug: 'medical-equipment',
        description: 'Diagnostic equipment, surgical instruments, and hospital supplies',
        categoryType: 'sub',
        industryTags: ['medical-devices', 'hospital', 'diagnostic'],
        targetMarket: ['hospitals', 'medical-centers'],
        supportsCustomization: false,
        supportsPrivateLabel: false
      }
    ]
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home decor, gardening tools, kitchen appliances, and household items',
    categoryType: 'main',
    industryTags: ['home', 'garden', 'decor', 'appliances'],
    targetMarket: ['home-stores', 'garden-centers', 'online-retailers'],
    supportsCustomization: true,
    supportsPrivateLabel: true,
    subcategories: [
      {
        name: 'Kitchen & Dining',
        slug: 'kitchen-dining',
        description: 'Cookware, tableware, small appliances, and kitchen gadgets',
        categoryType: 'sub',
        industryTags: ['kitchen', 'cooking', 'dining'],
        targetMarket: ['kitchen-stores', 'restaurants'],
        supportsCustomization: true,
        supportsPrivateLabel: true
      }
    ]
  },
  {
    name: 'Industrial Machinery',
    slug: 'industrial-machinery',
    description: 'Manufacturing equipment, processing machinery, and industrial tools',
    categoryType: 'main',
    industryTags: ['machinery', 'industrial', 'manufacturing', 'automation'],
    targetMarket: ['manufacturers', 'factories', 'industrial-suppliers'],
    supportsCustomization: true,
    supportsPrivateLabel: false
  },
  {
    name: 'Lights & Lighting',
    slug: 'lights-lighting',
    description: 'LED lights, commercial lighting, decorative fixtures, and smart lighting',
    categoryType: 'main',
    industryTags: ['lighting', 'LED', 'smart', 'decorative'],
    targetMarket: ['lighting-stores', 'contractors', 'designers'],
    supportsCustomization: true,
    supportsPrivateLabel: true
  },
  {
    name: 'Luggage & Bags',
    slug: 'luggage-bags',
    description: 'Travel luggage, handbags, backpacks, and promotional bags',
    categoryType: 'main',
    industryTags: ['luggage', 'bags', 'travel', 'accessories'],
    targetMarket: ['travel-stores', 'fashion-retailers'],
    supportsCustomization: true,
    supportsPrivateLabel: true
  },
  {
    name: 'Machinery',
    slug: 'machinery',
    description: 'General machinery, equipment parts, and mechanical components',
    categoryType: 'main',
    industryTags: ['machinery', 'equipment', 'mechanical'],
    targetMarket: ['manufacturers', 'maintenance-services'],
    supportsCustomization: true,
    supportsPrivateLabel: false
  },
  {
    name: 'Minerals & Metallurgy',
    slug: 'minerals-metallurgy',
    description: 'Raw materials, metals, alloys, and mining equipment',
    categoryType: 'main',
    industryTags: ['minerals', 'metals', 'mining', 'raw-materials'],
    targetMarket: ['manufacturers', 'mining-companies'],
    supportsCustomization: false,
    supportsPrivateLabel: false
  },
  {
    name: 'Office & School Supplies',
    slug: 'office-school-supplies',
    description: 'Stationery, educational materials, office equipment, and supplies',
    categoryType: 'main',
    industryTags: ['office', 'school', 'stationery', 'education'],
    targetMarket: ['offices', 'schools', 'stationery-stores'],
    supportsCustomization: true,
    supportsPrivateLabel: true
  },
  {
    name: 'Packaging & Printing',
    slug: 'packaging-printing',
    description: 'Packaging materials, printing services, and labeling solutions',
    categoryType: 'main',
    industryTags: ['packaging', 'printing', 'labels', 'materials'],
    targetMarket: ['manufacturers', 'e-commerce', 'food-industry'],
    supportsCustomization: true,
    supportsPrivateLabel: true
  },
  {
    name: 'Security & Protection',
    slug: 'security-protection',
    description: 'Security systems, surveillance equipment, and safety gear',
    categoryType: 'main',
    industryTags: ['security', 'surveillance', 'safety', 'protection'],
    targetMarket: ['security-companies', 'businesses'],
    supportsCustomization: true,
    supportsPrivateLabel: false
  },
  {
    name: 'Service Equipment',
    slug: 'service-equipment',
    description: 'Cleaning equipment, maintenance tools, and service industry supplies',
    categoryType: 'main',
    industryTags: ['service', 'cleaning', 'maintenance'],
    targetMarket: ['service-companies', 'facilities-management'],
    supportsCustomization: true,
    supportsPrivateLabel: false
  },
  {
    name: 'Sports & Entertainment',
    slug: 'sports-entertainment',
    description: 'Sports equipment, fitness gear, entertainment products, and outdoor gear',
    categoryType: 'main',
    industryTags: ['sports', 'fitness', 'entertainment', 'outdoor'],
    targetMarket: ['sports-stores', 'gyms', 'entertainment-venues'],
    supportsCustomization: true,
    supportsPrivateLabel: true,
    subcategories: [
      {
        name: 'Fitness Equipment',
        slug: 'fitness-equipment',
        description: 'Exercise machines, weights, and fitness accessories',
        categoryType: 'sub',
        industryTags: ['fitness', 'exercise', 'gym'],
        targetMarket: ['gyms', 'home-fitness'],
        supportsCustomization: true,
        supportsPrivateLabel: true
      }
    ]
  },
  {
    name: 'Textiles & Leather Products',
    slug: 'textiles-leather',
    description: 'Fabrics, leather goods, textile machinery, and raw materials',
    categoryType: 'main',
    industryTags: ['textiles', 'leather', 'fabrics', 'materials'],
    targetMarket: ['manufacturers', 'fashion-designers'],
    supportsCustomization: true,
    supportsPrivateLabel: true
  },
  {
    name: 'Tools & Hardware',
    slug: 'tools-hardware',
    description: 'Hand tools, power tools, hardware supplies, and construction tools',
    categoryType: 'main',
    industryTags: ['tools', 'hardware', 'construction', 'DIY'],
    targetMarket: ['hardware-stores', 'contractors', 'DIY-enthusiasts'],
    supportsCustomization: true,
    supportsPrivateLabel: true
  },
  {
    name: 'Toys & Hobbies',
    slug: 'toys-hobbies',
    description: 'Children\'s toys, hobby supplies, games, and educational toys',
    categoryType: 'main',
    industryTags: ['toys', 'children', 'hobbies', 'educational'],
    targetMarket: ['toy-stores', 'schools', 'parents'],
    supportsCustomization: true,
    supportsPrivateLabel: true
  },
  {
    name: 'Transportation',
    slug: 'transportation',
    description: 'Logistics equipment, shipping supplies, and transportation services',
    categoryType: 'main',
    industryTags: ['transportation', 'logistics', 'shipping'],
    targetMarket: ['logistics-companies', 'shipping-services'],
    supportsCustomization: true,
    supportsPrivateLabel: false
  }
];

export const seedAlibabaCategories = async (): Promise<void> => {
  console.log('🌱 Seeding Alibaba-style categories...');
  
  try {
    // Clear existing categories
    await Category.deleteMany({});
    
    // Create categories recursively
    for (const categoryData of alibabaCategoriesData) {
      await createCategoryWithSubcategories(categoryData);
    }
    
    console.log('✅ Alibaba categories seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
};

async function createCategoryWithSubcategories(
  categoryData: CategorySeedData, 
  parentId?: string
): Promise<ICategory> {
  // Create the main category
  const category = await Category.create({
    name: categoryData.name,
    slug: categoryData.slug,
    description: categoryData.description,
    categoryType: categoryData.categoryType,
    industryTags: categoryData.industryTags,
    targetMarket: categoryData.targetMarket,
    supportsCustomization: categoryData.supportsCustomization,
    supportsPrivateLabel: categoryData.supportsPrivateLabel,
    parentCategory: parentId || null,
    isActive: true,
    isFeatured: categoryData.categoryType === 'main',
    certificationRequired: ['health-medical', 'automotive', 'food'].some(tag => 
      categoryData.industryTags.includes(tag)
    ),
    tradeAssurance: ['electronics', 'machinery', 'automotive'].some(tag => 
      categoryData.industryTags.includes(tag)
    )
  });
  
  // Create subcategories if they exist
  if (categoryData.subcategories && categoryData.subcategories.length > 0) {
    const subcategoryIds: string[] = [];
    
    for (const subCategoryData of categoryData.subcategories) {
      const subCategory = await createCategoryWithSubcategories(subCategoryData, category._id);
      subcategoryIds.push(subCategory._id);
    }
    
    // Update parent with subcategory references
    category.subcategories = subcategoryIds;
    await category.save();
  }
  
  return category;
}
