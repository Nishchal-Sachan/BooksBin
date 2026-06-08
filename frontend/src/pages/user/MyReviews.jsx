import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { formatDate } from '../../utils/format'
import { coverUrl } from '../../utils/bookHelpers'
import AccountLayout from '../../components/account/AccountLayout'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import StarDisplay from '../../components/reviews/StarDisplay'
import ReviewForm from '../../components/reviews/ReviewForm'

export default function MyReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/reviews/my-reviews', { params: { limit: 50 } })
      setReviews(data.reviews || [])
    } catch {
      toast.error('Failed to load your reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return
    try {
      await api.delete(`/reviews/${reviewId}`)
      toast.success('Review deleted')
      setEditingId(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete review')
    }
  }

  return (
    <AccountLayout
      title="My reviews"
      subtitle="Reviews you've written for books and products you've purchased."
    >
      {loading ? (
        <p className="text-ink-muted">Loading your reviews…</p>
      ) : reviews.length === 0 ? (
        <Card className="py-16 text-center shadow-soft">
          <MessageSquare className="mx-auto h-12 w-12 text-neutral-300" />
          <h2 className="mt-4 text-h3">No reviews yet</h2>
          <p className="mt-2 max-w-md mx-auto text-body-sm text-ink-muted">
            After your order is shipped or delivered, open the product page and
            share your rating and feedback.
          </p>
          <Button as={Link} to="/orders" className="mt-6" variant="outline">
            View orders
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review._id} className="overflow-hidden shadow-soft">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                <Link
                  to={`/books/${review.book?._id}`}
                  className="flex shrink-0 gap-3 rounded-lg transition-opacity hover:opacity-90"
                >
                  <img
                    src={coverUrl(review.book)}
                    alt=""
                    className="h-24 w-16 rounded object-cover"
                  />
                  <div>
                    <p className="font-semibold text-ink">{review.book?.title}</p>
                    <p className="text-small text-ink-muted">{review.book?.author}</p>
                  </div>
                </Link>

                <div className="min-w-0 flex-1">
                  {editingId === review._id ? (
                    <ReviewForm
                      bookId={review.book?._id}
                      orderId={review.order}
                      existingReview={review}
                      onSuccess={() => {
                        setEditingId(null)
                        load()
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <StarDisplay value={review.rating} />
                        <time className="text-small text-ink-muted">
                          {formatDate(review.createdAt)}
                        </time>
                      </div>
                      {review.title && (
                        <p className="mt-2 font-semibold text-ink">{review.title}</p>
                      )}
                      <p className="mt-2 text-body-sm text-ink-muted">{review.comment}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(review._id)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-error"
                          onClick={() => handleDelete(review._id)}
                        >
                          Delete
                        </Button>
                        <Button as={Link} to={`/books/${review.book?._id}`} size="sm" variant="ghost">
                          View product
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AccountLayout>
  )
}
