'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Slider } from '@/components/ui/Slider';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

interface PriceRangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
}

export function PriceRangeSlider({ value, onChange, minPrice, maxPrice }: PriceRangeSliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialMin = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : minPrice;
  const initialMax = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : maxPrice;

  const [priceRange, setPriceRange] = useState<[number, number]>([initialMin, initialMax]);

  useEffect(() => {
    const min = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : minPrice;
    const max = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : maxPrice;
    setPriceRange([min, max]);
  }, [searchParams, minPrice, maxPrice]);

  const handleApplyFilter = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('minPrice', priceRange[0].toString());
    current.set('maxPrice', priceRange[1].toString());
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${window.location.pathname}${query}`);
  };

  const handleInputChange = (index: 0 | 1, inputValue: string) => {
    const newValue = Number(inputValue);
    const newRange = [...value] as [number, number];
    newRange[index] = newValue;
    onChange(newRange);
  };

  return (
    <div className="space-y-4">
      <Label className="font-semibold">Price Range</Label>
      <Slider
        min={minPrice}
        max={maxPrice}
        step={10}
        value={value}
        onValueChange={(val) => onChange(val as [number, number])}
        className="my-4"
      />
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">$</span>
          <Input
            type="number"
            value={value[0]}
            onChange={(e) => handleInputChange(0, e.target.value)}
            className="w-24"
          />
        </div>
        <span className="text-gray-500">-</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">$</span>
          <Input
            type="number"
            value={value[1]}
            onChange={(e) => handleInputChange(1, e.target.value)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}