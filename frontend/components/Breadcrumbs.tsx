import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

type BreadcrumbItem = {
  label: string;
  href: string;
  active?: boolean;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.label}>
            <div className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              )}
              <Link
                href={item.href}
                className={`ml-2 text-sm font-medium ${
                  item.active
                    ? 'text-gray-500 pointer-events-none'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}