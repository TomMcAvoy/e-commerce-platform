'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ICategory } from '../types/category';

/**
 * Category Navigation following Frontend Structure from Copilot Instructions
 * Client component with color-coded category navigation
 */

export default function CategoryNav() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/categories`);
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <nav className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 py-4 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/category/${category.slug}`}
              className="whitespace-nowrap font-medium transition-all duration-200 hover:scale-105 px-3 py-2 rounded-md"
              style={{
                color: category.colorScheme.primary,
                backgroundColor: `${category.colorScheme.primary}10`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${category.colorScheme.primary}20`;
                e.currentTarget.style.color = category.colorScheme.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${category.colorScheme.primary}10`;
                e.currentTarget.style.color = category.colorScheme.primary;
              }}
            >
              {category.name}
              <span 
                className="ml-1 text-sm"
                style={{ color: category.colorScheme.accent }}
              >
                ({category.productCount || 0})
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
