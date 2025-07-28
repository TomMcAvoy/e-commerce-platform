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
        // This endpoint should be protected and return the current user if the cookie is valid
        const response = await api.privateRequest('/auth/me');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const login = async (credentials: any) => {
    const response = await api.publicRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setUser(response.data);
    router.push('/account'); // Redirect to a protected page
  };

  const register = async (userInfo: any) => {
    const response = await api.publicRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userInfo),
    });
    setUser(response.data);
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