'use client';

import React from 'react';
import { useCart } from '../../../context/CartContext';
import { Navigation } from '../../../components/navigation/Navigation';

export default function CheckoutPage() {
  // Correctly use object destructuring to match the CartContextType
  const { state, dispatch } = useCart();

  const handleCheckout = () => {
    // In a real app, this would connect to a payment provider like Stripe
    alert('Proceeding to payment... (Not implemented)');
    // Potentially clear the cart after successful payment
    // dispatch({ type: 'CLEAR_CART' }); 
  };

  // This logic is now correct because 'state' is properly destructured.
  const subtotal = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div>
      <Navigation />
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
        <h1>Checkout</h1>
        {state.items.length > 0 ? (
          <div>
            <h2>Order Summary</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {state.items.map(item => (
                <li key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span>{item.product.name} (x{item.quantity})</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <h3 style={{ textAlign: 'right', marginTop: '1rem' }}>
              Subtotal: ${subtotal.toFixed(2)}
            </h3>
            <button 
              onClick={handleCheckout}
              style={{ width: '100%', padding: '1rem', marginTop: '1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              Proceed to Payment
            </button>
          </div>
        ) : (
          <p>Your cart is empty. There is nothing to check out.</p>
        )}
      </div>
    </div>
  );
}