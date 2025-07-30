'use client';

import { useState, useEffect } from 'react';
import { getCountryFeaturedProducts, getCountryVacationVendor } from '@/lib/api';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
}

interface VacationVendor {
  name: string;
  description: string;
  url: string;
  phone: string;
  specialOffers: string[];
  rating: number;
  image: string;
}

export default function CountrySpotlight() {
  const [spotlightCountry, setSpotlightCountry] = useState('scotland');
  const [products, setProducts] = useState<Product[]>([]);
  const [vacationVendor, setVacationVendor] = useState<VacationVendor | null>(null);
  const [loading, setLoading] = useState(true);

  const countries = [
    { code: 'scotland', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', description: 'Highland traditions' },
    { code: 'ireland', name: 'Ireland', flag: '🇮🇪', description: 'Celtic heritage' },
    { code: 'germany', name: 'Germany', flag: '🇩🇪', description: 'Bavarian culture' },
    { code: 'france', name: 'France', flag: '🇫🇷', description: 'Romantic elegance' },
    { code: 'italy', name: 'Italy', flag: '🇮🇹', description: 'Artistic heritage' },
    { code: 'spain', name: 'Spain', flag: '🇪🇸', description: 'Flamenco passion' },
    { code: 'netherlands', name: 'Netherlands', flag: '🇳🇱', description: 'Tulip traditions' },
    { code: 'japan', name: 'Japan', flag: '🇯🇵', description: 'Traditional arts' },
    { code: 'southkorea', name: 'South Korea', flag: '🇰🇷', description: 'K-culture' },
    { code: 'thailand', name: 'Thailand', flag: '🇹🇭', description: 'Land of smiles' },
    { code: 'india', name: 'India', flag: '🇮🇳', description: 'Rich traditions' }
  ];

  useEffect(() => {
    const fetchCountryData = async () => {
      setLoading(true);
      try {
        const [productsData, vendorData] = await Promise.all([
          getCountryFeaturedProducts(spotlightCountry),
          getCountryVacationVendor(spotlightCountry)
        ]);
        setProducts(productsData.slice(0, 3)); // Show first 3 products
        setVacationVendor(vendorData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [spotlightCountry]);

  const currentCountry = countries.find(c => c.code === spotlightCountry);

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Country Spotlight: {currentCountry?.name} {currentCountry?.flag}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Discover authentic products and travel experiences from around the world
          </p>
          
          {/* Country Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-4xl mx-auto">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => setSpotlightCountry(country.code)}
                className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  spotlightCountry === country.code
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:shadow-md'
                }`}
                title={country.description}
              >
                <span className="mr-1">{country.flag}</span>
                <span className="hidden sm:inline">{country.name}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading {currentCountry?.name} features...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Featured Products */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="text-2xl mr-2">🛍️</span>
                Featured {currentCountry?.name} Products
              </h3>
              
              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🎯</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-lg font-bold text-blue-600">${product.price}</span>
                            <div className="flex space-x-1">
                              {product.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Link href={`/products?country=${spotlightCountry}`} className="block">
                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors">
                      Shop All {currentCountry?.name} Products
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No featured products available for {currentCountry?.name}</p>
                </div>
              )}
            </div>

            {/* Vacation Vendor */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="text-2xl mr-2">✈️</span>
                Visit {currentCountry?.name}
              </h3>
              
              {vacationVendor ? (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold text-gray-900">{vacationVendor.name}</h4>
                    <div className="flex items-center mt-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(vacationVendor.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">({vacationVendor.rating}/5)</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{vacationVendor.description}</p>
                  
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Special Offers:</h5>
                    <ul className="space-y-1">
                      {vacationVendor.specialOffers.map((offer, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="mr-2">•</span>
                          {offer}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <a
                      href={vacationVendor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium text-center transition-colors"
                    >
                      Book Your {currentCountry?.name} Adventure
                    </a>
                    <p className="text-sm text-gray-500 text-center">
                      📞 {vacationVendor.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No vacation packages available for {currentCountry?.name}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}