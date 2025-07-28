'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

// Define a simplified Product type for the card
interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
}

interface ProductCardProps {
  product: Product;
}

/**
 * Product Card Component following Component Organization patterns.
 * This is a Client Component to allow for 'Add to Cart' interactivity.
 */
export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    // Optional: Add a toast notification here for user feedback
    console.log(`Added ${product.name} to cart.`);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg">
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 sm:aspect-none sm:h-60">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center sm:h-full sm:w-full"
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`/products/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-base font-semibold text-gray-900">${product.price.toFixed(2)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-2 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ShoppingCartIcon className="mr-2 h-5 w-5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}