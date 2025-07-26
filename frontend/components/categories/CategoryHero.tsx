import { Badge } from '@/components/ui/Badge';

interface CategoryHeroProps {
  category: {
    name: string;
    description: string;
    isFeatured: boolean;
    level: number;
    path: string;
  };
  productCount: number;
}

export function CategoryHero({ category, productCount }: CategoryHeroProps) {
  return (
    <section className="bg-gradient-to-r from-gray-800 to-gray-700 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {category.isFeatured && (
            <div className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full mb-4">
              Featured Category
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            {category.name}
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {category.description}
          </p>
          
          <div className="flex justify-center items-center gap-4 text-gray-400">
            <span>{productCount} Products Available</span>
            <span>•</span>
            <span>Level {category.level} Category</span>
          </div>
        </div>
      </div>
    </section>
  );
}