'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ICategory } from '../types';
import { getCategoryColorScheme } from '@/lib/icons';
import { CategoryIcon } from './ui/CategoryIcon';

interface CategoryCardProps {
  category: ICategory;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  if (!category) {
    console.warn('CategoryCard: Received null/undefined category');
    return null;
  }

  const colorScheme = getCategoryColorScheme(category.name);

  return (
    <Link 
      href={`/categories/${category.slug}`}
      data-testid="category-card"
      className="group block rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-2xl bg-white border border-gray-200"
    >
      {/* Image section */}
      <div className="relative h-40 w-full bg-gradient-to-br from-blue-50 to-gray-100">
        {category.image ? (
          <Image
            src={category.image}
            alt={`${category.name} category`}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              console.warn(`Failed to load image for category ${category.name}:`, category.image);
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <CategoryIcon 
              categoryName={category.name}
              className="w-16 h-16 text-blue-600 group-hover:text-blue-700 transition-colors" 
            />
          </div>
        )}
        
        {/* Featured badge */}
        {category.isFeatured && (
          <div className="absolute top-2 right-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>
        <p className="mt-2 text-sm text-gray-600 h-10 overflow-hidden">
          {category.description || 'Professional security equipment and solutions'}
        </p>
        
        {/* Category metadata */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span className="capitalize">{category.categoryType || 'Category'}</span>
          <span className="font-medium text-blue-600">
            View Products →
          </span>
        </div>
      </div>
    </Link>
  );
};
