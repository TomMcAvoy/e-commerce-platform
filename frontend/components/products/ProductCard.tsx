'use client';

import Link from 'next/link';
import Image from 'next/image';
import { StarIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    images: string[];
    vendor: {
      name: string;
      rating: number;
    };
    rating: number;
    reviewCount: number;
    inStock: boolean;
    features?: string[];
    badge?: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addToCart } = useCart();

  const discountPercentage = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                {product.badge}
              </span>
            </div>
          )}
          
          {discountPercentage > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">
                -{discountPercentage}%
              </span>
            </div>
          )}

          <Image
            src={product.images[0] || '/images/placeholder-product.jpg'}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoading ? 'blur-sm' : 'blur-0'
            }`}
            onLoad={() => setImageLoading(false)}
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={toggleWishlist}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                {isWishlisted ? (
                  <HeartSolid className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>

            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full shadow-lg transition-colors"
              >
                <ShoppingCartIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
              <span className="text-red-600 font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Vendor */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">{product.vendor.name}</span>
            <div className="flex items-center gap-1">
              <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-500">{product.vendor.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.inStock && (
              <span className="text-xs text-green-600 font-medium">In Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}