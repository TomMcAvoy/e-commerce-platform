'use client';

import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
}

export function PaginationControls({ 
  currentPage, 
  totalPages, 
  baseUrl, 
  className = '' 
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const generatePageUrl = (page: number) => {
    const url = new URL(baseUrl, window.location.origin);
    url.searchParams.set('page', page.toString());
    return url.pathname + url.search;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Number of page buttons to show
    const halfShow = Math.floor(showPages / 2);
    
    let startPage = Math.max(1, currentPage - halfShow);
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    // First page + ellipsis
    if (startPage > 1) {
      pages.push(
        <Link
          key={1}
          href={generatePageUrl(1)}
          className="px-3 py-2 text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          1
        </Link>
      );
      
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-3 py-2 text-sm text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <Link
          key={page}
          href={generatePageUrl(page)}
          className={`px-3 py-2 text-sm border transition-colors ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      );
    }

    // Last page + ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-3 py-2 text-sm text-gray-500">
            ...
          </span>
        );
      }
      
      pages.push(
        <Link
          key={totalPages}
          href={generatePageUrl(totalPages)}
          className="px-3 py-2 text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* Previous button */}
      <Link
        href={generatePageUrl(Math.max(1, currentPage - 1))}
        className={`flex items-center px-3 py-2 text-sm border border-gray-300 rounded-l-md transition-colors ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-50'
        }`}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Previous
      </Link>

      {/* Page numbers */}
      <div className="flex">
        {renderPageNumbers()}
      </div>

      {/* Next button */}
      <Link
        href={generatePageUrl(Math.min(totalPages, currentPage + 1))}
        className={`flex items-center px-3 py-2 text-sm border border-gray-300 rounded-r-md transition-colors ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-50'
        }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
        <ChevronRightIcon className="w-4 h-4 ml-1" />
      </Link>
    </div>
  );
}

// Utility component for pagination info
export function PaginationInfo({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage 
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="text-sm text-gray-600">
      Showing {startItem} to {endItem} of {totalItems} results
    </div>
  );
}