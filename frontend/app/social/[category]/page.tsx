import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShieldCheckIcon, 
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { SocialPostCard } from '@/components/social/SocialPostCard';
import { SocialNav } from '@/components/layout/SocialNav';
import { Button } from '@/components/ui/Button';
import { IPost } from '@/types';

interface CategoryPageProps {
  params: { category: string };
}

const categoryConfig = {
  'left-wing-politics': {
    name: 'Progressive Politics',
    description: 'Discussions on progressive policies and social justice',
    safetyLevel: 'adults' as const,
    color: 'bg-blue-500'
  },
  'right-wing-politics': {
    name: 'Conservative Politics', 
    description: 'Conservative viewpoints and traditional values',
    safetyLevel: 'adults' as const,
    color: 'bg-red-500'
  },
  'centrist-politics': {
    name: 'Centrist & Moderate Politics',
    description: 'Balanced political discussions and bipartisan solutions',
    safetyLevel: 'teens' as const,
    color: 'bg-purple-500'
  },
  'student-life': {
    name: 'Student Life & Education',
    description: 'School discussions and educational content',
    safetyLevel: 'kids' as const,
    color: 'bg-indigo-500'
  },
  'teen-zone': {
    name: 'Teen Zone',
    description: 'Safe space for teenagers',
    safetyLevel: 'teens' as const,
    color: 'bg-pink-500'
  },
  'breaking-news': {
    name: 'Breaking News',
    description: 'Latest news and current events',
    safetyLevel: 'teens' as const,
    color: 'bg-orange-500'
  }
} as const;

function getSafetyBadge(level: 'kids' | 'teens' | 'adults') {
  switch (level) {
    case 'kids':
      return (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
          Kid-Safe
        </span>
      );
    case 'teens':
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
          Teen-Friendly
        </span>
      );
    case 'adults':
      return (
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
          Adult Content
        </span>
      );
    default:
      return null;
  }
};

// This page component must be a default export to be recognized by Next.js.
export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;

  if (!(category in categoryConfig)) {
    notFound();
  }

  const config = categoryConfig[category as keyof typeof categoryConfig];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/social" className="flex items-center">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Communities
          </Link>
        </Button>
      </div>

      {/* Category Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-lg ${config.color}`}>
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{config.name}</CardTitle>
                <p className="text-gray-600 mt-1">{config.description}</p>
              </div>
            </div>
            {getSafetyBadge(config.safetyLevel)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <ShieldCheckIcon className="w-4 h-4 mr-1 text-green-600" />
              Moderated Community
            </span>
            <span>•</span>
            <span>Active discussions welcome</span>
            <span>•</span>
            <span>Stay on topic or suggest channel changes</span>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Content */}
      <Card className="text-center py-12">
        <CardContent>
          <div className="space-y-4">
            <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-600">Discussion Platform Coming Soon</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              We&apos;re building a safe, moderated discussion platform for this category. 
              This will include real-time messaging, topic redirection, and age-appropriate content filtering.
            </p>
            <div className="pt-4">
              <Button asChild variant="outline">
                <Link href="/social">
                  Explore Other Communities
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Info for this category */}
      <Card className="mt-8 bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2" />
            Safety Level: {config.safetyLevel.charAt(0).toUpperCase() + config.safetyLevel.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-700">
          <p className="text-sm">
            This category is designed for {config.safetyLevel} and includes appropriate content filtering, 
            moderation levels, and safety features to ensure a protected discussion environment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Generate static paths for known categories following your patterns
export async function generateStaticParams() {
  return Object.keys(categoryConfig).map((category) => ({
    category: category
  }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const { category } = params;

  if (!(category in categoryConfig)) {
    return {};
  }

  const config = categoryConfig[category as keyof typeof categoryConfig];

  return {
    title: `${config.name} - Discussion Platform`,
    description: config.description,
    keywords: [`${config.name}`, `${config.safetyLevel}`, 'discussion', 'forum'],
    authors: [{ name: 'Your Name', url: 'https://yourwebsite.com' }],
    openGraph: {
      title: `${config.name} - Discussion Platform`,
      description: config.description,
      url: `https://yourwebsite.com/category/${category}`,
      siteName: 'Your Site Name',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${config.name} - Discussion Platform`,
      description: config.description,
      site: 'https://yourwebsite.com',
      creator: 'https://yourwebsite.com/your-profile',
    },
  };
}