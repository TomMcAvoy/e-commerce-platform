'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CheckoutPage as StripeCheckoutComponent } from '@/components/CheckoutPage';

export default function Checkout() {
  // Correctly destructure the properties provided by CartContext
  const { cartItems, getCartTotal } = useCart();
  const router = useRouter();
  const total = getCartTotal();

  // Redirect to the cart page if it's empty, preventing checkout errors
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  // Render a loading/redirecting state while the effect runs
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
        <p className="text-gray-600 mt-2">Redirecting you to the cart page...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Order Summary Section */}
          <div className="lg:col-span-1 order-last lg:order-first bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4 border-b pb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.product._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t mt-6 pt-4 space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">${total.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="font-medium">Free</p>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Payment Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <StripeCheckoutComponent />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}