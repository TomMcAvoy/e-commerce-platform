'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { Navigation } from '../../components/navigation/Navigation';

/**
 * Shopping Cart Page - A Client Component using the CartContext.
 * Allows users to view, update, and remove items from their cart.
 */
export default function CartPage() {
  const { state, dispatch } = useCart();

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    } else {
      dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const subtotal = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div>
      <Navigation />
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '2rem' }}>
        <h1>Your Shopping Cart</h1>
        {state.items.length === 0 ? (
          <div>
            <p>Your cart is empty.</p>
            <Link href="/products" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
              {state.items.map(item => (
                <div key={item.product._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={item.product.images?.[0] || '/placeholder.png'} alt={item.product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '1rem' }} />
                    <div>
                      <h3 style={{ margin: 0 }}>{item.product.name}</h3>
                      <p style={{ margin: '0.25rem 0', color: '#666' }}>${item.product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value, 10))}
                      style={{ width: '60px', textAlign: 'center', marginRight: '1rem' }}
                    />
                    <button onClick={() => handleRemoveItem(item.product._id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ margin: '1rem 0' }}>Subtotal: ${subtotal.toFixed(2)}</h2>
              <p style={{ color: '#666' }}>Taxes and shipping calculated at checkout.</p>
              <Link href="/cart/checkout">
                <button style={{ padding: '1rem 2rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem' }}>
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
