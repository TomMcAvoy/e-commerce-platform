'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  // Correctly destructure the properties provided by CartContext
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart is Empty</h1>
        <p className="mt-4 text-gray-600">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-xl font-semibold">
                {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
              </h2>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Clear Cart
              </button>
            </div>
            <div className="space-y-6">
              {cartItems.map(({ product, quantity }) => (
                <div key={product._id} className="flex items-center gap-4 border-b pb-6 last:border-b-0">
                  <Image
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-gray-500 text-sm">Price: ${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => updateQuantity(product._id, parseInt(e.target.value, 10))}
                      className="w-16 text-center border rounded-md"
                    />
                    <p className="font-semibold w-24 text-right">${(product.price * quantity).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(product._id)} className="text-gray-400 hover:text-red-500">
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-semibold mb-4 border-b pb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">${total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">Free</p>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
              <Button asChild className="w-full mt-6">
                <Link href="/cart/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
