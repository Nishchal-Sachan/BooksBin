import { useEffect, useState } from 'react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import PageContainer from '../../components/layout/PageContainer'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import { coverUrl } from '../../utils/bookHelpers'

const AdminBooks = () => {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetchBooks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status])

  const fetchBooks = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' })
      if (search) params.append('search', search)
      if (status) params.append('status', status)
      const res = await api.get(`/admin/books?${params}`)
      setBooks(res.data.books || [])
      setTotalPages(res.data.pagination.totalPages)
    } catch {
      toast.error('Failed to load books')
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (bookId, isActive) => {
    try {
      await api.patch(`/admin/books/${bookId}/status`, { isActive })
      toast.success('Book status updated')
      fetchBooks()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDelete = async (bookId) => {
    if (!window.confirm('Delete this book?')) return
    try {
      await api.delete(`/admin/books/${bookId}`)
      toast.success('Book deleted')
      fetchBooks()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchBooks()
  }

  return (
    <div className="min-h-screen bg-surface-subtle py-8 md:py-10">
      <PageContainer>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-h1 md:text-display">Manage books</h1>
          <select
            value={status}
            onChange={(e) => {
              setPage(1)
              setStatus(e.target.value)
            }}
            className="select-field w-full sm:w-auto"
            aria-label="Filter by status"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <Card className="mb-6 p-4 shadow-card md:p-6">
          <form onSubmit={handleSearch} className="flex flex-col gap-2 sm:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field flex-1"
              placeholder="Search by title or author"
            />
            <Button type="submit" className="sm:w-auto">
              Search
            </Button>
          </form>
        </Card>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : books.length === 0 ? (
          <div className="py-20 text-center text-body text-ink-muted">
            No books.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((b) => (
                <Card
                  key={b._id}
                  interactive={false}
                  className="flex flex-col overflow-hidden p-0 shadow-card"
                >
                  <img
                    src={coverUrl(b)}
                    alt={b.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-4">
                    <div className="line-clamp-2 font-medium text-neutral-900">
                      {b.title}
                    </div>
                    <div className="mt-1 text-small text-ink-muted">
                      {b.author}
                    </div>
                    <div className="mt-3 text-body-sm text-ink-muted">
                      Seller: {b.seller?.name || '—'}
                    </div>
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      <select
                        value={b.isActive ? 'active' : 'inactive'}
                        onChange={(e) =>
                          updateStatus(b._id, e.target.value === 'active')
                        }
                        className="select-field min-w-0 flex-1 py-2 text-small"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-error/30 text-error hover:bg-error-muted"
                        onClick={() => handleDelete(b._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="px-3 py-2 text-body-sm text-ink-muted">
                  Page {page} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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

export default AdminBooks
