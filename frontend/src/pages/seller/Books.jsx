import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Pencil, Trash2, BookOpen } from 'lucide-react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/format'
import { coverUrl } from '../../utils/bookHelpers'
import SellerLayout from '../../components/seller/SellerLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { cn } from '../../utils/cn'

export default function SellerBooks() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/sellers/books', { params: { limit: 100 } })
      setBooks(data.books || [])
    } catch {
      toast.error('Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return books
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn?.toLowerCase().includes(q)
    )
  }, [books, query])

  const handleDelete = async (bookId) => {
    if (!window.confirm('Remove this title from your catalog?')) return
    try {
      await api.delete(`/books/${bookId}`)
      setBooks((prev) => prev.filter((b) => b._id !== bookId))
      toast.success('Book removed')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete')
    }
  }

  return (
    <SellerLayout
      title="My catalog"
      subtitle="Manage books, posters, prints, and other products."
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button as={Link} to="/seller/books/add" className="w-full sm:w-auto">
          Add product
        </Button>
      </div>

      <Card className="mb-6 border-neutral-200 p-4 shadow-soft md:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field pl-10"
            placeholder="Search title, author, or ISBN…"
            aria-label="Search catalog"
          />
        </div>
      </Card>

      {loading ? (
        <p className="text-ink-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-neutral-200 py-16 text-center shadow-soft">
          <BookOpen className="mx-auto h-12 w-12 text-neutral-300" />
          <p className="mt-4 text-body-sm text-ink-muted">
            {books.length === 0
              ? 'No books yet — add your first listing.'
              : 'No matches for that search.'}
          </p>
          {books.length === 0 && (
            <Button as={Link} to="/seller/books/add" className="mt-6">
              Add product
            </Button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-body-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50/80 text-small font-semibold uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-4 py-3">Book</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((book) => (
                  <tr key={book._id} className="hover:bg-neutral-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={coverUrl(book)}
                          alt=""
                          className="h-14 w-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-neutral-900">{book.title}</p>
                          <p className="text-small text-ink-muted">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{book.category}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(book.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-small font-medium',
                          book.stock > 5
                            ? 'bg-success-muted text-success-foreground'
                            : book.stock > 0
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-error-muted text-error-foreground'
                        )}
                      >
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/seller/books/${book._id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(book._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </SellerLayout>
  )
}
