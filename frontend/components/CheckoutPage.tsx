'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { createOrder, createPaymentIntent } from '@/lib/api';
// Assume you have a way to get the auth token, e.g., from a context or cookies
import { useAuth } from '@/context/AuthContext'; 

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { token } = useAuth(); // Example of getting the auth token
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create order and payment intent when the component mounts
    const initializeCheckout = async () => {
      if (!token) return;

      try {
        // 1. Create a pending order. You might pass shipping info from a previous step.
        const orderData = {
          // Dummy data for now, this would come from a form
          shippingAddress: { address: '123 Main St', city: 'Anytown', postalCode: '12345', country: 'US' },
          paymentMethod: 'stripe',
        };
        const order = await createOrder(orderData, token);

        // 2. Use the new orderId to create a Payment Intent
        const paymentData = await createPaymentIntent(order._id, token);
        setClientSecret(paymentData.clientSecret);

      } catch (error) {
        console.error("Failed to initialize checkout:", error);
        // Handle error, e.g., show a message to the user
      }
    };

    initializeCheckout();
  }, [token]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      ) : (
        <p>Loading payment details...</p>
      )}
    </div>
  );
}