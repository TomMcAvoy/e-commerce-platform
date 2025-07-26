import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProducts } from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';
import { getCategoryIcon } from '@/lib/icons';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PaginationControls } from '@/components/navigation/Pagination';
import type { Metadata } from 'next';

type CategoryPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug).catch(() => null);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} | Categories`,
    description: category.description || `Browse all products in the ${category.name} category.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = params;
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 20;

  const category = await getCategoryBySlug(slug).catch(e => {
    console.error(`Failed to fetch category ${slug}:`, e);
    return null;
  });

  if (!category) {
    notFound();
  }

  const { products, totalPages, totalProducts } = await getProducts({ 
    category: category._id, 
    page, 
    limit 
  }).catch(e => {
    console.error(`Failed to fetch products for category ${category.name}:`, e);
    return { products: [], totalPages: 0, totalProducts: 0 };
  });

  const IconComponent = getCategoryIcon(category.slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Categories', href: '/categories' },
          { label: category.name, href: `/categories/${category.slug}`, active: true },
        ]}
      />
      <header className="my-8 border-b pb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <IconComponent className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">{category.name}</h1>
            <p className="text-lg text-gray-600 mt-1">{category.description}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">{totalProducts} products found</p>
      </header>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="mt-12">
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No Products Found</h2>
          <p className="text-gray-500 mt-2">There are currently no products available in this category.</p>
        </div>
      )}
    </div>
  );
}

