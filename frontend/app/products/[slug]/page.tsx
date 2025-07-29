'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { IProduct } from '@/types';
import { ProductDetailsClient } from './ProductDetailsClient';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.publicRequest(`/products/slug/${params.slug}`);
        setProduct(response.data);
      } catch (err: any) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="bg-white">
        <div className="pt-6 text-center">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white">
        <div className="pt-6 text-center">
          <h1>Product Not Found</h1>
          <p>{error || 'The product you are looking for does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="pt-6">
        <ProductDetailsClient product={product} />
      </div>
    </div>
  );
}