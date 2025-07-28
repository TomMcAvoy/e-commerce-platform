import { Metadata } from 'next';
import { getCategories } from '../../lib/api';
import { CategoryCard } from '../../components/CategoryCard';
import { Navigation } from '../../components/navigation/Navigation';
import { ICategory } from '../../types';

export const metadata: Metadata = {
  title: 'All Categories | Whitestart System Security',
  description: 'Browse all product categories available on our platform.',
};

/**
 * Categories Listing Page - A Server Component for optimal performance.
 * Fetches and displays all available product categories.
 */
export default async function CategoriesPage() {
  const categories: ICategory[] = await getCategories();

  return (
    <div className="bg-white">
      <Navigation />
      <main>
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">All Categories</h1>
          <p className="mt-4 text-base text-gray-500">Browse our wide selection of product categories.</p>
        </div>

        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-gray-500">No categories are currently available.</p>
          )}
        </div>
      </main>
    </div>
  );
}
