'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface ProductDetailsClientProps {
  product: IProduct;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
      // Optionally, show a success toast/notification here
      alert(`${quantity} x ${product.name} added to cart!`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
      <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
      </div>

      {/* Image gallery */}
      <div className="mt-6 lg:col-span-2 lg:mt-0">
        <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            width={800}
            height={800}
            className="h-full w-full object-cover object-center"
            priority // Prioritize loading the main product image
          />
        </div>
      </div>

      {/* Product info */}
      <div className="mt-4 lg:row-span-3 lg:mt-0">
        <h2 className="sr-only">Product information</h2>
        <p className="text-3xl tracking-tight text-gray-900">${product.price.toFixed(2)}</p>

        <form className="mt-10">
          <div className="flex items-center space-x-4">
            <div className="w-24">
              <Label htmlFor="quantity" className="sr-only">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="text-center"
              />
            </div>
            <Button
              type="button"
              onClick={handleAddToCart}
              className="flex-1"
            >
              Add to cart
            </Button>
          </div>
        </form>
      </div>

      <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pb-16 lg:pr-8">
        <div>
          <h3 className="sr-only">Description</h3>
          <div className="space-y-6">
            <p className="text-base text-gray-900">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}