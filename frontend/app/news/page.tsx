import { getNews } from '@/lib/api';
import { Metadata } from 'next';
import Link from 'next/link';

// FIX: The NewsArticle interface now correctly expects a populated category object,
// not just a string ID. This is the key to fixing the bug.
interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  category: {
    name: string;
    slug: string;
  };
}

export const metadata: Metadata = {
  title: 'Latest News | Whitestart Security',
  description: 'Stay up to date with the latest news, announcements, and security insights from Whitestart Security.',
};

export default async function NewsPage() {
  // The getNews function already fetches articles with populated category data.
  const articles: NewsArticle[] = await getNews({ limit: 100 });

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Company News
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            The latest updates, product announcements, and security insights from our team.
          </p>
        </div>

        <div className="mt-12 mx-auto grid max-w-lg gap-8 lg:max-w-none lg:grid-cols-3">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div key={article._id} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <div className="flex-shrink-0">
                  <img className="h-48 w-full object-cover" src={article.imageUrl} alt={article.title} />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    {/* FIX: Display the category name as a clickable badge on each card. */}
                    {article.category && (
                      <p className="text-sm font-medium text-blue-600">
                        <Link href={`/news?category=${article.category.slug}`} className="hover:underline">
                          {article.category.name}
                        </Link>
                      </p>
                    )}
                    <Link href={`/news/${article.slug}`} className="mt-2 block">
                      <p className="text-xl font-semibold text-gray-900 hover:text-blue-600">{article.title}</p>
                      <p className="mt-3 text-base text-gray-500 line-clamp-3">{article.excerpt}</p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="text-sm text-gray-500">
                      <span>{article.author}</span>
                      <span className="mx-1">&middot;</span>
                      <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-lg text-gray-500">
              There are no news articles available at this time. Please check back later.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}