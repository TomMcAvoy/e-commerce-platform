'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.product._id} data-testid="cart-item" className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="w-16 h-16 relative">
              <Image
                src={item.product.images[0] || '/placeholder.svg'}
                alt={item.product.name}
                fill
                className="object-cover rounded"
              />
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value))}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFromCart(item.product._id)}
              >
                Remove
              </Button>
            </div>
            
            <div className="font-medium">
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <span data-testid="cart-total" className="text-xl font-bold">Total: ${getCartTotal().toFixed(2)}</span>
        </div>
        
        <div className="flex space-x-4">
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link href="/checkout">
            <Button>Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}