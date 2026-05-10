import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  BookOpen,
  Check,
  ChevronRight,
  Heart,
  Package,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react'
import { addToCart } from '../store/slices/cartSlice'
import api from '../store/api/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/format'
import { cn } from '../utils/cn'
import PageContainer from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import BookListingCard from '../components/books/BookListingCard'
import {
  getMockProductBook,
  getMockRelatedBooks,
} from '../data/bookProductMock'

const DEMO_ID_PREFIX = 'cat-'

function StarRow({ value, className }) {
  const v = Math.round((value || 0) * 2) / 2
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => {
        const full = v >= i
        const half = !full && v >= i - 0.5
        return (
          <Star
            key={i}
            className={cn(
              'h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]',
              full && 'fill-amber-400 text-amber-400',
              half && 'fill-amber-400/50 text-amber-400',
              !full && !half && 'text-neutral-300'
            )}
          />
        )
      })}
    </div>
  )
}

function BookDetailSkeleton() {
  return (
    <div className="min-h-screen bg-surface-subtle pb-20 pt-8 md:pt-10">
      <PageContainer>
        <Skeleton className="mb-8 h-4 w-64 max-w-full" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 xl:col-span-4">
            <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-16 w-14 shrink-0 rounded-lg" />
              <Skeleton className="h-16 w-14 shrink-0 rounded-lg" />
              <Skeleton className="h-16 w-14 shrink-0 rounded-lg" />
            </div>
          </div>
          <div className="lg:col-span-7 xl:col-span-8">
            <Skeleton className="h-10 w-4/5 max-w-xl" />
            <Skeleton className="mt-3 h-5 w-48" />
            <Skeleton className="mt-6 h-8 w-40" />
            <Skeleton className="mt-8 h-24 w-full" />
            <Skeleton className="mt-6 h-12 w-full max-w-md" />
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((s) => s.auth)

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [wishActive, setWishActive] = useState(false)
  const [wishBusy, setWishBusy] = useState(false)

  useEffect(() => {
    setActiveImage(0)
    setQuantity(1)
    setLoading(true)
    const t = window.setTimeout(() => {
      const b = getMockProductBook(id)
      setBook(b)
      setLoading(false)
    }, 420)
    return () => window.clearTimeout(t)
  }, [id])

  const isDemo = book && String(book._id).startsWith(DEMO_ID_PREFIX)

  const gallery = book?.gallery?.length ? book.gallery : book?.images || []
  const mainSrc =
    typeof gallery[activeImage] === 'string'
      ? gallery[activeImage]
      : gallery[activeImage]?.url || '/placeholder-book.jpg'

  const hasDiscount =
    book &&
    book.originalPrice != null &&
    book.originalPrice > book.price
  const discountPct =
    hasDiscount &&
    Math.round((1 - book.price / book.originalPrice) * 100)

  const stockStatus = useMemo(() => {
    if (!book) return null
    if (book.stock <= 0)
      return { label: 'Out of stock', tone: 'danger' }
    if (book.stock < 8)
      return {
        label: `Only ${book.stock} left in stock`,
        tone: 'warning',
      }
    return {
      label: 'In stock — ships within 24 hours',
      tone: 'success',
    }
  }, [book])

  const maxQty = book ? Math.min(10, Math.max(1, book.stock)) : 10

  const handleAddToCart = async () => {
    if (!book || book.stock <= 0) return
    try {
      await dispatch(
        addToCart({ bookId: book._id, quantity })
      ).unwrap()
      toast.success(
        isDemo
          ? `Added ${quantity} × “${book.title}” to your cart`
          : 'Added to cart'
      )
    } catch (e) {
      toast.error(e || 'Failed to add to cart')
    }
  }

  const handleBuyNow = async () => {
    if (!book || book.stock <= 0) return
    await handleAddToCart()
    if (isDemo) {
      navigate('/cart')
      return
    }
    navigate('/cart')
  }

  const handleWishlist = async () => {
    if (!book) return
    if (!isAuthenticated) {
      toast.error('Sign in to save books to your wishlist')
      return
    }
    if (isDemo) {
      setWishActive((v) => {
        const next = !v
        toast.success(
          next ? 'Saved to wishlist (preview)' : 'Removed from wishlist (preview)'
        )
        return next
      })
      return
    }
    setWishBusy(true)
    try {
      await api.post(`/users/wishlist/${book._id}`)
      setWishActive(true)
      toast.success('Added to wishlist')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not update wishlist')
    } finally {
      setWishBusy(false)
    }
  }

  const related = book ? getMockRelatedBooks(book._id, 6) : []

  if (loading) {
    return <BookDetailSkeleton />
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-surface-subtle py-12 md:py-16">
        <PageContainer>
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-surface py-20 text-center shadow-soft">
            <BookOpen className="mx-auto h-16 w-16 text-neutral-300" />
            <h2 className="mt-6 text-h2 text-neutral-800">Book not found</h2>
            <p className="mx-auto mt-2 max-w-md text-body-sm text-neutral-500">
              This title isn&apos;t in our demo catalog. Browse the shop for
              curated picks with full product pages.
            </p>
            <Button as={Link} to="/books" className="mt-8">
              Browse all books
            </Button>
          </div>
        </PageContainer>
      </div>
    )
  }

  const avg = book.ratings?.average ?? 0
  const count = book.ratings?.count ?? 0

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(34,197,94,0.08),transparent)] pb-20 pt-6 md:pt-10">
      <PageContainer>
        {/* Breadcrumb */}
        <nav
          className="mb-8 flex flex-wrap items-center gap-1 text-small text-neutral-500"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="transition-colors hover:text-primary-600">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          <Link to="/books" className="transition-colors hover:text-primary-600">
            Books
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
          <span className="line-clamp-1 font-medium text-neutral-700">
            {book.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Gallery column */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-24 lg:space-y-5">
              <div
                className={cn(
                  'relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.03]',
                  'before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:ring-1 before:ring-inset before:ring-white/60'
                )}
              >
                <div className="aspect-[3/4]">
                  <img
                    src={mainSrc}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                {hasDiscount && (
                  <Badge
                    variant="sale"
                    className="absolute left-4 top-4 px-3 py-1 text-small font-semibold shadow-lg"
                  >
                    {discountPct}% off
                  </Badge>
                )}
              </div>

              {gallery.length > 1 && (
                <div>
                  <p className="mb-2 text-small font-medium text-neutral-500">
                    Gallery
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-landing">
                    {gallery.map((src, i) => {
                      const url =
                        typeof src === 'string' ? src : src?.url || ''
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImage(i)}
                          className={cn(
                            'relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                            activeImage === i
                              ? 'border-primary-500 ring-2 ring-primary-500/25'
                              : 'border-transparent opacity-80 hover:opacity-100'
                          )}
                          aria-label={`View image ${i + 1}`}
                          aria-current={activeImage === i}
                        >
                          <img
                            src={url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-small font-semibold uppercase tracking-[0.12em] text-primary-600">
                  {book.category}
                </p>
                <h1 className="mt-2 font-serif text-[1.75rem] font-semibold leading-tight tracking-tight text-neutral-900 sm:text-4xl md:text-[2.35rem] md:leading-[1.15]">
                  {book.title}
                </h1>
                <p className="mt-3 text-lg text-neutral-600">
                  by{' '}
                  <span className="font-medium text-neutral-800">
                    {book.author}
                  </span>
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <StarRow value={avg} />
                  <span className="text-lg font-semibold tabular-nums text-neutral-900">
                    {avg.toFixed(1)}
                  </span>
                  <span className="text-body-sm text-neutral-500">
                    {count.toLocaleString()} reviews
                  </span>
                </div>
              </div>

              <Card className="border-neutral-200/90 bg-gradient-to-br from-surface via-surface to-primary-50/30 p-6 shadow-card md:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="text-3xl font-bold tracking-tight text-primary-600 md:text-4xl">
                        {formatPrice(book.price)}
                      </span>
                      {hasDiscount && (
                        <>
                          <span className="text-lg text-neutral-400 line-through">
                            {formatPrice(book.originalPrice)}
                          </span>
                          <Badge variant="new" className="font-semibold">
                            Save {formatPrice(book.originalPrice - book.price)}
                          </Badge>
                        </>
                      )}
                    </div>
                    {stockStatus && (
                      <p
                        className={cn(
                          'mt-3 flex items-center gap-2 text-body-sm font-medium',
                          stockStatus.tone === 'success' && 'text-success',
                          stockStatus.tone === 'warning' && 'text-amber-700',
                          stockStatus.tone === 'danger' && 'text-error'
                        )}
                      >
                        <Package className="h-4 w-4 shrink-0" />
                        {stockStatus.label}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 sm:flex-col sm:items-end">
                    <button
                      type="button"
                      onClick={handleWishlist}
                      disabled={wishBusy}
                      aria-pressed={wishActive}
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 shadow-soft transition-all hover:border-rose-200 hover:text-rose-600',
                        wishActive &&
                          'border-rose-200 bg-rose-50 text-rose-600'
                      )}
                      aria-label="Wishlist"
                    >
                      <Heart
                        className={cn(
                          'h-5 w-5',
                          wishActive && 'fill-rose-600 text-rose-600'
                        )}
                        fill={wishActive ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 border-t border-neutral-100 pt-8 sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="inline-flex items-center rounded-xl border border-neutral-200 bg-white shadow-soft">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="rounded-l-xl px-4 py-3 text-lg font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
                    >
                      −
                    </button>
                    <span className="min-w-[3.5rem] px-4 py-3 text-center text-body font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(maxQty, q + 1))
                      }
                      className="rounded-r-xl px-4 py-3 text-lg font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
                    >
                      +
                    </button>
                  </div>

                  <Button
                    size="lg"
                    disabled={book.stock <= 0}
                    onClick={handleAddToCart}
                    className="min-h-[3rem] flex-1 gap-2 sm:min-w-[200px]"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={book.stock <= 0}
                    onClick={handleBuyNow}
                    className="min-h-[3rem] flex-1 gap-2 border-neutral-300 bg-white/80 sm:min-w-[200px]"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Buy now
                  </Button>
                </div>

                <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                  <li className="flex items-start gap-2 rounded-xl bg-white/60 px-3 py-2.5 text-small text-neutral-600">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                    Free shipping over $35
                  </li>
                  <li className="flex items-start gap-2 rounded-xl bg-white/60 px-3 py-2.5 text-small text-neutral-600">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                    Authentic publisher editions
                  </li>
                  <li className="flex items-start gap-2 rounded-xl bg-white/60 px-3 py-2.5 text-small text-neutral-600">
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                    Careful packaging & tracking
                  </li>
                </ul>
              </Card>

              {/* Meta */}
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-neutral-200/80 bg-surface-subtle/80 px-5 py-4 text-small sm:grid-cols-4">
                <div>
                  <dt className="text-neutral-500">ISBN</dt>
                  <dd className="mt-0.5 font-medium text-neutral-800">
                    {book.isbn}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Format</dt>
                  <dd className="mt-0.5 font-medium text-neutral-800">
                    {book.format}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Pages</dt>
                  <dd className="mt-0.5 font-medium text-neutral-800">
                    {book.pages}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Publisher</dt>
                  <dd className="mt-0.5 font-medium text-neutral-800 line-clamp-2">
                    {book.publisher}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-4">
                  <dt className="text-neutral-500">Language</dt>
                  <dd className="mt-0.5 font-medium text-neutral-800">
                    {book.language}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Description & highlights */}
        <section className="mt-16 md:mt-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <h2 className="font-serif text-2xl font-semibold text-neutral-900 md:text-3xl">
                About this book
              </h2>
              <div className="prose-book mt-6 space-y-4 text-body text-neutral-700">
                {book.description.split('\n\n').map((para, i) => (
                  <p key={i} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <Card className="border-primary-100/80 bg-gradient-to-b from-primary-50/40 to-surface p-6 shadow-soft">
                <h3 className="text-small font-semibold uppercase tracking-wide text-primary-800">
                  Highlights
                </h3>
                <ul className="mt-4 space-y-3">
                  {book.highlights.map((line, i) => (
                    <li key={i} className="flex gap-3 text-body-sm text-neutral-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-16 border-t border-neutral-200/80 pt-16 md:mt-20 md:pt-20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-neutral-900 md:text-3xl">
                Customer reviews
              </h2>
              <p className="mt-1 text-body-sm text-neutral-500">
                Verified purchase-style feedback from our demo community
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-surface px-4 py-2 shadow-soft">
              <StarRow value={avg} />
              <span className="font-semibold text-neutral-900">
                {avg.toFixed(1)}
              </span>
              <span className="text-small text-neutral-500">
                ({count.toLocaleString()} total)
              </span>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {book.reviews.map((rev) => (
              <Card
                key={rev.id}
                className="border-neutral-200/90 p-5 shadow-soft transition-shadow hover:shadow-card md:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-small font-bold text-white shadow-soft"
                      aria-hidden
                    >
                      {rev.userName
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {rev.userName}
                      </p>
                      <StarRow value={rev.rating} className="mt-1" />
                    </div>
                  </div>
                  <time className="text-small text-neutral-400">
                    {rev.dateLabel}
                  </time>
                </div>
                <p className="mt-4 text-body-sm leading-relaxed text-neutral-700">
                  {rev.comment}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-neutral-200/80 pt-16 md:mt-20 md:pt-20">
            <h2 className="font-serif text-2xl font-semibold text-neutral-900 md:text-3xl">
              You may also like
            </h2>
            <p className="mt-2 max-w-xl text-body-sm text-neutral-500">
              Similar titles in {book.category}, hand-picked for readers who
              enjoyed this book.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rb) => (
                <BookListingCard
                  key={rb._id}
                  book={rb}
                  onAddToCart={async (bookId, b) => {
                    try {
                      await dispatch(
                        addToCart({ bookId, quantity: 1 })
                      ).unwrap()
                      toast.success(
                        `“${b?.title ?? 'Book'}” added to cart`
                      )
                    } catch (e) {
                      toast.error(e || 'Failed to add to cart')
                    }
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </PageContainer>
    </div>
  )
}
