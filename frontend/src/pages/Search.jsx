import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import api from '../store/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setPagination, setSearchQuery } from '../store/slices/uiSlice'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import PageContainer from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProductCard from '../components/ui/ProductCard'
import Spinner from '../components/ui/Spinner'

const Search = () => {
  const dispatch = useDispatch()
  const { searchQuery, pagination } = useSelector((s) => s.ui)
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [params, setParams] = useSearchParams()

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
      dispatch(
        setPagination({
          currentPage: res.data.pagination.currentPage,
          totalPages: res.data.pagination.totalPages,
          totalItems: res.data.pagination.totalBooks,
        })
      )
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
    <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
      <PageContainer>
        <h1 className="text-h1 md:text-display mb-8">Search</h1>

        <Card className="mb-8 p-4 shadow-card md:p-6">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                className="input-field pl-10"
                placeholder="Search books by title, author, ISBN..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                aria-label="Search books"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="submit">Search</Button>
            </div>
          </form>
        </Card>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : books.length === 0 ? (
          <div className="py-20 text-center text-body text-ink-muted">
            No results found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <ProductCard
                  key={book._id}
                  book={book}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pagination.currentPage === 1}
                  onClick={() =>
                    dispatch(
                      setPagination({
                        currentPage: Math.max(1, pagination.currentPage - 1),
                      })
                    )
                  }
                >
                  Previous
                </Button>
                <span className="px-3 py-2 text-body-sm text-ink-muted">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={
                    pagination.currentPage === pagination.totalPages
                  }
                  onClick={() =>
                    dispatch(
                      setPagination({
                        currentPage: Math.min(
                          pagination.totalPages,
                          pagination.currentPage + 1
                        ),
                      })
                    )
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </PageContainer>
    </div>
  )
}

export default Search
