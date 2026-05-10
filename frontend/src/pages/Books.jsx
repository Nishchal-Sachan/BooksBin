import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  BookOpen,
  Filter,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import PageContainer from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import BookListingCard from '../components/books/BookListingCard'
import BookListingCardSkeleton from '../components/books/BookListingCardSkeleton'
import {
  MOCK_BOOKS_CATALOG,
  CATALOG_PRICE_BOUNDS,
  CATALOG_CATEGORIES,
} from '../data/booksCatalogMock'
import { formatPrice } from '../utils/format'
import { cn } from '../utils/cn'

const PAGE_SIZE = 12
const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating_desc', label: 'Customer rating' },
]

const RATING_OPTIONS = [
  { value: '', label: 'Any rating' },
  { value: '4', label: '4★ & up' },
  { value: '3', label: '3★ & up' },
  { value: '2', label: '2★ & up' },
]

const DEMO_ID_PREFIX = 'cat-'

function SidebarFilters({
  category,
  setCategory,
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  bounds,
  minRating,
  setMinRating,
  onReset,
  idPrefix = '',
  className,
}) {
  const p = idPrefix
  return (
    <aside
      className={cn(
        'flex flex-col gap-8 rounded-xl border border-neutral-200/90 bg-surface p-5 shadow-soft lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto',
        className
      )}
    >
      <div>
        <h2 className="text-small font-semibold uppercase tracking-wide text-neutral-500">
          Categories
        </h2>
        <ul className="mt-3 space-y-1">
          <li>
            <button
              type="button"
              onClick={() => setCategory('')}
              className={cn(
                'flex w-full rounded-lg px-3 py-2 text-left text-body-sm transition-colors',
                !category
                  ? 'bg-primary-50 font-medium text-primary-800'
                  : 'text-neutral-700 hover:bg-neutral-50'
              )}
            >
              All books
            </button>
          </li>
          {CATALOG_CATEGORIES.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  'flex w-full rounded-lg px-3 py-2 text-left text-body-sm transition-colors',
                  category === c
                    ? 'bg-primary-50 font-medium text-primary-800'
                    : 'text-neutral-700 hover:bg-neutral-50'
                )}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-small font-semibold uppercase tracking-wide text-neutral-500">
          Price range
        </h2>
        <p className="mt-2 text-small text-neutral-500">
          {formatPrice(priceMin)} — {formatPrice(priceMax)}
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor={`${p}price-min`}
              className="text-small font-medium text-neutral-600"
            >
              Minimum
            </label>
            <input
              id={`${p}price-min`}
              type="range"
              min={bounds.min}
              max={bounds.max}
              step={0.5}
              value={Math.min(priceMin, priceMax)}
              onChange={(e) => {
                const v = Number(e.target.value)
                setPriceMin(v)
                if (v > priceMax) setPriceMax(v)
              }}
              className="mt-1 h-2 w-full cursor-pointer accent-primary-600"
            />
          </div>
          <div>
            <label
              htmlFor={`${p}price-max`}
              className="text-small font-medium text-neutral-600"
            >
              Maximum
            </label>
            <input
              id={`${p}price-max`}
              type="range"
              min={bounds.min}
              max={bounds.max}
              step={0.5}
              value={Math.max(priceMin, priceMax)}
              onChange={(e) => {
                const v = Number(e.target.value)
                setPriceMax(v)
                if (v < priceMin) setPriceMin(v)
              }}
              className="mt-1 h-2 w-full cursor-pointer accent-primary-600"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-small font-semibold uppercase tracking-wide text-neutral-500">
          Rating
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value || 'any'}
              type="button"
              onClick={() => setMinRating(opt.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-small font-medium transition-colors',
                minRating === opt.value
                  ? 'border-primary-500 bg-primary-50 text-primary-800'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={onReset}>
        Reset filters
      </Button>
    </aside>
  )
}

export default function Books() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const bounds = CATALOG_PRICE_BOUNDS
  const [category, setCategory] = useState('')
  const [priceMin, setPriceMin] = useState(bounds.min)
  const [priceMax, setPriceMax] = useState(bounds.max)
  const [minRating, setMinRating] = useState('')
  const [sort, setSort] = useState('rating_desc')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(() => searchParams.get('search') || '')
  const [isLoading, setIsLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    const q = searchParams.get('search')
    if (q != null && q !== search) setSearch(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    setIsLoading(true)
    const t = window.setTimeout(() => setIsLoading(false), 480)
    return () => window.clearTimeout(t)
  }, [category, priceMin, priceMax, minRating, sort])

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase()
    const minR = minRating === '' ? 0 : Number(minRating)

    let list = MOCK_BOOKS_CATALOG.filter((b) => {
      if (category && b.category !== category) return false
      if (b.price < priceMin || b.price > priceMax) return false
      if ((b.ratings?.average ?? 0) < minR) return false
      if (q) {
        const hay = `${b.title} ${b.author}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })

    if (sort === 'price_asc') {
      list = [...list].sort((a, b) => a.price - b.price)
    } else if (sort === 'price_desc') {
      list = [...list].sort((a, b) => b.price - a.price)
    } else {
      list = [...list].sort(
        (a, b) => (b.ratings?.average ?? 0) - (a.ratings?.average ?? 0)
      )
    }
    return list
  }, [category, priceMin, priceMax, minRating, sort, search])

  const totalFiltered = filteredSorted.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageBooks = filteredSorted.slice(pageStart, pageStart + PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [category, priceMin, priceMax, minRating, sort, search])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const syncUrl = useCallback(() => {
    const next = new URLSearchParams()
    if (search.trim()) next.set('search', search.trim())
    setSearchParams(next, { replace: true })
  }, [search, setSearchParams])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    syncUrl()
    setPage(1)
  }

  const resetFilters = () => {
    setCategory('')
    setPriceMin(bounds.min)
    setPriceMax(bounds.max)
    setMinRating('')
    setSort('rating_desc')
    setSearch('')
    setSearchParams({}, { replace: true })
    setPage(1)
    setMobileFiltersOpen(false)
  }

  const handleAddToCart = async (bookId, book) => {
    try {
      await dispatch(addToCart({ bookId, quantity: 1 })).unwrap()
      toast.success(
        String(bookId).startsWith(DEMO_ID_PREFIX)
          ? `“${book?.title ?? 'Book'}” added to cart`
          : 'Added to cart'
      )
    } catch (e) {
      toast.error(e || 'Failed to add to cart')
    }
  }

  const rangeLabel =
    totalFiltered === 0
      ? '0 results'
      : `Showing ${pageStart + 1}–${Math.min(pageStart + pageBooks.length, totalFiltered)} of ${totalFiltered}`

  const renderSidebar = (idPrefix) => (
    <SidebarFilters
      idPrefix={idPrefix}
      category={category}
      setCategory={setCategory}
      priceMin={priceMin}
      priceMax={priceMax}
      setPriceMin={setPriceMin}
      setPriceMax={setPriceMax}
      bounds={bounds}
      minRating={minRating}
      setMinRating={setMinRating}
      onReset={resetFilters}
    />
  )

  return (
    <div className="min-h-screen bg-surface-subtle pb-16 pt-8 md:pb-20 md:pt-10">
      <PageContainer>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-small font-semibold uppercase tracking-wide text-primary-600">
              Shop
            </p>
            <h1 className="text-h1 md:text-display mt-1">All books</h1>
            <p className="mt-2 max-w-xl text-body-sm text-neutral-600">
              Browse our catalog with filters, sort by price or rating, and build
              your next read — same layout you&apos;d expect from a major
              bookstore.
            </p>
          </div>
          <Card className="flex items-center gap-3 border-primary-100/80 bg-gradient-to-br from-primary-50/90 to-surface p-4 shadow-soft">
            <Sparkles className="h-8 w-8 shrink-0 text-primary-500" />
            <p className="text-body-sm text-neutral-700">
              <span className="font-semibold text-neutral-900">Free delivery</span>{' '}
              on orders over $35 — demo catalog with realistic pricing.
            </p>
          </Card>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or author…"
            className="input-field min-w-0 flex-1"
            aria-label="Search catalog"
          />
          <div className="flex gap-2">
            <Button type="submit" variant="secondary">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </form>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="hidden shrink-0 lg:block lg:w-72">
            {renderSidebar('')}
          </div>

          <main className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-body-sm text-neutral-600">
                <span className="font-medium text-neutral-900">{rangeLabel}</span>
                <span className="text-neutral-400"> · </span>
                {MOCK_BOOKS_CATALOG.length} titles in catalog
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort-books" className="text-small text-neutral-500">
                  Sort
                </label>
                <select
                  id="sort-books"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="select-field min-w-[200px]"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: PAGE_SIZE }, (_, i) => (
                  <BookListingCardSkeleton key={i} />
                ))}
              </div>
            ) : totalFiltered === 0 ? (
              <Card className="border-dashed border-neutral-300 bg-surface py-16 text-center shadow-soft md:py-20">
                <BookOpen className="mx-auto h-16 w-16 text-neutral-300" />
                <h2 className="mt-6 text-h2 text-neutral-800">
                  No books match your filters
                </h2>
                <p className="mx-auto mt-2 max-w-md text-body-sm text-neutral-500">
                  Try widening the price range, clearing the category, or
                  resetting filters to see the full catalog again.
                </p>
                <Button type="button" className="mt-8" onClick={resetFilters}>
                  Reset all filters
                </Button>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {pageBooks.map((book) => (
                    <BookListingCard
                      key={book._id}
                      book={book}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    className="mt-10 flex flex-wrap items-center justify-center gap-2"
                    aria-label="Pagination"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={safePage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <span className="px-3 py-2 text-body-sm text-neutral-600">
                      Page {safePage} of {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={safePage >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </nav>
                )}
              </>
            )}
          </main>
        </div>
      </PageContainer>

      {/* Mobile filter drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          mobileFiltersOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-hidden={!mobileFiltersOpen}
      >
        <button
          type="button"
          className={cn(
            'absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity',
            mobileFiltersOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileFiltersOpen(false)}
          aria-label="Close filters"
        />
        <div
          className={cn(
            'absolute left-0 top-0 flex h-full w-[min(100%,20rem)] max-w-full flex-col border-r border-neutral-200 bg-surface shadow-card transition-transform duration-300 ease-out',
            mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <span className="flex items-center gap-2 font-semibold text-neutral-900">
              <Filter className="h-5 w-5 text-primary-600" />
              Filters
            </span>
            <button
              type="button"
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {renderSidebar('m-')}
          </div>
        </div>
      </div>
    </div>
  )
}
