import Link from 'next/link';
import Image from 'next/image';
import type { Vendor } from '@/lib/types';

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const logoUrl = vendor.logoUrl || '/images/placeholder.svg';

  return (
    <Link
      href={`/vendors/${vendor.slug}`}
      className="group block bg-gray-800 border border-gray-700 rounded-lg shadow-md hover:shadow-violet-500/20 hover:border-violet-700 transition-all duration-300"
    >
      <div className="flex items-center p-4">
        <div className="relative w-16 h-16 mr-4 flex-shrink-0 bg-white/10 rounded-md p-1">
          <Image
            src={logoUrl}
            alt={`${vendor.name} logo`}
            fill
            sizes="64px"
            className="object-contain rounded-sm"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-100 group-hover:text-violet-400 transition-colors">
            {vendor.name}
          </h3>
          {vendor.tagline && (
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">{vendor.tagline}</p>
          )}
        </div>
      </div>
    </Link>
  );
}