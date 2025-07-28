'use client';

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { apiClient } from '../lib/api';

// Define the shape of the user object to match the new backend model
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'vendor';
  phone?: string;
  addresses?: Array<{
    type: 'shipping' | 'billing';
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
  }>;
  preferences?: {
    newsletter: boolean;
    notifications: boolean;

    language: string;
  };
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // This function checks if a user is logged in by calling the /api/auth/me endpoint.
  const checkAuth = useCallback(async () => {
    // No need to set loading true here to prevent UI flicker on re-validation
    try {
      const data = await apiClient.privateRequest('/auth/me');
      if (data && data.data) {
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // A 401 error from the API will be caught here, indicating no valid session.
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run the authentication check once when the application loads.
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = { user, isAuthenticated, isLoading, checkAuth };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to easily access the auth context in your components.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}