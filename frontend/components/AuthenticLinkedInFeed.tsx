'use client'
import React, { useState } from 'react'
import { User, MoreHorizontal, ThumbsUp, MessageCircle, Share, Send, Smile, Image, Calendar, FileText, TrendingUp, Eye, Globe, Camera, Video, Plus, X, MapPin, Building, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react'

interface AuthenticPost {
  id: string
  author: {
    name: string
    title: string
    company?: string
    avatar?: string
    verified?: boolean
    isConnection?: boolean
    connectionLevel?: '1st' | '2nd' | '3rd'
    premium?: boolean
  }
  timestamp: string
  visibility: 'public' | 'connections' | 'company'
  content: string
  hashtags?: string[]
  mentions?: string[]
  media?: {
    type: 'image' | 'video' | 'document' | 'article' | 'poll' | 'carousel'
    url?: string
    title?: string
    description?: string
    thumbnail?: string
  }
  engagement: {
    likes: number
    loves: number
    celebrates: number
    supports: number
    comments: number
    shares: number
    reposts: number
  }
  userReactions?: {
    liked?: boolean
    reactionType?: 'like' | 'love' | 'celebrate' | 'support' | 'insightful' | 'funny'
  }
  promoted?: boolean
  isSponsored?: boolean
  location?: string
}

const samplePosts: AuthenticPost[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      title: 'Senior Product Manager',
      company: 'Microsoft',
      verified: true,
      isConnection: true,
      connectionLevel: '1st',
      premium: true
    },
    timestamp: '2h',
    visibility: 'public',
    content: `🚀 Excited to announce that our team just shipped a major update to Microsoft Teams!

After 6 months of research, design, and development, we're rolling out AI-powered meeting summaries that will save teams hours every week.

Key features:
• Real-time transcription with 99% accuracy
• Automatic action item extraction
• Smart meeting insights and analytics
• Integration with Microsoft 365 ecosystem

Huge thanks to my incredible team - none of this would be possible without your dedication and expertise. Special shoutout to Alex Rodriguez, Maya Patel, and the entire engineering crew who made this vision a reality.

What's your biggest productivity challenge in remote meetings? I'd love to hear your thoughts! 👇

#ProductManagement #Microsoft #AI #Innovation #TeamWork #RemoteWork #MeetingProductivity`,
    hashtags: ['ProductManagement', 'Microsoft', 'AI', 'Innovation', 'TeamWork', 'RemoteWork', 'MeetingProductivity'],
    mentions: ['Alex Rodriguez', 'Maya Patel'],
    media: {
      type: 'image',
      url: '/api/placeholder/600/400',
      title: 'Microsoft Teams AI Meeting Summary Feature',
      description: 'Screenshot showing the new AI-powered meeting summary interface'
    },
    engagement: {
      likes: 847,
      loves: 23,
      celebrates: 156,
      supports: 12,
      comments: 89,
      shares: 67,
      reposts: 34
    },
    userReactions: {
      liked: false
    },
    location: 'Seattle, WA'
  },
  {
    id: '2',
    author: {
      name: 'LinkedIn News',
      title: 'The latest news and insights',
      verified: true,
      isConnection: false,
      premium: false
    },
    timestamp: '4h',
    visibility: 'public',
    content: `📊 BREAKING: Tech industry sees 40% increase in AI-related job postings this quarter

New LinkedIn data reveals the most in-demand AI skills:

🔥 Machine Learning Engineering (+67%)
🔥 Natural Language Processing (+54%)
🔥 Computer Vision (+48%)
🔥 MLOps and AI Infrastructure (+71%)
🔥 Prompt Engineering (+89%)

Industries leading the charge:
• Technology (obviously) 
• Financial Services
• Healthcare & Life Sciences
• Retail & E-commerce
• Manufacturing

The average salary for AI roles has increased by 32% year-over-year, with senior positions commanding $180K-$350K+ in major tech hubs.

Are you upskilling in AI? What skills are you focusing on? Share your AI learning journey below! 

Full report and methodology in the comments 👇

#ArtificialIntelligence #JobMarket #TechCareers #MachineLearning #CareerGrowth #SkillDevelopment #FutureOfWork`,
    hashtags: ['ArtificialIntelligence', 'JobMarket', 'TechCareers', 'MachineLearning', 'CareerGrowth', 'SkillDevelopment', 'FutureOfWork'],
    engagement: {
      likes: 3247,
      loves: 89,
      celebrates: 567,
      supports: 234,
      comments: 423,
      shares: 289,
      reposts: 156
    },
    userReactions: {
      liked: true,
      reactionType: 'celebrate'
    },
    isSponsored: false
  },
  {
    id: '3',
    author: {
      name: 'James Wilson',
      title: 'Full Stack Developer',
      company: 'Startup Inc.',
      verified: false,
      isConnection: true,
      connectionLevel: '1st',
      premium: false
    },
    timestamp: '6h',
    visibility: 'public',
    content: `💡 Just finished my first hackathon and WON! 🏆

48 hours, 3 cups of coffee, and countless debugging sessions later - our team built an AI-powered code review assistant that caught 94% of bugs in our test dataset.

Tech stack:
• Frontend: React + TypeScript + Tailwind CSS
• Backend: Node.js + Express + MongoDB
• AI/ML: OpenAI GPT-4 + Custom training on 10K+ code samples
• Deployment: Docker + AWS Lambda + CloudFront

What I learned:
✅ MVPs don't have to be perfect - they just need to work
✅ Team collaboration is everything in high-pressure situations
✅ Sometimes the simplest solution is the best solution
✅ Sleep is optional, but coffee is not ☕

Already got 3 VCs interested and potential customers reaching out. This might be the start of something big!

To anyone hesitant about joining a hackathon - DO IT. The experience is invaluable.

What's the most exciting project you've worked on recently? Drop a comment! 👇

#Hackathon #Coding #AI #Startup #WebDevelopment #React #NodeJS #Innovation #Entrepreneurship`,
    hashtags: ['Hackathon', 'Coding', 'AI', 'Startup', 'WebDevelopment', 'React', 'NodeJS', 'Innovation', 'Entrepreneurship'],
    media: {
      type: 'carousel',
      url: '/api/placeholder/600/400',
      title: 'Hackathon Winner - Code Review AI Assistant',
      description: 'Screenshots of our winning hackathon project'
    },
    engagement: {
      likes: 234,
      loves: 45,
      celebrates: 123,
      supports: 78,
      comments: 67,
      shares: 23,
      reposts: 12
    },
    userReactions: {
      liked: false
    },
    location: 'San Francisco, CA'
  },
  {
    id: '4',
    author: {
      name: 'Dr. Emily Rodriguez',
      title: 'Chief Technology Officer',
      company: 'HealthTech Solutions',
      verified: true,
      isConnection: false,
      connectionLevel: '2nd',
      premium: true
    },
    timestamp: '1d',
    visibility: 'public',
    content: `🏥 Healthcare + AI = Lives Saved

Today marks the 1-year anniversary of launching our AI diagnostic platform, and the results are incredible:

📈 Key Metrics:
• 2.3M+ patients analyzed
• 89% diagnostic accuracy improvement
• 60% reduction in time-to-diagnosis
• $12M+ in healthcare cost savings
• 99.7% patient satisfaction rate

Real Impact Stories:
👩‍⚕️ Emergency rooms using our platform detect critical conditions 40% faster
🔬 Radiologists can now review 3x more scans with higher confidence
🏥 Small clinics in rural areas access specialist-level diagnostics

But here's what matters most - we've helped save over 1,200 lives by catching critical conditions early.

The intersection of healthcare and technology isn't just about innovation - it's about human impact. Every algorithm we write, every model we train, every feature we ship has the potential to save someone's life.

To my fellow healthcare technologists: What we do matters. Keep building, keep innovating, keep saving lives.

What healthcare challenge do you think technology should solve next?

#HealthTech #AI #Healthcare #Innovation #DigitalHealth #MedTech #PatientCare #HealthcareInnovation`,
    hashtags: ['HealthTech', 'AI', 'Healthcare', 'Innovation', 'DigitalHealth', 'MedTech', 'PatientCare', 'HealthcareInnovation'],
    media: {
      type: 'video',
      url: '/api/placeholder/600/400',
      title: 'AI Diagnostic Platform in Action',
      description: 'Demo video showing how our AI platform assists doctors in real-time'
    },
    engagement: {
      likes: 1567,
      loves: 234,
      celebrates: 89,
      supports: 456,
      comments: 234,
      shares: 156,
      reposts: 78
    },
    userReactions: {
      liked: true,
      reactionType: 'support'
    },
    location: 'Boston, MA',
    promoted: true
  }
]

export default function AuthenticLinkedInFeed() {
  const [posts, setPosts] = useState<AuthenticPost[]>(samplePosts)
  const [showPostForm, setShowPostForm] = useState(false)
  const [postContent, setPostContent] = useState('')

  const handleReaction = (postId: string, reactionType: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const currentReaction = post.userReactions?.reactionType
        const wasLiked = post.userReactions?.liked
        
        // Toggle reaction logic
        if (wasLiked && currentReaction === reactionType) {
          // Remove reaction
          return {
            ...post,
            userReactions: { liked: false },
            engagement: {
              ...post.engagement,
              [reactionType === 'like' ? 'likes' : reactionType + 's']: 
                post.engagement[reactionType === 'like' ? 'likes' : reactionType + 's' as keyof typeof post.engagement] - 1
            }
          }
        } else {
          // Add new reaction (remove old one if exists)
          const updatedEngagement = { ...post.engagement }
          
          if (wasLiked && currentReaction) {
            updatedEngagement[currentReaction === 'like' ? 'likes' : currentReaction + 's' as keyof typeof updatedEngagement]--
          }
          
          updatedEngagement[reactionType === 'like' ? 'likes' : reactionType + 's' as keyof typeof updatedEngagement]++
          
          return {
            ...post,
            userReactions: { liked: true, reactionType: reactionType as any },
            engagement: updatedEngagement
          }
        }
      }
      return post
    }))
  }

  return (
    <div className="space-y-4 max-w-none">
      {/* Create Post Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-gray-600" />
          </div>
          <button 
            onClick={() => setShowPostForm(true)}
            className="flex-1 text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Start a post
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <PostButton icon={Image} label="Photo" color="text-blue-500" />
          <PostButton icon={Video} label="Video" color="text-green-500" />
          <PostButton icon={Calendar} label="Event" color="text-orange-500" />
          <PostButton icon={FileText} label="Write article" color="text-red-500" />
        </div>
      </div>

      {/* Posts Feed */}
      {posts.map((post) => (
        <AuthenticPostCard 
          key={post.id} 
          post={post} 
          onReaction={handleReaction}
        />
      ))}

      {/* Load More */}
      <div className="text-center py-8">
        <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors">
          Show more posts
        </button>
      </div>
    </div>
  )
}

function PostButton({ icon: Icon, label, color }: { icon: any, label: string, color: string }) {
  return (
    <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
      <Icon className={`h-5 w-5 ${color}`} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  )
}

function AuthenticPostCard({ post, onReaction }: { 
  post: AuthenticPost, 
  onReaction: (postId: string, reactionType: string) => void
}) {
  const [showComments, setShowComments] = useState(false)
  const [showReactions, setShowReactions] = useState(false)

  const totalReactions = post.engagement.likes + post.engagement.loves + post.engagement.celebrates + post.engagement.supports

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Promoted Label */}
      {post.promoted && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center space-x-2 text-sm text-yellow-800">
            <TrendingUp className="h-4 w-4" />
            <span>Promoted</span>
          </div>
        </div>
      )}

      {/* Post Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            {post.author.premium && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">✧</span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                {post.author.name}
              </h3>
              {post.author.verified && (
                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              )}
              {post.author.connectionLevel && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {post.author.connectionLevel}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600">
              {post.author.title}
              {post.author.company && (
                <span>
                  {' '}at{' '}
                  <span className="hover:text-blue-600 cursor-pointer">{post.author.company}</span>
                </span>
              )}
            </p>
            
            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
              <span>{post.timestamp} •</span>
              <Globe className="h-3 w-3" />
              {post.location && (
                <>
                  <span>•</span>
                  <MapPin className="h-3 w-3" />
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!post.author.isConnection && (
              <button className="text-blue-600 border border-blue-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">
                + Follow
              </button>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <div className="text-gray-900 whitespace-pre-line text-sm leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* Post Media */}
      {post.media && (
        <div className="px-4 pb-3">
          {post.media.type === 'image' && (
            <div className="relative">
              <img 
                src={post.media.url} 
                alt={post.media.title} 
                className="w-full rounded-lg object-cover max-h-96 cursor-pointer hover:opacity-95 transition-opacity" 
              />
              {post.media.title && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 text-sm">{post.media.title}</h4>
                  {post.media.description && (
                    <p className="text-xs text-gray-600 mt-1">{post.media.description}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {post.media.type === 'video' && (
            <div className="relative bg-black rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-70" />
                  <p className="text-sm">Video: {post.media.title}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
              {totalReactions > 0 && (
                <>
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <ThumbsUp className="h-2.5 w-2.5 text-white" />
                    </div>
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">❤</span>
                    </div>
                    <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🎉</span>
                    </div>
                  </div>
                  <span>{totalReactions.toLocaleString()}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="hover:text-blue-600 transition-colors"
            >
              {post.engagement.comments} comments
            </button>
            <span>{post.engagement.reposts} reposts</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="relative">
            <ActionButton
              icon={ThumbsUp}
              label="Like"
              active={post.userReactions?.liked && post.userReactions?.reactionType === 'like'}
              onClick={() => onReaction(post.id, 'like')}
              onHover={() => setShowReactions(true)}
              onLeave={() => setShowReactions(false)}
            />
            
            {/* Reaction Picker */}
            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-full shadow-lg px-2 py-1 flex items-center space-x-1 z-10">
                {[
                  { type: 'like', emoji: '👍', color: 'text-blue-600' },
                  { type: 'love', emoji: '❤️', color: 'text-red-500' },
                  { type: 'celebrate', emoji: '🎉', color: 'text-yellow-500' },
                  { type: 'support', emoji: '💪', color: 'text-green-500' },
                  { type: 'insightful', emoji: '💡', color: 'text-yellow-600' },
                  { type: 'funny', emoji: '😂', color: 'text-orange-500' }
                ].map((reaction) => (
                  <button
                    key={reaction.type}
                    onClick={() => onReaction(post.id, reaction.type)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <span className="text-lg">{reaction.emoji}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <ActionButton
            icon={MessageCircle}
            label="Comment"
            onClick={() => setShowComments(!showComments)}
          />
          <ActionButton
            icon={Share}
            label="Repost"
          />
          <ActionButton
            icon={Send}
            label="Send"
          />
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-start space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          {/* Sample Comments */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">Mike Johnson</span>
                    <span className="text-xs text-gray-500">2h</span>
                  </div>
                  <p className="text-sm text-gray-800">Great insights! This is exactly what our industry needs.</p>
                </div>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <button className="hover:text-blue-600">Like</button>
                  <button className="hover:text-blue-600">Reply</button>
                  <span>3 likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionButton({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick,
  onHover,
  onLeave
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  onClick?: () => void,
  onHover?: () => void,
  onLeave?: () => void
}) {
  return (
    <button 
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex-1 ${
        active ? 'text-blue-600' : 'text-gray-600'
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-blue-600 fill-current' : ''}`} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}
