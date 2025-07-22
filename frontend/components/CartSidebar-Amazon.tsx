'use client'

import { Fragment } from 'react'
import { X, Minus, Plus, ShoppingBag, Trash2, Lock, Truck } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

export default function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Amazon-style Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Amazon-style Header */}
          <div className="bg-amazon-dark text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="h-6 w-6 mr-2" />
                <h2 className="text-lg font-semibold">
                  Cart ({totalItems})
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {totalPrice > 0 && (
              <div className="mt-2 flex items-center text-sm">
                <Truck className="h-4 w-4 mr-1" />
                <span>FREE delivery on orders over $35</span>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-gray-500">
                <ShoppingBag className="h-20 w-20 mb-4 text-gray-300" />
                <h3 className="text-xl font-medium mb-2 text-gray-700">Your cart is empty</h3>
                <p className="text-sm text-center text-gray-500 mb-4">
                  Add some products to get started shopping!
                </p>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="btn-amazon-orange px-6 py-2"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant || ''}`} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded border flex items-center justify-center">
                        <span className="text-xs text-gray-500">IMG</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1">
                          {item.name}
                        </h3>
                        
                        {item.variant && (
                          <p className="text-xs text-gray-600 mb-1">
                            {item.variant}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="price-amazon text-lg">${item.price}</span>
                          <button
                            onClick={() => removeFromCart(item.id, item.variant)}
                            className="text-blue-600 hover:text-red-600 text-xs hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variant)}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium bg-gray-50 border-x border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                              className="p-1 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <span className="text-sm text-gray-600">
                            In Stock
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Gift Options */}
                <div className="border-t border-gray-200 pt-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-700">This order contains a gift</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Amazon-style Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 p-4">
              {/* Subtotal */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">Subtotal ({totalItems} items):</span>
                  <span className="price-amazon text-xl">${totalPrice.toFixed(2)}</span>
                </div>
                
                {totalPrice < 35 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Add ${(35 - totalPrice).toFixed(2)} to qualify for FREE delivery
                  </p>
                )}
              </div>
              
              {/* Secure Checkout Button */}
              <button className="w-full btn-amazon-orange text-center py-3 mb-3 font-semibold">
                Proceed to Checkout
              </button>
              
              {/* Security Badge */}
              <div className="flex items-center justify-center text-xs text-gray-600">
                <Lock className="h-3 w-3 mr-1" />
                <span>Secure 256-bit SSL encryption</span>
              </div>
              
              {/* Payment Methods */}
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500 mb-2">We accept:</p>
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">VISA</div>
                  <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">MC</div>
                  <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center">AMEX</div>
                  <div className="w-8 h-5 bg-yellow-500 rounded text-white text-xs flex items-center justify-center">PP</div>
                </div>
              </div>
              
              {/* Recently Viewed */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Inspired by your shopping trends</p>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white border rounded p-2 text-center hover:shadow-sm cursor-pointer">
                      <div className="w-full h-12 bg-gray-200 rounded mb-1"></div>
                      <p className="text-xs text-gray-600 line-clamp-2">Related Item {item}</p>
                      <p className="text-xs font-medium text-amazon-orange">${(Math.random() * 30 + 10).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
