import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { IProduct } from '@/types';
import { ProductDetailsClient } from './ProductDetailsClient';
import { Metadata } from 'next';

// Server-side fetch using the centralized API integration
async function getProduct(slug: string): Promise<IProduct | null> {
  try {
    // Use the exported API function for consistency
    const product = await api.getProductBySlug(slug);
    return product;
  } catch {
    return null;
  }
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | Whitestart`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

// Server Component for the product page
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="pt-6">
        <ProductDetailsClient product={product} />
      </div>
    </div>
  );
}