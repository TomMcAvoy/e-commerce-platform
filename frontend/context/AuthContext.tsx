'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { IUser } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: IUser | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userInfo: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await api.privateRequest('/auth/me');
        setUser(response.data);
      } catch (error) {
        // User not authenticated, clear state
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to prevent flash
    const timer = setTimeout(() => {
      checkUserStatus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await api.publicRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      setUser(response.user);
      router.push('/account'); // Redirect to a protected page
    } catch (error: any) {
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new Error('Invalid credentials');
      }
      throw error;
    }
  };

  const register = async (userInfo: any) => {
    const response = await api.publicRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userInfo),
    });
    setUser(response.user);
    router.push('/account'); // Redirect after registration
  };

  const logout = async () => {
    try {
      await api.privateRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout failed, clearing client-side state anyway.", error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};