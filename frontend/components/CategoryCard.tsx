'use client';

import Link from 'next/link';

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  colorScheme: {
    primary: string;
    background: string;
    text: string;
  };
  productCount: number;
}

export const CategoryCard = ({ category }: { category: ICategory }) => {
  return (
    <Link href={`/categories/${category.slug}`} legacyBehavior>
      <a
        className="block p-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-2xl"
        style={{
          backgroundColor: category.colorScheme.background,
          color: category.colorScheme.text,
          border: `1px solid ${category.colorScheme.primary}`
        }}
      >
        <h3 className="text-xl font-bold" style={{ color: category.colorScheme.primary }}>
          {category.name}
        </h3>
        <p className="mt-2 text-sm opacity-90">{category.description}</p>
        <div className="mt-4 text-xs font-semibold" style={{ color: category.colorScheme.primary }}>
          {category.productCount} Products
        </div>
      </a>
    </Link>
  );
};
