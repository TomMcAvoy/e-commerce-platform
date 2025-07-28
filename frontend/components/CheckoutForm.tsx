'use client';

import { useState, useEffect } from 'react';
import { 
  useStripe, 
  useElements, 
  PaymentElement, 
  AddressElement 
} from '@stripe/react-stripe-js';
import { Button } from './ui/Button';

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/cart/checkout/success`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || 'An unexpected error occurred.');
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
      <AddressElement id="address-element" options={{mode: 'shipping'}} />

      <h2 className="text-lg font-medium text-gray-900 mt-6 mb-4">Payment Details</h2>
      <PaymentElement id="payment-element" />
      
      <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full mt-6">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </Button>
      
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className="mt-4 text-center text-sm text-red-600">{message}</div>}
    </form>
  );
}