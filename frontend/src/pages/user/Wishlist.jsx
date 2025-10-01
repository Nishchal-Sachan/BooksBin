import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import api from '../../store/api/api'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/format'

const Wishlist = () => {
  const dispatch = useDispatch()
  const [wishlist, setWishlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/users/wishlist')
      setWishlist(res.data.wishlist || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load wishlist')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async (bookId) => {
    try {
      await api.delete(`/users/wishlist/${bookId}`)
      setWishlist((prev) => prev.filter((b) => b._id !== bookId))
      toast.success('Removed from wishlist')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove')
    }
  }

  const handleAddToCart = async (bookId) => {
    try {
      await dispatch(addToCart({ bookId, quantity: 1 })).unwrap()
      toast.success('Added to cart')
    } catch (error) {
      toast.error(error || 'Failed to add to cart')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        </div>

        {(!wishlist || wishlist.length === 0) ? (
          <div className="text-center py-20">
            <Heart className="mx-auto h-24 w-24 text-gray-400" />
            <h2 className="mt-6 text-2xl font-semibold text-gray-600">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-500">Save your favorite books to view them later.</p>
            <div className="mt-6">
              <Link
                to="/books"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Browse Books
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((book) => (
              <div key={book._id} className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
                <Link to={`/books/${book._id}`} className="block">
                  <img
                    src={book.images?.[0] || '/placeholder-book.jpg'}
                    alt={book.title}
                    className="w-full h-56 object-cover"
                  />
                </Link>
                <div className="p-4 flex-1 flex flex-col">
                  <Link to={`/books/${book._id}`} className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
                    {book.title}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">by {book.author}</p>
                  <div className="mt-3 text-lg font-semibold text-gray-900">{formatPrice(book.price)}</div>
                  <div className="mt-4 flex gap-2 mt-auto">
                    <button
                      onClick={() => handleAddToCart(book._id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(book._id)}
                      className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md text-red-600 border border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
