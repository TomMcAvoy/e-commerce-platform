'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export function SocialNav() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/social" className="flex items-center space-x-2">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">Community</span>
          </Link>
          <div className="flex space-x-4">
            <Button aschild="true" variant="ghost" size="sm">
              <Link href="/social/breaking-news">News</Link>
            </Button>
            <Button aschild="true" variant="ghost" size="sm">
              <Link href="/social/student-life">Education</Link>
            </Button>
            <Button aschild="true" variant="ghost" size="sm">
              <Link href="/social/centrist-politics">Politics</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
