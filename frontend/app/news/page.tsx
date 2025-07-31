'use client';
import { useState, useEffect } from 'react';

interface NewsArticle {
  _id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  author: string;
  sourceName: string;
  sourceId: string;
  country: string;
  category: string;
}

interface Category {
  code: string;
  name: string;
  icon: string;
}

interface Country {
  code: string;
  name: string;
  region: string;
}

function CategoryTabs({ categories, selectedCategory, onCategoryChange }: { 
  categories: Category[]; 
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.code}
          onClick={() => onCategoryChange(category.code)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.code
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          <span className="mr-2">{category.icon}</span>
          {category.name}
        </button>
      ))}
    </div>
  );
}

function CountryTabs({ countries, selectedCountry, onCountryChange }: {
  countries: Country[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}) {
  const allCountries = [{ code: 'all', name: 'All Countries', region: 'Global' }, ...countries];
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {allCountries.map((country) => (
        <button
          key={country.code}
          onClick={() => onCountryChange(country.code)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCountry === country.code
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          {country.name}
        </button>
      ))}
    </div>
  );
}

function NewsGrid({ articles }: { articles: NewsArticle[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <div key={article._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <img 
            src={article.urlToImage || '/placeholder.svg'} 
            alt={article.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <div className="flex items-center mb-2">
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {article.category || 'General'}
              </span>
              <span className="text-xs text-gray-500 ml-auto">
                {new Date(article.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">{article.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                By {article.sourceName}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {article.country}
              </div>
            </div>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Read more →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, countriesRes] = await Promise.all([
          fetch('/api/news/categories'),
          fetch('/api/news/countries')
        ]);
        
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.data || []);
        }
        
        if (countriesRes.ok) {
          const countriesData = await countriesRes.json();
          setCountries(countriesData.data || []);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: '20'
        });
        
        const response = await fetch(`/api/news?${params}`);
        if (response.ok) {
          const data = await response.json();
          let filteredArticles = data.data || [];
          
          // Filter by country
          if (selectedCountry !== 'all') {
            filteredArticles = filteredArticles.filter(article => 
              article.country === selectedCountry
            );
          }
          
          // Filter by category
          if (selectedCategory !== 'general') {
            filteredArticles = filteredArticles.filter(article => 
              article.category === selectedCategory
            );
          }
          
          setArticles(filteredArticles);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, [selectedCategory, selectedCountry]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest News</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest news from around the world across all categories
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Country:</h3>
        <CountryTabs 
          countries={countries} 
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Select Category:</h3>
        <CategoryTabs 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading articles...</p>
        </div>
      ) : (
        <NewsGrid articles={articles} />
      )}

      {!loading && articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No news articles available for {selectedCountry}/{selectedCategory}.</p>
        </div>
      )}
    </div>
  );
}