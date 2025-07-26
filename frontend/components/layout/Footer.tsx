import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo className="h-8 w-auto" />
              <span className="font-bold text-xl text-gray-800">ShopSec</span>
            </Link>
            <p className="text-sm text-gray-600">Your trusted marketplace for security and surveillance equipment.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories" className="text-gray-600 hover:text-blue-600">Categories</Link></li>
              <li><Link href="/products" className="text-gray-600 hover:text-blue-600">All Products</Link></li>
              <li><Link href="/vendors" className="text-gray-600 hover:text-blue-600">Vendors</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-blue-600">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link></li>
              <li><Link href="/register" className="text-gray-600 hover:text-blue-600">Register</Link></li>
              <li><Link href="/account/orders" className="text-gray-600 hover:text-blue-600">My Orders</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ShopSecurity Inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}