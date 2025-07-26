import { Metadata } from 'next';
import { notFound } from 'next/navigation';

/**
 * Dynamic Category Page following Frontend Structure from Copilot Instructions
 * Server-side rendering with database-driven content generation
 */

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    vendor?: string;
  };
}

// Server component for category data fetching
async function getCategory(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/categories/${slug}`,
      {
        cache: 'revalidate',
        next: { revalidate: 300 } // 5 minutes following Performance patterns
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getCategoryProducts(slug: string, searchParams: any) {
  try {
    const queryParams = new URLSearchParams({
      page: searchParams.page || '1',
      sort: searchParams.sort || 'createdAt',
      ...(searchParams.minPrice && { minPrice: searchParams.minPrice }),
      ...(searchParams.maxPrice && { maxPrice: searchParams.maxPrice }),
      ...(searchParams.inStock && { inStock: searchParams.inStock }),
      ...(searchParams.vendor && { vendor: searchParams.vendor })
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/categories/${slug}/products?${queryParams}`,
      {
        cache: 'revalidate',
        next: { revalidate: 60 } // 1 minute for products
      }
    );

    if (!response.ok) {
      return { data: [], pagination: {} };
    }

    const result = await response.json();
    return { data: result.data, pagination: result.pagination };
  } catch (error) {
    console.error('Error fetching category products:', error);
    return { data: [], pagination: {} };
  }
}

// Generate metadata following SEO patterns
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }

  return {
    title: category.seo?.title || `${category.name} | Your Store`,
    description: category.seo?.description || category.description,
    keywords: category.seo?.keywords,
    openGraph: {
      title: category.name,
      description: category.description,
      images: category.image ? [category.image] : []
    }
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategory(params.slug);
  
  if (!category) {
    notFound();
  }

  const { data: products, pagination } = await getCategoryProducts(params.slug, searchParams);

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: category.colorScheme.background }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Category Header with color theming */}
        <div 
          className="mb-8 p-8 rounded-lg"
          style={{ 
            background: category.colorScheme.gradient,
            color: category.colorScheme.background
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {category.name}
              </h1>
              <p className="text-lg opacity-90 mb-4">
                {category.description}
              </p>
              <div className="text-sm opacity-80">
                {category.productCount || 0} products available
              </div>
            </div>
            {category.image && (
              <div className="hidden md:block">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-32 h-32 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Subcategories with color theming */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 
              className="text-xl font-semibold mb-4"
              style={{ color: category.colorScheme.primary }}
            >
              Shop by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((subcategory: any) => (
                <button
                  key={subcategory.slug || subcategory}
                  className="px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: category.colorScheme.secondary,
                    color: category.colorScheme.background
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = category.colorScheme.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = category.colorScheme.secondary;
                  }}
                >
                  {subcategory.name || subcategory}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 
              className="text-xl font-semibold"
              style={{ color: category.colorScheme.primary }}
            >
              Products
            </h2>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2"
              defaultValue={searchParams.sort || 'createdAt'}
            >
              <option value="createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <h3 
                className="text-lg font-medium mb-2"
                style={{ color: category.colorScheme.text }}
              >
                No products found
              </h3>
              <p 
                className="opacity-70"
                style={{ color: category.colorScheme.text }}
              >
                Check back later for new products in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <div 
                  key={product._id} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={product.image || '/images/products/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                      </span>
                      {product.stock > 0 ? (
                        <span className="text-green-600 text-sm">In Stock</span>
                      ) : (
                        <span className="text-red-600 text-sm">Out of Stock</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>⭐ {product.rating || 'No rating'}</span>
                      <span>by {product.vendor?.name || 'Unknown'}</span>
                    </div>
                    <button 
                      className="w-full py-2 px-4 rounded-md font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                      style={{
                        backgroundColor: product.stock > 0 ? category.colorScheme.primary : '#gray',
                        color: category.colorScheme.background
                      }}
                      disabled={product.stock === 0}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination with color theming */}
        {pagination.pages && pagination.pages > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  className="px-3 py-2 rounded-md font-medium transition-colors"
                  style={{
                    backgroundColor: pageNum === pagination.page ? category.colorScheme.primary : 'transparent',
                    color: pageNum === pagination.page ? category.colorScheme.background : category.colorScheme.primary,
                    border: `1px solid ${category.colorScheme.primary}`
                  }}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
