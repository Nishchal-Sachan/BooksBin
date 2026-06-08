import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/format'
import { coverUrl } from '../../utils/bookHelpers'
import AccountLayout from '../../components/account/AccountLayout'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function Wishlist() {
  const dispatch = useDispatch()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/users/wishlist')
      setBooks(data.wishlist || [])
    } catch {
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleRemove = async (bookId) => {
    try {
      await api.delete(`/users/wishlist/${bookId}`)
      setBooks((prev) => prev.filter((b) => b._id !== bookId))
      toast.success('Removed from wishlist')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to remove')
    }
  }

  const handleAddToCart = async (bookId) => {
    try {
      await dispatch(addToCart({ bookId, quantity: 1 })).unwrap()
      toast.success('Added to cart')
    } catch (error) {
      toast.error(error || 'Failed to add to cart')
    }
  }

  return (
    <AccountLayout
      title="Wishlist"
      subtitle="Books you've saved for later."
    >
      {loading ? (
        <p className="text-ink-muted">Loading…</p>
      ) : books.length === 0 ? (
        <Card className="py-16 text-center shadow-soft">
          <Heart className="mx-auto h-12 w-12 text-neutral-300" />
          <h2 className="mt-4 text-h3">Your wishlist is empty</h2>
          <p className="mt-2 text-body-sm text-ink-muted">
            Save books you love and come back when you&apos;re ready to buy.
          </p>
          <Button as={Link} to="/books" className="mt-6">
            Browse books
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {books.map((book) => (
            <Card key={book._id} className="overflow-hidden shadow-soft">
              <CardContent className="flex gap-4 p-4">
                <Link to={`/books/${book._id}`} className="shrink-0">
                  <img
                    src={coverUrl(book)}
                    alt=""
                    className="h-28 w-20 rounded-lg object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/books/${book._id}`}
                    className="font-semibold text-neutral-900 hover:text-primary-800"
                  >
                    {book.title}
                  </Link>
                  <p className="text-body-sm text-ink-muted">{book.author}</p>
                  <p className="mt-2 font-semibold text-primary-700">
                    {formatPrice(book.price)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => handleAddToCart(book._id)}>
                      <ShoppingCart className="mr-1.5 h-4 w-4" />
                      Add to cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemove(book._id)}
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AccountLayout>
  )
}
