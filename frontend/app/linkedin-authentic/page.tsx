import LinkedInLayout from '../../components/LinkedInLayout'
import AuthenticLinkedInFeed from '../../components/AuthenticLinkedInFeed'
import { ArrowLeft, Bookmark, TrendingUp, Users, Briefcase, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default function AuthenticLinkedInPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Banner */}
      <div className="bg-blue-600 text-white p-2 text-center text-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-blue-200">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to E-commerce View</span>
          </Link>
          <div className="font-medium">
            🎯 Authentic LinkedIn Experience - Exact Clone Interface
          </div>
          <div className="w-32"></div> {/* Spacer for center alignment */}
        </div>
      </div>

      <LinkedInLayout
        leftSidebar={<AuthenticLinkedInLeftSidebar />}
        rightSidebar={<AuthenticLinkedInRightSidebar />}
      >
        <AuthenticLinkedInFeed />
      </LinkedInLayout>
    </div>
  )
}

function AuthenticLinkedInLeftSidebar() {
  return (
    <div className="space-y-4">
      {/* Enhanced Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-16 bg-gradient-to-r from-blue-400 to-blue-600 relative">
          <div className="absolute -bottom-6 left-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center relative">
              <img 
                src="/api/placeholder/64/64" 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-8 pb-4 px-4">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer">John Doe</h3>
            <p className="text-sm text-gray-600 mb-1">Senior Software Engineer</p>
            <p className="text-xs text-gray-500">San Francisco Bay Area</p>
          </div>
          
          <hr className="border-gray-200 mb-3" />
          
          <div className="space-y-2">
            <button className="w-full text-left hover:bg-gray-50 p-2 -mx-2 rounded">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Profile viewers</span>
                <span className="font-semibold text-blue-600">127</span>
              </div>
            </button>
            <button className="w-full text-left hover:bg-gray-50 p-2 -mx-2 rounded">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Post impressions</span>
                <span className="font-semibold text-blue-600">2,843</span>
              </div>
            </button>
          </div>
          
          <hr className="border-gray-200 my-3" />
          
          <button className="w-full text-left hover:bg-gray-50 p-2 -mx-2 rounded">
            <div className="text-sm">
              <span className="text-gray-600">Access exclusive tools & insights</span>
              <div className="flex items-center mt-1">
                <div className="w-4 h-4 bg-amber-400 rounded-sm mr-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">◆</span>
                </div>
                <span className="font-semibold text-gray-900">Try Premium for free</span>
              </div>
            </div>
          </button>
          
          <hr className="border-gray-200 my-3" />
          
          <button className="w-full flex items-center text-sm text-gray-600 hover:bg-gray-50 p-2 -mx-2 rounded">
            <Bookmark className="h-4 w-4 mr-2" />
            <span>My items</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Recent</h4>
          <div className="space-y-2">
            {[
              { icon: "👥", name: "React Developers Community", type: "group", members: "125K" },
              { icon: "👥", name: "JavaScript Ninjas", type: "group", members: "89K" },
              { icon: "📅", name: "Tech Conference 2025", type: "event", date: "Mar 15" },
              { icon: "#", name: "reactjs", type: "hashtag", posts: "12K new posts" },
              { icon: "#", name: "webdevelopment", type: "hashtag", posts: "8K new posts" },
              { icon: "🏢", name: "Google", type: "company", followers: "15M" }
            ].map((item, idx) => (
              <button key={idx} className="w-full flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2 -mx-2 rounded">
                <span className="text-base">{item.icon}</span>
                <div className="flex-1 text-left">
                  <div className="truncate font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.members || item.date || item.posts || item.followers}</div>
                </div>
              </button>
            ))}
          </div>
          
          <button className="w-full text-sm text-gray-600 hover:bg-gray-50 p-2 -mx-2 rounded mt-2 text-left font-medium">
            Show more
          </button>
        </div>
      </div>

      {/* Groups */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Groups</h4>
            <button className="text-gray-400 hover:text-gray-600">
              <Users className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {[
              { name: "Full Stack Developers Network", members: "234K", active: true },
              { name: "React & Redux Developers", members: "145K", active: false },
              { name: "Node.js Developers Community", members: "189K", active: true }
            ].map((group, idx) => (
              <button key={idx} className="w-full flex items-center space-x-3 text-sm hover:bg-gray-50 p-2 -mx-2 rounded">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900 truncate">{group.name}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span>{group.members} members</span>
                    {group.active && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="text-green-600">Active</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <button className="w-full text-sm text-gray-600 hover:bg-gray-50 p-2 -mx-2 rounded mt-2 text-left font-medium">
            See all
          </button>
        </div>
      </div>

      {/* Events */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Events</h4>
            <button className="text-blue-600 text-sm font-medium">+ Create</button>
          </div>
          <div className="space-y-3">
            {[
              { name: "AI in Web Development Summit", date: "Mar 20", attendees: "2.1K" },
              { name: "React Conference 2025", date: "Apr 15", attendees: "5.8K" }
            ].map((event, idx) => (
              <div key={idx} className="flex items-start space-x-3 hover:bg-gray-50 p-2 -mx-2 rounded cursor-pointer">
                <div className="w-10 h-10 bg-orange-100 rounded flex flex-col items-center justify-center text-xs">
                  <span className="font-bold text-orange-600">20</span>
                  <span className="text-orange-500">MAR</span>
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 text-sm leading-tight">{event.name}</h5>
                  <p className="text-xs text-gray-500 mt-1">{event.attendees} attendees</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthenticLinkedInRightSidebar() {
  return (
    <div className="space-y-4">
      {/* Add to your feed */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Add to your feed</h4>
          <button className="text-gray-400 hover:text-gray-600">
            <TrendingUp className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { 
              name: "React", 
              followers: "2,847,291", 
              avatar: "R", 
              verified: true, 
              description: "JavaScript library for building user interfaces",
              category: "Technology"
            },
            { 
              name: "OpenAI", 
              followers: "1,432,567", 
              avatar: "AI", 
              verified: true, 
              description: "Advancing artificial intelligence research",
              category: "AI Research"
            },
            { 
              name: "GitHub", 
              followers: "3,156,789", 
              avatar: "GH", 
              verified: true, 
              description: "Where the world builds software",
              category: "Developer Tools"
            }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center relative">
                  <span className="text-blue-600 font-semibold text-sm">{item.avatar}</span>
                  {item.verified && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <h5 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h5>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{item.description}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.followers} followers</span>
                  </div>
                </div>
              </div>
              <button className="text-blue-600 border border-blue-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-50 flex-shrink-0 ml-2">
                + Follow
              </button>
            </div>
          ))}
        </div>
        
        <button className="w-full text-sm text-gray-600 mt-3 hover:bg-gray-50 p-2 -mx-2 rounded font-medium">
          View all recommendations
        </button>
      </div>

      {/* LinkedIn News */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">LinkedIn News</h4>
          <button className="text-gray-400 hover:text-gray-600">
            <TrendingUp className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { 
              title: "AI job market heats up", 
              subtitle: "2h ago", 
              readers: "15,847", 
              trend: "Technology",
              category: "🔥 Top news"
            },
            { 
              title: "Remote work policies evolve", 
              subtitle: "4h ago", 
              readers: "12,234", 
              trend: "Workplace",
              category: "💼 Career"
            },
            { 
              title: "Startup funding rebounds", 
              subtitle: "6h ago", 
              readers: "8,432", 
              trend: "Venture Capital",
              category: "💰 Finance"
            },
            { 
              title: "Green tech investments surge", 
              subtitle: "8h ago", 
              readers: "6,789", 
              trend: "Sustainability",
              category: "🌱 Climate"
            },
            { 
              title: "New coding bootcamp graduates", 
              subtitle: "1d ago", 
              readers: "4,521", 
              trend: "Education",
              category: "🎓 Learning"
            }
          ].map((news, idx) => (
            <div key={idx} className="cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 text-sm leading-tight mb-1">{news.title}</h5>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{news.subtitle}</span>
                    <span>•</span>
                    <span>{news.readers} readers</span>
                  </div>
                  <span className="inline-block mt-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {news.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full text-sm text-gray-600 mt-3 hover:bg-gray-50 p-2 -mx-2 rounded font-medium">
          Show more
        </button>
      </div>

      {/* Today's most viewed courses */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Today's most viewed courses</h4>
          <button className="text-gray-400 hover:text-gray-600">
            <GraduationCap className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { 
              name: "Python for Data Science", 
              instructor: "DataCamp", 
              duration: "6h 30m",
              learners: "45K",
              rating: 4.8
            },
            { 
              name: "React - The Complete Guide", 
              instructor: "Academind", 
              duration: "40h 15m",
              learners: "123K",
              rating: 4.9
            },
            { 
              name: "AWS Solutions Architect", 
              instructor: "A Cloud Guru", 
              duration: "15h 45m",
              learners: "78K",
              rating: 4.7
            }
          ].map((course, idx) => (
            <div key={idx} className="cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 text-sm">{course.name}</h5>
                  <p className="text-xs text-gray-500">{course.instructor}</p>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                    <span>{course.duration}</span>
                    <span>•</span>
                    <span>{course.learners} learners</span>
                    <span>•</span>
                    <span>⭐ {course.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full text-sm text-blue-600 mt-3 hover:bg-blue-50 p-2 -mx-2 rounded font-medium">
          Show more on LinkedIn Learning
        </button>
      </div>

      {/* Footer */}
      <div className="text-center space-y-3 px-4">
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
          {[
            "About", "Accessibility", "Help Center",
            "Privacy & Terms", "Ad Choices", "Advertising", 
            "Business Services", "Get the LinkedIn app", "More"
          ].map((link, idx) => (
            <a key={idx} href="#" className="hover:text-blue-600 hover:underline truncate">
              {link}
            </a>
          ))}
        </div>
        
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <span className="font-bold text-blue-700">LinkedIn</span>
            <span className="ml-1">Corporation © 2025</span>
          </div>
        </div>
      </div>
    </div>
  )
}
