import Link from 'next/link'

export default function VendorsPage() {
  const vendors = [
    {
      id: 1,
      name: 'StyleCo Fashion',
      description: 'Premium fashion and lifestyle brand',
      category: 'Fashion & Apparel',
      rating: 4.8,
      reviews: 1250,
      products: 450,
      location: 'New York, USA',
      verified: true,
      dropshipping: true,
      logo: '/api/placeholder/100/100'
    },
    {
      id: 2,
      name: 'TechGear Pro',
      description: 'Latest electronics and gadgets',
      category: 'Electronics',
      rating: 4.6,
      reviews: 890,
      products: 320,
      location: 'California, USA',
      verified: true,
      dropshipping: true,
      logo: '/api/placeholder/100/100'
    },
    {
      id: 3,
      name: 'Natural Beauty Co',
      description: 'Organic skincare and cosmetics',
      category: 'Beauty & Makeup',
      rating: 4.7,
      reviews: 670,
      products: 180,
      location: 'London, UK',
      verified: true,
      dropshipping: false,
      logo: '/api/placeholder/100/100'
    },
    {
      id: 4,
      name: 'HomeStyle Living',
      description: 'Modern home decor and furniture',
      category: 'Home & Living',
      rating: 4.5,
      reviews: 540,
      products: 290,
      location: 'Toronto, Canada',
      verified: true,
      dropshipping: true,
      logo: '/api/placeholder/100/100'
    },
    {
      id: 5,
      name: 'FitLife Sports',
      description: 'Athletic wear and fitness equipment',
      category: 'Sports & Fitness',
      rating: 4.4,
      reviews: 780,
      products: 380,
      location: 'Sydney, Australia',
      verified: false,
      dropshipping: true,
      logo: '/api/placeholder/100/100'
    },
    {
      id: 6,
      name: 'Global Dropship',
      description: 'International dropshipping solutions',
      category: 'Multi-Category',
      rating: 4.3,
      reviews: 450,
      products: 1200,
      location: 'Hong Kong',
      verified: true,
      dropshipping: true,
      logo: '/api/placeholder/100/100'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ShopCart
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/products" className="text-gray-600 hover:text-gray-900">
                Products
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                Categories
              </Link>
              <Link href="/vendors" className="text-blue-600 font-medium">
                Vendors
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Trusted Vendors
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover amazing products from our verified vendors and dropshipping partners worldwide.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              Want to become a vendor?
            </h2>
            <p className="text-blue-700 mb-4">
              Join our marketplace and start selling your products to customers worldwide with our dropshipping integration.
            </p>
            <Link
              href="/vendors/register"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply to Become a Vendor
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mr-4"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        {vendor.name}
                        {vendor.verified && (
                          <svg className="w-5 h-5 text-blue-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{vendor.location}</p>
                    </div>
                  </div>
                  {vendor.dropshipping && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Dropshipping
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{vendor.description}</p>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {vendor.rating} ({vendor.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Products:</span>
                    <span className="font-medium ml-1">{vendor.products}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium ml-1">{vendor.category}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/vendors/${vendor.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Store
                  </Link>
                  <Link
                    href={`/products?vendor=${vendor.id}`}
                    className="flex-1 bg-gray-200 text-gray-700 text-center py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Products
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
