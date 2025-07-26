'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  brand: string;
  isFeatured: boolean;
  isActive: boolean;
  vendor: string;
  asin: string;
  sku: string;
  stock: number;
}

interface ProductGridProps {
  products: Product[];
  category?: any;
  className?: string;
}

export function ProductGrid({ products, category, className = '' }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">No products found</div>
        <p className="text-gray-500">
          {category ? `No products available in ${category.name} category` : 'Try adjusting your filters or search terms'}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Use your API client pattern
      const { api } = await import('@/lib/api');
      await api.cart.add({
        productId: product._id,
        quantity: 1
      });
      
      // Show success feedback (could integrate with toast system)
      console.log('Added to cart:', product.name);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/products/${product._id}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group cursor-pointer">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          {!imageError ? (
            <Image
              src={product.images[0] || '/api/placeholder/400/400'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isFeatured && (
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Featured
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                -{discountPercentage}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="h-4 w-4 text-red-500" />
            ) : (
              <HeartIcon className="h-4 w-4 text-white" />
            )}
          </button>

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-400 text-xs mt-1">{product.brand}</p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-sm line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Stock Indicator */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-orange-400 text-xs mt-2 text-center">
              Only {product.stock} left in stock
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}