import Link from 'next/link'

export default function CategoriesPage() {
  const categories = [
    {
      id: 1,
      name: 'Fashion & Apparel',
      description: 'Clothing, shoes, and fashion accessories',
      image: '/api/placeholder/300/200',
      subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories']
    },
    {
      id: 2,
      name: 'Beauty & Makeup',
      description: 'Cosmetics, skincare, and beauty tools',
      image: '/api/placeholder/300/200',
      subcategories: ['Makeup', 'Skincare', 'Hair Care', 'Fragrances']
    },
    {
      id: 3,
      name: 'Electronics',
      description: 'Gadgets, accessories, and tech products',
      image: '/api/placeholder/300/200',
      subcategories: ['Smartphones', 'Accessories', 'Audio', 'Gaming']
    },
    {
      id: 4,
      name: 'Home & Living',
      description: 'Home decor, furniture, and household items',
      image: '/api/placeholder/300/200',
      subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding']
    },
    {
      id: 5,
      name: 'Sports & Fitness',
      description: 'Activewear, equipment, and fitness accessories',
      image: '/api/placeholder/300/200',
      subcategories: ['Activewear', 'Equipment', 'Supplements', 'Outdoor']
    },
    {
      id: 6,
      name: 'Health & Wellness',
      description: 'Health products, supplements, and wellness items',
      image: '/api/placeholder/300/200',
      subcategories: ['Supplements', 'Medical', 'Personal Care', 'Wellness']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing products across all categories from our verified vendors and dropshipping partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Subcategories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.map((sub, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/products?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
