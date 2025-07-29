'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';
import Sidebar from '@/components/layout/Sidebar';
import { IProduct } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useSearchParams } from 'next/navigation';

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const searchParams = useSearchParams();
  const limit = 12;

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (selectedCategory) params.append('category', selectedCategory);
        
        const response = await api.publicRequest(`/products?${params.toString()}`);
        setProducts(response.data || []);
        setTotalProducts(response.count || 0);
        setError(null);
      } catch (err: any) {
        console.error('Products page error:', err);
        setError(err.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategory]);

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="bg-white flex max-w-7xl mx-auto">
      <div className="flex-1 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products` : 'All Products'}
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Browse our collection of high-quality products from trusted vendors.
        </p>
        
        <div className="mt-8 flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              !selectedCategory 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Products
          </button>
          {['fashion', 'electronics', 'home', 'sports', 'beauty', 'security'].map((category) => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-12 text-center">
            <p className="text-gray-500">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="mt-12 rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
           <div className="mt-12 text-center">
             <h2 className="text-xl font-semibold text-gray-900">No Products Found</h2>
             <p className="mt-2 text-gray-500">Please check back later or try a different category.</p>
           </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
            </div>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
      <Sidebar />
    </div>
  );
}