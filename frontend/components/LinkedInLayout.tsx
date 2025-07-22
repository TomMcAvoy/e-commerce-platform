'use client'
import React from 'react'
import { Search, Home, Users, MessageCircle, Bell, Briefcase, User, ChevronDown, Plus, Grid3X3, Play, Bookmark, Eye, ThumbsUp, Send } from 'lucide-react'

interface LinkedInLayoutProps {
  children: React.ReactNode
  rightSidebar?: React.ReactNode
  leftSidebar?: React.ReactNode
}

export default function LinkedInLayout({ children, rightSidebar, leftSidebar }: LinkedInLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Exact LinkedIn Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left side - Logo and Search */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-700 rounded text-white flex items-center justify-center font-bold text-lg">
                  in
                </div>
              </div>
              <div className="relative ml-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-1.5 bg-blue-50 border-0 rounded-md text-sm w-72 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300"
                />
              </div>
            </div>

            {/* Right side - Navigation */}
            <nav className="flex items-center">
              <NavItem icon={Home} label="Home" active />
              <NavItem icon={Users} label="My Network" badge={9} />
              <NavItem icon={Briefcase} label="Jobs" />
              <NavItem icon={MessageCircle} label="Messaging" badge={3} />
              <NavItem icon={Bell} label="Notifications" badge={12} />
              <div className="flex items-center space-x-1 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-md mx-1">
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-gray-600 max-w-16 truncate">Me</span>
                <ChevronDown className="h-3 w-3 text-gray-600" />
              </div>
              <div className="border-l border-gray-300 mx-2 h-8"></div>
              <div className="flex items-center space-x-1 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-md">
                <Grid3X3 className="h-5 w-5 text-gray-600" />
                <span className="text-xs text-gray-600">Work</span>
                <ChevronDown className="h-3 w-3 text-gray-600" />
              </div>
              <div className="text-center cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-md">
                <div className="text-xs text-amber-600 font-medium">Try Premium for</div>
                <div className="text-xs text-amber-600 font-medium">free</div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3">
            {leftSidebar || <LinkedInLeftSidebar />}
          </div>

          {/* Main Feed */}
          <div className="col-span-6">
            {children}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3">
            {rightSidebar || <LinkedInRightSidebar />}
          </div>
        </div>
      </div>
    </div>
  )
}

// Navigation Item Component
function NavItem({ icon: Icon, label, active = false, badge }: { icon: any, label: string, active?: boolean, badge?: number }) {
  return (
    <div className={`flex flex-col items-center cursor-pointer px-3 py-2 rounded-md mx-1 hover:bg-gray-100 ${active ? 'border-b-2 border-gray-800' : ''}`}>
      <div className="relative">
        <Icon className={`h-6 w-6 ${active ? 'text-gray-800' : 'text-gray-600'}`} />
        {badge && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-4 h-4 flex items-center justify-center px-1">
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>
      <span className={`text-xs mt-1 ${active ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>{label}</span>
    </div>
  )
}

// LinkedIn Left Sidebar
function LinkedInLeftSidebar() {
  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-16 bg-gradient-to-r from-blue-400 to-blue-600 relative">
          <div className="absolute -bottom-6 left-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center">
              <User className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="pt-8 pb-4 px-4">
          <h3 className="font-semibold text-gray-900 hover:underline cursor-pointer">John Doe</h3>
          <p className="text-sm text-gray-600 mb-3">Software Engineer at Tech Corp</p>
          
          <hr className="border-gray-200 mb-3" />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Profile viewers</span>
              <span className="font-semibold text-blue-600">42</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Post impressions</span>
              <span className="font-semibold text-blue-600">1,543</span>
            </div>
          </div>
          
          <hr className="border-gray-200 my-3" />
          
          <div className="text-sm">
            <span className="text-gray-600">Access exclusive tools & insights</span>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 bg-amber-400 rounded-sm mr-2"></div>
              <span className="font-semibold text-gray-900">Try Premium for free</span>
            </div>
          </div>
          
          <hr className="border-gray-200 my-3" />
          
          <div className="flex items-center text-sm text-gray-600 hover:bg-gray-50 p-2 -mx-2 rounded cursor-pointer">
            <Bookmark className="h-4 w-4 mr-2" />
            <span>My items</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Recent</h4>
          <div className="space-y-2">
            {[
              { icon: "👥", name: "JavaScript Developers", type: "group" },
              { icon: "👥", name: "React Developers", type: "group" },
              { icon: "📄", name: "Web Development Trends", type: "event" },
              { icon: "#", name: "reactjs", type: "hashtag" },
              { icon: "#", name: "javascript", type: "hashtag" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-50 rounded">
                <span className="text-base">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
          
          <button className="text-sm text-gray-600 hover:bg-gray-50 p-2 -mx-2 rounded mt-2 w-full text-left">
            Show more
          </button>
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Groups</h4>
          <div className="space-y-2">
            {[
              "JavaScript Developers Network",
              "React & Redux Developers",
              "Full Stack Developers"
            ].map((group, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-50 rounded">
                <div className="w-4 h-4 bg-blue-100 rounded"></div>
                <span className="truncate">{group}</span>
              </div>
            ))}
          </div>
          
          <button className="text-sm text-gray-600 hover:bg-gray-50 p-2 -mx-2 rounded mt-2 w-full text-left">
            See all
          </button>
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Events</h4>
          <div className="flex items-center text-sm text-blue-600 cursor-pointer hover:bg-blue-50 p-2 -mx-2 rounded">
            <Plus className="h-4 w-4 mr-2" />
            <span>Create event</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Followed Hashtags</h4>
          <div className="space-y-2">
            {["#javascript", "#react", "#webdev", "#programming"].map((tag, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-50 rounded">
                <span className="text-blue-600 font-bold">#</span>
                <span className="truncate">{tag.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-4 text-center">
          <button className="text-sm text-gray-600 hover:bg-gray-50 p-2 rounded">
            Discover more
          </button>
        </div>
      </div>
    </div>
  )
}

// LinkedIn Right Sidebar
function LinkedInRightSidebar() {
  return (
    <div className="space-y-4">
      {/* Add to your feed */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Add to your feed</h4>
          <button className="text-gray-400 hover:text-gray-600">
            <Eye className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { name: "React", followers: "2,847,291", avatar: "R", verified: true },
            { name: "JavaScript", followers: "1,432,567", avatar: "JS", verified: true },
            { name: "LinkedIn News", followers: "15,678,934", avatar: "LN", verified: true }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">{item.avatar}</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <h5 className="font-semibold text-gray-900 text-sm">{item.name}</h5>
                    {item.verified && (
                      <div className="ml-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{item.followers} followers</p>
                </div>
              </div>
              <button className="text-blue-600 border border-blue-600 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-50">
                + Follow
              </button>
            </div>
          ))}
        </div>
        
        <button className="text-sm text-gray-600 mt-3 hover:bg-gray-50 p-2 -mx-2 rounded w-full text-left">
          View all recommendations
        </button>
      </div>

      {/* LinkedIn News */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">LinkedIn News</h4>
          <button className="text-gray-400 hover:text-gray-600">
            <Eye className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { title: "Tech layoffs continue", subtitle: "2h ago • 12,847 readers", trend: "Top news" },
            { title: "Remote work here to stay", subtitle: "4h ago • 8,234 readers", trend: "Technology" },
            { title: "AI reshapes job market", subtitle: "6h ago • 15,432 readers", trend: "Trending" },
            { title: "Startup funding rebounds", subtitle: "1d ago • 6,789 readers", trend: "Business" },
            { title: "New workplace wellness trends", subtitle: "2d ago • 4,521 readers", trend: "Career" }
          ].map((news, idx) => (
            <div key={idx} className="cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-800 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <h5 className="font-medium text-gray-900 text-sm leading-tight">{news.title}</h5>
                  <p className="text-xs text-gray-500 mt-1">{news.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="text-sm text-gray-600 mt-3 hover:bg-gray-50 p-2 -mx-2 rounded w-full text-left">
          Show more
        </button>
      </div>

      {/* Today's games */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Today's games</h4>
          <button className="text-gray-400 hover:text-gray-600">
            <Eye className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {[
            { name: "Queens", icon: "♛", players: "2.1M" },
            { name: "Crossclimb", icon: "🏔", players: "1.8M" },
            { name: "Pinpoint", icon: "📍", players: "1.2M" }
          ].map((game, idx) => (
            <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{game.icon}</span>
                <div>
                  <h5 className="font-medium text-gray-900 text-sm">{game.name}</h5>
                  <p className="text-xs text-gray-500">{game.players} players today</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 transform rotate-270" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-2">
        <div className="flex flex-wrap justify-center text-xs text-gray-500 space-x-3">
          <a href="#" className="hover:text-blue-600">About</a>
          <a href="#" className="hover:text-blue-600">Accessibility</a>
          <a href="#" className="hover:text-blue-600">Help Center</a>
        </div>
        <div className="flex flex-wrap justify-center text-xs text-gray-500 space-x-3">
          <a href="#" className="hover:text-blue-600">Privacy & Terms</a>
          <a href="#" className="hover:text-blue-600">Ad Choices</a>
          <a href="#" className="hover:text-blue-600">Advertising</a>
        </div>
        <div className="flex flex-wrap justify-center text-xs text-gray-500 space-x-3">
          <a href="#" className="hover:text-blue-600">Business Services</a>
          <a href="#" className="hover:text-blue-600">Get the LinkedIn app</a>
          <a href="#" className="hover:text-blue-600">More</a>
        </div>
        <div className="text-xs text-gray-500 mt-3">
          <div className="flex items-center justify-center">
            <span className="font-bold text-blue-700">LinkedIn</span>
            <span className="ml-1">Corporation © 2025</span>
          </div>
        </div>
      </div>
    </div>
  )
}
