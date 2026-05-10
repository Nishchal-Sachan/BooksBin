import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/format'
import AccountLayout from '../../components/account/AccountLayout'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { MOCK_BOOKS_CATALOG } from '../../data/booksCatalogMock'
import { getMockProductBook } from '../../data/bookProductMock'
import {
  getWishlistIds,
  setWishlistIds,
  removeWishlistId,
} from '../../utils/wishlistStorage'

function resolveBook(bookId) {
  return (
    getMockProductBook(bookId) ||
    MOCK_BOOKS_CATALOG.find((b) => b._id === bookId) ||
    null
  )
}

function coverUrl(book) {
  const first = book?.images?.[0]
  if (!first) return '/placeholder-book.jpg'
  return typeof first === 'string' ? first : first?.url || '/placeholder-book.jpg'
}

export default function Wishlist() {
  const dispatch = useDispatch()
  const [ids, setIds] = useState(() => getWishlistIds())

  const books = useMemo(() => {
    return ids
      .map((id) => {
        const b = resolveBook(id)
        return b ? { ...b, _id: id } : null
      })
      .filter(Boolean)
  }, [ids])

  const refreshIds = useCallback(() => {
    setIds(getWishlistIds())
  }, [])

  const handleRemove = (bookId) => {
    removeWishlistId(bookId)
    refreshIds()
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = async (bookId) => {
    try {
      await dispatch(addToCart({ bookId, quantity: 1 })).unwrap()
      toast.success('Added to cart')
    } catch (error) {
      toast.error(error || 'Failed to add to cart')
    }
  }

  const clearAll = () => {
    if (window.confirm('Remove all books from your wishlist?')) {
      setWishlistIds([])
      refreshIds()
      toast.success('Wishlist cleared')
    }
  }

  return (
    <AccountLayout
      title="Wishlist"
      subtitle="Books you have saved. Stored on this device for the demo."
    >
      {books.length > 0 && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={clearAll}
            className="text-body-sm font-medium text-error transition-colors hover:text-error/80"
          >
            Clear all
          </button>
        </div>
      )}

      {books.length === 0 ? (
        <Card className="border-dashed border-neutral-200 p-12 text-center shadow-soft">
          <Heart className="mx-auto h-14 w-14 text-rose-200" strokeWidth={1.25} />
          <h2 className="mt-4 text-h2 text-neutral-800">Nothing saved yet</h2>
          <p className="mt-2 text-body-sm text-neutral-500">
            Browse the catalog and keep titles you love on your wishlist.
          </p>
          <Button as={Link} to="/books" className="mt-6">
            Discover books
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <Card
              key={book._id}
              interactive={false}
              className="flex flex-col overflow-hidden border-neutral-200/90 p-0 shadow-soft transition-shadow hover:shadow-card"
            >
              <Link to={`/books/${book._id}`} className="block shrink-0">
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                  <img
                    src={coverUrl(book)}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </div>
              </Link>
              <CardContent className="flex flex-1 flex-col gap-2 pt-4">
                <Link
                  to={`/books/${book._id}`}
                  className="line-clamp-2 text-body font-semibold text-neutral-900 transition-colors hover:text-primary-600"
                >
                  {book.title}
                </Link>
                <p className="text-small text-neutral-500">by {book.author}</p>
                <p className="text-lg font-semibold text-primary-600">
                  {formatPrice(book.price)}
                </p>
                <div className="mt-auto flex gap-2 pt-3">
                  <Button
                    type="button"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleAddToCart(book._id)}
                  >
                    <ShoppingCart className="mr-1 h-4 w-4" />
                    Add to cart
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    onClick={() => handleRemove(book._id)}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AccountLayout>
  )
}
