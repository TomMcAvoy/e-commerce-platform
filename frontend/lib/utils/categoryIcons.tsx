import {
  ShieldCheckIcon,
  ComputerDesktopIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
  CameraIcon,
  LockClosedIcon,
  ExclamationTriangleIcon,
  WifiIcon,
  DevicePhoneMobileIcon,
  TruckIcon,
  BeakerIcon,
  CogIcon
} from '@heroicons/react/24/outline';

/**
 * Category icon mapping following Project-Specific Conventions
 * Maps category slugs to Heroicons components for consistent UI
 */

interface CategoryIconProps {
  className?: string;
}

// Icon mapping based on your seeded categories
const CATEGORY_ICON_MAP: Record<string, React.ComponentType<CategoryIconProps>> = {
  // Main Categories (Level 0)
  'security-surveillance': ShieldCheckIcon,
  'electronics-technology': ComputerDesktopIcon,
  'home-garden': HomeIcon,
  'tools-equipment': WrenchScrewdriverIcon,
  'automotive': TruckIcon,
  'health-beauty': BeakerIcon,
  'fashion-apparel': DevicePhoneMobileIcon, // Using mobile icon as placeholder
  'sports-outdoors': CogIcon, // Using cog icon as placeholder
  
  // Subcategories (Level 1)
  'surveillance-cameras': CameraIcon,
  'access-control': LockClosedIcon,
  'alarm-systems': ExclamationTriangleIcon,
  'smart-home-security': WifiIcon,
  
  // Default fallback
  'default': ShieldCheckIcon
};

/**
 * Get appropriate icon component for a category slug
 * Following Error Handling Pattern with safe fallbacks
 */
export function getCategoryIcon(slug: string): React.ComponentType<CategoryIconProps> {
  if (!slug || typeof slug !== 'string') {
    return CATEGORY_ICON_MAP.default;
  }
  
  return CATEGORY_ICON_MAP[slug] || CATEGORY_ICON_MAP.default;
}

/**
 * Get all available category icons for admin/management interfaces
 * Following Architecture Patterns for reusable utilities
 */
export function getAllCategoryIcons(): Record<string, React.ComponentType<CategoryIconProps>> {
  return { ...CATEGORY_ICON_MAP };
}

/**
 * Render category icon with consistent styling
 * Following Frontend Structure patterns for component composition
 */
interface CategoryIconRendererProps {
  slug: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function CategoryIconRenderer({ 
  slug, 
  className = '', 
  size = 'md' 
}: CategoryIconRendererProps) {
  const IconComponent = getCategoryIcon(slug);
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };
  
  const combinedClassName = `${sizeClasses[size]} ${className}`.trim();
  
  return <IconComponent className={combinedClassName} />;
}

/**
 * Type definitions for TypeScript safety
 * Following Project-Specific Conventions for type safety
 */
export type CategorySlug = keyof typeof CATEGORY_ICON_MAP;
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

// Export constants for use in other components
export const AVAILABLE_CATEGORY_SLUGS = Object.keys(CATEGORY_ICON_MAP) as CategorySlug[];
export const DEFAULT_CATEGORY_ICON = CATEGORY_ICON_MAP.default;