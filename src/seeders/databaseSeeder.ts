import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Tenant from '../models/Tenant';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';
import Vendor from '../models/Vendor';
import connectDB from '../config/db';

/**
 * Comprehensive E-commerce Categories following Amazon/Temu/Walmart structure
 * Following Database Patterns from Copilot Instructions
 */
const COMPREHENSIVE_CATEGORIES = [
  // ELECTRONICS & TECHNOLOGY (Main Category + Subcategories)
  {
    name: 'Electronics & Technology',
    slug: 'electronics-technology',
    description: 'Consumer electronics, gadgets, and technology products',
    level: 0,
    path: 'electronics-technology',
    categoryType: 'main' as const,
    isFeatured: true,
    order: 1,
    affiliateCode: 'ELEC-MAIN-001',
    affiliateUrl: 'https://amazon.com/electronics?tag=whitestart-20',
    promotionText: 'Up to 50% Off Electronics',
    industryTags: ['Technology', 'Consumer Electronics'],
    targetMarket: ['Global', 'North America', 'Europe'],
    tradeAssurance: true,
    supportsCustomization: false
  },
  {
    name: 'Smartphones & Accessories',
    slug: 'smartphones-accessories',
    description: 'Latest smartphones, cases, chargers, and mobile accessories',
    level: 1,
    path: 'electronics-technology/smartphones-accessories',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 2,
    affiliateCode: 'MOBL-001',
    affiliateUrl: 'https://amazon.com/cell-phones?tag=whitestart-20'
  },
  {
    name: 'Computers & Laptops',
    slug: 'computers-laptops',
    description: 'Desktop computers, laptops, tablets, and computer accessories',
    level: 1,
    path: 'electronics-technology/computers-laptops',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 3,
    affiliateCode: 'COMP-001',
    affiliateUrl: 'https://amazon.com/computers?tag=whitestart-20'
  },
  {
    name: 'Audio & Headphones',
    slug: 'audio-headphones',
    description: 'Headphones, earbuds, speakers, and audio equipment',
    level: 1,
    path: 'electronics-technology/audio-headphones',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 4,
    affiliateCode: 'AUDI-001',
    affiliateUrl: 'https://amazon.com/headphones?tag=whitestart-20'
  },
  {
    name: 'Gaming & Consoles',
    slug: 'gaming-consoles',
    description: 'Video games, gaming consoles, controllers, and gaming accessories',
    level: 1,
    path: 'electronics-technology/gaming-consoles',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 5,
    affiliateCode: 'GAME-001',
    affiliateUrl: 'https://amazon.com/video-games?tag=whitestart-20'
  },
  {
    name: 'Smart Home & Security',
    slug: 'smart-home-security',
    description: 'Smart home devices, security cameras, and home automation',
    level: 1,
    path: 'electronics-technology/smart-home-security',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 6,
    affiliateCode: 'SMRT-001',
    affiliateUrl: 'https://amazon.com/smart-home?tag=whitestart-20'
  },
  {
    name: 'Cameras & Photography',
    slug: 'cameras-photography',
    description: 'Digital cameras, lenses, photography equipment, and accessories',
    level: 1,
    path: 'electronics-technology/cameras-photography',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 7,
    affiliateCode: 'CAMR-001',
    affiliateUrl: 'https://amazon.com/cameras?tag=whitestart-20'
  },
  {
    name: 'Wearable Technology',
    slug: 'wearable-technology',
    description: 'Smartwatches, fitness trackers, and wearable devices',
    level: 1,
    path: 'electronics-technology/wearable-technology',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 8,
    affiliateCode: 'WEAR-001',
    affiliateUrl: 'https://amazon.com/wearables?tag=whitestart-20'
  },

  // FASHION & APPAREL
  {
    name: 'Fashion & Apparel',
    slug: 'fashion-apparel',
    description: 'Clothing, shoes, accessories, and fashion items for all ages',
    level: 0,
    path: 'fashion-apparel',
    categoryType: 'main' as const,
    isFeatured: true,
    order: 9,
    affiliateCode: 'FASH-MAIN-001',
    affiliateUrl: 'https://amazon.com/fashion?tag=whitestart-20',
    promotionText: 'New Season Arrivals',
    industryTags: ['Fashion', 'Apparel', 'Retail'],
    targetMarket: ['Global'],
    tradeAssurance: true,
    supportsCustomization: true
  },
  {
    name: 'Men\'s Fashion',
    slug: 'mens-fashion',
    description: 'Men\'s clothing, shoes, accessories, and grooming products',
    level: 1,
    path: 'fashion-apparel/mens-fashion',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 10,
    affiliateCode: 'MENS-001',
    affiliateUrl: 'https://amazon.com/mens-fashion?tag=whitestart-20'
  },
  {
    name: 'Women\'s Fashion',
    slug: 'womens-fashion',
    description: 'Women\'s clothing, shoes, handbags, and beauty accessories',
    level: 1,
    path: 'fashion-apparel/womens-fashion',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 11,
    affiliateCode: 'WMNS-001',
    affiliateUrl: 'https://amazon.com/womens-fashion?tag=whitestart-20'
  },
  {
    name: 'Kids & Baby',
    slug: 'kids-baby',
    description: 'Children\'s clothing, baby products, toys, and accessories',
    level: 1,
    path: 'fashion-apparel/kids-baby',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 12,
    affiliateCode: 'KIDS-001',
    affiliateUrl: 'https://amazon.com/baby?tag=whitestart-20'
  },
  {
    name: 'Shoes & Footwear',
    slug: 'shoes-footwear',
    description: 'Athletic shoes, boots, sandals, and specialty footwear',
    level: 1,
    path: 'fashion-apparel/shoes-footwear',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 13,
    affiliateCode: 'SHOE-001',
    affiliateUrl: 'https://amazon.com/shoes?tag=whitestart-20'
  },
  {
    name: 'Jewelry & Watches',
    slug: 'jewelry-watches',
    description: 'Fine jewelry, fashion jewelry, watches, and accessories',
    level: 1,
    path: 'fashion-apparel/jewelry-watches',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 14,
    affiliateCode: 'JEWL-001',
    affiliateUrl: 'https://amazon.com/jewelry?tag=whitestart-20'
  },
  {
    name: 'Bags & Luggage',
    slug: 'bags-luggage',
    description: 'Handbags, backpacks, travel luggage, and carrying cases',
    level: 1,
    path: 'fashion-apparel/bags-luggage',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 15,
    affiliateCode: 'BAGS-001',
    affiliateUrl: 'https://amazon.com/luggage?tag=whitestart-20'
  },

  // HOME & GARDEN
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home improvement, furniture, decor, and garden supplies',
    level: 0,
    path: 'home-garden',
    categoryType: 'main' as const,
    isFeatured: true,
    order: 16,
    affiliateCode: 'HOME-MAIN-001',
    affiliateUrl: 'https://amazon.com/home-garden?tag=whitestart-20',
    promotionText: 'Transform Your Space',
    industryTags: ['Home Improvement', 'Furniture', 'Gardening'],
    targetMarket: ['North America', 'Europe'],
    tradeAssurance: true,
    supportsCustomization: true
  },
  {
    name: 'Furniture',
    slug: 'furniture',
    description: 'Living room, bedroom, office, and outdoor furniture',
    level: 1,
    path: 'home-garden/furniture',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 17,
    affiliateCode: 'FURN-001',
    affiliateUrl: 'https://amazon.com/furniture?tag=whitestart-20'
  },
  {
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Wall art, lighting, rugs, curtains, and decorative accessories',
    level: 1,
    path: 'home-garden/home-decor',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 18,
    affiliateCode: 'DECR-001',
    affiliateUrl: 'https://amazon.com/home-decor?tag=whitestart-20'
  },
  {
    name: 'Kitchen & Dining',
    slug: 'kitchen-dining',
    description: 'Kitchen appliances, cookware, dinnerware, and dining accessories',
    level: 1,
    path: 'home-garden/kitchen-dining',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 19,
    affiliateCode: 'KTCH-001',
    affiliateUrl: 'https://amazon.com/kitchen?tag=whitestart-20'
  },
  {
    name: 'Garden & Outdoor',
    slug: 'garden-outdoor',
    description: 'Gardening tools, plants, outdoor furniture, and patio decor',
    level: 1,
    path: 'home-garden/garden-outdoor',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 20,
    affiliateCode: 'GARD-001',
    affiliateUrl: 'https://amazon.com/garden?tag=whitestart-20'
  },
  {
    name: 'Tools & Hardware',
    slug: 'tools-hardware',
    description: 'Power tools, hand tools, hardware, and home improvement supplies',
    level: 1,
    path: 'home-garden/tools-hardware',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 21,
    affiliateCode: 'TOOL-001',
    affiliateUrl: 'https://amazon.com/tools?tag=whitestart-20'
  },
  {
    name: 'Appliances',
    slug: 'appliances',
    description: 'Large and small appliances for kitchen, laundry, and home',
    level: 1,
    path: 'home-garden/appliances',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 22,
    affiliateCode: 'APPL-001',
    affiliateUrl: 'https://amazon.com/appliances?tag=whitestart-20'
  },

  // HEALTH & BEAUTY
  {
    name: 'Health & Beauty',
    slug: 'health-beauty',
    description: 'Health products, beauty items, personal care, and wellness',
    level: 0,
    path: 'health-beauty',
    categoryType: 'main' as const,
    isFeatured: true,
    order: 23,
    affiliateCode: 'HLTH-MAIN-001',
    affiliateUrl: 'https://amazon.com/health-beauty?tag=whitestart-20',
    promotionText: 'Wellness & Beauty Essentials',
    industryTags: ['Health', 'Beauty', 'Personal Care'],
    targetMarket: ['Global'],
    tradeAssurance: false,
    supportsCustomization: false
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Skincare, haircare, oral care, and personal hygiene products',
    level: 1,
    path: 'health-beauty/personal-care',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 24,
    affiliateCode: 'CARE-001',
    affiliateUrl: 'https://amazon.com/personal-care?tag=whitestart-20'
  },
  {
    name: 'Beauty & Cosmetics',
    slug: 'beauty-cosmetics',
    description: 'Makeup, fragrances, nail care, and beauty tools',
    level: 1,
    path: 'health-beauty/beauty-cosmetics',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 25,
    affiliateCode: 'BEAU-001',
    affiliateUrl: 'https://amazon.com/beauty?tag=whitestart-20'
  },
  {
    name: 'Vitamins & Supplements',
    slug: 'vitamins-supplements',
    description: 'Vitamins, minerals, protein supplements, and health products',
    level: 1,
    path: 'health-beauty/vitamins-supplements',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 26,
    affiliateCode: 'VITA-001',
    affiliateUrl: 'https://amazon.com/vitamins?tag=whitestart-20'
  },
  {
    name: 'Fitness & Exercise',
    slug: 'fitness-exercise',
    description: 'Exercise equipment, fitness accessories, and workout gear',
    level: 1,
    path: 'health-beauty/fitness-exercise',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 27,
    affiliateCode: 'FITN-001',
    affiliateUrl: 'https://amazon.com/fitness?tag=whitestart-20'
  },

  // SPORTS & OUTDOORS
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Sporting goods, outdoor recreation, and athletic equipment',
    level: 0,
    path: 'sports-outdoors',
    categoryType: 'main' as const,
    isFeatured: true,
    order: 28,
    affiliateCode: 'SPRT-MAIN-001',
    affiliateUrl: 'https://amazon.com/sports?tag=whitestart-20',
    promotionText: 'Gear Up for Adventure',
    industryTags: ['Sports', 'Recreation', 'Outdoor'],
    targetMarket: ['Global'],
    tradeAssurance: true,
    supportsCustomization: true
  },
  {
    name: 'Athletic Wear',
    slug: 'athletic-wear',
    description: 'Sports clothing, activewear, and athletic footwear',
    level: 1,
    path: 'sports-outdoors/athletic-wear',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 29,
    affiliateCode: 'ATHL-001',
    affiliateUrl: 'https://amazon.com/athletic-wear?tag=whitestart-20'
  },
  {
    name: 'Outdoor Recreation',
    slug: 'outdoor-recreation',
    description: 'Camping, hiking, fishing, and outdoor adventure gear',
    level: 1,
    path: 'sports-outdoors/outdoor-recreation',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 30,
    affiliateCode: 'OUTR-001',
    affiliateUrl: 'https://amazon.com/outdoor-recreation?tag=whitestart-20'
  },
  {
    name: 'Team Sports',
    slug: 'team-sports',
    description: 'Equipment for football, basketball, soccer, baseball, and more',
    level: 1,
    path: 'sports-outdoors/team-sports',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 31,
    affiliateCode: 'TEAM-001',
    affiliateUrl: 'https://amazon.com/team-sports?tag=whitestart-20'
  },

  // AUTOMOTIVE
  {
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car parts, accessories, tools, and automotive supplies',
    level: 0,
    path: 'automotive',
    categoryType: 'main' as const,
    isFeatured: false,
    order: 32,
    affiliateCode: 'AUTO-MAIN-001',
    affiliateUrl: 'https://amazon.com/automotive?tag=whitestart-20',
    industryTags: ['Automotive', 'Transportation'],
    targetMarket: ['North America', 'Europe'],
    tradeAssurance: true,
    supportsCustomization: true
  },
  {
    name: 'Car Electronics',
    slug: 'car-electronics',
    description: 'GPS systems, dash cams, car audio, and electronic accessories',
    level: 1,
    path: 'automotive/car-electronics',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 33,
    affiliateCode: 'CREL-001',
    affiliateUrl: 'https://amazon.com/car-electronics?tag=whitestart-20'
  },
  {
    name: 'Car Care',
    slug: 'car-care',
    description: 'Car cleaning products, maintenance supplies, and detailing tools',
    level: 1,
    path: 'automotive/car-care',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 34,
    affiliateCode: 'CARE-001',
    affiliateUrl: 'https://amazon.com/car-care?tag=whitestart-20'
  },

  // TOYS & GAMES
  {
    name: 'Toys & Games',
    slug: 'toys-games',
    description: 'Toys, games, puzzles, and entertainment for all ages',
    level: 0,
    path: 'toys-games',
    categoryType: 'main' as const,
    isFeatured: true,
    order: 35,
    affiliateCode: 'TOYS-MAIN-001',
    affiliateUrl: 'https://amazon.com/toys-games?tag=whitestart-20',
    promotionText: 'Fun for Everyone',
    industryTags: ['Toys', 'Entertainment', 'Education'],
    targetMarket: ['Global'],
    tradeAssurance: false,
    supportsCustomization: false
  },
  {
    name: 'Educational Toys',
    slug: 'educational-toys',
    description: 'STEM toys, learning games, and educational activities',
    level: 1,
    path: 'toys-games/educational-toys',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 36,
    affiliateCode: 'EDUC-001',
    affiliateUrl: 'https://amazon.com/educational-toys?tag=whitestart-20'
  },
  {
    name: 'Board Games & Puzzles',
    slug: 'board-games-puzzles',
    description: 'Board games, card games, jigsaw puzzles, and family games',
    level: 1,
    path: 'toys-games/board-games-puzzles',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 37,
    affiliateCode: 'BORD-001',
    affiliateUrl: 'https://amazon.com/board-games?tag=whitestart-20'
  },

  // BOOKS & MEDIA
  {
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, e-books, audiobooks, movies, and digital content',
    level: 0,
    path: 'books-media',
    categoryType: 'main' as const,
    isFeatured: false,
    order: 38,
    affiliateCode: 'BOOK-MAIN-001',
    affiliateUrl: 'https://amazon.com/books?tag=whitestart-20',
    industryTags: ['Publishing', 'Media', 'Education'],
    targetMarket: ['Global'],
    tradeAssurance: false,
    supportsCustomization: false
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Fiction, non-fiction, textbooks, and specialty books',
    level: 1,
    path: 'books-media/books',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 39,
    affiliateCode: 'BOOK-001',
    affiliateUrl: 'https://amazon.com/books?tag=whitestart-20'
  },
  {
    name: 'Movies & TV',
    slug: 'movies-tv',
    description: 'DVDs, Blu-rays, digital movies, and TV shows',
    level: 1,
    path: 'books-media/movies-tv',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 40,
    affiliateCode: 'MOVI-001',
    affiliateUrl: 'https://amazon.com/movies?tag=whitestart-20'
  },

  // OFFICE & BUSINESS
  {
    name: 'Office & Business',
    slug: 'office-business',
    description: 'Office supplies, business equipment, and workplace essentials',
    level: 0,
    path: 'office-business',
    categoryType: 'main' as const,
    isFeatured: false,
    order: 41,
    affiliateCode: 'OFFC-MAIN-001',
    affiliateUrl: 'https://amazon.com/office-supplies?tag=whitestart-20',
    industryTags: ['Business', 'Office', 'Professional'],
    targetMarket: ['Global'],
    tradeAssurance: true,
    supportsCustomization: true
  },
  {
    name: 'Office Supplies',
    slug: 'office-supplies',
    description: 'Pens, paper, organizers, and everyday office essentials',
    level: 1,
    path: 'office-business/office-supplies',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 42,
    affiliateCode: 'SUPP-001',
    affiliateUrl: 'https://amazon.com/office-supplies?tag=whitestart-20'
  },

  // PET SUPPLIES
  {
    name: 'Pet Supplies',
    slug: 'pet-supplies',
    description: 'Pet food, toys, accessories, and care products for all pets',
    level: 0,
    path: 'pet-supplies',
    categoryType: 'main' as const,
    isFeatured: true,
    order: 43,
    affiliateCode: 'PETS-MAIN-001',
    affiliateUrl: 'https://amazon.com/pet-supplies?tag=whitestart-20',
    promotionText: 'Everything for Your Pet',
    industryTags: ['Pets', 'Animal Care'],
    targetMarket: ['Global'],
    tradeAssurance: false,
    supportsCustomization: false
  },
  {
    name: 'Dog Supplies',
    slug: 'dog-supplies',
    description: 'Dog food, toys, leashes, beds, and care products',
    level: 1,
    path: 'pet-supplies/dog-supplies',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 44,
    affiliateCode: 'DOGS-001',
    affiliateUrl: 'https://amazon.com/dog-supplies?tag=whitestart-20'
  },
  {
    name: 'Cat Supplies',
    slug: 'cat-supplies',
    description: 'Cat food, litter, toys, scratching posts, and accessories',
    level: 1,
    path: 'pet-supplies/cat-supplies',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 45,
    affiliateCode: 'CATS-001',
    affiliateUrl: 'https://amazon.com/cat-supplies?tag=whitestart-20'
  },

  // GROCERY & FOOD
  {
    name: 'Grocery & Food',
    slug: 'grocery-food',
    description: 'Food items, beverages, snacks, and pantry essentials',
    level: 0,
    path: 'grocery-food',
    categoryType: 'main' as const,
    isFeatured: false,
    order: 46,
    affiliateCode: 'GROC-MAIN-001',
    affiliateUrl: 'https://amazon.com/grocery?tag=whitestart-20',
    industryTags: ['Food', 'Beverage', 'Grocery'],
    targetMarket: ['North America'],
    tradeAssurance: false,
    supportsCustomization: false
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Coffee, tea, soft drinks, juices, and specialty beverages',
    level: 1,
    path: 'grocery-food/beverages',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 47,
    affiliateCode: 'BEVR-001',
    affiliateUrl: 'https://amazon.com/beverages?tag=whitestart-20'
  },
  {
    name: 'Snacks & Candy',
    slug: 'snacks-candy',
    description: 'Chips, cookies, candy, nuts, and snack foods',
    level: 1,
    path: 'grocery-food/snacks-candy',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 48,
    affiliateCode: 'SNCK-001',
    affiliateUrl: 'https://amazon.com/snacks?tag=whitestart-20'
  },

  // ARTS & CRAFTS
  {
    name: 'Arts & Crafts',
    slug: 'arts-crafts',
    description: 'Art supplies, crafting materials, and creative projects',
    level: 0,
    path: 'arts-crafts',
    categoryType: 'main' as const,
    isFeatured: false,
    order: 49,
    affiliateCode: 'ARTS-MAIN-001',
    affiliateUrl: 'https://amazon.com/arts-crafts?tag=whitestart-20',
    industryTags: ['Arts', 'Crafts', 'Creative'],
    targetMarket: ['Global'],
    tradeAssurance: false,
    supportsCustomization: true
  },
  {
    name: 'Drawing & Painting',
    slug: 'drawing-painting',
    description: 'Paints, brushes, canvases, drawing supplies, and art tools',
    level: 1,
    path: 'arts-crafts/drawing-painting',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 50,
    affiliateCode: 'DRAW-001',
    affiliateUrl: 'https://amazon.com/drawing-painting?tag=whitestart-20'
  },

  // MUSICAL INSTRUMENTS
  {
    name: 'Musical Instruments',
    slug: 'musical-instruments',
    description: 'Guitars, keyboards, drums, and music equipment',
    level: 0,
    path: 'musical-instruments',
    categoryType: 'main' as const,
    isFeatured: false,
    order: 51,
    affiliateCode: 'MUSI-MAIN-001',
    affiliateUrl: 'https://amazon.com/musical-instruments?tag=whitestart-20',
    industryTags: ['Music', 'Instruments'],
    targetMarket: ['Global'],
    tradeAssurance: true,
    supportsCustomization: true
  },
  {
    name: 'Guitars & Strings',
    slug: 'guitars-strings',
    description: 'Acoustic guitars, electric guitars, basses, and string instruments',
    level: 1,
    path: 'musical-instruments/guitars-strings',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 52,
    affiliateCode: 'GUIT-001',
    affiliateUrl: 'https://amazon.com/guitars?tag=whitestart-20'
  },

  // INDUSTRIAL & SCIENTIFIC
  {
    name: 'Industrial & Scientific',
    slug: 'industrial-scientific',
    description: 'Industrial equipment, laboratory supplies, and scientific instruments',
    level: 0,
    path: 'industrial-scientific',
    categoryType: 'main' as const,
    isFeatured: false,
    order: 53,
    affiliateCode: 'INDU-MAIN-001',
    affiliateUrl: 'https://amazon.com/industrial?tag=whitestart-20',
    industryTags: ['Industrial', 'Scientific', 'B2B'],
    targetMarket: ['Global'],
    tradeAssurance: true,
    supportsCustomization: true
  },
  {
    name: 'Laboratory Equipment',
    slug: 'laboratory-equipment',
    description: 'Lab instruments, testing equipment, and scientific supplies',
    level: 1,
    path: 'industrial-scientific/laboratory-equipment',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 54,
    affiliateCode: 'LABS-001',
    affiliateUrl: 'https://amazon.com/lab-equipment?tag=whitestart-20'
  },

  // COLLECTIBLES & HOBBIES
  {
    name: 'Collectibles & Hobbies',
    slug: 'collectibles-hobbies',
    description: 'Collectible items, hobby supplies, and specialty interests',
    level: 0,
    path: 'collectibles-hobbies',
    categoryType: 'main' as const,
    isFeatured: false,
    order: 55,
    affiliateCode: 'COLL-MAIN-001',
    affiliateUrl: 'https://amazon.com/collectibles?tag=whitestart-20',
    industryTags: ['Collectibles', 'Hobbies'],
    targetMarket: ['Global'],
    tradeAssurance: false,
    supportsCustomization: false
  },
  {
    name: 'Trading Cards',
    slug: 'trading-cards',
    description: 'Sports cards, gaming cards, and collectible card games',
    level: 1,
    path: 'collectibles-hobbies/trading-cards',
    categoryType: 'sub' as const,
    isFeatured: false,
    order: 56,
    affiliateCode: 'CARD-001',
    affiliateUrl: 'https://amazon.com/trading-cards?tag=whitestart-20'
  },

  // BABY & MATERNITY
  {
    name: 'Baby & Maternity',
    slug: 'baby-maternity',
    description: 'Baby gear, maternity products, and parenting essentials',
    level: 0,
    path: 'baby-maternity',
    categoryType: 'main' as const,
    isFeatured: true,
    order: 57,
    affiliateCode: 'BABY-MAIN-001',
    affiliateUrl: 'https://amazon.com/baby?tag=whitestart-20',
    promotionText: 'Everything for Baby',
    industryTags: ['Baby', 'Maternity', 'Parenting'],
    targetMarket: ['Global'],
    tradeAssurance: false,
    supportsCustomization: false
  },
  {
    name: 'Baby Gear',
    slug: 'baby-gear',
    description: 'Strollers, car seats, high chairs, and baby equipment',
    level: 1,
    path: 'baby-maternity/baby-gear',
    categoryType: 'sub' as const,
    isFeatured: true,
    order: 58,
    affiliateCode: 'GEAR-001',
    affiliateUrl: 'https://amazon.com/baby-gear?tag=whitestart-20'
  }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting comprehensive seeding with 58 categories...');
        
        // Connect following Database Patterns
        await connectDB();
        
        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            Tenant.deleteMany({}),
            User.deleteMany({}),
            Category.deleteMany({}),
            Product.deleteMany({}),
            Vendor.deleteMany({})
        ]);

        // Create Tenant following Project-Specific Conventions
        console.log('🏢 Creating tenant...');
        const tenant = await Tenant.create({
            name: 'Whitestart System Security',
            hostname: 'localhost'
        });

        // Create McAvoy Team following Authentication Flow
        console.log('👤 Creating McAvoy admin team...');
        const adminPassword = await bcrypt.hash('AhenP3131m!', 12);
        
        await User.create([
            {
                name: 'Thomas McAvoy',
                email: 'thomas.mcavoy@whitestartups.com',
                password: adminPassword,
                role: 'admin',
                tenantId: tenant._id
            },
            {
                name: 'Shirley McAvoy',
                email: 'shirley.mcavoy@whitestartups.com',
                password: adminPassword,
                role: 'admin',
                tenantId: tenant._id
            },
            {
                name: 'Adam McAvoy',
                email: 'adam.mcavoy@whitestartups.com',
                password: adminPassword,
                role: 'admin',
                tenantId: tenant._id
            },
            {
                name: 'Connor McAvoy',
                email: 'connor.mcavoy@whitestartups.com',
                password: adminPassword,
                role: 'admin',
                tenantId: tenant._id
            }
        ]);

        // Create ALL 58 Categories with proper hierarchy and affiliate marketing
        console.log('📂 Creating 58 comprehensive categories with hierarchy...');
        
        // First create main categories
        const mainCategories = COMPREHENSIVE_CATEGORIES.filter(cat => cat.level === 0);
        const createdMainCategories = await Category.create(
            mainCategories.map(cat => ({
                ...cat,
                tenantId: tenant._id,
                isActive: true,
                parentCategory: null
            }))
        );

        // Create a map for parent category lookup
        const categoryMap = new Map();
        createdMainCategories.forEach(cat => {
            categoryMap.set(cat.path, cat._id);
        });

        // Then create subcategories with proper parent references
        const subCategories = COMPREHENSIVE_CATEGORIES.filter(cat => cat.level === 1);
        const createdSubCategories = await Category.create(
            subCategories.map(cat => {
                const parentPath = cat.path.split('/')[0];
                const parentId = categoryMap.get(parentPath);
                return {
                    ...cat,
                    tenantId: tenant._id,
                    isActive: true,
                    parentCategory: parentId
                };
            })
        );

        const allCategories = [...createdMainCategories, ...createdSubCategories];

        // Create Sample Vendor and Products
        console.log('🏪 Creating vendor and sample products...');
        const vendorUser = await User.create({
            name: 'Tech Solutions Vendor',
            email: 'vendor@techsolutions.com',
            password: adminPassword,
            role: 'vendor',
            tenantId: tenant._id
        });

        const vendor = await Vendor.create({
            user: vendorUser._id,
            businessName: 'Tech Solutions LLC',
            description: 'Premium technology and security equipment provider',
            contactEmail: 'vendor@techsolutions.com',
            website: 'https://techsolutions.com',
            tenantId: tenant._id
        });

        // Create products in multiple categories
        const electronicsCategory = allCategories.find(cat => cat.slug === 'electronics-technology');
        const smartHomeCategory = allCategories.find(cat => cat.slug === 'smart-home-security');
        const computersCategory = allCategories.find(cat => cat.slug === 'computers-laptops');

        await Product.create([
            {
                name: 'Professional 4K Security Camera System',
                description: 'Advanced 4K wireless security camera with AI detection, night vision, and mobile app control',
                price: 299.99,
                category: smartHomeCategory._id,
                vendor: vendor._id,
                stock: 25,
                images: ['security-camera-4k.jpg'],
                isFeatured: true,
                tenantId: tenant._id
            },
            {
                name: 'Gaming Laptop Pro 15"',
                description: 'High-performance gaming laptop with RTX graphics and fast SSD storage',
                price: 1299.99,
                category: computersCategory._id,
                vendor: vendor._id,
                stock: 15,
                images: ['gaming-laptop.jpg'],
                isFeatured: true,
                tenantId: tenant._id
            },
            {
                name: 'Smart Home Hub Controller',
                description: 'Central control hub for all smart home devices with voice assistant integration',
                price: 149.99,
                category: smartHomeCategory._id,
                vendor: vendor._id,
                stock: 40,
                images: ['smart-hub.jpg'],
                isFeatured: true,
                tenantId: tenant._id
            }
        ]);

        console.log('✅ Comprehensive database seeding completed successfully!');
        console.log('\n📋 Seeded Data Summary:');
        console.log(`- Categories: ${allCategories.length} (Main: ${createdMainCategories.length}, Sub: ${createdSubCategories.length})`);
        console.log(`- Products: 3 sample products`);
        console.log(`- Admin Users: 4 (McAvoy Team)`);
        console.log(`- Vendors: 1`);
        console.log(`- Tenant: ${tenant.name}`);
        
        console.log('\n📂 Main Categories Created:');
        createdMainCategories.forEach((cat, index) => {
            const subCount = createdSubCategories.filter(sub => sub.parentCategory?.toString() === cat._id.toString()).length;
            console.log(`${index + 1}. ${cat.name} (${subCount} subcategories)`);
        });
        
        console.log('\n🔗 Affiliate Marketing Features:');
        console.log('- All categories have affiliate codes and Amazon URLs');
        console.log('- Featured categories marked for homepage display');
        console.log('- Hierarchical structure with main and sub categories');
        console.log('- Industry tags and target markets defined');
        
        console.log('\n🧪 Debug Commands:');
        console.log('curl http://localhost:3000/api/categories');
        console.log('curl http://localhost:3000/api/categories | jq ". | length"');
        console.log('open http://localhost:3001/debug');
        console.log('open http://localhost:3001/categories');
        
        process.exit(0);
    } catch (error: unknown) {
        console.error('Seeding process failed.');
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Stack trace:', error.stack);
        } else {
          console.error('An unknown error occurred:', error);
        }
        process.exit(1);
    }
};

// Run seeder if called directly
if (require.main === module) {
    seedDatabase();
}

export default seedDatabase;