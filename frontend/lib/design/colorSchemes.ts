// filepath: /Users/thomasmcavoy/GitHub/shoppingcart/frontend/lib/design/colorSchemes.ts

/**
 * Whitestart System Security Design System
 * Following Project-Specific Conventions for consistent branding
 */

export interface CategoryColors {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  gradient: string;
  text: string;
  accent: string;
  background: string;
  hover: string;
  border: string;
  icon: string;
}

export const categoryColorSchemes: Record<string, CategoryColors> = {
  // Mens Fashion - Professional Grays/Blues
  mens: {
    id: 'mens',
    name: 'Mens Fashion',
    primary: 'rgb(71, 85, 105)', // slate-600
    secondary: 'rgb(51, 65, 85)', // slate-700
    gradient: 'from-slate-600 to-gray-700',
    text: 'text-slate-600 hover:text-slate-700',
    accent: 'rgb(59, 130, 246)', // blue-500
    background: 'bg-slate-50',
    hover: 'hover:bg-slate-100',
    border: 'border-slate-200',
    icon: '👔'
  },

  // Womens Fashion - Elegant Pinks/Roses
  womens: {
    id: 'womens',
    name: 'Womens Fashion',
    primary: 'rgb(236, 72, 153)', // pink-500
    secondary: 'rgb(225, 29, 72)', // rose-600
    gradient: 'from-pink-500 to-rose-600',
    text: 'text-pink-600 hover:text-pink-700',
    accent: 'rgb(251, 113, 133)', // rose-400
    background: 'bg-pink-50',
    hover: 'hover:bg-pink-100',
    border: 'border-pink-200',
    icon: '👗'
  },

  // Cosmetics - Luxury Purples
  cosmetics: {
    id: 'cosmetics',
    name: 'Beauty & Cosmetics',
    primary: 'rgb(168, 85, 247)', // purple-500
    secondary: 'rgb(236, 72, 153)', // pink-500
    gradient: 'from-purple-500 to-pink-500',
    text: 'text-purple-600 hover:text-purple-700',
    accent: 'rgb(196, 181, 253)', // purple-300
    background: 'bg-purple-50',
    hover: 'hover:bg-purple-100',
    border: 'border-purple-200',
    icon: '💄'
  },

  // Sports - Energetic Greens
  sports: {
    id: 'sports',
    name: 'Sports & Fitness',
    primary: 'rgb(34, 197, 94)', // green-500
    secondary: 'rgb(5, 150, 105)', // emerald-600
    gradient: 'from-green-500 to-emerald-600',
    text: 'text-green-600 hover:text-green-700',
    accent: 'rgb(74, 222, 128)', // green-400
    background: 'bg-green-50',
    hover: 'hover:bg-green-100',
    border: 'border-green-200',
    icon: '⚽'
  },

  // Hardware - Industrial Oranges/Reds
  hardware: {
    id: 'hardware',
    name: 'Tools & Hardware',
    primary: 'rgb(249, 115, 22)', // orange-500
    secondary: 'rgb(220, 38, 38)', // red-600
    gradient: 'from-orange-500 to-red-600',
    text: 'text-orange-600 hover:text-orange-700',
    accent: 'rgb(251, 146, 60)', // orange-400
    background: 'bg-orange-50',
    hover: 'hover:bg-orange-100',
    border: 'border-orange-200',
    icon: '🔧'
  },

  // Electronics - Tech Blues
  electronics: {
    id: 'electronics',
    name: 'Electronics & Gaming',
    primary: 'rgb(59, 130, 246)', // blue-500
    secondary: 'rgb(79, 70, 229)', // indigo-600
    gradient: 'from-blue-500 to-indigo-600',
    text: 'text-blue-600 hover:text-blue-700',
    accent: 'rgb(96, 165, 250)', // blue-400
    background: 'bg-blue-50',
    hover: 'hover:bg-blue-100',
    border: 'border-blue-200',
    icon: '📱'
  },

  // Home & Garden - Warm Ambers
  home: {
    id: 'home',
    name: 'Home & Garden',
    primary: 'rgb(245, 158, 11)', // amber-500
    secondary: 'rgb(249, 115, 22)', // orange-500
    gradient: 'from-amber-500 to-orange-500',
    text: 'text-amber-600 hover:text-amber-700',
    accent: 'rgb(251, 191, 36)', // amber-400
    background: 'bg-amber-50',
    hover: 'hover:bg-amber-100',
    border: 'border-amber-200',
    icon: '🏠'
  },

  // Baby & Kids - Cheerful Yellows
  baby: {
    id: 'baby',
    name: 'Baby & Kids',
    primary: 'rgb(250, 204, 21)', // yellow-400
    secondary: 'rgb(245, 158, 11)', // amber-500
    gradient: 'from-yellow-400 to-amber-500',
    text: 'text-yellow-600 hover:text-yellow-700',
    accent: 'rgb(254, 240, 138)', // yellow-200
    background: 'bg-yellow-50',
    hover: 'hover:bg-yellow-100',
    border: 'border-yellow-200',
    icon: '👶'
  },

  // Health & Wellness - Calming Teals
  health: {
    id: 'health',
    name: 'Health & Wellness',
    primary: 'rgb(20, 184, 166)', // teal-500
    secondary: 'rgb(5, 150, 105)', // emerald-600
    gradient: 'from-teal-500 to-emerald-600',
    text: 'text-teal-600 hover:text-teal-700',
    accent: 'rgb(45, 212, 191)', // teal-400
    background: 'bg-teal-50',
    hover: 'hover:bg-teal-100',
    border: 'border-teal-200',
    icon: '🏥'
  },

  // Default/All Products - Security Blue
  all: {
    id: 'all',
    name: 'All Products',
    primary: 'rgb(59, 130, 246)', // blue-500
    secondary: 'rgb(29, 78, 216)', // blue-700
    gradient: 'from-blue-500 to-blue-700',
    text: 'text-blue-600 hover:text-blue-700',
    accent: 'rgb(96, 165, 250)', // blue-400
    background: 'bg-blue-50',
    hover: 'hover:bg-blue-100',
    border: 'border-blue-200',
    icon: '🛍️'
  },

  // Social Feed - Sky Blues
  social: {
    id: 'social',
    name: 'Security Community',
    primary: 'rgb(14, 165, 233)', // sky-500
    secondary: 'rgb(59, 130, 246)', // blue-500
    gradient: 'from-sky-500 to-blue-500',
    text: 'text-sky-600 hover:text-sky-700',
    accent: 'rgb(56, 189, 248)', // sky-400
    background: 'bg-sky-50',
    hover: 'hover:bg-sky-100',
    border: 'border-sky-200',
    icon: '👥'
  }
};

/**
 * Get color scheme for specific category
 */
export const getCategoryColors = (categoryId: string): CategoryColors => {
  return categoryColorSchemes[categoryId] || categoryColorSchemes.all;
};

/**
 * Get all category colors for navigation
 */
export const getAllCategoryColors = (): CategoryColors[] => {
  return Object.values(categoryColorSchemes);
};

/**
 * Brand colors for Whitestart System Security
 */
export const brandColors = {
  primary: 'rgb(59, 130, 246)', // blue-500
  secondary: 'rgb(71, 85, 105)', // slate-600
  accent: 'rgb(34, 197, 94)', // green-500 for verified badges
  danger: 'rgb(239, 68, 68)', // red-500
  warning: 'rgb(245, 158, 11)', // amber-500
  success: 'rgb(34, 197, 94)', // green-500
  
  // Gradients
  primaryGradient: 'from-blue-600 to-blue-800',
  securityGradient: 'from-slate-600 to-slate-800',
  successGradient: 'from-green-500 to-emerald-600'
};

/**
 * Component-specific color utilities
 */
export const componentColors = {
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  },
  
  badge: {
    verified: 'bg-green-500 text-white',
    discount: 'bg-red-500 text-white',
    new: 'bg-blue-500 text-white',
    featured: 'bg-purple-500 text-white'
  },
  
  status: {
    success: 'text-green-600 bg-green-50 border-green-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200'
  }
};
