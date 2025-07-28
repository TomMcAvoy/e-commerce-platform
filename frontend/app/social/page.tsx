import Link from 'next/link';
import { Metadata } from 'next';
import { SocialPostCard } from '@/components/social/SocialPostCard';
import { SocialNav } from '@/components/layout/SocialNav';
import { Button } from '@/components/ui/Button';
import { IPost } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  ShieldCheckIcon,
  NewspaperIcon,
  AcademicCapIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Social - Community Discussions',
  description: 'Join safe and moderated community discussions on various topics.',
};

interface SocialCategory {
  id: string;
  name: string;
  description: string;
  iconName: string; // Change from icon component to string
  safetyLevel: 'kids' | 'teens' | 'adults';
  memberCount: number;
  activeDiscussions: number;
  color: string;
}

const socialCategories: SocialCategory[] = [
  {
    id: 'left-wing-politics',
    name: 'Progressive Politics',
    description: 'Discussions on progressive policies, social justice, and left-leaning political viewpoints',
    iconName: 'chat', // Use string identifier instead
    safetyLevel: 'adults',
    memberCount: 2847,
    activeDiscussions: 156,
    color: 'bg-blue-500'
  },
  {
    id: 'right-wing-politics', 
    name: 'Conservative Politics',
    description: 'Conservative viewpoints, traditional values, and right-leaning political discussions',
    iconName: 'chat',
    safetyLevel: 'adults',
    memberCount: 3201,
    activeDiscussions: 189,
    color: 'bg-red-500'
  },
  {
    id: 'centrist-politics',
    name: 'Centrist & Moderate Politics',
    description: 'Balanced political discussions, bipartisan solutions, and moderate viewpoints',
    iconName: 'chat',
    safetyLevel: 'teens',
    memberCount: 1923,
    activeDiscussions: 98,
    color: 'bg-purple-500'
  },
  {
    id: 'breaking-news',
    name: 'Breaking News',
    description: 'Latest news updates, current events, and real-time discussions',
    iconName: 'news',
    safetyLevel: 'teens',
    memberCount: 5642,
    activeDiscussions: 234,
    color: 'bg-orange-500'
  },
  {
    id: 'student-life',
    name: 'Student Life & Education',
    description: 'School discussions, homework help, study groups, and educational content',
    iconName: 'academic',
    safetyLevel: 'kids',
    memberCount: 4521,
    activeDiscussions: 178,
    color: 'bg-indigo-500'
  },
  {
    id: 'teen-zone',
    name: 'Teen Zone',
    description: 'Safe space for teenagers to discuss interests, hobbies, and age-appropriate topics',
    iconName: 'heart',
    safetyLevel: 'teens',
    memberCount: 3847,
    activeDiscussions: 145,
    color: 'bg-pink-500'
  }
];

// Create icon component mapping function
function getIconComponent(iconName: string) {
  switch (iconName) {
    case 'chat':
      return <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />;
    case 'news':
      return <NewspaperIcon className="w-6 h-6 text-white" />;
    case 'academic':
      return <AcademicCapIcon className="w-6 h-6 text-white" />;
    case 'heart':
      return <HeartIcon className="w-6 h-6 text-white" />;
    default:
      return <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />;
  }
}

function getSafetyBadge(level: string) {
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
}

export default function SocialPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Community Discussions</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join safe, moderated conversations in topic-based communities. 
          Our platform protects users with age-appropriate content and active moderation.
        </p>
        <div className="flex items-center justify-center mt-4 space-x-2">
          <ShieldCheckIcon className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-600 font-medium">Protected & Moderated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {socialCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${category.color}`}>
                  {getIconComponent(category.iconName)}
                </div>
                {getSafetyBadge(category.safetyLevel)}
              </div>
              <CardTitle className="text-xl">{category.name}</CardTitle>
              <CardDescription className="text-sm">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <UserGroupIcon className="w-4 h-4 mr-1" />
                  {category.memberCount.toLocaleString()} members
                </span>
                <span className="flex items-center">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                  {category.activeDiscussions} active
                </span>
              </div>
              <Button asChild className="w-full">
                <Link href={`/social/${category.id}`}>
                  Join Discussion
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <ShieldCheckIcon className="w-6 h-6 mr-2" />
            Community Safety Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ul className="space-y-2">
            <li>• <strong>Age-Appropriate Content:</strong> All discussions are moderated for appropriate age groups</li>
            <li>• <strong>Topic Redirection:</strong> Move conversations to appropriate channels when topics drift</li>
            <li>• <strong>Active Moderation:</strong> 24/7 human and AI moderation to ensure safe environments</li>
            <li>• <strong>Report System:</strong> Easy reporting tools to flag inappropriate content</li>
            <li>• <strong>Parental Controls:</strong> Parents can monitor and control their children&apos;s participation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}