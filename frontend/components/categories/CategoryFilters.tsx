'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PriceRangeSlider } from '@/components/filters/PriceRangeSlider';
import { BrandFilter } from '@/components/filters/BrandFilter';
import { Button } from '@/components/ui/Button';

interface CategoryFiltersProps {
  brands: { _id: string; name: string }[];
  minPrice: number;
  maxPrice: number;
}

export function CategoryFilters({ brands, minPrice, maxPrice }: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Sync state from URL on initial load or when URL changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    setPriceRange([
      params.has('minPrice') ? Number(params.get('minPrice')) : minPrice,
      params.has('maxPrice') ? Number(params.get('maxPrice')) : maxPrice,
    ]);
    setSelectedBrands(params.get('brands')?.split(',') || []);
  }, [searchParams, minPrice, maxPrice]);

  const handleBrandChange = (brandName: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  const handleApplyFilters = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    current.set('minPrice', priceRange[0].toString());
    current.set('maxPrice', priceRange[1].toString());

    if (selectedBrands.length > 0) {
      current.set('brands', selectedBrands.join(','));
    } else {
      current.delete('brands');
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  return (
    <aside className="p-6 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-6">Filters</h3>
      <div className="space-y-8">
        <PriceRangeSlider
          value={priceRange}
          onChange={setPriceRange}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
        <BrandFilter
          brands={brands}
          selected={selectedBrands}
          onChange={handleBrandChange}
        />
      </div>
      <Button onClick={handleApplyFilters} className="w-full mt-8">
        Apply Filters
      </Button>
    </aside>
  );
}