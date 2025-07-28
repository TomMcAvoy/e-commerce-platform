'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingCartIcon, 
  HeartIcon, 
  StarIcon, 
  EyeIcon,
  ShieldCheckIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Enhanced Product type with additional fields
interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  slug: string;
  rating?: number;
  reviewCount?: number;
  vendor?: {
    name: string;
    verified?: boolean;
  };
  freeShipping?: boolean;
  inStock?: boolean;
  stockCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  country?: string;
}

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
}

/**
 * Enhanced Product Card Component with multiple variants and visual improvements.
 * This is a Client Component to allow for 'Add to Cart' interactivity.
 */
export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate discount percentage if originalPrice is provided
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : product.discount;

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0]
    });
    // Optional: Add a toast notification here for user feedback
    console.log(`Added ${product.name} to cart.`);
  };

  // Generate star rating display
  const renderRating = () => {
    if (!product.rating) return null;
    
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i}>
            {i < fullStars ? (
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
            ) : i === fullStars && hasHalfStar ? (
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4 text-gray-300" />
            )}
          </span>
        ))}
        {product.reviewCount && (
          <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
        )}
      </div>
    );
  };

  // Featured variant with larger display and more details
  if (variant === 'featured') {
    return (
      <div 
        className="group relative flex flex-col md:flex-row overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image section */}
        <div className="relative md:w-2/5">
          {discountPercentage && discountPercentage > 0 && (
            <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </div>
          )}
          
          {product.isNew && (
            <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </div>
          )}
          
          <Link href={`/products/${product.slug}`} className="block h-full">
            <div className="relative h-80 w-full overflow-hidden">
              <Image
                src={product.images[0] || '/placeholder.svg'}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Quick view overlay */}
              <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <button className="bg-white text-gray-800 rounded-full p-2 transform hover:scale-110 transition-transform">
                  <EyeIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Content section */}
        <div className="flex flex-1 flex-col p-6">
          {product.vendor && (
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500">{product.vendor.name}</span>
              {product.vendor.verified && (
                <ShieldCheckIcon className="h-4 w-4 ml-1 text-blue-500" />
              )}
            </div>
          )}
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          
          <div className="mb-4">
            {renderRating()}
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            High-quality security equipment with advanced features and reliable performance.
          </p>
          
          <div className="mt-auto">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-4">
              {product.freeShipping && (
                <div className="flex items-center mr-4">
                  <TruckIcon className="h-4 w-4 mr-1 text-green-600" />
                  <span>Free Shipping</span>
                </div>
              )}
              
              {product.inStock ? (
                <div className="text-green-600">In Stock</div>
              ) : (
                <div className="text-red-600">Out of Stock</div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center rounded-md px-4 py-3 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  product.inStock 
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCartIcon className="mr-2 h-5 w-5" />
                Add to Cart
              </button>
              
              <button className="p-3 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
                <HeartIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Compact variant for smaller displays like sidebars
  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="64px"
            className="object-cover object-center"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h4>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</p>
            <button
              onClick={handleAddToCart}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Add to cart"
            >
              <ShoppingCartIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-w-3 aspect-h-4 bg-gray-100">
        {discountPercentage && discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}
        
        {product.isNew && (
          <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </div>
        )}
        
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        
        {/* Quick actions overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex space-x-2">
            <button 
              onClick={handleAddToCart}
              className="bg-white text-gray-800 rounded-full p-2 transform hover:scale-110 transition-transform"
              aria-label="Add to cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
            <button 
              className="bg-white text-gray-800 rounded-full p-2 transform hover:scale-110 transition-transform"
              aria-label="Add to wishlist"
            >
              <HeartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        {product.vendor && (
          <div className="text-xs text-gray-500 mb-1">{product.vendor.name}</div>
        )}
        
        <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        
        <div className="mb-2">
          {renderRating()}
        </div>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-base font-semibold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="ml-2 text-xs text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          
          {product.freeShipping && (
            <div className="text-xs text-green-600 flex items-center">
              <TruckIcon className="h-3 w-3 mr-1" />
              Free
            </div>
          )}
        </div>
        
        <button
          onClick={handleAddToCart}
          className="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ShoppingCartIcon className="mr-2 h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}