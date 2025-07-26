'use client';

import { getCategoryIcon } from '@/lib/icons';

interface CategoryIconProps {
  categoryName: string;
  className?: string;
}

export function CategoryIcon({ categoryName, className = 'w-6 h-6' }: CategoryIconProps) {
  const IconComponent = getCategoryIcon(categoryName);
  return <IconComponent className={className} />;
}

// Alternative emoji-based icon for simpler scenarios
export function CategoryEmoji({ categoryName, className = 'text-2xl' }: CategoryIconProps) {
  const emoji = getCategoryEmoji(categoryName);
  return <span className={className}>{emoji}</span>;
}