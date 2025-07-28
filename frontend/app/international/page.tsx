import { Metadata } from 'next';
import Link from 'next/link';
import { 
  GlobeAmericasIcon, 
  MapPinIcon, 
  ShoppingBagIcon,
  TruckIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'International Shopping | Whitestart Security',
  description: 'Shop security products from USA, Canada, UK, and Scotland with international shipping options.',
};

// Country data with regions and features
const countries = [
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    regions: ['East Coast', 'West Coast', 'Midwest', 'South'],
    currency: 'USD',
    shippingTime: '1-3 business days',
    featuredVendors: 12,
    productCount: 1245,
    color: 'blue',
    description: 'Leading security technology from American manufacturers with fast domestic shipping and comprehensive support.',
    features: [
      'Next-day delivery in most states',
      'US-based technical support',
      'Military-grade encryption standards',
      'Compliant with US security regulations'
    ]
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    regions: ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
    currency: 'CAD',
    shippingTime: '1-5 business days',
    featuredVendors: 8,
    productCount: 876,
    color: 'red',
    description: 'Canadian security solutions designed for extreme weather conditions with bilingual support and nationwide coverage.',
    features: [
      'Weather-resistant equipment',
      'Bilingual (English/French) support',
      'Cross-border warranty service',
      'Compatible with Canadian networks'
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    regions: ['England', 'Wales', 'Northern Ireland'],
    currency: 'GBP',
    shippingTime: '2-4 business days',
    featuredVendors: 10,
    productCount: 932,
    color: 'indigo',
    description: 'British security systems with advanced CCTV technology and compliance with UK privacy and security standards.',
    features: [
      'GDPR-compliant systems',
      'Integration with UK police networks',
      'BSI certified equipment',
      'UK-based installation services'
    ]
  },
  {
    id: 'scotland',
    name: 'Scotland',
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    regions: ['Highlands', 'Lowlands', 'Central Belt', 'Islands'],
    currency: 'GBP',
    shippingTime: '2-5 business days',
    featuredVendors: 6,
    productCount: 487,
    color: 'cyan',
    description: 'Scottish security solutions designed for remote locations and harsh weather with local technical support.',
    features: [
      'Remote monitoring for rural areas',
      'Weather-resistant outdoor systems',
      'Scottish-based technical teams',
      'Renewable energy compatible systems'
    ]
  }
];

export default function InternationalPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <GlobeAmericasIcon className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              International Security Solutions
            </h1>
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100 text-center">
            Shop security products from trusted vendors across USA, Canada, UK, and Scotland with international shipping and local support.
          </p>
          
          {/* Quick country navigation */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {countries.map(country => (
              <Link 
                key={country.id}
                href={`/international/${country.id}`}
                className="flex items-center px-5 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
              >
                <span className="mr-2 text-xl">{country.flag}</span>
                {country.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* International shipping benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Global Security Solutions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <TruckIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">International Shipping</h3>
              <p className="text-gray-600">Fast and secure shipping to over 120 countries with real-time tracking and delivery updates.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                <BuildingLibraryIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Compliance</h3>
              <p className="text-gray-600">All products meet local security regulations and standards for each country and region.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4">
                <CurrencyDollarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Currency</h3>
              <p className="text-gray-600">Shop in your local currency with transparent pricing and no hidden conversion fees.</p>
            </div>
          </div>
        </div>
        
        {/* Country sections */}
        <div className="space-y-16">
          {countries.map(country => (
            <section key={country.id} id={country.id} className="scroll-mt-20">
              <div className={`bg-${country.color}-50 rounded-xl overflow-hidden shadow-sm`}>
                <div className={`bg-${country.color}-600 py-6 px-8 flex items-center`}>
                  <span className="text-4xl mr-4">{country.flag}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{country.name}</h2>
                    <p className="text-sm text-white/80">{country.productCount} products from {country.featuredVendors} vendors</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-700 mb-6">{country.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <MapPinIcon className="w-5 h-5 mr-2 text-gray-500" />
                        Regions
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {country.regions.map(region => (
                          <span key={region} className="px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-700">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <ShoppingBagIcon className="w-5 h-5 mr-2 text-gray-500" />
                        Shopping Details
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                          <span className="w-24 text-gray-500">Currency:</span>
                          <span className="font-medium">{country.currency}</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-24 text-gray-500">Shipping:</span>
                          <span className="font-medium">{country.shippingTime}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {country.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex justify-center mt-6">
                    <Link 
                      href={`/international/${country.id}`}
                      className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-${country.color}-600 hover:bg-${country.color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${country.color}-500`}
                    >
                      Shop {country.name} Products
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
        
        {/* Global shipping information */}
        <div className="mt-20 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">International Shipping Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Shipping Policies</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Secure packaging with tamper-evident seals</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Real-time tracking with SMS and email updates</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Insurance included on all international shipments</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Customs documentation handled by our team</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Returns & Support</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>30-day international return policy</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>24/7 multilingual customer support</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Local technical support in each country</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>International warranty on all products</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}