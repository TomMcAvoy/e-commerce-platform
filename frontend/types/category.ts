/**
 * Category types following Frontend Structure from Copilot Instructions
 * Matches backend Category model with color scheme support
 */

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  gradient?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parentCategory?: string;
  subcategories: string[];
  isActive: boolean;
  colorScheme: ColorScheme;
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}
