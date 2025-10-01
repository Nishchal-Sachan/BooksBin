import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import api from '../store/api/api'
import { Heart, Star, ShoppingCart, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/format'

const BookDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [book, setBook] = useState(null)
  const [related, setRelated] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isWishing, setIsWishing] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    setIsLoading(true)
    try {
      const res = await api.get(`/books/${id}`)
      setBook(res.data.book)
      const rel = await api.get(`/books/${id}/related`)
      setRelated(rel.data.books || [])
    } catch (e) {
      toast.error('Failed to load book')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ bookId: book._id, quantity })).unwrap()
      toast.success('Added to cart')
    } catch (e) {
      toast.error(e || 'Failed to add to cart')
    }
  }

  const handleWishlist = async () => {
    if (!book) return
    setIsWishing(true)
    try {
      await api.post(`/users/wishlist/${book._id}`)
      toast.success('Added to wishlist')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add to wishlist')
    } finally {
      setIsWishing(false)
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

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">Book not found</h2>
            <p className="mt-2 text-gray-500">It may have been removed or is unavailable.</p>
            <Link to="/books" className="mt-6 inline-block px-4 py-2 rounded-md bg-primary-600 text-white">Back to Books</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white shadow rounded-lg p-4 flex items-center justify-center">
            <img
              src={book.images?.[0] || '/placeholder-book.jpg'}
              alt={book.title}
              className="w-full max-w-sm object-cover rounded"
            />
          </div>

          {/* Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900">{book.title}</h1>
            <p className="text-gray-600 mt-1">by {book.author}</p>
            <div className="flex items-center mt-2 text-yellow-500 text-sm">
              <Star className="h-5 w-5 fill-yellow-400" />
              <span className="ml-1">{book.ratings?.average?.toFixed?.(1) || '4.0'}</span>
              <span className="ml-2 text-gray-400">({book.ratings?.count || 0} reviews)</span>
            </div>
            <div className="mt-4 text-3xl font-semibold text-gray-900">{formatPrice(book.price)}</div>
            <p className="mt-4 text-gray-700 whitespace-pre-line">{book.description || 'No description available.'}</p>

            <div className="mt-4 text-sm text-gray-600">
              <p><span className="font-medium text-gray-800">ISBN:</span> {book.isbn || '—'}</p>
              <p><span className="font-medium text-gray-800">Category:</span> {book.category || '—'}</p>
              <p><span className="font-medium text-gray-800">Stock:</span> {book.stock > 0 ? `${book.stock} available` : 'Out of stock'}</p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2"
                >-
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, Math.min(book.stock || 10, q + 1)))}
                  className="px-3 py-2"
                >+
                </button>
              </div>
              <button
                disabled={book.stock <= 0}
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary-600 text-white disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                disabled={isWishing}
                className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Heart className="h-5 w-5 mr-2" />
                Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rb) => (
                <div key={rb._id} className="bg-white shadow rounded-lg overflow-hidden">
                  <Link to={`/books/${rb._id}`}>
                    <img src={rb.images?.[0] || '/placeholder-book.jpg'} alt={rb.title} className="w-full h-48 object-cover" />
                  </Link>
                  <div className="p-4">
                    <Link to={`/books/${rb._id}`} className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
                      {rb.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">by {rb.author}</p>
                    <div className="mt-2 text-lg font-semibold">{formatPrice(rb.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookDetail
