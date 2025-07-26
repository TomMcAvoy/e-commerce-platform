'use client';

import React from 'react';
import Link from 'next/link';
import { Navigation } from '../../components/navigation/Navigation';
import { useCart } from '../../context/CartContext';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

/**
 * Cart Page following Frontend Structure from Copilot Instructions
 */

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart to get started.</p>
            <Link href="/categories" className="btn-primary">
              Shop Now
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        <section className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Shopping Cart ({state.totalItems} items)
          </h1>

          {state.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || '/api/placeholder/80/80'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                      <p className="font-bold text-blue-600">${item.price}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        disabled={state.isLoading}
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        disabled={state.isLoading}
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center mt-1"
                        disabled={state.isLoading}
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({state.totalItems} items)</span>
                    <span>${state.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${state.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <button className="w-full btn-primary mb-2">
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full btn-outline"
                  disabled={state.isLoading}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
