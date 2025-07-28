import { getNewsFeed } from '@/lib/api';
import { Metadata } from 'next';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  sourceName: string;
  publishedAt: string;
}

export const metadata: Metadata = {
  title: 'World News Feed | Whitestart Security',
  description: 'Curated top headlines from leading news sources around the world.',
};

// Search parameters are passed to server components
export default async function NewsFeedPage({ searchParams }: { searchParams: { source: string } }) {
  const source = searchParams.source || 'all';
  const { data: articles, count }: { data: Article[], count: number } = await getNewsFeed({ source });

  const sources = [
    { id: 'all', name: 'All Sources' },
    { id: 'cnn', name: 'CNN' },
    { id: 'fox-news', name: 'Fox News' },
    { id: 'bbc-news', name: 'BBC News' },
    { id: 'the-globe-and-mail', name: 'The Globe and Mail (Canada)' },
    { id: 'bbc-scottish-news', name: 'BBC News (Scotland)' },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            World News Feed
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Top headlines from trusted sources, updated hourly.
          </p>
        </div>

        <div className="my-8 text-center">
          <div className="inline-flex flex-wrap justify-center gap-2 rounded-lg bg-gray-100 p-2">
            {sources.map((s) => (
              <Link
                key={s.id}
                href={s.id === 'all' ? '/news/feed' : `/news/feed?source=${s.id}`}
                className={`${
                  source === s.id
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:bg-white'
                } rounded-md px-4 py-2 text-sm font-medium transition-colors`}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {count > 0 ? (
            articles.map((article) => (
              <a
                key={article._id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="flex-shrink-0">
                  <img className="h-48 w-full object-cover" src={article.urlToImage || '/placeholder-image.jpg'} alt={article.title} />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-gray-50 p-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600">{article.sourceName}</p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">{article.title}</p>
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">{article.description}</p>
                  </div>
                  <div className="mt-6 text-sm text-gray-500">
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p className="col-span-full text-center text-lg text-gray-500">
              No articles found for this source. The cache may be updating. Please check back shortly.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}