import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '../../../lib/api';
import { ProductCard } from '../../../components/products/ProductCard';
import { CategoryHero } from '../../../components/categories/CategoryHero';
import { CategoryFilters } from '../../../components/categories/CategoryFilters';
import { ICategory, IProduct } from '../../../types';

// This interface represents the comprehensive data needed for the page
interface CategoryPageData {
  category: ICategory;
  products: IProduct[];
  brands: { _id: string; name:string }[];
  priceRange: { min: number; max: number };
}

// Fetch all necessary data for the category page in one go
async function getCategoryPageData(slug: string, searchParams: { [key: string]: string | string[] | undefined }): Promise<CategoryPageData | null> {
  try {
    const query = new URLSearchParams(searchParams as Record<string, string>).toString();
    const response = await apiClient.publicRequest(`/categories/slug/${slug}/page-data?${query}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch page data for category ${slug}:`, error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // A simpler fetch just for metadata to keep it fast
  const response = await apiClient.publicRequest(`/categories/slug/${params.slug}`).catch(() => null);
  const category = response?.data;
  if (!category) {
    return { title: 'Category Not Found' };
  }
  return {
    title: `${category.name} | Whitestart`,
    description: category.description || `Shop for products in the ${category.name} category.`,
  };
}

// The Page Component
export default async function CategoryPage({ params, searchParams }: { params: { slug: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const data = await getCategoryPageData(params.slug, searchParams);

  if (!data) {
    notFound();
  }

  const { category, products, brands, priceRange } = data;

  return (
    <div className="bg-white">
      <CategoryHero category={category} productCount={products.length} />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-12 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">{category.name} Products</h1>
          {/* TODO: Add sorting dropdown here */}
        </div>

        <section className="pt-6 pb-24">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <div className="hidden lg:block">
              <CategoryFilters 
                brands={brands} 
                minPrice={priceRange.min} 
                maxPrice={priceRange.max} 
              />
            </div>

            {/* Product grid */}
            <div className="lg:col-span-3">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-2xl font-semibold text-gray-900">No Products Found</h3>
                  <p className="mt-2 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

