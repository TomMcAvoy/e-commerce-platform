'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(createPageUrl(page));
    }
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && goToPage(page)}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}