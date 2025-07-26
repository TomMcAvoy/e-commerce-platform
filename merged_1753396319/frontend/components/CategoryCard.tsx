'use client';

import Link from 'next/link';
import { ICategory } from '../types/category';

/**
 * Category Card following Frontend Structure from Copilot Instructions
 * Uses dynamic color schemes from database with fallback patterns
 */

interface CategoryCardProps {
  category: ICategory;
  className?: string;
}

export default function CategoryCard({ category, className = '' }: CategoryCardProps) {
  const { colorScheme } = category;

  return (
    <Link 
      href={`/category/${category.slug}`}
      className={`block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${className}`}
      style={{
        background: colorScheme.gradient || colorScheme.background,
        color: colorScheme.text
      }}
    >
      <div className="relative h-48 overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-6xl font-bold"
            style={{ 
              background: colorScheme.gradient,
              color: colorScheme.background
            }}
          >
            {category.name.charAt(0)}
          </div>
        )}
        
        {/* Color overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Category badge */}
        <div 
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: colorScheme.accent,
            color: colorScheme.text
          }}
        >
          {category.productCount || 0} items
        </div>
      </div>
      
      <div className="p-6">
        <h3 
          className="text-xl font-bold mb-2"
          style={{ color: colorScheme.primary }}
        >
          {category.name}
        </h3>
        
        <p 
          className="text-sm opacity-80 mb-4 line-clamp-2"
          style={{ color: colorScheme.text }}
        >
          {category.description}
        </p>
        
        {/* Subcategories */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {category.subcategories.slice(0, 3).map((sub: string) => (
              <span
                key={sub}
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${colorScheme.secondary}20`,
                  color: colorScheme.secondary
                }}
              >
                {sub}
              </span>
            ))}
            {category.subcategories.length > 3 && (
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${colorScheme.secondary}20`,
                  color: colorScheme.secondary
                }}
              >
                +{category.subcategories.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Shop now button */}
        <button
          className="w-full py-2 px-4 rounded-md font-semibold transition-all duration-200 hover:shadow-lg"
          style={{
            backgroundColor: colorScheme.primary,
            color: colorScheme.background
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colorScheme.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colorScheme.primary;
          }}
        >
          Shop Now
        </button>
      </div>
    </Link>
  );
}
