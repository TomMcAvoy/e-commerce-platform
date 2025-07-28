'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const categories = [
	{ name: 'All', href: '/social' },
	{ name: 'News', href: '/social/breaking-news' },
	{ name: 'Education', href: '/social/student-life' },
	{ name: 'Politics', href: '/social/centrist-politics' },
];

export function SocialNav() {
	const pathname = usePathname();
	const activeCategory = categories.find((category) => category.href === pathname);

	return (
		<nav className="bg-white shadow-sm border-b">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<Link href="/social" className="flex items-center space-x-2">
						<ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
						<span className="font-bold text-lg">Community</span>
					</Link>
					<div className="flex space-x-4">
						{categories.map((category) => (
							<Button
								key={category.name}
								aschild="true"
								variant={activeCategory?.name === category.name ? 'default' : 'ghost'}
								size="sm"
							>
								<Link href={category.href}>{category.name}</Link>
							</Button>
						))}
					</div>
				</div>
			</div>
		</nav>
	);
}
