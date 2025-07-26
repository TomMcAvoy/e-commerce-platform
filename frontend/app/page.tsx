
import Link from 'next/link';
import { getCategories, getFeaturedProducts, getFeaturedVendors } from '@/lib/api';
import { getCategoryIcon } from '@/lib/icons';
import { ProductCard } from '@/components/products/ProductCard';
import { VendorCard } from '@/components/vendors/VendorCard';
import { HeroSection } from '@/components/layout/HeroSection';
import { Button } from '@/components/ui/button';

export const revalidate = 600; // Revalidate data every 10 minutes

export default async function HomePage() {
  const [categoriesData, productsData, vendorsData] = await Promise.all([
    getCategories({ limit: 8 }).catch(e => { console.error("Category fetch failed:", e); return []; }),
    getFeaturedProducts({ limit: 4 }).catch(e => { console.error("Product fetch failed:", e); return []; }),
    getFeaturedVendors({ limit: 6 }).catch(e => { console.error("Vendor fetch failed:", e); return []; })
  ]);

  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const featuredProducts = Array.isArray(productsData) ? productsData : [];
  const featuredVendors = Array.isArray(vendorsData) ? vendorsData : [];

  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button aschild="true" size="lg">
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
            <Button aschild="true" size="lg" variant="outline">
              <Link href="/vendors">Meet All Vendors</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}