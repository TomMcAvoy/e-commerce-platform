import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

/**
 * Comprehensive Footer Component following Component Organization patterns.
 * Displays company info, site links, a newsletter form, and trust signals.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info & Social */}
          <div className="space-y-4">
            <Logo className="h-10 w-auto" />
            <p className="text-sm text-gray-400">
              Leading provider of advanced security solutions to protect your assets with cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/products" className="text-sm text-gray-400 hover:text-white">All Products</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="/help" className="text-sm text-gray-400 hover:text-white">Help Center</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link href="/shipping" className="text-sm text-gray-400 hover:text-white">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-white">Stay Connected</h3>
            <p className="mt-4 text-sm text-gray-400">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="mt-4 flex">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                required
                placeholder="Your email"
                className="w-full min-w-0 appearance-none rounded-l-md border-0 bg-gray-700 px-3 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                className="inline-flex flex-shrink-0 items-center justify-center rounded-r-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 border-t border-gray-700 pt-8">
          <div className="flex flex-col-reverse items-center justify-between gap-y-4 md:flex-row">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Whitestart System Security Inc. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-2">
              {/* Placeholder Payment Icons */}
              <div className="flex h-8 w-12 items-center justify-center rounded-md bg-white text-xs font-semibold text-gray-600">Visa</div>
              <div className="flex h-8 w-12 items-center justify-center rounded-md bg-white text-xs font-semibold text-gray-600">MC</div>
              <div className="flex h-8 w-12 items-center justify-center rounded-md bg-white text-xs font-semibold text-gray-600">PayPal</div>
              <div className="flex h-8 w-12 items-center justify-center rounded-md bg-white text-xs font-semibold text-gray-600">Amex</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}