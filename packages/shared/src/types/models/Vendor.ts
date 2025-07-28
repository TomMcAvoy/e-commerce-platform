import { ObjectId } from './common';

/**
 * Vendor model interface
 * Shared between frontend and backend
 */
export interface Vendor {
  _id: ObjectId;
  tenantId: ObjectId;
  userId: ObjectId;
  businessName: string;
  slug: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
  };
  taxId?: string;
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    accountType: string;
    bankName: string;
  };
  isVerified: boolean;
  rating: number;
  totalSales: number;
  commission: number;
  products: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Vendor creation request
 */
export interface VendorCreateRequest {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  taxId?: string;
}

/**
 * Vendor update request
 */
export interface VendorUpdateRequest {
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessAddress?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
  taxId?: string;
}

/**
 * Vendor response with additional fields
 */
export interface VendorResponse extends Vendor {
  productCount?: number;
  user?: {
    name: string;
    email: string;
    profilePicture?: string;
  };
}