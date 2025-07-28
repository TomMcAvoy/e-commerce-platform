import { apiClient } from '../../../lib/api';
import Image from 'next/image';
import ProductImages from '../../../components/products/ProductImages';
import AddToCartButton from '../../../components/products/AddToCartButton';
import { IProduct } from '../../../../src/models/Product';

// The local 'FullProduct' interface is removed to use the more complete 'IProduct' type.

async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    const product = await apiClient.publicRequest(`/products/slug/${slug}`);
    return product.data;
  } catch (error) {
    console.error(`Failed to fetch product with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Product Detail Page - A Server Component that fetches the FULL product object.
 */
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    // In a real app, you might render a more sophisticated "Not Found" page.
    return <div>Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <ProductImages images={product.images} productName={product.name} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl text-gray-800 mt-2">${product.price.toFixed(2)}</p>
          <p className="text-gray-700 mt-4">{product.description}</p>
          {/* Access the 'quantity' property within the 'inventory' object */}
          <p className="mt-4">In Stock: {product.inventory?.quantity ?? 'Not available'}</p>
          
          {/* This button now receives a product object that matches the IProduct type. */}
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}