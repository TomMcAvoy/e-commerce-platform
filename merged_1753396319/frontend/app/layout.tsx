import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import CategoryNav from '../components/CategoryNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Multi-Vendor E-Commerce Platform',
  description: 'E-commerce platform with dropshipping integration and color-themed categories',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Your Store
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
                <a href="/categories" className="text-gray-700 hover:text-blue-600">Categories</a>
                <a href="/vendors" className="text-gray-700 hover:text-blue-600">Vendors</a>
                <a href="/cart" className="text-gray-700 hover:text-blue-600">Cart</a>
              </nav>
            </div>
          </div>
        </header>
        
        <CategoryNav />
        
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Your Store. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
