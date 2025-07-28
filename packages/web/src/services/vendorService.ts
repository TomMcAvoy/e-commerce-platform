import { 
  Vendor, 
  VendorCreateRequest, 
  VendorUpdateRequest 
} from '@shoppingcart/shared/src/types/models/Vendor';
import { ApiResponse } from '@shoppingcart/shared/src/types/api/responses';
import { apiClient } from './apiClient';

/**
 * Get all vendors
 */
export async function getVendors(params?: { limit?: number }): Promise<Vendor[]> {
  const query = params?.limit ? `?limit=${params.limit}` : '';
  const response = await apiClient<ApiResponse<Vendor[]>>(`/vendors${query}`, { 
    next: { revalidate: 3600 } 
  });
  
  return response.data || [];
}

/**
 * Get vendor by ID
 */
export async function getVendorById(id: string): Promise<Vendor | null> {
  try {
    const response = await apiClient<ApiResponse<Vendor>>(`/vendors/${id}`, { 
      next: { revalidate: 3600 } 
    });
    
    return response.data || null;
  } catch (error) {
    console.error('Error fetching vendor by ID:', error);
    return null;
  }
}

/**
 * Get vendor by slug
 */
export async function getVendorBySlug(slug: string): Promise<Vendor | null> {
  try {
    const response = await apiClient<ApiResponse<Vendor>>(`/vendors/slug/${slug}`, { 
      next: { revalidate: 3600 } 
    });
    
    return response.data || null;
  } catch (error) {
    console.error('Error fetching vendor by slug:', error);
    return null;
  }
}

/**
 * Get vendor products
 */
export async function getVendorProducts(vendorId: string): Promise<any[]> {
  try {
    const response = await apiClient<ApiResponse<any[]>>(`/vendors/${vendorId}/products`, { 
      next: { revalidate: 3600 } 
    });
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    return [];
  }
}

/**
 * Register as a vendor
 */
export async function registerVendor(data: VendorCreateRequest & { 
  firstName: string; 
  lastName: string; 
  email: string; 
  password: string; 
}): Promise<Vendor | null> {
  try {
    const response = await apiClient<ApiResponse<Vendor>>('/vendors/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data || null;
  } catch (error) {
    console.error('Error registering vendor:', error);
    throw error;
  }
}

/**
 * Create vendor profile
 */
export async function createVendorProfile(data: VendorCreateRequest): Promise<Vendor | null> {
  try {
    const response = await apiClient<ApiResponse<Vendor>>('/vendors', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data || null;
  } catch (error) {
    console.error('Error creating vendor profile:', error);
    throw error;
  }
}

/**
 * Update vendor profile
 */
export async function updateVendorProfile(id: string, data: VendorUpdateRequest): Promise<Vendor | null> {
  try {
    const response = await apiClient<ApiResponse<Vendor>>(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data || null;
  } catch (error) {
    console.error('Error updating vendor profile:', error);
    throw error;
  }
}

/**
 * Import products for vendor
 */
export async function importProducts(formData: FormData): Promise<boolean> {
  try {
    const response = await apiClient<ApiResponse<any>>('/vendors/import-products', {
      method: 'POST',
      body: formData
    });
    
    return response.success;
  } catch (error) {
    console.error('Error importing products:', error);
    throw error;
  }
}