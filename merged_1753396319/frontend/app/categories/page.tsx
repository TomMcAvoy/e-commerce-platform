import { Metadata } from 'next';
import CategoryCard from '../../components/CategoryCard';
import { ICategory } from '../../types/category';

/**
 * Categories Grid Page following Frontend Structure from Copilot Instructions
 * Server component for SEO-optimized category browsing
 */

export const metadata: Metadata = {
  title: 'Shop by Category | Multi-Vendor Marketplace',
  description: 'Browse all product categories in our multi-vendor marketplace',
};

async function getCategories(): Promise<ICategory[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/categories`,
      {
        cache: 'revalidate',
        next: { revalidate: 300 } // 5 minutes following Database Patterns
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover thousands of products from verified vendors across all categories
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories available
          </h3>
          <p className="text-gray-500">
            Categories will appear here once they're added to the system.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              className="h-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
