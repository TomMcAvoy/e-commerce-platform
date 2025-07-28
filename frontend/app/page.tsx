import Link from 'next/link';
import { getCategories, getFeaturedProducts, getFeaturedVendors } from '@/lib/api';
import { getCategoryIcon } from '@/lib/icons';
import { ProductCard } from '@/components/products/ProductCard';
import { VendorCard } from '@/components/vendors/VendorCard';
import { HeroSection } from '@/components/layout/HeroSection';
import { Button } from '@/components/ui/Button';
import { ICategory, IProduct, IVendor } from '@/types';

/**
 * Homepage Component following Frontend Structure patterns.
 * Uses Server Components for data fetching and renders child components.
 * Includes robust error handling for data fetching.
 */
export default async function HomePage() {
  let categories: ICategory[] = [];
  let featuredProducts: IProduct[] = [];
  let featuredVendors: IVendor[] = [];
  let error: string | null = null;

  try {
    // Fetch all data concurrently for performance
    const [categoriesData, productsData, vendorsData] = await Promise.all([
      getCategories({ limit: 8 }),
      getFeaturedProducts({ limit: 4 }),
      getFeaturedVendors({ limit: 6 })
    ]);
    categories = categoriesData;
    featuredProducts = productsData;
    featuredVendors = vendorsData;
  } catch (e: any) {
    // FIX: Catch errors during data fetching to prevent the page from crashing.
    // This ensures the header and footer will always be displayed.
    console.error('Failed to fetch homepage data:', e.message);
    error = 'Could not connect to the server. Please ensure the backend is running and try again.';
  }

  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        {error ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-red-600">Data Fetching Error</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <p className="mt-4 text-sm text-gray-500">
              You can start the backend server by running `npm run dev:server` in your terminal.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            <section id="categories" className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.slug);
                  return (
                    <Link key={category._id} href={`/categories/${category.slug}`} className="group block text-center p-4 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                      <IconComponent className="w-12 h-12 mx-auto mb-2 text-blue-600 group-hover:text-white transition-colors" />
                      <span className="font-semibold text-sm">{category.name}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
            <section id="featured-products" className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
              <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild size="lg">
                  <Link href="/products">View All Products</Link>
                </Button>
              </div>
            </section>
            <section id="featured-vendors">
              <h2 className="text-3xl font-bold text-center mb-8">Trusted Vendors</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredVendors.map((vendor) => (
                  <VendorCard key={vendor._id} vendor={vendor} />
                ))}
              </div>
               <div className="text-center mt-8">
                <Button asChild size="lg" variant="outline">
                  <Link href="/vendors">Meet All Vendors</Link>
                </Button>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
}