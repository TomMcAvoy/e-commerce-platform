'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import Sidebar from '@/components/layout/Sidebar';
import { useSearchParams, useRouter } from 'next/navigation';

interface NewsArticle {
  _id: string;
  title: string;
  content: string;
  description: string;
  sourceName: string;
  author: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareDropdown, setShareDropdown] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [countries, setCountries] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.publicRequest('/news/countries');
        setCountries(response.data || {});
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
    
    // Set initial category from URL params
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedCountry) params.append('country', selectedCountry);
        if (selectedCategory) params.append('category', selectedCategory);
        
        const response = await api.publicRequest(`/news/feed?${params.toString()}`);
        setArticles(response.data || []);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCountry, selectedCategory]);

  if (loading) {
    return <div className="p-8">Loading news...</div>;
  }

  return (
    <div className="flex max-w-7xl mx-auto">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">News Feed</h1>
      
      <div className="mb-6 space-y-4">
        {/* Country Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCountry('')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              !selectedCountry 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Countries
          </button>
          {Object.entries(countries).map(([code, name]) => (
            <button
              key={code}
              onClick={() => setSelectedCountry(code)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedCountry === code 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategory('');
              router.push('/news');
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              !selectedCategory 
                ? 'bg-green-600 text-white' 
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {['Technology', 'Business', 'Politics', 'Sports', 'Health', 'Science', 'Entertainment'].map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                router.push(`/news?category=${category.toLowerCase()}`);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedCategory === category 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No news articles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article._id} data-testid="news-article" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Article Image */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={article.urlToImage || '/placeholder.svg'}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              
              {/* Article Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {article.sourceName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 h-12 overflow-hidden">
                  {article.title.length > 60 ? article.title.substring(0, 60) + '...' : article.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 h-16 overflow-hidden">
                  {(article.description || article.content)?.substring(0, 120) + '...'}
                </p>
                
                {article.author && (
                  <p className="text-xs text-gray-400 mb-3">By {article.author}</p>
                )}
                
                <div className="flex space-x-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Read Article
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  
                  <div className="relative">
                    <button
                      data-testid="share-button"
                      onClick={() => setShareDropdown(shareDropdown === article._id ? null : article._id)}
                      className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                    
                    {shareDropdown === article._id && (
                      <div data-testid="share-options" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(article.url);
                              setShareDropdown(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Copy Link
                          </button>
                          <button
                            onClick={() => {
                              window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(article.url)}&text=${encodeURIComponent(article.title)}`, '_blank');
                              setShareDropdown(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Share on Twitter
                          </button>
                          <button
                            onClick={() => {
                              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`, '_blank');
                              setShareDropdown(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Share on Facebook
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      <Sidebar />
    </div>
  );
}