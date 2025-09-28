import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Star, ArrowRight, BookOpen, Users, Award, Truck } from 'lucide-react'
import api from '../store/api/api'
import { formatPrice } from '../utils/format'

const Home = () => {
  // Fetch featured books
  const { data: featuredBooks, isLoading: featuredLoading } = useQuery(
    'featuredBooks',
    () => api.get('/books/featured').then(res => res.data.books),
    { staleTime: 5 * 60 * 1000 } // 5 minutes
  )

  // Fetch categories
  const { data: categories } = useQuery(
    'categories',
    () => api.get('/books/categories/list').then(res => res.data.categories),
    { staleTime: 10 * 60 * 1000 } // 10 minutes
  )

  const features = [
    {
      icon: BookOpen,
      title: 'Wide Selection',
      description: 'Discover thousands of books across all genres and categories'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with readers and authors from around the world'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'All books are verified and quality-checked before listing'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to your doorstep'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Next
              <span className="block text-primary-200">Great Read</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Explore thousands of books, connect with authors, and build your personal library. 
              Your literary journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/books"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Browse Books
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BookStore?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make buying and selling books simple, secure, and enjoyable for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Books
            </h2>
            <Link
              to="/books"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks?.slice(0, 8).map((book) => (
                <div key={book._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/books/${book._id}`}>
                    <div className="aspect-w-3 aspect-h-4">
                      <img
                        src={book.images?.[0]?.url || '/placeholder-book.jpg'}
                        alt={book.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        by {book.author}
                      </p>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(book.ratings?.average || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          ({book.ratings?.count || 0})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(book.price)}
                        </span>
                        {book.originalPrice && book.originalPrice > book.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(book.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find books in your favorite genres
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories?.slice(0, 12).map((category) => (
              <Link
                key={category}
                to={`/books?category=${category}`}
                className="bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-200 rounded-lg p-4 text-center transition-colors group"
              >
                <h3 className="font-medium text-gray-900 group-hover:text-primary-700 capitalize">
                  {category.replace('-', ' ')}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Book Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of readers and sellers who trust BookStore for their literary needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/books"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
