'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryHero } from '@/components/categories/CategoryHero';
import { CategoryBreadcrumb } from '@/components/categories/CategoryBreadcrumb';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/ui/Pagination';

interface CategoryPageClientProps {
  category: any;
  products: any[];
  pagination: any;
  searchParams: any;
}

export function CategoryPageClient({ 
  category, 
  products: initialProducts, 
  pagination: initialPagination,
  searchParams 
}: CategoryPageClientProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    params.delete('page'); // Reset to page 1 when filtering
    
    router.push(`/categories/${category.slug}?${params.toString()}`);
  };

  const handleSortChange = (sortValue: string) => {
    updateFilters('sort', sortValue);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <CategoryBreadcrumb category={category} />
      <CategoryHero category={category} productCount={initialPagination.total} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-gray-800 rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
              
              {/* Sort Options */}
              <div>
                <h4 className="text-md font-medium text-gray-300 mb-3">Sort By</h4>
                <select 
                  value={searchParams.sort || 'default'} 
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                  <option value="featured">Featured</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => router.push(`/categories/${category.slug}`)}
                className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <section className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <div className="text-gray-400 text-sm">
                {initialPagination.total} products found
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                    <div className="w-full h-48 bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid 
                products={initialProducts}
                category={category}
              />
            )}
            
            {initialPagination.totalPages > 1 && (
              <Pagination 
                currentPage={initialPagination.currentPage}
                totalPages={initialPagination.totalPages}
                baseUrl={`/categories/${category.slug}`}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}