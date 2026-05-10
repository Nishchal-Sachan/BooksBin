import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Card, CardContent } from './Card'
import Badge from './Badge'
import Button from './Button'
import { formatPrice } from '../../utils/format'
import { cn } from '../../utils/cn'

function bookCoverUrl(book) {
  const first = book.images?.[0]
  if (!first) return '/placeholder-book.jpg'
  return typeof first === 'string' ? first : first.url || '/placeholder-book.jpg'
}

export default function ProductCard({
  book,
  onAddToCart,
  showBadges = true,
  className,
}) {
  const hasDiscount =
    book.originalPrice != null && book.originalPrice > book.price

  return (
    <Card
      interactive={false}
      className={cn(
        'group flex h-full flex-col overflow-hidden p-0 transition-card hover:-translate-y-1 hover:scale-[1.02] hover:shadow-card motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100',
        className
      )}
    >
      <Link to={`/books/${book._id}`} className="block shrink-0">
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
          <img
            src={bookCoverUrl(book)}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-200 ease-smooth group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
          {showBadges && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {hasDiscount && <Badge variant="sale">Sale</Badge>}
              {book.isNew && <Badge variant="new">New</Badge>}
            </div>
          )}
        </div>
      </Link>
      <CardContent className="flex flex-1 flex-col gap-2">
        <Link
          to={`/books/${book._id}`}
          className="text-body-sm font-semibold text-neutral-900 line-clamp-2 transition-colors hover:text-primary-600"
        >
          {book.title}
        </Link>
        <p className="text-small text-neutral-500">by {book.author}</p>
        <div className="flex items-center gap-1 text-small text-neutral-600">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-3.5 w-3.5',
                  i < Math.floor(book.ratings?.average || 0)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-neutral-200'
                )}
              />
            ))}
          </div>
          <span className="text-neutral-400">
            ({book.ratings?.count || 0})
          </span>
        </div>
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-2 pt-2">
          <span className="text-lg font-semibold text-primary-600">
            {formatPrice(book.price)}
          </span>
          {hasDiscount && (
            <span className="text-small text-neutral-400 line-through">
              {formatPrice(book.originalPrice)}
            </span>
          )}
        </div>
        {onAddToCart && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              type="button"
              size="sm"
              className="flex-1 min-w-[7rem]"
              onClick={() => onAddToCart(book._id)}
            >
              Add to Cart
            </Button>
            <Button variant="outline" size="sm" as={Link} to={`/books/${book._id}`}>
              Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
