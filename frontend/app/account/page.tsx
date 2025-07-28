'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api';
import Link from 'next/link';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      await checkAuth();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading || !user) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const defaultAddress = user.addresses?.find(a => a.isDefault);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <div className="flex items-center gap-4">
          {/* FIX: Add a back link to the main shop page */}
          <Link href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
            &larr; Back to Shop
          </Link>
          {/* FIX: Ensure the Edit Profile button links to the correct page */}
          <Link href="/account/edit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
            Edit Profile
          </Link>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-semibold">{user.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-semibold">{user.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-semibold">{user.phone || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-semibold capitalize">{user.role || 'N/A'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Default Shipping Address</p>
            <p className="font-semibold">
              {defaultAddress ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state} ${defaultAddress.zipCode}` : 'Not provided'}
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 flex justify-end">
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}