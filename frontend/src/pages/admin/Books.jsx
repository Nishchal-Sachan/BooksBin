import { useEffect, useState } from 'react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
          <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value) }} className="input w-auto">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <form onSubmit={handleSearch} className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="input flex-1" placeholder="Search by title or author" />
            <button className="px-4 py-2 rounded-md bg-primary-600 text-white">Search</button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No books.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((b) => (
                <div key={b._id} className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
                  <img src={b.images?.[0] || '/placeholder-book.jpg'} alt={b.title} className="w-full h-48 object-cover" />
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="font-medium text-gray-900 line-clamp-2">{b.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{b.author}</div>
                    <div className="mt-3 text-sm">Seller: {b.seller?.name || '—'}</div>
                    <div className="mt-auto flex gap-2">
                      <select value={b.isActive ? 'active' : 'inactive'} onChange={(e) => updateStatus(b._id, e.target.value === 'active')} className="px-3 py-1.5 text-sm rounded-md border">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <button onClick={() => handleDelete(b._id)} className="px-3 py-1.5 text-sm rounded-md border border-red-300 text-red-600">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded border disabled:opacity-50">Previous</button>
                <span className="px-3 py-1.5">Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded border disabled:opacity-50">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminBooks
