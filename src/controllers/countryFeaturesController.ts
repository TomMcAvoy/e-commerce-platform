import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

// Country-specific featured products and vacation vendors
const countryFeatures = {
  scotland: {
    featuredProducts: [
      {
        id: 'scot-1',
        name: 'Authentic Scottish Kilt - Tartan Wool',
        description: 'Premium quality traditional Scottish kilt in authentic clan tartan patterns',
        price: 189.99,
        category: 'fashion',
        image: '/images/scottish-kilt.jpg',
        tags: ['scottish', 'traditional', 'formal', 'menswear']
      },
      {
        id: 'scot-2',
        name: 'Highland Formal Jacket',
        description: 'Traditional Scottish Highland formal wear jacket for special occasions',
        price: 149.99,
        category: 'fashion',
        image: '/images/highland-jacket.jpg',
        tags: ['scottish', 'formal', 'highland', 'menswear']
      },
      {
        id: 'scot-3',
        name: 'Tartan Plaid Shawl - Women\'s',
        description: 'Elegant tartan plaid shawl perfect for Scottish occasions',
        price: 59.99,
        category: 'fashion',
        image: '/images/tartan-shawl.jpg',
        tags: ['scottish', 'women', 'tartan', 'accessories']
      },
      {
        id: 'scot-4',
        name: 'Tartan Dog Coat - Weather Resistant',
        description: 'Stylish tartan pattern dog coat to keep your pet warm in Scottish weather',
        price: 34.99,
        category: 'pets',
        image: '/images/tartan-dog-coat.jpg',
        tags: ['pets', 'scottish', 'tartan', 'weather-resistant']
      },
      {
        id: 'scot-5',
        name: 'Clan Sporran - Leather & Fur',
        description: 'Traditional Scottish sporran with authentic clan details',
        price: 89.99,
        category: 'accessories',
        image: '/images/clan-sporran.jpg',
        tags: ['scottish', 'traditional', 'accessories', 'clan']
      }
    ],
    vacationVendor: {
      name: 'Highland Adventures Scotland',
      description: 'Experience the magic of the Scottish Highlands with castle tours, whisky trails, and Highland games',
      url: 'https://highland-adventures.scot',
      phone: '+44 131 555 0123',
      specialOffers: [
        'Isle of Skye 3-Day Tours',
        'Edinburgh Castle & Whisky Trail',
        'Highland Games Experience',
        'Loch Ness Adventure Package'
      ],
      rating: 4.8,
      image: '/images/scotland-highlands.jpg'
    }
  },
  
  ireland: {
    featuredProducts: [
      {
        id: 'ire-1',
        name: 'Irish Aran Fisherman Sweater',
        description: 'Hand-knitted traditional Irish Aran sweater with cable patterns',
        price: 129.99,
        category: 'fashion',
        image: '/images/aran-sweater.jpg',
        tags: ['irish', 'traditional', 'wool', 'handmade']
      },
      {
        id: 'ire-2',
        name: 'Celtic Claddagh Ring',
        description: 'Authentic Irish Claddagh ring in sterling silver',
        price: 79.99,
        category: 'jewelry',
        image: '/images/claddagh-ring.jpg',
        tags: ['irish', 'celtic', 'jewelry', 'traditional']
      },
      {
        id: 'ire-3',
        name: 'Irish Tweed Flat Cap',
        description: 'Classic Irish tweed flat cap in traditional patterns',
        price: 45.99,
        category: 'accessories',
        image: '/images/irish-tweed-cap.jpg',
        tags: ['irish', 'tweed', 'accessories', 'traditional']
      }
    ],
    vacationVendor: {
      name: 'Emerald Isle Tours',
      description: 'Discover the beauty of Ireland with our authentic cultural and scenic tours',
      url: 'https://emerald-isle-tours.ie',
      phone: '+353 1 555 0456',
      specialOffers: [
        'Ring of Kerry Scenic Drive',
        'Dublin Pub & Culture Tour',
        'Cliffs of Moher Adventure',
        'Castle & Countryside Package'
      ],
      rating: 4.7,
      image: '/images/ireland-cliffs.jpg'
    }
  },
  
  germany: {
    featuredProducts: [
      {
        id: 'ger-1',
        name: 'Bavarian Lederhosen - Authentic Leather',
        description: 'Traditional Bavarian lederhosen made from premium leather',
        price: 199.99,
        category: 'fashion',
        image: '/images/lederhosen.jpg',
        tags: ['german', 'bavarian', 'traditional', 'oktoberfest']
      },
      {
        id: 'ger-2',
        name: 'German Beer Stein - Hand Painted',
        description: 'Authentic German beer stein with traditional hand-painted designs',
        price: 39.99,
        category: 'collectibles',
        image: '/images/beer-stein.jpg',
        tags: ['german', 'beer', 'traditional', 'collectible']
      },
      {
        id: 'ger-3',
        name: 'Black Forest Cuckoo Clock',
        description: 'Handcrafted Black Forest cuckoo clock with traditional woodwork',
        price: 159.99,
        category: 'home',
        image: '/images/cuckoo-clock.jpg',
        tags: ['german', 'black-forest', 'traditional', 'handcrafted']
      }
    ],
    vacationVendor: {
      name: 'Bavaria & Beyond Tours',
      description: 'Experience authentic German culture from Oktoberfest to fairy tale castles',
      url: 'https://bavaria-tours.de',
      phone: '+49 89 555 0789',
      specialOffers: [
        'Neuschwanstein Castle Tour',
        'Oktoberfest Experience',
        'Rhine Valley Wine Tour',
        'Berlin History Walk'
      ],
      rating: 4.9,
      image: '/images/neuschwanstein-castle.jpg'
    }
  },

  france: {
    featuredProducts: [
      {
        id: 'fra-1',
        name: 'French Beret - Authentic Wool',
        description: 'Classic French beret made from premium wool in traditional style',
        price: 45.99,
        category: 'fashion',
        image: '/images/french-beret.jpg',
        tags: ['french', 'traditional', 'wool', 'fashion']
      },
      {
        id: 'fra-2',
        name: 'Provence Lavender Gift Set',
        description: 'Authentic Provence lavender products including soap, oil, and sachets',
        price: 39.99,
        category: 'wellness',
        image: '/images/lavender-set.jpg',
        tags: ['french', 'provence', 'lavender', 'natural']
      },
      {
        id: 'fra-3',
        name: 'French Vintage Wine Glasses',
        description: 'Elegant French crystal wine glasses perfect for wine tasting',
        price: 79.99,
        category: 'home',
        image: '/images/wine-glasses.jpg',
        tags: ['french', 'wine', 'crystal', 'elegant']
      }
    ],
    vacationVendor: {
      name: 'Paris & Provinces Tours',
      description: 'Discover the romance of France from Paris boulevards to countryside vineyards',
      url: 'https://paris-provinces-tours.fr',
      phone: '+33 1 555 0234',
      specialOffers: [
        'Eiffel Tower & Seine River Cruise',
        'Loire Valley Castle Tour',
        'Provence Wine & Lavender Experience',
        'French Riviera Coastal Adventure'
      ],
      rating: 4.7,
      image: '/images/france-eiffel.jpg'
    }
  },

  italy: {
    featuredProducts: [
      {
        id: 'ita-1',
        name: 'Italian Leather Handbag - Florence',
        description: 'Handcrafted Italian leather handbag from Florence artisans',
        price: 189.99,
        category: 'fashion',
        image: '/images/italian-handbag.jpg',
        tags: ['italian', 'leather', 'florence', 'handcrafted']
      },
      {
        id: 'ita-2',
        name: 'Venetian Glass Jewelry Set',
        description: 'Beautiful Murano glass jewelry set from Venice',
        price: 99.99,
        category: 'jewelry',
        image: '/images/murano-jewelry.jpg',
        tags: ['italian', 'venice', 'murano', 'glass']
      },
      {
        id: 'ita-3',
        name: 'Italian Ceramic Dinnerware',
        description: 'Traditional Italian ceramic dinnerware with hand-painted designs',
        price: 149.99,
        category: 'home',
        image: '/images/italian-ceramics.jpg',
        tags: ['italian', 'ceramic', 'traditional', 'handpainted']
      }
    ],
    vacationVendor: {
      name: 'Bella Italia Experiences',
      description: 'Experience authentic Italy from Roman history to Tuscan countryside',
      url: 'https://bella-italia-experiences.it',
      phone: '+39 06 555 0567',
      specialOffers: [
        'Rome Colosseum & Vatican Tour',
        'Tuscany Wine Country Experience',
        'Venice Gondola & Culture Tour',
        'Amalfi Coast Scenic Drive'
      ],
      rating: 4.8,
      image: '/images/italy-colosseum.jpg'
    }
  },

  spain: {
    featuredProducts: [
      {
        id: 'spa-1',
        name: 'Spanish Flamenco Dress',
        description: 'Authentic Spanish flamenco dress with traditional ruffles and patterns',
        price: 159.99,
        category: 'fashion',
        image: '/images/flamenco-dress.jpg',
        tags: ['spanish', 'flamenco', 'traditional', 'dance']
      },
      {
        id: 'spa-2',
        name: 'Toledo Steel Letter Opener',
        description: 'Handcrafted Toledo steel letter opener with traditional designs',
        price: 49.99,
        category: 'collectibles',
        image: '/images/toledo-steel.jpg',
        tags: ['spanish', 'toledo', 'steel', 'handcrafted']
      },
      {
        id: 'spa-3',
        name: 'Spanish Tile Coaster Set',
        description: 'Beautiful Spanish ceramic tile coasters with Moorish patterns',
        price: 29.99,
        category: 'home',
        image: '/images/spanish-tiles.jpg',
        tags: ['spanish', 'ceramic', 'moorish', 'tiles']
      }
    ],
    vacationVendor: {
      name: 'Spanish Splendor Tours',
      description: 'Explore Spain\'s rich culture from flamenco shows to architectural wonders',
      url: 'https://spanish-splendor.es',
      phone: '+34 91 555 0890',
      specialOffers: [
        'Madrid & Barcelona Culture Tour',
        'Andalusia Flamenco Experience',
        'Camino de Santiago Pilgrimage',
        'Costa del Sol Beach Package'
      ],
      rating: 4.6,
      image: '/images/spain-alhambra.jpg'
    }
  },

  netherlands: {
    featuredProducts: [
      {
        id: 'ned-1',
        name: 'Dutch Wooden Clogs - Hand Painted',
        description: 'Traditional Dutch wooden clogs with beautiful hand-painted tulip designs',
        price: 54.99,
        category: 'fashion',
        image: '/images/dutch-clogs.jpg',
        tags: ['dutch', 'wooden', 'traditional', 'tulips']
      },
      {
        id: 'ned-2',
        name: 'Delft Blue Ceramic Vase',
        description: 'Authentic Delft blue ceramic vase with traditional Dutch windmill design',
        price: 89.99,
        category: 'home',
        image: '/images/delft-blue-vase.jpg',
        tags: ['dutch', 'delft', 'ceramic', 'windmill']
      },
      {
        id: 'ned-3',
        name: 'Dutch Cheese Selection Box',
        description: 'Premium selection of authentic Dutch cheeses from local farms',
        price: 69.99,
        category: 'food',
        image: '/images/dutch-cheese.jpg',
        tags: ['dutch', 'cheese', 'authentic', 'premium']
      }
    ],
    vacationVendor: {
      name: 'Holland Heritage Tours',
      description: 'Explore the Netherlands\' canals, windmills, and tulip fields with expert guides',
      url: 'https://holland-heritage.nl',
      phone: '+31 20 555 0321',
      specialOffers: [
        'Amsterdam Canal & Museum Tour',
        'Keukenhof Tulip Garden Experience',
        'Kinderdijk Windmill Village',
        'Dutch Countryside Bike Tour'
      ],
      rating: 4.8,
      image: '/images/dutch-windmills.jpg'
    }
  },
  
  japan: {
    featuredProducts: [
      {
        id: 'jpn-1',
        name: 'Traditional Kimono - Silk',
        description: 'Elegant traditional Japanese silk kimono with floral patterns',
        price: 299.99,
        category: 'fashion',
        image: '/images/silk-kimono.jpg',
        tags: ['japanese', 'traditional', 'silk', 'kimono']
      },
      {
        id: 'jpn-2',
        name: 'Japanese Tea Set - Ceramic',
        description: 'Authentic Japanese ceramic tea set for traditional tea ceremony',
        price: 89.99,
        category: 'home',
        image: '/images/japanese-tea-set.jpg',
        tags: ['japanese', 'tea', 'ceramic', 'traditional']
      },
      {
        id: 'jpn-3',
        name: 'Samurai Katana Replica',
        description: 'High-quality decorative samurai katana replica',
        price: 179.99,
        category: 'collectibles',
        image: '/images/katana-replica.jpg',
        tags: ['japanese', 'samurai', 'collectible', 'replica']
      }
    ],
    vacationVendor: {
      name: 'Japan Cultural Journeys',
      description: 'Immerse yourself in Japanese culture with authentic experiences and guided tours',
      url: 'https://japan-cultural-journeys.com',
      phone: '+81 3 555 0321',
      specialOffers: [
        'Tokyo Culture & Cuisine Tour',
        'Kyoto Temple & Garden Walk',
        'Mount Fuji Scenic Experience',
        'Traditional Ryokan Stay'
      ],
      rating: 4.8,
      image: '/images/japan-temple.jpg'
    }
  },

  india: {
    featuredProducts: [
      {
        id: 'ind-1',
        name: 'Indian Silk Saree - Hand Embroidered',
        description: 'Luxurious hand-embroidered silk saree with traditional patterns',
        price: 149.99,
        category: 'fashion',
        image: '/images/silk-saree.jpg',
        tags: ['indian', 'silk', 'traditional', 'embroidered']
      },
      {
        id: 'ind-2',
        name: 'Brass Yoga Meditation Set',
        description: 'Traditional Indian brass singing bowls and meditation accessories',
        price: 79.99,
        category: 'wellness',
        image: '/images/brass-meditation-set.jpg',
        tags: ['indian', 'yoga', 'meditation', 'brass']
      },
      {
        id: 'ind-3',
        name: 'Rajasthani Handicraft Mirror',
        description: 'Colorful Rajasthani mirror with traditional embroidered frame',
        price: 65.99,
        category: 'home',
        image: '/images/rajasthani-mirror.jpg',
        tags: ['indian', 'rajasthani', 'handicraft', 'mirror']
      }
    ],
    vacationVendor: {
      name: 'Golden Triangle Tours India',
      description: 'Discover the wonders of India with luxury tours covering heritage, culture, and cuisine',
      url: 'https://golden-triangle-india.com',
      phone: '+91 11 555 0654',
      specialOffers: [
        'Taj Mahal Sunrise Tour',
        'Rajasthan Palace Experience',
        'Kerala Backwater Cruise',
        'Goa Beach & Culture Package'
      ],
      rating: 4.6,
      image: '/images/taj-mahal.jpg'
    }
  },

  thailand: {
    featuredProducts: [
      {
        id: 'tha-1',
        name: 'Thai Silk Scarf - Hand Woven',
        description: 'Luxurious hand-woven Thai silk scarf with traditional patterns',
        price: 69.99,
        category: 'fashion',
        image: '/images/thai-silk-scarf.jpg',
        tags: ['thai', 'silk', 'handwoven', 'traditional']
      },
      {
        id: 'tha-2',
        name: 'Buddha Meditation Statue',
        description: 'Peaceful Buddha statue for meditation and spiritual practice',
        price: 89.99,
        category: 'wellness',
        image: '/images/buddha-statue.jpg',
        tags: ['thai', 'buddha', 'meditation', 'spiritual']
      },
      {
        id: 'tha-3',
        name: 'Thai Cooking Spice Set',
        description: 'Authentic Thai cooking spices including lemongrass, galangal, and curry',
        price: 34.99,
        category: 'food',
        image: '/images/thai-spices.jpg',
        tags: ['thai', 'cooking', 'spices', 'authentic']
      }
    ],
    vacationVendor: {
      name: 'Thailand Adventure Co.',
      description: 'Discover the Land of Smiles with temple tours, island hopping, and cultural experiences',
      url: 'https://thailand-adventure.co.th',
      phone: '+66 2 555 0432',
      specialOffers: [
        'Bangkok Temple & Market Tour',
        'Phuket Island Paradise Package',
        'Chiang Mai Elephant Sanctuary',
        'Thai Cooking Class Experience'
      ],
      rating: 4.7,
      image: '/images/thailand-temple.jpg'
    }
  },

  southkorea: {
    featuredProducts: [
      {
        id: 'kor-1',
        name: 'Korean Hanbok - Traditional Dress',
        description: 'Beautiful traditional Korean hanbok with vibrant colors and elegant design',
        price: 199.99,
        category: 'fashion',
        image: '/images/korean-hanbok.jpg',
        tags: ['korean', 'hanbok', 'traditional', 'elegant']
      },
      {
        id: 'kor-2',
        name: 'Korean Skincare Gift Set',
        description: 'Premium K-beauty skincare set with ginseng and snail mucin',
        price: 79.99,
        category: 'beauty',
        image: '/images/korean-skincare.jpg',
        tags: ['korean', 'kbeauty', 'skincare', 'ginseng']
      },
      {
        id: 'kor-3',
        name: 'Korean Tea Ceremony Set',
        description: 'Traditional Korean tea ceremony set with ceramic teapot and cups',
        price: 129.99,
        category: 'home',
        image: '/images/korean-tea-set.jpg',
        tags: ['korean', 'tea', 'ceremony', 'traditional']
      }
    ],
    vacationVendor: {
      name: 'Korea Cultural Discovery',
      description: 'Experience modern Korea and ancient traditions from Seoul to Jeju Island',
      url: 'https://korea-discovery.kr',
      phone: '+82 2 555 0765',
      specialOffers: [
        'Seoul City & K-Pop Experience',
        'Jeju Island Nature Tour',
        'DMZ Historical Tour',
        'Korean Temple Stay Program'
      ],
      rating: 4.5,
      image: '/images/seoul-skyline.jpg'
    }
  }
};

// Get country-specific featured products
const getCountryFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { country } = req.params;
    
    if (!country) {
      return next(new AppError('Country parameter is required', 400));
    }
    
    const countryData = countryFeatures[country.toLowerCase() as keyof typeof countryFeatures];
    
    if (!countryData) {
      return res.status(200).json({
        success: true,
        data: [],
        message: `No featured products available for ${country}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: countryData.featuredProducts,
      country: country.toLowerCase(),
      count: countryData.featuredProducts.length
    });
  } catch (error) {
    next(new AppError('Failed to get country featured products', 500));
  }
};

// Get country-specific vacation vendor
const getCountryVacationVendor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { country } = req.params;
    
    if (!country) {
      return next(new AppError('Country parameter is required', 400));
    }
    
    const countryData = countryFeatures[country.toLowerCase() as keyof typeof countryFeatures];
    
    if (!countryData || !countryData.vacationVendor) {
      return res.status(200).json({
        success: true,
        data: null,
        message: `No vacation vendor available for ${country}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: countryData.vacationVendor,
      country: country.toLowerCase()
    });
  } catch (error) {
    next(new AppError('Failed to get country vacation vendor', 500));
  }
};

// Get all available countries with features
const getAvailableCountries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const availableCountries = Object.keys(countryFeatures).map(country => ({
      code: country,
      name: country.charAt(0).toUpperCase() + country.slice(1),
      hasProducts: countryFeatures[country as keyof typeof countryFeatures].featuredProducts.length > 0,
      hasVacationVendor: !!countryFeatures[country as keyof typeof countryFeatures].vacationVendor
    }));
    
    res.status(200).json({
      success: true,
      data: availableCountries,
      count: availableCountries.length
    });
  } catch (error) {
    next(new AppError('Failed to get available countries', 500));
  }
};

export default {
  getCountryFeaturedProducts,
  getCountryVacationVendor,
  getAvailableCountries
};