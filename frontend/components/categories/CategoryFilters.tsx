'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PriceRangeSlider } from '@/components/filters/PriceRangeSlider';
import { BrandFilter } from '@/components/filters/BrandFilter';

interface CategoryFiltersProps {
  category: any;
  searchParams: any;
}

export function CategoryFilters({ category, searchParams }: CategoryFiltersProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  
  const [priceRange, setPriceRange] = useState({
    min: parseInt(searchParams.priceMin || '0'),
    max: parseInt(searchParams.priceMax || '10000')
  });

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    params.delete('page'); // Reset to page 1 when filtering
    
    router.push(`/categories/${category.slug}?${params.toString()}`);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set('priceMin', priceRange.min.toString());
    params.set('priceMax', priceRange.max.toString());
    params.delete('page');
    
    router.push(`/categories/${category.slug}?${params.toString()}`);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
      
      {/* Price Range */}
      <div>
        <h4 className="text-md font-medium text-gray-300 mb-3">Price Range</h4>
        <PriceRangeSlider 
          value={priceRange}
          onChange={setPriceRange}
          onApply={applyPriceFilter}
        />
      </div>

      {/* Category Specific Filters */}
      {category.slug === 'security-surveillance' && (
        <div>
          <h4 className="text-md font-medium text-gray-300 mb-3">Security Type</h4>
          <SecurityTypeFilter 
            selected={searchParams.securityType}
            onChange={(value) => updateFilters('securityType', value)}
          />
        </div>
      )}

      {/* Brand Filter */}
      <BrandFilter 
        categorySlug={category.slug}
        selected={searchParams.brand}
        onChange={(value) => updateFilters('brand', value)}
      />

      {/* Clear Filters */}
      <button
        onClick={() => router.push(`/categories/${category.slug}`)}
        className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}