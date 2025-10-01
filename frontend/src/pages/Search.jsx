import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, Star } from 'lucide-react'
import api from '../store/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, setPagination, setSearchQuery } from '../store/slices/uiSlice'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/format'

const Search = () => {
  const dispatch = useDispatch()
  const { searchQuery, filters, pagination } = useSelector((s) => s.ui)
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [params, setParams] = useSearchParams()

  // Initialize search term from URL on first load
  useEffect(() => {
    const q = params.get('q') || ''
    if (q && q !== searchQuery) {
      dispatch(setSearchQuery(q))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchBooks()
    const next = new URLSearchParams()
    if (searchQuery) next.set('q', searchQuery)
    next.set('page', String(pagination.currentPage))
    setParams(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, pagination.currentPage])

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const query = new URLSearchParams({
        page: String(pagination.currentPage || 1),
        limit: '12',
      })
      if (searchQuery) query.append('search', searchQuery)
      const res = await api.get(`/books?${query}`)
      setBooks(res.data.books || [])
      dispatch(setPagination({
        currentPage: res.data.pagination.currentPage,
        totalPages: res.data.pagination.totalPages,
        totalItems: res.data.pagination.totalBooks,
      }))
    } catch {
      toast.error('Failed to load results')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(setPagination({ currentPage: 1 }))
    fetchBooks()
  }

  const handleAddToCart = async (bookId) => {
    try {
      await dispatch(addToCart({ bookId, quantity: 1 })).unwrap()
      toast.success('Added to cart')
    } catch (e) {
      toast.error(e || 'Failed to add to cart')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="input pl-10"
              placeholder="Search books by title, author, ISBN..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
          </div>
          <div className="mt-3 text-right">
            <button type="submit" className="px-4 py-2 rounded-md bg-primary-600 text-white">Search</button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No results found.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <div key={book._id} className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
                  <Link to={`/books/${book._id}`} className="block">
                    <img src={book.images?.[0] || '/placeholder-book.jpg'} alt={book.title} className="w-full h-56 object-cover" />
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <Link to={`/books/${book._id}`} className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
                      {book.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">by {book.author}</p>
                    <div className="flex items-center mt-2 text-yellow-500 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400" />
                      <span className="ml-1">{book.ratings?.average?.toFixed?.(1) || '4.0'}</span>
                      <span className="ml-2 text-gray-400">({book.ratings?.count || 0})</span>
                    </div>
                    <div className="mt-3 text-lg font-semibold text-gray-900">{formatPrice(book.price)}</div>
                    <div className="mt-4 flex gap-2 mt-auto">
                      <button onClick={() => handleAddToCart(book._id)} className="flex-1 px-3 py-2 text-sm rounded-md bg-primary-600 text-white">Add to Cart</button>
                      <Link to={`/books/${book._id}`} className="px-3 py-2 text-sm rounded-md border border-gray-200 text-gray-700">Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => dispatch(setPagination({ currentPage: Math.max(1, pagination.currentPage - 1) }))}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1.5 rounded border disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5">Page {pagination.currentPage} of {pagination.totalPages}</span>
                <button
                  onClick={() => dispatch(setPagination({ currentPage: Math.min(pagination.totalPages, pagination.currentPage + 1) }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1.5 rounded border disabled:opacity-50"
                >
                  Next
                </button>
        </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Search
