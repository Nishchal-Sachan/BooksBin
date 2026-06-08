import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Card } from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { formatPrice } from '../../utils/format'
import { cn } from '../../utils/cn'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { coverUrl } from '../../utils/bookHelpers'
import { isBuyer } from '../../utils/roles'

export default function BookListingCard({ book, onAddToCart, className }) {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const showShopActions = !isAuthenticated || isBuyer(user)
  const [wishBusy, setWishBusy] = useState(false)
  const [wishActive, setWishActive] = useState(false)

  const avg = book.ratings?.average ?? 0
  const count = book.ratings?.count ?? 0
  const hasDiscount =
    book.originalPrice != null && book.originalPrice > book.price
  const detailHref = `/books/${book._id}`

  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error('Sign in to save books to your wishlist')
      return
    }
    setWishBusy(true)
    try {
      await api.post(`/users/wishlist/${book._id}`)
      setWishActive(true)
      toast.success('Added to wishlist')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update wishlist')
    } finally {
      setWishBusy(false)
    }
  }

  const handleCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error('Sign in to add items to your cart')
      navigate('/login')
      return
    }
    onAddToCart?.(book._id, book)
  }

  return (
    <Card
      interactive={false}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-card',
        className
      )}
    >
      <div className="relative shrink-0">
        <Link to={detailHref} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
            <img
              src={coverUrl(book)}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
            {hasDiscount && (
              <Badge
                variant="sale"
                className="absolute left-3 top-3 font-bold shadow-soft"
              >
                Sale
              </Badge>
            )}
          </div>
        </Link>
        {showShopActions && (
          <button
            type="button"
            onClick={handleWishlist}
            disabled={wishBusy}
            aria-pressed={wishActive}
            aria-label={
              wishActive ? 'Remove from wishlist' : 'Add to wishlist'
            }
            className={cn(
              'absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-ink-muted shadow-card transition-all duration-200 hover:scale-105 hover:text-error disabled:opacity-50',
              wishActive && 'border-rose-300 bg-rose-50 text-rose-600'
            )}
          >
            <Heart
              className={cn('h-5 w-5', wishActive && 'fill-rose-600 text-rose-600')}
              fill={wishActive ? 'currentColor' : 'none'}
            />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link
          to={detailHref}
          className="line-clamp-2 min-h-[2.75rem] text-body font-semibold leading-snug text-ink transition-colors hover:text-primary-800"
        >
          {book.title}
        </Link>
        <p className="mt-1 text-small text-ink-muted">by {book.author}</p>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-0.5 text-accent-600">
            <Star className="h-4 w-4 fill-accent-500 text-accent-500" />
            <span className="text-small font-semibold tabular-nums text-ink">
              {avg.toFixed(1)}
            </span>
          </div>
          <span className="text-small text-ink-muted">
            ({count.toLocaleString()})
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="price-tag">{formatPrice(book.price)}</span>
          {hasDiscount && (
            <span className="text-small text-ink-muted line-through">
              {formatPrice(book.originalPrice)}
            </span>
          )}
        </div>

        {showShopActions ? (
          <div className="mt-auto pt-4">
            <Button type="button" className="w-full gap-2" onClick={handleCart}>
              <ShoppingCart className="h-4 w-4" />
              Add to cart
            </Button>
          </div>
        ) : (
          <div className="mt-auto pt-4">
            <Button as={Link} to={detailHref} variant="outline" className="w-full">
              View listing
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
