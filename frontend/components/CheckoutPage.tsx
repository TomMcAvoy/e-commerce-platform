'use client';

import { useState, useEffect } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CheckoutForm } from '@/components/CheckoutForm'; // Corrected: Use named import
import { apiClient } from '@/lib/api';

// Make sure to add your publishable key to your .env.local file
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createIntent = async () => {
      try {
        // This endpoint should exist on your backend. It takes the cart/order details
        // and returns a clientSecret from Stripe.
        const response = await apiClient.privateRequest('/orders/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // You might need to pass cart items or total amount here
          body: JSON.stringify({ amount: 1099 }), // Example amount
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Failed to create payment intent:", error);
        // Handle error state in UI
      }
    };

    createIntent();
  }, []);

  const appearance = {
    theme: 'stripe' as const,
  };
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
      {!clientSecret && (
        <div className="text-center p-8">
          <p>Loading payment form...</p>
        </div>
      )}
    </div>
  );
}