import { api } from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';
import { IProduct } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface ProductsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || '1', 10);
  const limit = parseInt(searchParams.limit || '12', 10);
  const query = `page=${page}&limit=${limit}`;

  let products: IProduct[] = [];
  let totalProducts = 0;
  let error: string | null = null;

  try {
    const response = await api.getProducts(query);
    products = response.data;
    totalProducts = response.count;
  } catch (err: any) {
    error = err.message || 'Failed to load products.';
  }

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">All Products</h1>
        <p className="mt-4 text-xl text-gray-500">
          Browse our collection of high-quality products from trusted vendors.
        </p>

        {error && (
          <div className="mt-12 rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {!error && products.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!error && products.length === 0 && (
           <div className="mt-12 text-center">
             <h2 className="text-xl font-semibold text-gray-900">No Products Found</h2>
             <p className="mt-2 text-gray-500">Please check back later or try a different category.</p>
           </div>
        )}

        {/* Pagination Controls */}
        {!error && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
            <Button asChild variant="outline" disabled={page <= 1}>
              <Link href={`/products?page=${page - 1}&limit=${limit}`}>Previous</Link>
            </Button>
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
            </div>
            <Button asChild variant="outline" disabled={page >= totalPages}>
              <Link href={`/products?page=${page + 1}&limit=${limit}`}>Next</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}