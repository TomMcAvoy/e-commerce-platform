'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNews } from '../../lib/api';

interface NewsArticle {
  _id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const newsData = await getNews({ limit: 5 });
      setNews(newsData);
      setLoading(false);
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading news...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Latest News</h2>
      <div className="space-y-3">
        {news.length > 0 ? news.map(article => (
          <a key={article._id} href={article.url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <h3 className="font-semibold text-gray-800">{article.title}</h3>
            <p className="text-sm text-gray-500">{article.source} - {new Date(article.publishedAt).toLocaleDateString()}</p>
          </a>
        )) : (
            <p className="text-gray-500">No news articles available right now.</p>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <Link href="/news" className="text-sm font-semibold text-blue-600 hover:underline transition-colors">
          View All News
        </Link>
      </div>
    </div>
  );
}