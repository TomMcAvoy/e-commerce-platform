'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
    >
      {/* Home link */}
      <Link 
        href="/"
        className="flex items-center hover:text-blue-600 transition-colors"
        aria-label="Home"
      >
        <HomeIcon className="w-4 h-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          
          {item.href && !item.isCurrentPage ? (
            <Link 
              href={item.href}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={`${
                item.isCurrentPage 
                  ? 'text-gray-900 font-medium' 
                  : 'text-gray-600'
              }`}
              aria-current={item.isCurrentPage ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// Helper function to generate breadcrumbs from URL path
export function generateBreadcrumbs(pathname: string, categoryData?: any): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = '/' + segments.slice(0, i + 1).join('/');
    const isCurrentPage = i === segments.length - 1;

    // Customize labels based on route
    let label = formatSegmentLabel(segment);
    
    // If we have category data, use the actual category name
    if (segment === 'categories' && i < segments.length - 1) {
      label = 'Categories';
    } else if (categoryData && segments[i - 1] === 'categories') {
      label = categoryData.name || formatSegmentLabel(segment);
    }

    breadcrumbs.push({
      label,
      href: isCurrentPage ? undefined : href,
      isCurrentPage,
    });
  }

  return breadcrumbs;
}

// Format URL segments into readable labels
function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}