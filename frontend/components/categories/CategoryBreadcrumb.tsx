import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface CategoryBreadcrumbProps {
  category: {
    name: string;
    path: string;
    parentCategory?: {
      name: string;
      slug: string;
    };
  };
}

export function CategoryBreadcrumb({ category }: CategoryBreadcrumbProps) {
  const pathSegments = category.path.split('/');
  
  return (
    <nav className="bg-gray-800 py-4 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link 
              href="/" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>
          </li>
          
          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
          
          <li>
            <Link 
              href="/categories" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Categories
            </Link>
          </li>
          
          {pathSegments.length > 1 && category.parentCategory && (
            <>
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
              <li>
                <Link 
                  href={`/categories/${category.parentCategory.slug}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {category.parentCategory.name}
                </Link>
              </li>
            </>
          )}
          
          <ChevronRightIcon className="h-4 w-4 text-gray-500" />
          
          <li className="text-white font-medium">
            {category.name}
          </li>
        </ol>
      </div>
    </nav>
  );
}