export interface IProduct {
  _id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  vendorId: string;
  sku: string;
  asin: string;
  images: string[];
  inventory: {
    quantity: number;
    lowStock: number;
    inStock: boolean;
  };
  cost?: number;
  features?: string[];
  sizes?: string[];
  colors?: string[];
  gender?: string;
  seasonalTags?: string[];
  sport?: string;
  fitnessLevel?: string;
  room?: string;
  materials?: string[];
  seasonalAvailability?: string[];
  skinType?: string;
  productType?: string;
  fdaCompliant?: boolean;
  mediaType?: string;
  genre?: string;
  ageRange?: string;
  safetyCertifications?: string[];
  compatibility?: Array<{ make: string; model: string; year: number; }>;
  seo?: { title?: string; description?: string; keywords?: string[]; };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Computed fields for frontend compatibility
  stock?: number; // Alias for inventory.quantity
  rating?: number;
  vendor?: {
    _id: string;
    name: string;
    slug: string;
  };
}