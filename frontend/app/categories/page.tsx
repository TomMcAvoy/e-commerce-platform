import { getCategories } from '@/lib/api';
import { CategoryCard } from '@/components/CategoryCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security Equipment Categories - Whitestart System Security',
  description: 'Browse our comprehensive range of security equipment categories including CCTV, access control, alarms, and surveillance systems.',
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Security Equipment Categories
          </h1>
          <p className="text-lg text-gray-600">
            Browse our comprehensive range of professional security solutions
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-8">
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Categories Found
            </h3>
            <p className="text-gray-600">
              Categories are being updated. Please check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
