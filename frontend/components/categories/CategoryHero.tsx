import { Badge } from '@/components/ui/Badge';
import { getCategoryIcon } from '@/lib/icons';
import { 
  ShieldCheckIcon, 
  TruckIcon, 
  CubeIcon, 
  StarIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface CategoryHeroProps {
  category: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    tradeAssurance?: boolean;
    supportsCustomization?: boolean;
    isFeatured?: boolean;
    level?: number;
    color?: string;
  };
  productCount: number;
}

export function CategoryHero({ category, productCount }: CategoryHeroProps) {
  // Get the appropriate icon for this category
  const IconComponent = getCategoryIcon(category.slug);
  
  // Generate a background gradient based on the category name or provided color
  const getBackgroundStyle = () => {
    // Default gradient
    let gradient = 'from-gray-800 to-gray-700';
    
    // Use provided color if available
    if (category.color) {
      return `from-${category.color}-800 to-${category.color}-700`;
    }
    
    // Or generate based on category name
    const name = category.name.toLowerCase();
    if (name.includes('camera') || name.includes('cctv')) {
      gradient = 'from-blue-900 to-blue-800';
    } else if (name.includes('alarm') || name.includes('security')) {
      gradient = 'from-red-900 to-red-800';
    } else if (name.includes('access') || name.includes('door')) {
      gradient = 'from-green-900 to-green-800';
    } else if (name.includes('fire') || name.includes('safety')) {
      gradient = 'from-orange-900 to-orange-800';
    }
    
    return gradient;
  };

  // Features to highlight for this category
  const features = [
    category.tradeAssurance && {
      icon: <ShieldCheckIcon className="w-5 h-5" />,
      text: 'Trade Assurance'
    },
    category.supportsCustomization && {
      icon: <AdjustmentsHorizontalIcon className="w-5 h-5" />,
      text: 'Customization Available'
    },
    {
      icon: <TruckIcon className="w-5 h-5" />,
      text: 'Fast Shipping'
    },
    {
      icon: <CubeIcon className="w-5 h-5" />,
      text: 'Quality Products'
    }
  ].filter(Boolean);

  return (
    <section className={`bg-gradient-to-r ${getBackgroundStyle()} relative overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%227%22%20cy%3D%227%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>
      
      {/* Large category icon */}
      <div className="absolute right-0 top-0 opacity-20 transform translate-x-1/4 -translate-y-1/4">
        <IconComponent className="w-96 h-96 text-white" />
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <IconComponent className="w-16 h-16 text-white mr-4" />
            
            <div>
              {category.isFeatured && (
                <div className="inline-flex items-center bg-yellow-500 text-white text-xs px-3 py-1 rounded-full mb-2">
                  <StarIcon className="w-3 h-3 mr-1" />
                  Featured Category
                </div>
              )}
              
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                {category.name}
              </h1>
            </div>
          </div>
          
          {category.description && (
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto text-center">
              {category.description}
            </p>
          )}
          
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {productCount} Products Available
            </Badge>
            
            {category.level && (
              <Badge variant="secondary" className="bg-white/20 text-white">
                Level {category.level} Category
              </Badge>
            )}
          </div>
          
          {/* Category features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            {features.map((feature, index) => (
              feature && (
                <div key={index} className="flex items-center bg-white/10 rounded-lg p-3">
                  <div className="mr-3 text-white">
                    {feature.icon}
                  </div>
                  <span className="text-sm text-white">{feature.text}</span>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}