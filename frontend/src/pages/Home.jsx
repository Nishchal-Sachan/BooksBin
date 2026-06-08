import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Search,
  Truck,
  Banknote,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import api from '../store/api/api'
import { addToCart } from '../store/slices/cartSlice'
import toast from 'react-hot-toast'
import PageContainer from '../components/layout/PageContainer'
import Button from '../components/ui/Button'
import BookListingCard from '../components/books/BookListingCard'
import BookListingCardSkeleton from '../components/books/BookListingCardSkeleton'
import { formatPrice } from '../utils/format'
import { FREE_SHIPPING_THRESHOLD } from '../utils/constants'
import { BOOK_CATEGORIES } from '../utils/bookHelpers'
import { cn } from '../utils/cn'

const QUICK_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Posters',
  'Art & Prints',
  'Stationery & Journals',
  'Merchandise & Gifts',
  'Magazines',
  'Children',
]

function ProductSection({ title, subtitle, books, onAddToCart, viewAllTo }) {
  if (!books?.length) return null
  return (
    <section className="py-10 md:py-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-h2 md:text-h1">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-body-sm text-ink-muted">{subtitle}</p>
          )}
        </div>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-primary-800 hover:text-primary-900"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
        {books.map((book) => (
          <BookListingCard
            key={book._id}
            book={book}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  )
}

function EmptyCatalog() {
  return (
    <section className="py-10 md:py-12">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-soft md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-800">
          <BookOpen className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-h2">Catalog coming soon</h2>
        <p className="mx-auto mt-3 max-w-lg text-body-sm text-ink-muted">
          Our seller is adding books, posters, prints, and more. Check back soon,
          or browse categories to see what we carry.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/books">
            Browse categories
          </Button>
          <Button as={Link} to="/register" variant="outline">
            Join BooksBin
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-h2">Shop by category</h2>
        <p className="mt-1 text-body-sm text-ink-muted">
          Explore what BooksBin offers
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {BOOK_CATEGORIES.slice(0, 12).map((name) => (
            <Link
              key={name}
              to={`/books?category=${encodeURIComponent(name)}`}
              className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-soft transition-all hover:border-primary-300 hover:shadow-card"
            >
              <BookOpen className="h-6 w-6 text-primary-700" />
              <span className="mt-3 font-semibold text-ink group-hover:text-primary-800">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [store, setStore] = useState({
    featured: [],
    newArrivals: [],
    bestsellers: [],
    categories: [],
    stats: { totalBooks: 0, totalCategories: 0, minPrice: 0, maxPrice: 0 },
  })

  useEffect(() => {
    document.title = 'BooksBin — Online Bookstore'
    api
      .get('/books/storefront')
      .then((res) => setStore(res.data))
      .catch(() => toast.error('Could not load store'))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/books?search=${encodeURIComponent(search.trim())}`)
    } else {
      navigate('/books')
    }
  }

  const handleAddToCart = async (bookId, book) => {
    try {
      await dispatch(addToCart({ bookId, quantity: 1 })).unwrap()
      toast.success(`“${book?.title ?? 'Book'}” added to cart`)
    } catch (e) {
      toast.error(e || 'Sign in to add items to cart')
    }
  }

  const { stats, categories, featured, newArrivals, bestsellers } = store
  const hasProducts =
    featured.length > 0 ||
    bestsellers.length > 0 ||
    newArrivals.length > 0 ||
    stats.totalBooks > 0
  const displayCategories =
    categories.length > 0
      ? categories
      : QUICK_CATEGORIES.map((name) => ({ name, count: 0 }))

  return (
    <div className="min-h-screen bg-surface-subtle">
      <div className="promo-bar">
        <PageContainer className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2.5">
          <span className="inline-flex items-center gap-1.5 text-white">
            <Truck className="h-3.5 w-3.5" aria-hidden />
            Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}
          </span>
          <span className="hidden sm:inline text-white/50" aria-hidden>
            |
          </span>
          <span className="inline-flex items-center gap-1.5 text-white">
            <Banknote className="h-3.5 w-3.5" aria-hidden />
            Cash on delivery available
          </span>
        </PageContainer>
      </div>

      <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
        <div
          className="pointer-events-none absolute -right-24 top-0 h-full w-1/2 opacity-[0.07]"
          aria-hidden
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #1e3247 0, #1e3247 2px, transparent 2px, transparent 12px)',
          }}
        />
        <PageContainer className="relative py-10 md:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">Books, posters & more</p>
              <h1 className="mt-3 text-h1 md:text-display">
                Your next great read awaits
              </h1>
              <p className="mt-4 max-w-lg text-body text-ink-muted">
                {loading
                  ? 'Loading catalog…'
                  : stats.totalBooks > 0
                    ? `${stats.totalBooks} products across ${stats.totalCategories} categories — from ${formatPrice(stats.minPrice)}.`
                    : 'Browse books, posters, prints, and stationery. Create a free account and pay cash on delivery.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button as={Link} to="/books" size="lg">
                  Start shopping
                </Button>
                <Button as={Link} to="/register" variant="outline" size="lg">
                  Join free
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-surface-subtle p-5 shadow-soft md:p-6">
              <p className="mb-3 text-small font-semibold text-ink-muted">
                Search our catalog
              </p>
              <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Title, author, or ISBN…"
                    className="input-field w-full rounded-xl py-3 pl-11 pr-4 text-base"
                  />
                </div>
                <Button type="submit" size="lg" className="shrink-0 sm:px-8">
                  Search
                </Button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                {(loading ? QUICK_CATEGORIES.slice(0, 6) : displayCategories.slice(0, 6)).map(
                  (cat) => {
                    const name = typeof cat === 'string' ? cat : cat.name
                    const count = typeof cat === 'string' ? null : cat.count
                    return (
                      <Link
                        key={name}
                        to={`/books?category=${encodeURIComponent(name)}`}
                        className="rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-small font-medium text-ink-muted transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-900"
                      >
                        {name}
                        {count != null && count > 0 && (
                          <span className="ml-1 text-ink-muted">({count})</span>
                        )}
                      </Link>
                    )
                  }
                )}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="border-b border-neutral-200 bg-white">
        <PageContainer className="py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Banknote, label: 'Cash on delivery', detail: 'Pay when your order arrives' },
              { icon: Truck, label: 'Fast dispatch', detail: 'Ships within 24 hours on in-stock items' },
              { icon: ShieldCheck, label: 'Secure checkout', detail: 'Your data stays protected' },
            ].map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-surface-subtle px-4 py-3.5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-body-sm font-semibold text-ink">{label}</p>
                  <p className="text-small text-ink-muted">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <PageContainer className="pb-16">
        {loading ? (
          <div className="py-10">
            <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-neutral-200" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <BookListingCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : !hasProducts ? (
          <EmptyCatalog />
        ) : (
          <>
            <ProductSection
              title="Featured picks"
              subtitle="Editor's selections from our catalog"
              books={featured}
              onAddToCart={handleAddToCart}
              viewAllTo="/books"
            />

            <ProductSection
              title="Bestsellers"
              subtitle="Most ordered by readers this month"
              books={bestsellers}
              onAddToCart={handleAddToCart}
              viewAllTo="/books?sort=bestseller"
            />

            <ProductSection
              title="New arrivals"
              subtitle="Recently added to the store"
              books={newArrivals}
              onAddToCart={handleAddToCart}
              viewAllTo="/books?sort=newest"
            />

            {categories.length > 0 && (
              <section className="py-10 md:py-12">
                <h2 className="text-h2 md:text-h1">Browse by category</h2>
                <p className="mt-1 text-body-sm text-ink-muted">
                  Find exactly what you are looking for
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={`/books?category=${encodeURIComponent(cat.name)}`}
                      className={cn(
                        'group flex flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-soft',
                        'transition-all hover:border-primary-300 hover:shadow-card'
                      )}
                    >
                      <BookOpen className="h-6 w-6 text-primary-700" />
                      <span className="mt-3 font-semibold text-ink group-hover:text-primary-800">
                        {cat.name}
                      </span>
                      <span className="mt-1 text-small text-ink-muted">
                        {cat.count} {cat.count === 1 ? 'title' : 'titles'}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <section className="mt-10 overflow-hidden rounded-2xl bg-primary-900 p-8 shadow-card md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-small font-medium text-white">
                <Sparkles className="h-3.5 w-3.5" />
                Cash on delivery
              </div>
              <h2 className="text-h2 text-white">Ready to order?</h2>
              <p className="mt-2 max-w-lg text-body-sm text-primary-100">
                Add items to your cart, checkout with cash on delivery, and track
                every order from your account.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button as={Link} to="/books" variant="inverse" size="lg">
                Shop all products
              </Button>
              <Button as={Link} to="/register" variant="outlineInverse" size="lg">
                Create account
              </Button>
            </div>
          </div>
        </section>
      </PageContainer>
    </div>
  )
}
