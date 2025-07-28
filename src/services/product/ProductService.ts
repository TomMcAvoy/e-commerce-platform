// filepath: /Users/thomasmcavoy/GitHub/shoppingcart/src/services/product/ProductService.ts
import AppError from '../../utils/AppError';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  subcategory?: string;
  verified: boolean;
  description: string;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  vendorId: string;
  stock: number;
  featured: boolean;
}

export interface ProductFilter {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export class ProductService {
  private static instance: ProductService;
  
  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Get products by category following DropshippingService patterns
   */
  async getProductsByCategory(category: string, filters: ProductFilter = {}): Promise<{
    products: Product[];
    totalCount: number;
    page: number;
    totalPages: number;
  }> {
    try {
      // Mock secure product data - in production this would query database
      const allProducts = this.getMockProductDatabase();
      
      let filteredProducts = allProducts.filter(p => 
        category === 'all' || p.category === category
      );

      // Apply filters following API Endpoints Structure
      if (filters.subcategory) {
        filteredProducts = filteredProducts.filter(p => p.subcategory === filters.subcategory);
      }
      
      if (filters.brand) {
        filteredProducts = filteredProducts.filter(p => p.brand === filters.brand);
      }
      
      if (filters.size) {
        filteredProducts = filteredProducts.filter(p => p.sizes?.includes(filters.size as string));
      }

      if (filters.color) {
        filteredProducts = filteredProducts.filter(p => p.colors?.includes(filters.color as string));
      }
      
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
      }
      
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
      }

      // Apply sorting
      this.applySorting(filteredProducts, filters.sortBy || 'featured');

      // Pagination following Project-Specific Conventions
      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      const totalPages = Math.ceil(filteredProducts.length / limit);

      return {
        products: paginatedProducts,
        totalCount: filteredProducts.length,
        page,
        totalPages
      };
    } catch (error) {
      throw new AppError('Failed to fetch products', 500);
    }
  }

  /**
   * Get featured products for homepage
   */
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const allProducts = this.getMockProductDatabase();
      return allProducts
        .filter(p => p.featured)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    } catch (error) {
      throw new AppError('Failed to fetch featured products', 500);
    }
  }

  /**
   * Get product categories with counts
   */
  async getCategories(): Promise<Array<{ 
    id: string; 
    name: string; 
    count: number; 
    color: string;
    icon: string;
  }>> {
    try {
      const allProducts = this.getMockProductDatabase();
      const categories = [
        { 
          id: 'mens', 
          name: 'Mens Fashion', 
          color: 'from-slate-600 to-gray-700',
          icon: '👔'
        },
        { 
          id: 'womens', 
          name: 'Womens Fashion', 
          color: 'from-pink-500 to-rose-600',
          icon: '👗'
        },
        { 
          id: 'cosmetics', 
          name: 'Beauty & Cosmetics', 
          color: 'from-purple-500 to-pink-500',
          icon: '💄'
        },
        { 
          id: 'sports', 
          name: 'Sports & Fitness', 
          color: 'from-green-500 to-emerald-600',
          icon: '⚽'
        },
        { 
          id: 'hardware', 
          name: 'Tools & Hardware', 
          color: 'from-orange-500 to-red-600',
          icon: '🔧'
        },
        { 
          id: 'electronics', 
          name: 'Electronics', 
          color: 'from-blue-500 to-indigo-600',
          icon: '📱'
        },
        { 
          id: 'home', 
          name: 'Home & Garden', 
          color: 'from-amber-500 to-orange-500',
          icon: '🏠'
        },
        { 
          id: 'baby', 
          name: 'Baby & Kids', 
          color: 'from-yellow-400 to-amber-500',
          icon: '👶'
        }
      ];

      return categories.map(cat => ({
        ...cat,
        count: allProducts.filter(p => p.category === cat.id).length
      }));
    } catch (error) {
      throw new AppError('Failed to fetch categories', 500);
    }
  }

  private applySorting(products: Product[], sortBy: string): void {
    switch (sortBy) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // In real implementation, sort by createdAt
        products.sort((a, b) => b.reviews - a.reviews);
        break;
      default: // featured
        products.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
    }
  }

  /**
   * Secure mock database - this would be replaced with actual database queries
   * Following DropshippingService.test.ts patterns for mock data structure
   */
  private getMockProductDatabase(): Product[] {
    return [
      // Mens Fashion
      {
        id: 'mens-1',
        name: 'Executive Security Suit - Charcoal',
        price: 399.99,
        originalPrice: 599.99,
        rating: 4.8,
        reviews: 247,
        image: '/api/placeholder/300/300',
        category: 'mens',
        subcategory: 'suits',
        verified: true,
        description: 'Premium tailored suit with concealed tactical features',
        brand: 'Whitestart Executive',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Charcoal', 'Navy', 'Black'],
        tags: ['professional', 'security', 'formal'],
        vendorId: 'vendor-001',
        stock: 50,
        featured: true
      },
      // Womens Fashion
      {
        id: 'womens-1',
        name: 'Professional Blazer with Hidden Pockets',
        price: 189.99,
        originalPrice: 269.99,
        rating: 4.9,
        reviews: 342,
        image: '/api/placeholder/300/300',
        category: 'womens',
        subcategory: 'blazers',
        verified: true,
        description: 'Executive blazer with concealed security features',
        brand: 'Whitestart Professional',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Navy', 'Black', 'Charcoal'],
        tags: ['professional', 'security', 'executive'],
        vendorId: 'vendor-002',
        stock: 75,
        featured: true
      },
      // Cosmetics
      {
        id: 'cosmetics-1',
        name: 'Long-Wear Professional Foundation',
        price: 89.99,
        originalPrice: 119.99,
        rating: 4.8,
        reviews: 1247,
        image: '/api/placeholder/300/300',
        category: 'cosmetics',
        subcategory: 'makeup',
        verified: true,
        description: '16-hour wear foundation for security professionals',
        brand: 'SecureBeauty Pro',
        colors: ['Fair', 'Light', 'Medium', 'Tan', 'Deep'],
        tags: ['long-wear', 'professional', 'full-coverage'],
        vendorId: 'vendor-003',
        stock: 120,
        featured: true
      },
      // Add more categories...
      {
        id: 'sports-1',
        name: 'Tactical Fitness Gear Set',
        price: 299.99,
        originalPrice: 399.99,
        rating: 4.7,
        reviews: 156,
        image: '/api/placeholder/300/300',
        category: 'sports',
        subcategory: 'training',
        verified: true,
        description: 'Complete training set for security fitness',
        brand: 'SecureFit Pro',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Gray'],
        tags: ['tactical', 'fitness', 'training'],
        vendorId: 'vendor-004',
        stock: 45,
        featured: true
      }
    ];
  }
}
