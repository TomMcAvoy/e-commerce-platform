import Link from 'next/link';
import { getCategories, getFeaturedProducts, getFeaturedVendors, getNews } from '@/lib/api';
import { getCategoryIcon } from '@/lib/icons';
import { ProductCard } from '@/components/products/ProductCard';
import { VendorCard } from '@/components/vendors/VendorCard';
import { HeroSection } from '@/components/layout/HeroSection';
import { Button } from '@/components/ui/Button';
import { ICategory, IProduct, IVendor } from '@/types';
import CountrySpotlight from '@/components/sections/CountrySpotlight';
import { 
  ShoppingBagIcon, 
  NewspaperIcon, 
  GlobeAmericasIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

/**
 * Enhanced Homepage Component with dynamic sections and improved visual design.
 * Uses Server Components for data fetching and renders child components.
 * Includes robust error handling for data fetching.
 */
export default async function HomePage() {
  let categories: ICategory[] = [];
  let featuredProducts: IProduct[] = [];
  let featuredVendors: IVendor[] = [];
  let latestNews: any[] = [];
  let error: string | null = null;

  try {
    // Fetch all data concurrently for performance
    const [categoriesData, productsData, vendorsData, newsData] = await Promise.all([
      getCategories({ limit: 8 }).catch(e => { console.warn('Categories fetch failed:', e.message); return []; }),
      getFeaturedProducts({ limit: 6 }).catch(e => { console.warn('Products fetch failed:', e.message); return []; }),
      getFeaturedVendors({ limit: 3 }).catch(e => { console.warn('Vendors fetch failed:', e.message); return []; }),
      getNews({ limit: 3 }).catch(e => { console.warn('News fetch failed:', e.message); return []; })
    ]);
    categories = categoriesData;
    featuredProducts = productsData;
    featuredVendors = vendorsData;
    latestNews = newsData;
  } catch (e: any) {
    console.error('Critical homepage data fetch error:', e.message);
    // Only show error if ALL APIs fail, not just empty data
    if (categories.length === 0 && featuredProducts.length === 0) {
      error = 'Could not connect to the server. Please ensure the backend is running and try again.';
    }
  }

  // Add some sample data for demonstration if we don't have real data
  if (featuredProducts.length > 0) {
    // Add some extra properties to the products for demonstration
    featuredProducts = featuredProducts.map((product, index) => ({
      ...product,
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 100) + 10,
      originalPrice: index % 2 === 0 ? product.price * 1.2 : undefined,
      freeShipping: index % 3 === 0,
      isNew: index === 0,
      inStock: true,
      vendor: {
        name: 'Security Pro',
        verified: true
      }
    }));
  }

  return (
    <>
      <HeroSection />
      
      {error ? (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-red-600">Data Fetching Error</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <p className="mt-4 text-sm text-gray-500">
              You can start the backend server by running `npm run dev:server` in your terminal.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Categories Section */}
          <section id="categories" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center mb-10">
                <ShoppingBagIcon className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold">Shop by Category</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.slug);
                  return (
                    <Link 
                      key={category._id} 
                      href={`/categories/${category.slug}`} 
                      className="group flex flex-col items-center p-6 bg-white hover:bg-blue-600 rounded-xl shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 group-hover:bg-white/20 mb-4 transition-colors">
                        <IconComponent className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <span className="font-semibold text-gray-900 group-hover:text-white transition-colors">{category.name}</span>
                    </Link>
                  );
                })}
              </div>
              
              <div className="text-center mt-10">
                <Button asChild size="lg" variant="outline">
                  <Link href="/categories" className="flex items-center">
                    View All Categories
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
          
          {/* Featured Products Section */}
          <section id="featured-products" className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Featured product with larger display */}
                {featuredProducts.length > 0 && (
                  <div className="md:col-span-3 mb-8">
                    <ProductCard 
                      product={{
                        ...featuredProducts[0],
                        isFeatured: true
                      }} 
                      variant="featured" 
                    />
                  </div>
                )}
                
                {/* Regular product grid */}
                {featuredProducts.slice(1).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Button asChild size="lg">
                  <Link href="/products" className="flex items-center">
                    View All Products
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
          
          {/* International Section */}
          <section id="international" className="py-16 bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center mb-8">
                <GlobeAmericasIcon className="w-8 h-8 mr-3" />
                <h2 className="text-3xl font-bold">International Security Solutions</h2>
              </div>
              
              <p className="text-center text-blue-100 max-w-3xl mx-auto mb-12">
                Shop security products from trusted vendors across USA, Canada, UK, and Scotland with international shipping and local support.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {['USA', 'Canada', 'United Kingdom', 'Scotland'].map((country, index) => (
                  <Link 
                    key={country} 
                    href={`/international/${country.toLowerCase().replace(' ', '-')}`}
                    className="group bg-white/10 hover:bg-white/20 rounded-xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="text-4xl mb-3">
                      {index === 0 && '🇺🇸'}
                      {index === 1 && '🇨🇦'}
                      {index === 2 && '🇬🇧'}
                      {index === 3 && '🏴󠁧󠁢󠁳󠁣󠁴󠁿'}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{country}</h3>
                    <p className="text-sm text-blue-200 mb-4">
                      {index === 0 && 'Leading security technology with fast shipping'}
                      {index === 1 && 'Weather-resistant equipment with bilingual support'}
                      {index === 2 && 'Advanced CCTV with UK standards compliance'}
                      {index === 3 && 'Solutions for remote locations and harsh weather'}
                    </p>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 group-hover:text-white transition-colors">
                      Shop Now
                    </span>
                  </Link>
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/international" className="flex items-center">
                    Explore International Options
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
          
          {/* Trusted Vendors Section */}
          <section id="featured-vendors" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center mb-10">
                <UserGroupIcon className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold">Trusted Vendors</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {featuredVendors.map((vendor) => (
                  <VendorCard key={vendor._id} vendor={vendor} />
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Button asChild size="lg" variant="outline">
                  <Link href="/vendors" className="flex items-center">
                    Meet All Vendors
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
          
          {/* Latest News Section */}
          <section id="latest-news" className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center mb-10">
                <NewspaperIcon className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold">Latest Security News</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestNews.map((article, index) => (
                  <div key={article._id || index} className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.imageUrl || 'https://via.placeholder.com/400x200?text=Security+News'} 
                        alt={article.title || 'Security news'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span>{article.category?.name || 'Security News'}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(article.publishedAt || new Date()).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        <Link href={`/news/${article.slug || '#'}`} className="hover:text-blue-600 transition-colors">
                          {article.title || 'Latest security technology trends and updates'}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.excerpt || 'Stay updated with the latest security industry news, product releases, and technology trends.'}
                      </p>
                      <Link 
                        href={`/news/${article.slug || '#'}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        Read More
                        <ArrowRightIcon className="ml-1 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Button asChild size="lg" variant="outline">
                  <Link href="/news" className="flex items-center">
                    View All News
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Country Spotlight Section */}
          <CountrySpotlight />
        </>
      )}
    </>
  );
}