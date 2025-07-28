import { getNews } from '@/lib/api';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  NewspaperIcon, 
  GlobeAmericasIcon, 
  FlagIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

// Enhanced NewsArticle interface with source information
interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  source?: string;
  country?: string;
  category: {
    name: string;
    slug: string;
  };
}

export const metadata: Metadata = {
  title: 'Latest News | Whitestart Security',
  description: 'Stay up to date with the latest news, announcements, and security insights from Whitestart Security.',
};

// News sources with their details
const newsSources = [
  { id: 'cnn', name: 'CNN', country: 'USA', logo: '/images/news/cnn-logo.png' },
  { id: 'fox', name: 'Fox News', country: 'USA', logo: '/images/news/fox-logo.png' },
  { id: 'bbc', name: 'BBC', country: 'UK', logo: '/images/news/bbc-logo.png' },
  { id: 'sky', name: 'Sky News', country: 'UK', logo: '/images/news/sky-logo.png' },
  { id: 'cbc', name: 'CBC', country: 'Canada', logo: '/images/news/cbc-logo.png' },
  { id: 'scotsman', name: 'The Scotsman', country: 'Scotland', logo: '/images/news/scotsman-logo.png' },
];

// Country filters
const countries = [
  { id: 'usa', name: 'USA', flag: '🇺🇸' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦' },
  { id: 'scotland', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
];

export default async function NewsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Get filter parameters
  const categoryFilter = typeof searchParams.category === 'string' ? searchParams.category : undefined;
  const sourceFilter = typeof searchParams.source === 'string' ? searchParams.source : undefined;
  const countryFilter = typeof searchParams.country === 'string' ? searchParams.country : undefined;
  
  // The getNews function fetches articles with populated category data
  let articles: NewsArticle[] = await getNews({ 
    limit: 100,
    category: categoryFilter,
    source: sourceFilter,
    country: countryFilter
  });

  // If we don't have real data with sources, simulate it for the demo
  if (articles.length > 0 && !articles[0].source) {
    // Assign random sources and countries to articles for demonstration
    articles = articles.map(article => {
      const randomSourceIndex = Math.floor(Math.random() * newsSources.length);
      const source = newsSources[randomSourceIndex];
      return {
        ...article,
        source: source.name,
        country: source.country
      };
    });
  }

  // Get unique categories from articles
  const categories = Array.from(new Set(articles.map(article => 
    article.category ? article.category.name : null
  ).filter(Boolean) as string[]));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <NewspaperIcon className="w-10 h-10 mr-3" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Security News Hub
            </h1>
          </div>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-blue-200 text-center">
            Stay informed with the latest security news from trusted sources worldwide
          </p>
          
          {/* Search bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news articles..."
                className="w-full px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* News Sources */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">News Sources</h3>
              <div className="flex flex-wrap gap-2">
                <Link 
                  href="/news"
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${!sourceFilter ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  All Sources
                </Link>
                {newsSources.map(source => (
                  <Link 
                    key={source.id}
                    href={`/news?source=${source.id}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${sourceFilter === source.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {source.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Countries */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Countries</h3>
              <div className="flex flex-wrap gap-2">
                <Link 
                  href="/news"
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${!countryFilter ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  All Countries
                </Link>
                {countries.map(country => (
                  <Link 
                    key={country.id}
                    href={`/news?country=${country.id}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${countryFilter === country.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    <span className="mr-1">{country.flag}</span> {country.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <Link 
                  href="/news"
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${!categoryFilter ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  All Categories
                </Link>
                {categories.map(category => (
                  <Link 
                    key={category}
                    href={`/news?category=${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryFilter === category.toLowerCase().replace(/\s+/g, '-') ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured article */}
        {articles.length > 0 && (
          <div className="mb-12">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
              <img 
                src={articles[0].imageUrl} 
                alt={articles[0].title} 
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <div className="flex items-center mb-3">
                  {articles[0].source && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mr-2">
                      {articles[0].source}
                    </span>
                  )}
                  {articles[0].category && (
                    <Link href={`/news?category=${articles[0].category.slug}`} className="text-xs font-medium text-white/80 hover:text-white">
                      {articles[0].category.name}
                    </Link>
                  )}
                  <span className="mx-2">•</span>
                  <span className="text-xs text-white/80">
                    {new Date(articles[0].publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <Link href={`/news/${articles[0].slug}`}>
                  <h2 className="text-3xl font-bold mb-2 hover:underline">{articles[0].title}</h2>
                </Link>
                <p className="text-white/90 text-lg mb-4 line-clamp-2">{articles[0].excerpt}</p>
                <div className="flex items-center">
                  <span className="text-sm">By {articles[0].author}</span>
                  {articles[0].country && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="flex items-center text-sm">
                        <GlobeAmericasIcon className="w-4 h-4 mr-1" />
                        {articles[0].country}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length > 1 ? (
            articles.slice(1).map((article) => (
              <div key={article._id} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <div className="flex-shrink-0 relative">
                  <img className="h-48 w-full object-cover" src={article.imageUrl} alt={article.title} />
                  {article.source && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                      {article.source}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      {article.category && (
                        <Link href={`/news?category=${article.category.slug}`} className="text-xs font-medium text-blue-600 hover:underline">
                          {article.category.name}
                        </Link>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <Link href={`/news/${article.slug}`} className="block">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 mb-2">{article.title}</h3>
                      <p className="text-base text-gray-500 line-clamp-3">{article.excerpt}</p>
                    </Link>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-600">{article.author}</span>
                    {article.country && (
                      <span className="flex items-center text-xs text-gray-500">
                        <FlagIcon className="w-3 h-3 mr-1" />
                        {article.country}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-lg text-gray-500 py-12">
              There are no news articles available at this time. Please check back later.
            </p>
          )}
        </div>
        
        {/* Pagination */}
        {articles.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </a>
              <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-blue-600">
                1
              </a>
              <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                2
              </a>
              <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                3
              </a>
              <a href="#" className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </a>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}