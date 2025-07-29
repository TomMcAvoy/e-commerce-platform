'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';
import Sidebar from '@/components/layout/Sidebar';
import { IProduct } from '@/types';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.publicRequest(`/products?category=${slug}`);
        setProducts(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProducts();
    }
  }, [slug]);

  const categoryName = slug?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Category';

  if (loading) {
    return (
      <div className="flex max-w-7xl mx-auto">
        <div className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 h-64 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    );
  }

  return (
    <div className="flex max-w-7xl mx-auto">
      <div className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{categoryName}</h1>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-8">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
      <Sidebar />
    </div>
  );
}