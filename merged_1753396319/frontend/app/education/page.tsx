'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from '../../components/navigation/Navigation';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  GlobeAltIcon, 
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  PlayCircleIcon,
  ChevronRightIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';

interface EducationProgram {
  id: string;
  title: string;
  subtitle: string;
  provider: string;
  price: number;
  originalPrice?: number;
  duration: string;
  format: 'online' | 'hybrid' | 'in-person';
  level: 'certificate' | 'diploma' | 'bachelors' | 'masters' | 'phd';
  rating: number;
  reviews: number;
  image: string;
  category: string;
  subcategory: string;
  verified: boolean;
  description: string;
  features: string[];
  modules: string[];
  prerequisites: string[];
  outcomes: string[];
  accreditation: string;
  startDates: string[];
  language: string;
  support: string[];
}

export default function EducationPage() {
  const [programs, setPrograms] = useState<EducationProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showAffiliateSidebar, setShowAffiliateSidebar] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    loadPrograms();
  }, [selectedCategory, selectedLevel, selectedFormat, sortBy]);

  const loadPrograms = async () => {
    setIsLoading(true);
    try {
      // Following DropshippingService.test.ts patterns for mock data structure
      const mockPrograms: EducationProgram[] = [
        {
          id: 'edu-1',
          title: 'MSc Computer Science',
          subtitle: 'Advanced Computing & AI Specialization',
          provider: 'University of Technology',
          price: 12999,
          originalPrice: 15999,
          duration: '18 months',
          format: 'online',
          level: 'masters',
          rating: 4.8,
          reviews: 1247,
          image: '/api/placeholder/400/300',
          category: 'education',
          subcategory: 'computer-science',
          verified: true,
          description: 'Advanced master\'s program in computer science with specialization in AI and machine learning',
          features: [
            'Industry-Led Curriculum',
            'Real-World Projects', 
            'Career Support',
            'Flexible Schedule',
            'Expert Faculty'
          ],
          modules: [
            'Advanced Algorithms',
            'Machine Learning',
            'Data Structures',
            'AI & Neural Networks',
            'Software Engineering',
            'Research Methods'
          ],
          prerequisites: ['Bachelor\'s degree', 'Programming experience', 'Mathematics background'],
          outcomes: [
            'Senior Software Developer',
            'AI/ML Engineer', 
            'Research Scientist',
            'Technical Lead',
            'Data Scientist'
          ],
          accreditation: 'Accredited by Computer Science Accreditation Board',
          startDates: ['September 2024', 'January 2025', 'May 2025'],
          language: 'English',
          support: ['24/7 Online Support', 'Personal Tutor', 'Career Services', 'Alumni Network']
        },
        {
          id: 'edu-2',
          title: 'Digital Marketing Certificate',
          subtitle: 'Complete Digital Marketing Strategy',
          provider: 'Marketing Institute',
          price: 2499,
          originalPrice: 3499,
          duration: '6 months',
          format: 'online',
          level: 'certificate',
          rating: 4.7,
          reviews: 2156,
          image: '/api/placeholder/400/300',
          category: 'education',
          subcategory: 'marketing',
          verified: true,
          description: 'Comprehensive digital marketing program covering all aspects of modern marketing',
          features: [
            'Hands-on Projects',
            'Industry Tools Access',
            'Certification Included',
            'Job Placement Support',
            'Live Workshops'
          ],
          modules: [
            'SEO & SEM',
            'Social Media Marketing',
            'Content Strategy',
            'Email Marketing',
            'Analytics & Reporting',
            'PPC Advertising'
          ],
          prerequisites: ['Basic computer skills', 'High school diploma'],
          outcomes: [
            'Digital Marketing Specialist',
            'Social Media Manager',
            'SEO Analyst',
            'Content Marketing Manager',
            'Marketing Coordinator'
          ],
          accreditation: 'Google & Facebook Blueprint Certified',
          startDates: ['Every month'],
          language: 'English',
          support: ['Mentor Support', 'Peer Learning', 'Career Coaching', 'Portfolio Review']
        },
        {
          id: 'edu-3',
          title: 'Data Science Bootcamp',
          subtitle: 'Python, Machine Learning & Analytics',
          provider: 'TechED Academy',
          price: 8999,
          originalPrice: 12999,
          duration: '12 months',
          format: 'hybrid',
          level: 'certificate',
          rating: 4.9,
          reviews: 892,
          image: '/api/placeholder/400/300',
          category: 'education',
          subcategory: 'data-science',
          verified: true,
          description: 'Intensive data science program with hands-on experience in Python and machine learning',
          features: [
            'Real Industry Projects',
            'One-on-One Mentoring',
            'Job Guarantee',
            'Flexible Payment Plans',
            'Industry Partnerships'
          ],
          modules: [
            'Python Programming',
            'Statistics & Probability',
            'Machine Learning',
            'Data Visualization',
            'SQL & Databases',
            'Deep Learning'
          ],
          prerequisites: ['Basic mathematics', 'Logical thinking', 'Computer literacy'],
          outcomes: [
            'Data Scientist',
            'Machine Learning Engineer',
            'Data Analyst',
            'Business Intelligence Analyst',
            'Research Analyst'
          ],
          accreditation: 'Industry-Recognized Certificate',
          startDates: ['Flexible start dates'],
          language: 'English',
          support: ['24/7 Technical Support', 'Career Services', 'Alumni Network', 'Interview Prep']
        },
        {
          id: 'edu-4',
          title: 'Project Management Professional',
          subtitle: 'PMP Certification Preparation',
          provider: 'Professional Training Institute',
          price: 1999,
          originalPrice: 2799,
          duration: '4 months',
          format: 'online',
          level: 'certificate',
          rating: 4.6,
          reviews: 1567,
          image: '/api/placeholder/400/300',
          category: 'education',
          subcategory: 'business',
          verified: true,
          description: 'Comprehensive PMP certification preparation with exam guarantee',
          features: [
            'PMP Exam Prep',
            'Real-world Case Studies',
            'Exam Simulator',
            'Money-back Guarantee',
            'Continuing Education Credits'
          ],
          modules: [
            'Project Initiation',
            'Planning & Execution',
            'Monitoring & Control',
            'Risk Management',
            'Quality Management',
            'Stakeholder Management'
          ],
          prerequisites: ['Bachelor\'s degree OR 5 years experience', '35 hours project management education'],
          outcomes: [
            'Project Manager',
            'Program Manager',
            'Operations Manager',
            'Consultant',
            'Team Lead'
          ],
          accreditation: 'PMI Authorized Training Partner',
          startDates: ['Monthly cohorts'],
          language: 'English',
          support: ['Instructor Support', 'Study Groups', 'Exam Coaching', 'Career Guidance']
        },
        {
          id: 'edu-5',
          title: 'Web Development Bootcamp',
          subtitle: 'Full-Stack JavaScript Development',
          provider: 'CodeCamp Academy',
          price: 6999,
          originalPrice: 9999,
          duration: '9 months',
          format: 'online',
          level: 'certificate',
          rating: 4.8,
          reviews: 1789,
          image: '/api/placeholder/400/300',
          category: 'education',
          subcategory: 'web-development',
          verified: true,
          description: 'Complete full-stack web development program with job placement assistance',
          features: [
            'Portfolio Projects',
            'Industry Mentors',
            'Job Placement Help',
            'Lifetime Access',
            'Modern Tech Stack'
          ],
          modules: [
            'HTML/CSS/JavaScript',
            'React & Node.js',
            'Database Design',
            'API Development',
            'DevOps Basics',
            'Testing & Deployment'
          ],
          prerequisites: ['Basic computer skills', 'Problem-solving mindset'],
          outcomes: [
            'Full-Stack Developer',
            'Frontend Developer',
            'Backend Developer',
            'Web Developer',
            'Software Engineer'
          ],
          accreditation: 'Industry-Recognized Certificate',
          startDates: ['Bi-weekly cohorts'],
          language: 'English',
          support: ['Code Reviews', 'Career Coaching', 'Technical Mentoring', 'Job Interview Prep']
        },
        {
          id: 'edu-6',
          title: 'MBA in Innovation Management',
          subtitle: 'Executive MBA Program',
          provider: 'Business Excellence University',
          price: 24999,
          originalPrice: 29999,
          duration: '24 months',
          format: 'hybrid',
          level: 'masters',
          rating: 4.9,
          reviews: 634,
          image: '/api/placeholder/400/300',
          category: 'education',
          subcategory: 'business',
          verified: true,
          description: 'Executive MBA focusing on innovation, leadership, and strategic management',
          features: [
            'Executive Format',
            'Global Residencies',
            'Leadership Coaching',
            'Alumni Network',
            'Capstone Project'
          ],
          modules: [
            'Strategic Management',
            'Innovation Leadership',
            'Financial Management',
            'Global Business',
            'Digital Transformation',
            'Entrepreneurship'
          ],
          prerequisites: ['Bachelor\'s degree', '5+ years management experience', 'GMAT/GRE scores'],
          outcomes: [
            'Senior Executive',
            'CEO/COO/CMO',
            'Innovation Director',
            'Strategy Consultant',
            'Entrepreneur'
          ],
          accreditation: 'AACSB Accredited',
          startDates: ['September 2024', 'January 2025'],
          language: 'English',
          support: ['Executive Coaching', 'Networking Events', 'Career Services', 'Global Alumni']
        }
      ];

      // Apply filters following Frontend Structure patterns
      let filteredPrograms = mockPrograms;
      
      if (selectedCategory !== 'all') {
        filteredPrograms = filteredPrograms.filter(p => p.subcategory === selectedCategory);
      }
      
      if (selectedLevel !== 'all') {
        filteredPrograms = filteredPrograms.filter(p => p.level === selectedLevel);
      }

      if (selectedFormat !== 'all') {
        filteredPrograms = filteredPrograms.filter(p => p.format === selectedFormat);
      }

      // Apply sorting following API Endpoints Structure
      if (sortBy === 'price-low') {
        filteredPrograms.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        filteredPrograms.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filteredPrograms.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'duration') {
        filteredPrograms.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      setPrograms(filteredPrograms);
    } catch (error) {
      console.error('Failed to load education programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollNow = (program: EducationProgram) => {
    addItem({
      id: program.id,
      name: program.title,
      price: program.price,
      quantity: 1
    });
    console.log(`Enrolled in ${program.title}`);
  };

  const categories = [
    { id: 'all', name: 'All Programs', count: 6 },
    { id: 'computer-science', name: 'Computer Science', count: 1 },
    { id: 'marketing', name: 'Digital Marketing', count: 1 },
    { id: 'data-science', name: 'Data Science', count: 1 },
    { id: 'business', name: 'Business & Management', count: 2 },
    { id: 'web-development', name: 'Web Development', count: 1 }
  ];

  const levels = ['all', 'certificate', 'diploma', 'bachelors', 'masters', 'phd'];
  const formats = ['all', 'online', 'hybrid', 'in-person'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section - Following Abertay University design with education theme */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white py-20 mt-16 relative overflow-hidden">
        {/* Background pattern similar to Abertay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <AcademicCapIcon className="w-16 h-16 mr-4 text-yellow-400" />
              <div>
                <h1 className="text-5xl font-bold mb-4">🎓 Transform Your Career</h1>
                <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                  Advance your skills with industry-leading online programs designed for working professionals
                </p>
              </div>
            </div>
          </div>
          
          {/* Key benefits row - Abertay style */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <GlobeAltIcon className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-lg font-semibold mb-2">100% Online</h3>
              <p className="text-indigo-200 text-sm">Study from anywhere, anytime</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-lg font-semibold mb-2">Expert Faculty</h3>
              <p className="text-indigo-200 text-sm">Learn from industry professionals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <ClockIcon className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-lg font-semibold mb-2">Flexible Schedule</h3>
              <p className="text-indigo-200 text-sm">Balance work and study</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <ShieldCheckIcon className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-lg font-semibold mb-2">Accredited</h3>
              <p className="text-indigo-200 text-sm">Globally recognized qualifications</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <button className="bg-yellow-500 text-purple-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 transition-colors mr-4">
              Explore Programs
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-900 transition-colors">
              Book a Call
            </button>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar Layout */}
      <div className="flex max-w-7xl mx-auto">
        {/* Filters Sidebar */}
        <div className="w-80 p-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpenIcon className="w-5 h-5 mr-2" />
              Program Categories
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{category.name}</span>
                    <span className="text-xs text-gray-500">({category.count})</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Education Level</h3>
            <div className="space-y-2">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                    selectedLevel === level
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Study Format</h3>
            <div className="space-y-2">
              {formats.map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                    selectedFormat === format
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {format === 'all' ? 'All Formats' : format.charAt(0).toUpperCase() + format.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="featured">Featured Programs</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="duration">Shortest Duration</option>
            </select>
          </div>
        </div>

        {/* Programs Grid */}
        <div className={`flex-1 p-6 ${showAffiliateSidebar ? 'mr-80' : ''}`}>
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {programs.map((program) => (
                <div key={program.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <img
                      src={program.image}
                      alt={program.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTIwTDI0MCAyMDBIMTYwTDIwMCAxMjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LXNpemU9IjE2Ij5FZHVjYXRpb248L3RleHQ+Cjwvc3ZnPg==';
                      }}
                    />
                    {program.verified && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <ShieldCheckIcon className="w-3 h-3 mr-1" />
                        Accredited
                      </div>
                    )}
                    {program.originalPrice && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Save ${(program.originalPrice - program.price).toLocaleString()}
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {program.format.charAt(0).toUpperCase() + program.format.slice(1)}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-indigo-600 font-medium">{program.provider}</span>
                      <span className="text-xs text-gray-500 ml-2">• {program.level.charAt(0).toUpperCase() + program.level.slice(1)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{program.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{program.subtitle}</p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
                    
                    {/* Key details row */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <UserGroupIcon className="w-4 h-4 mr-1" />
                        <span>{program.reviews.toLocaleString()} students</span>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {program.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {program.features.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            +{program.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(program.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {program.rating} ({program.reviews.toLocaleString()} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">${program.price.toLocaleString()}</span>
                        {program.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${program.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <div className="text-xs text-gray-500">Total program cost</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEnrollNow(program)}
                        className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center font-semibold"
                      >
                        <AcademicCapIcon className="w-4 h-4 mr-2" />
                        Enroll Now
                      </button>
                      <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <PlayCircleIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Next start date */}
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-500">Next start: </span>
                      <span className="text-xs font-medium text-indigo-600">{program.startDates[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Education Affiliate Sidebar following Critical Integration Points */}
      {showAffiliateSidebar && (
        <div className="fixed right-4 top-20 w-80 h-[calc(100vh-6rem)] z-40">
          <div className="bg-white rounded-lg shadow-lg p-6 h-full overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">🎓 Education Partners</h3>
            
            {/* Coursera Affiliate */}
            <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Coursera</h4>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Up to 45%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">University courses and professional certificates</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                Browse Courses →
              </button>
            </div>

            {/* Udemy Affiliate */}
            <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Udemy</h4>
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">8-15%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Practical skills and professional development</p>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors">
                Explore Skills →
              </button>
            </div>

            {/* Skillshare Affiliate */}
            <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">Skillshare</h4>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">$7-10</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Creative and business skills classes</p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                Start Learning →
              </button>
            </div>

            {/* MasterClass Affiliate */}
            <div className="border rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800">MasterClass</h4>
                <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">$15-50</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">Learn from the world's best instructors</p>
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors">
                Get Access →
              </button>
            </div>

            {/* Featured Education Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg">
              <h4 className="font-bold mb-2">🚀 Career Boost</h4>
              <p className="text-sm mb-3">Start your transformation today with 30% off</p>
              <button className="bg-white text-indigo-600 px-4 py-2 rounded font-semibold text-sm w-full">
                Claim Discount →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
