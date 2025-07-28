import { getNewsArticleBySlug } from '@/lib/api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Article {
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  category: {
    name: string;
    slug: string;
  };
}

// Generate metadata dynamically based on the article
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article: Article | null = await getNewsArticleBySlug(params.slug);
  if (!article) {
    return { title: 'Article Not Found' };
  }
  return {
    title: `${article.title} | Whitestart Security`,
    description: article.content.substring(0, 160),
  };
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article: Article | null = await getNewsArticleBySlug(params.slug);

  if (!article) {
    notFound(); // Triggers the not-found.tsx page
  }

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mb-8">
          <Link href={`/news?category=${article.category.slug}`} className="text-base font-semibold leading-7 text-blue-600 hover:text-blue-800">
            {article.category.name}
          </Link>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {article.title}
        </h1>
        <div className="mt-6 flex items-center gap-x-4 text-sm text-gray-500">
          <span>By {article.author}</span>
          <span className="h-1 w-1 rounded-full bg-gray-300"></span>
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>
        <figure className="mt-10">
          <img className="aspect-video rounded-xl bg-gray-50 object-cover" src={article.imageUrl} alt={article.title} />
        </figure>
        <div
          className="prose prose-lg mt-10"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}