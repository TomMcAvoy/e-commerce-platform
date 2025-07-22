import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const featuredDeals = [
    {
      id: 1,
      title: "Deal of the Day",
      discount: "Up to 40% off",
      image: "/api/placeholder/300/200",
      category: "Electronics"
    },
    {
      id: 2,
      title: "Limited Time Offer",
      discount: "Save 30%",
      image: "/api/placeholder/300/200",
      category: "Fashion"
    },
    {
      id: 3,
      title: "Best Seller",
      discount: "25% off",
      image: "/api/placeholder/300/200",
      category: "Home"
    },
    {
      id: 4,
      title: "New Arrival",
      discount: "20% off",
      image: "/api/placeholder/300/200",
      category: "Sports"
    }
  ]

  const categories = [
    { name: "Electronics", image: "/api/placeholder/150/150", href: "/categories/electronics" },
    { name: "Fashion", image: "/api/placeholder/150/150", href: "/categories/fashion" },
    { name: "Home & Garden", image: "/api/placeholder/150/150", href: "/categories/home" },
    { name: "Sports & Outdoors", image: "/api/placeholder/150/150", href: "/categories/sports" },
    { name: "Books", image: "/api/placeholder/150/150", href: "/categories/books" },
    { name: "Beauty", image: "/api/placeholder/150/150", href: "/categories/beauty" },
    { name: "Automotive", image: "/api/placeholder/150/150", href: "/categories/automotive" },
    { name: "Health", image: "/api/placeholder/150/150", href: "/categories/health" }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-screen-2xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Find it. Love it. Buy it.
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-gray-200">
                Millions of products, endless possibilities
              </p>
              <Link href="/products" className="btn-amazon-orange text-lg px-8 py-3">
                Shop Now
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {featuredDeals.slice(0, 4).map((deal) => (
                  <div key={deal.id} className="card-amazon p-4 text-center">
                    <div className="w-full h-32 bg-gray-200 rounded mb-2"></div>
                    <div className="text-sm font-bold text-red-600">{deal.discount}</div>
                    <div className="text-xs text-gray-600">{deal.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        
        {/* Today's Deals */}
        <section className="mb-12">
          <div className="card-amazon p-6">
            <h2 className="text-2xl font-bold mb-6">Today's Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDeals.map((deal) => (
                <Link key={deal.id} href="/products" className="group">
                  <div className="card-amazon p-4 hover:shadow-lg transition-shadow">
                    <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                      <span className="text-gray-500">Product Image</span>
                    </div>
                    <div className="badge-amazon mb-2">{deal.discount}</div>
                    <h3 className="font-bold text-lg mb-1">{deal.title}</h3>
                    <p className="text-sm text-gray-600">{deal.category}</p>
                    <div className="mt-3">
                      <span className="price-amazon">$29.99</span>
                      <span className="price-original-amazon ml-2">$49.99</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="mb-12">
          <div className="card-amazon p-6">
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category) => (
                <Link key={category.name} href={category.href} className="group text-center">
                  <div className="w-full h-24 bg-gray-200 rounded-lg mb-3 flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <span className="text-gray-500 text-xs">Image</span>
                  </div>
                  <h3 className="text-sm font-medium group-hover:text-orange-600">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended for You */}
        <section className="mb-12">
          <div className="card-amazon p-6">
            <h2 className="text-2xl font-bold mb-6">Recommended for you</h2>
            <div className="product-grid-amazon">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                <Link key={item} href="/products" className="group">
                  <div className="card-amazon p-3 hover:shadow-lg transition-shadow h-full">
                    <div className="w-full h-40 bg-gray-200 rounded mb-3 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Product {item}</span>
                    </div>
                    <h3 className="text-sm font-medium mb-2 line-clamp-2">
                      Sample Product Title That Might Be Long {item}
                    </h3>
                    <div className="rating-amazon mb-2">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          ★★★★☆
                        </div>
                        <span className="ml-1 text-blue-600">(127)</span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <span className="price-amazon">${(Math.random() * 100 + 10).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">FREE delivery</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recently Viewed */}
        <section className="mb-12">
          <div className="card-amazon p-6">
            <h2 className="text-2xl font-bold mb-6">Your recently viewed items</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Link key={item} href="/products" className="flex-shrink-0 w-48">
                  <div className="card-amazon p-3 hover:shadow-lg transition-shadow">
                    <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Item {item}</span>
                    </div>
                    <h3 className="text-sm font-medium mb-2 line-clamp-2">
                      Recently Viewed Product {item}
                    </h3>
                    <span className="price-amazon">${(Math.random() * 50 + 5).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsored Products */}
        <section className="mb-12">
          <div className="card-amazon p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Sponsored products related to items in your cart</h2>
              <span className="text-xs text-gray-500">Sponsored</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <Link key={item} href="/products" className="group">
                  <div className="card-amazon p-3 hover:shadow-lg transition-shadow">
                    <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Sponsored {item}</span>
                    </div>
                    <h3 className="text-sm font-medium mb-2 line-clamp-2">
                      Sponsored Product Title {item}
                    </h3>
                    <div className="rating-amazon mb-2">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 text-sm">
                          ★★★★☆
                        </div>
                        <span className="ml-1 text-blue-600 text-xs">(89)</span>
                      </div>
                    </div>
                    <span className="price-amazon">${(Math.random() * 80 + 15).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Amazon-style Footer */}
      <footer className="footer-amazon">
        <div className="bg-gray-700 py-4">
          <div className="max-w-screen-2xl mx-auto px-4 text-center">
            <button className="text-white hover:text-gray-300 text-sm">
              Back to top
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 py-12">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-white mb-4">Get to Know Us</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/about" className="hover:underline">About ShopCart</Link></li>
                  <li><Link href="/careers" className="hover:underline">Careers</Link></li>
                  <li><Link href="/blog" className="hover:underline">ShopCart Blog</Link></li>
                  <li><Link href="/investor-relations" className="hover:underline">Investor Relations</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-white mb-4">Make Money with Us</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/vendors/register" className="hover:underline">Sell on ShopCart</Link></li>
                  <li><Link href="/affiliate" className="hover:underline">Become an Affiliate</Link></li>
                  <li><Link href="/advertise" className="hover:underline">Advertise Your Products</Link></li>
                  <li><Link href="/fulfillment" className="hover:underline">Fulfillment by ShopCart</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-white mb-4">ShopCart Payment Products</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/credit-card" className="hover:underline">ShopCart Rewards Card</Link></li>
                  <li><Link href="/gift-cards" className="hover:underline">Gift Cards</Link></li>
                  <li><Link href="/currency-converter" className="hover:underline">Currency Converter</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-white mb-4">Let Us Help You</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/help" className="hover:underline">Your Account</Link></li>
                  <li><Link href="/orders" className="hover:underline">Your Orders</Link></li>
                  <li><Link href="/shipping" className="hover:underline">Shipping Rates & Policies</Link></li>
                  <li><Link href="/returns" className="hover:underline">Returns & Replacements</Link></li>
                  <li><Link href="/help" className="hover:underline">Help</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 py-8">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-white text-black px-2 py-1 rounded mr-4">
                  <span className="font-bold">shop</span>
                  <span className="text-orange-500 font-bold">cart</span>
                </div>
                <div className="flex space-x-4 text-sm text-gray-300">
                  <select className="bg-gray-800 border border-gray-600 rounded px-2 py-1">
                    <option>English</option>
                    <option>Español</option>
                    <option>Français</option>
                  </select>
                  <select className="bg-gray-800 border border-gray-600 rounded px-2 py-1">
                    <option>$ USD - U.S. Dollar</option>
                    <option>€ EUR - Euro</option>
                    <option>£ GBP - British Pound</option>
                  </select>
                  <select className="bg-gray-800 border border-gray-600 rounded px-2 py-1">
                    <option>🇺🇸 United States</option>
                    <option>🇨🇦 Canada</option>
                    <option>🇬🇧 United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-700 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400">
                <Link href="/conditions" className="hover:underline">Conditions of Use</Link>
                <Link href="/privacy" className="hover:underline">Privacy Notice</Link>
                <Link href="/cookies" className="hover:underline">Your Ads Privacy Choices</Link>
                <span>© 2025 ShopCart.com, Inc.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2025 ShopCart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
