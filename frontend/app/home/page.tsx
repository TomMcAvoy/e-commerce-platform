"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { IProduct } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.publicRequest(
          "/products?limit=8&sort=-createdAt"
        );
        setProducts(response.data.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white">
      <main>
        {/* Hero Section */}
        <div className="relative bg-gray-900">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80&sat=-100"
              alt="Hero background"
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gray-900 opacity-50"
          />
          <div className="relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center lg:px-0">
            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
              Your One-Stop E-Commerce Hub
            </h1>
            <p className="mt-4 text-xl text-white">
              Discover amazing products from vendors all over the world. Quality
              and convenience, delivered.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>

        {/* Featured Products Section */}
        <section
          aria-labelledby="featured-products-heading"
          className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8"
        >
          <h2
            id="featured-products-heading"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            Featured Products
          </h2>
          {loading && <p className="mt-6">Loading...</p>}
          {error && <p className="mt-6 text-red-600">{error}</p>}
          {!loading && !error && (
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
