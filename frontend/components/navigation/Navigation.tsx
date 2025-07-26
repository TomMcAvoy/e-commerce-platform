'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/categories', label: 'Categories' },
    { href: '/cart', label: 'Cart' },
    { href: '/debug', label: 'Debug' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              Whitestart Security
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
