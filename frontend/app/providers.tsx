'use client';

import { Navigation } from '../components/navigation/Navigation';
import { CartProvider } from '../context/CartContext';

/**
 * Client-side provider wrapper following Context Pattern from Copilot Instructions.
 * This component can safely use hooks, context, and event handlers.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navigation />
      <main className="pt-16"> {/* Add padding to main to offset fixed navigation */}
        {children}
      </main>
    </CartProvider>
  );
}