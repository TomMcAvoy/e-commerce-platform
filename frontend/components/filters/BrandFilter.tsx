'use client';

import React from 'react';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';

// This interface is updated to accept state and a handler from the parent.
interface BrandFilterProps {
  brands: { _id: string; name: string }[];
  selected: string[]; // The state of selected brands, passed from the parent.
  onChange: (brandName: string) => void; // The function to call when a brand is checked/unchecked.
}

// This is now a "controlled" component. It is stateless and has no "Apply" button.
export function BrandFilter({ brands, selected, onChange }: BrandFilterProps) {
  return (
    <div className="space-y-4">
      <Label className="font-semibold">Brands</Label>
      <div className="space-y-2">
        {brands.map((brand) => (
          <div key={brand._id} className="flex items-center space-x-2">
            <Checkbox
              id={`brand-${brand._id}`}
              checked={selected.includes(brand.name)}
              onCheckedChange={() => onChange(brand.name)}
            />
            <Label htmlFor={`brand-${brand._id}`} className="font-normal cursor-pointer">
              {brand.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}