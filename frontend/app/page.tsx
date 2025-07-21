import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Welcome to{' '}
            <span className="text-blue-600">ShopCart</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Your modern e-commerce platform with integrated dropshipping capabilities. 
            Discover amazing products from verified vendors worldwide.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/products"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Shop Now
            </Link>
            <Link href="/vendors/register" className="text-sm font-semibold leading-6 text-gray-900">
              Become a Vendor <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Featured Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fashion & Apparel</h3>
              <p className="text-gray-600">Discover the latest trends in clothing and accessories</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Beauty & Makeup</h3>
              <p className="text-gray-600">Premium cosmetics and skincare products</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Electronics</h3>
              <p className="text-gray-600">Latest gadgets and tech accessories</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2025 ShopCart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
