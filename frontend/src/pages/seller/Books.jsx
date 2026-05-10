import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Pencil, Trash2, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/format'
import SellerLayout from '../../components/seller/SellerLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import {
  getSellerBooks,
  deleteSellerBook,
} from '../../utils/sellerMockStore'
import { cn } from '../../utils/cn'

function coverUrl(b) {
  const img = b.images?.[0]
  if (!img) return '/placeholder-book.jpg'
  return typeof img === 'string' ? img : img?.url || '/placeholder-book.jpg'
}

export default function SellerBooks() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState(() => getSellerBooks())

  useEffect(() => {
    setBooks(getSellerBooks())
  }, [location.pathname])

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

  const handleDelete = (bookId) => {
    if (!window.confirm('Remove this title from your catalog?')) return
    deleteSellerBook(bookId)
    setBooks(getSellerBooks())
    toast.success('Book removed')
  }

  return (
    <SellerLayout
      title="My books"
      subtitle="Search, edit, or remove listings. New titles appear here after you add them."
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button as={Link} to="/seller/books/add" className="w-full sm:w-auto">
          Add book
        </Button>
      </div>

      <Card className="mb-6 border-neutral-200/90 p-4 shadow-soft md:p-5">
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

      {filtered.length === 0 ? (
        <Card className="border-dashed border-neutral-200 py-16 text-center shadow-soft">
          <BookOpen className="mx-auto h-12 w-12 text-neutral-300" />
          <p className="mt-4 text-body-sm text-neutral-500">
            {books.length === 0
              ? 'No books yet — add your first listing.'
              : 'No matches for that search.'}
          </p>
          {books.length === 0 && (
            <Button as={Link} to="/seller/books/add" className="mt-6">
              Add book
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-neutral-200/90 bg-surface shadow-card md:block">
            <table className="min-w-full text-left text-body-sm">
              <thead className="border-b border-neutral-100 bg-surface-subtle text-small font-semibold uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-3 pl-6">Book</th>
                  <th className="px-4 py-3">ISBN</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((b) => (
                  <tr key={b._id} className="transition-colors hover:bg-neutral-50/80">
                    <td className="px-4 py-3 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={coverUrl(b)}
                          alt=""
                          className="h-14 w-10 rounded-lg object-cover shadow-soft"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 line-clamp-2">
                            {b.title}
                          </p>
                          <p className="text-small text-neutral-500">{b.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-small text-neutral-600">
                      {b.isbn || '—'}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {b.category || '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-neutral-900">
                      {formatPrice(b.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={cn(
                          'inline-flex min-w-[2.5rem] justify-end tabular-nums font-medium',
                          (b.stock ?? 0) === 0
                            ? 'text-error'
                            : (b.stock ?? 0) < 10
                              ? 'text-amber-700'
                              : 'text-neutral-800'
                        )}
                      >
                        {b.stock ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 pr-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/seller/books/${b._id}/edit`)}
                        >
                          <Pencil className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-error/30 text-error hover:bg-error-muted"
                          onClick={() => handleDelete(b._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-4 md:hidden">
            {filtered.map((b) => (
              <li key={b._id}>
                <Card className="overflow-hidden border-neutral-200/90 p-4 shadow-soft">
                  <div className="flex gap-3">
                    <img
                      src={coverUrl(b)}
                      alt=""
                      className="h-24 w-[4.5rem] shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-neutral-900 line-clamp-2">
                        {b.title}
                      </p>
                      <p className="text-small text-neutral-500">{b.author}</p>
                      <p className="mt-2 text-body-sm font-medium text-primary-600">
                        {formatPrice(b.price)}
                      </p>
                      <p className="text-small text-neutral-600">
                        Stock: <span className="tabular-nums">{b.stock}</span>
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/seller/books/${b._id}/edit`)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-error/30 text-error"
                          onClick={() => handleDelete(b._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </SellerLayout>
  )
}
