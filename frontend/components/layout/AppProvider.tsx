"use client";

import { AuthProvider } from "../../context/AuthContext";

/**
 * AppProvider Component following Context Pattern from Copilot Instructions.
 * This is a Client Component that wraps the application with all necessary
 * client-side context providers, resolving the context access issue.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {/* You can add other providers like CartProvider here in the future */}
      {children}
    </AuthProvider>
  );
}