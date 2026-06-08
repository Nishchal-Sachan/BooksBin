import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../store/api/api'
import toast from 'react-hot-toast'
import { Card } from '../ui/Card'
import Button from '../ui/Button'
import StarDisplay from './StarDisplay'
import RatingBreakdown from './RatingBreakdown'
import ReviewForm from './ReviewForm'
import ReviewCard from './ReviewCard'

export default function BookReviewsSection({
  bookId,
  bookTitle,
  avgRating,
  reviewCount,
  onReviewChange,
}) {
  const { isAuthenticated } = useSelector((s) => s.auth)
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({
    averageRating: avgRating,
    totalReviews: reviewCount,
    ratingDistribution: {},
  })
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 })
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [eligibility, setEligibility] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState(null)
  const [helpfulCounts, setHelpfulCounts] = useState({})

  const loadReviews = useCallback(async (page = 1) => {
    setLoadingReviews(true)
    try {
      const { data } = await api.get(`/reviews/book/${bookId}`, {
        params: { page, limit: 5 },
      })
      setReviews(data.reviews || [])
      setPagination(data.pagination || { currentPage: 1, totalPages: 1 })
      if (data.stats) {
        setStats((prev) => ({
          ...prev,
          averageRating: data.stats.averageRating ?? prev.averageRating,
          totalReviews: data.stats.totalReviews ?? prev.totalReviews,
        }))
      }
    } catch {
      toast.error('Could not load reviews')
    } finally {
      setLoadingReviews(false)
    }
  }, [bookId])

  const loadStats = useCallback(async () => {
    try {
      const { data } = await api.get(`/reviews/book/${bookId}/stats`)
      setStats(data)
    } catch {
      /* optional */
    }
  }, [bookId])

  const loadEligibility = useCallback(async () => {
    if (!isAuthenticated) {
      setEligibility(null)
      return
    }
    try {
      const { data } = await api.get(`/reviews/eligibility/${bookId}`)
      setEligibility(data)
      if (data.canEdit && data.existingReview) {
        setEditingReview(data.existingReview)
      }
    } catch {
      setEligibility(null)
    }
  }, [bookId, isAuthenticated])

  useEffect(() => {
    loadReviews(1)
    loadStats()
  }, [loadReviews, loadStats])

  useEffect(() => {
    loadEligibility()
  }, [loadEligibility])

  const refreshAll = async () => {
    await Promise.all([loadReviews(1), loadStats(), loadEligibility()])
    setShowForm(false)
    setEditingReview(null)
    onReviewChange?.()
  }

  const handleDelete = async (review) => {
    if (!window.confirm('Delete your review?')) return
    try {
      await api.delete(`/reviews/${review._id}`)
      toast.success('Review deleted')
      refreshAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete review')
    }
  }

  const displayAvg = stats.averageRating ?? avgRating
  const displayCount = stats.totalReviews ?? reviewCount

  return (
    <section className="mt-16 border-t border-neutral-200 pt-16 md:mt-20 md:pt-20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-h2 md:text-h1">Customer reviews</h2>
          <p className="mt-1 text-body-sm text-ink-muted">
            Ratings from verified buyers who purchased {bookTitle}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 shadow-soft">
          <StarDisplay value={displayAvg} />
          <span className="font-semibold text-ink">{displayAvg.toFixed(1)}</span>
          <span className="text-small text-ink-muted">
            ({displayCount.toLocaleString()} total)
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <RatingBreakdown
            averageRating={displayAvg}
            totalReviews={displayCount}
            distribution={stats.ratingDistribution}
          />

          {isAuthenticated ? (
            <div className="mt-4">
              {eligibility?.canReview && !showForm && !editingReview && (
                <Button className="w-full" onClick={() => setShowForm(true)}>
                  Write a review
                </Button>
              )}
              {eligibility?.canEdit && !showForm && !editingReview && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setEditingReview(eligibility.existingReview)
                    setShowForm(true)
                  }}
                >
                  Edit your review
                </Button>
              )}
              {!eligibility?.canReview &&
                !eligibility?.canEdit &&
                eligibility?.reason && (
                  <p className="rounded-lg border border-neutral-200 bg-surface-subtle px-3 py-2 text-small text-ink-muted">
                    {eligibility.reason}
                  </p>
                )}
            </div>
          ) : (
            <p className="mt-4 text-body-sm text-ink-muted">
              <Link to="/login" className="link-primary font-medium">
                Sign in
              </Link>{' '}
              to write a review after your order ships.
            </p>
          )}
        </div>

        <div className="space-y-4 lg:col-span-8">
          {showForm && (eligibility?.canReview || editingReview) && (
            <ReviewForm
              bookId={bookId}
              orderId={eligibility?.eligibleOrderId}
              existingReview={editingReview}
              onSuccess={refreshAll}
              onCancel={() => {
                setShowForm(false)
                if (!eligibility?.canEdit) setEditingReview(null)
              }}
            />
          )}

          {loadingReviews ? (
            <Card className="p-8 text-center text-ink-muted">Loading reviews…</Card>
          ) : reviews.length === 0 ? (
            <Card className="border-dashed border-neutral-200 p-8 text-center text-body-sm text-ink-muted">
              No reviews yet. Be the first to share your thoughts after your order
              is shipped or delivered.
            </Card>
          ) : (
            reviews.map((rev) => (
              <ReviewCard
                key={rev._id}
                review={{
                  ...rev,
                  helpful: {
                    ...rev.helpful,
                    count: helpfulCounts[rev._id] ?? rev.helpful?.count ?? 0,
                  },
                }}
                onEdit={(r) => {
                  setEditingReview(r)
                  setShowForm(true)
                }}
                onDelete={handleDelete}
                onHelpful={(id, count) =>
                  setHelpfulCounts((prev) => ({ ...prev, [id]: count }))
                }
              />
            ))
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1}
                onClick={() => loadReviews(pagination.currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-body-sm text-ink-muted">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => loadReviews(pagination.currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
